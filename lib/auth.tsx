"use client";

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ApiRequestError,
  apiRequest,
  createAuthHeaders,
} from "@/lib/client-api";
import type { AppUserProfile } from "@/lib/api-types";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

type AuthContextValue = {
  user: User | null;
  userProfile: AppUserProfile | null;
  loading: boolean;
  roleLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: (userOverride?: User | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function isFirebaseAdminUnavailable(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

async function syncUserProfileClient(user: User) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const userRef = doc(db, "users", user.uid);
  const [snapshot, tokenResult] = await Promise.all([
    getDoc(userRef),
    user.getIdTokenResult(true),
  ]);

  const existingRole = snapshot.data()?.role;
  const tokenRole =
    tokenResult.claims.role === "admin" || tokenResult.claims.admin === true
      ? "admin"
      : tokenResult.claims.role === "customer"
        ? "customer"
        : null;
  const resolvedRole =
    existingRole === "admin" || tokenRole === "admin" ? "admin" : "customer";

  await setDoc(
    userRef,
    {
      uid: user.uid,
      name: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      role: resolvedRole,
      createdAt: snapshot.exists()
        ? snapshot.data()?.createdAt ?? serverTimestamp()
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function fetchUserProfileClient(user: User) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDoc(doc(db, "users", user.uid));

  if (!snapshot.exists()) {
    throw new Error("User profile was not found.");
  }

  const data = snapshot.data() as Partial<AppUserProfile>;

  return {
    uid: data.uid ?? user.uid,
    name: data.name ?? user.displayName ?? "",
    email: data.email ?? user.email ?? "",
    photoURL: data.photoURL ?? user.photoURL ?? "",
    role: data.role === "admin" ? "admin" : "customer",
    createdAt:
      typeof data.createdAt === "string" || data.createdAt === null
        ? data.createdAt
        : null,
    updatedAt:
      typeof data.updatedAt === "string" || data.updatedAt === null
        ? data.updatedAt
        : null,
  } satisfies AppUserProfile;
}

async function syncUserProfile(user: User) {
  const headers = await createAuthHeaders(user, true);
  await apiRequest<{ profile: AppUserProfile }>("/api/users/sync", {
    method: "POST",
    headers,
  });
}

async function fetchUserProfile(user: User) {
  const headers = await createAuthHeaders(user);
  const response = await apiRequest<{ profile: AppUserProfile }>("/api/users/me", {
    headers,
  });

  return response.profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  const refreshProfile = async (userOverride?: User | null) => {
    const activeUser = userOverride ?? auth?.currentUser ?? user;

    if (!activeUser) {
      setUserProfile(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    try {
      await syncUserProfileClient(activeUser);
      const nextProfile = await fetchUserProfileClient(activeUser);
      setUserProfile(nextProfile);
    } catch (error) {
      try {
        await syncUserProfile(activeUser);
        const nextProfile = await fetchUserProfile(activeUser);
        setUserProfile({
          ...nextProfile,
          role: nextProfile.role === "admin" ? "admin" : "customer",
        });
        return;
      } catch (serverError) {
        if (!isFirebaseAdminUnavailable(serverError)) {
          console.error("Failed to load user profile", serverError);
        }
      }

      if (!isFirebaseAdminUnavailable(error)) {
        try {
          await syncUserProfileClient(activeUser);
          const nextProfile = await fetchUserProfileClient(activeUser);
          setUserProfile(nextProfile);
          return;
        } catch (retryError) {
          console.error("Failed to load user profile from Firestore", retryError);
        }
      }

      setUserProfile(null);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setRoleLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setUserProfile(null);
        setRoleLoading(false);
        return;
      }

      setUserProfile(null);
      void refreshProfile(nextUser);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    roleLoading,
    isConfigured: isFirebaseConfigured,
    refreshProfile,
    async login(email, password) {
      if (!auth) {
        throw new Error("Firebase is not configured.");
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      await refreshProfile(credential.user);
    },
    async register(name, email, password) {
      if (!auth) {
        throw new Error("Firebase is not configured.");
      }

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(credential.user, { displayName: name });
      await refreshProfile(credential.user);
    },
    async continueWithGoogle() {
      if (!auth) {
        throw new Error("Firebase is not configured.");
      }

      const credential = await signInWithPopup(auth, googleProvider);
      await refreshProfile(credential.user);
    },
    async logout() {
      if (!auth) {
        return;
      }

      await signOut(auth);
      setUserProfile(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function useUserRole() {
  const { user, userProfile, loading, roleLoading } = useAuth();

  return {
    user,
    role: userProfile?.role ?? null,
    userProfile,
    loading,
    roleLoading,
    isAdmin: userProfile?.role === "admin",
    isCustomer:
      Boolean(user) && (userProfile?.role ?? "customer") === "customer",
  };
}
