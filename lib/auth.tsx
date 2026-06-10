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
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

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
};

export type UserRole = "admin" | "customer";

export type AppUserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: UserRole;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

async function syncUserDocument(user: User) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existingRole = snapshot.data()?.role;

  if (snapshot.exists()) {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        role: existingRole ?? "customer",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    role: "customer",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setRoleLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setUserProfile(null);
        setRoleLoading(false);
        return;
      }

      // Clear any previous user's role immediately and require a fresh Firestore check.
      setUserProfile(null);
      setRoleLoading(true);

      try {
        await syncUserDocument(nextUser);
      } catch (error) {
        console.error("Failed to sync user document", error);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!db || !user) {
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          setUserProfile(null);
          setRoleLoading(false);
          return;
        }

        const data = snapshot.data() as AppUserProfile;
        setUserProfile({
          uid: data.uid ?? user.uid,
          name: data.name ?? user.displayName ?? "",
          email: data.email ?? user.email ?? "",
          photoURL: data.photoURL ?? user.photoURL ?? "",
          role: data.role === "admin" ? "admin" : "customer",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
        setRoleLoading(false);
      },
      (error) => {
        console.error("Failed to read user role", error);
        setRoleLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    roleLoading,
    isConfigured: isFirebaseConfigured,
    async login(email, password) {
      if (!auth) {
        throw new Error("Firebase is not configured.");
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      await syncUserDocument(credential.user);
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
      await syncUserDocument(credential.user);
    },
    async continueWithGoogle() {
      if (!auth) {
        throw new Error("Firebase is not configured.");
      }

      const credential = await signInWithPopup(auth, googleProvider);
      await syncUserDocument(credential.user);
    },
    async logout() {
      if (!auth) {
        return;
      }

      await signOut(auth);
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
    isCustomer: Boolean(user) && (userProfile?.role ?? "customer") === "customer",
  };
}
