"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Shield } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/ui/StatCard";
import {
  ApiRequestError,
  apiRequest,
  createAuthHeaders,
} from "@/lib/client-api";
import type { AppUserProfile } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

function isFirebaseAdminUnavailable(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

function toIsoString(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

async function loadUsersFromFirestore() {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(
    query(collection(db, "users"), orderBy("updatedAt", "desc"))
  );

  return snapshot.docs.map((entry) => {
    const data = entry.data() as Record<string, unknown>;

    return {
      uid: String(data.uid || entry.id),
      name: String(data.name || ""),
      email: String(data.email || ""),
      photoURL: String(data.photoURL || ""),
      role: data.role === "admin" ? "admin" : "customer",
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    } satisfies AppUserProfile;
  });
}

async function promoteUserToAdminInFirestore(uid: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await setDoc(
    doc(db, "users", uid),
    {
      role: "admin",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = await createAuthHeaders(user);
        const response = await apiRequest<{ users: AppUserProfile[] }>(
          "/api/admin/users",
          {
            headers,
          }
        );

        if (!cancelled) {
          setUsers(response.users);
        }
      } catch (nextError) {
        if (isFirebaseAdminUnavailable(nextError)) {
          try {
            const firestoreUsers = await loadUsersFromFirestore();

            if (!cancelled) {
              setUsers(firestoreUsers);
            }

            return;
          } catch (fallbackError) {
            if (!cancelled) {
              setError(
                fallbackError instanceof Error
                  ? fallbackError.message
                  : "Failed to load users."
              );
            }

            return;
          }
        }

        if (!cancelled) {
          setError(
            nextError instanceof Error ? nextError.message : "Failed to load users."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const promoteToAdmin = async (uid: string) => {
    if (!user) {
      return;
    }

    setUpdatingUid(uid);
    setError("");

    try {
      try {
        const headers = {
          "Content-Type": "application/json",
          ...(await createAuthHeaders(user)),
        };

        await apiRequest<{ message: string }>(`/api/admin/users/${uid}/role`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ role: "admin" }),
        });
      } catch (nextError) {
        if (isFirebaseAdminUnavailable(nextError)) {
          await promoteUserToAdminInFirestore(uid);
        } else {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to update role."
          );
          return;
        }
      }

      setUsers((prev) =>
        prev.map((entry) =>
          entry.uid === uid ? { ...entry, role: "admin" } : entry
        )
      );
    } finally {
      setUpdatingUid(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">ACCOUNTS</p>
          <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">Users</h1>
          <p className="text-[#666] text-sm mt-2">
            View users stored in Firestore and promote customers to admins through
            backend APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="TOTAL USERS" value={users.length} />
          <StatCard
            label="CUSTOMERS"
            value={users.filter((entry) => entry.role === "customer").length}
          />
          <StatCard
            label="ADMINS"
            value={users.filter((entry) => entry.role === "admin").length}
          />
        </div>

        {loading ? (
          <div className="bg-[#161616] border border-[#1A1A1A] p-6 text-[#C9A84C]">
            Loading users...
          </div>
        ) : error ? (
          <div className="bg-[#161616] border border-red-500/30 p-6 text-red-300">
            {error}
          </div>
        ) : (
          <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  {["User", "Role", "Created", "Updated", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-[#666]"
                    >
                      No users found yet.
                    </td>
                  </tr>
                ) : (
                  users.map((entry) => (
                    <tr key={entry.uid} className="border-b border-[#111]">
                      <td className="px-4 py-3.5">
                        <p className="text-[#F5F0E8] text-sm">
                          {entry.name || "Unnamed User"}
                        </p>
                        <p className="text-[#666] text-xs">{entry.email}</p>
                        <p className="text-[#444] text-xs mt-1">{entry.uid}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 text-xs border ${
                            entry.role === "admin"
                              ? "border-[#C9A84C]/40 text-[#C9A84C] bg-[#C9A84C]/10"
                              : "border-[#2A2A2A] text-[#C8C0B0] bg-[#111]"
                          }`}
                        >
                          <Shield size={12} />
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#666]">
                        {entry.createdAt
                          ? new Date(String(entry.createdAt)).toLocaleString()
                          : "Pending"}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#666]">
                        {entry.updatedAt
                          ? new Date(String(entry.updatedAt)).toLocaleString()
                          : "Pending"}
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.role === "customer" ? (
                          <button
                            onClick={() => void promoteToAdmin(entry.uid)}
                            disabled={updatingUid === entry.uid}
                            className="px-4 py-2 text-xs font-[Cinzel] text-[#0A0A0A]"
                            style={{
                              background:
                                "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                              opacity: updatingUid === entry.uid ? 0.7 : 1,
                            }}
                          >
                            {updatingUid === entry.uid ? "UPDATING..." : "MAKE ADMIN"}
                          </button>
                        ) : (
                          <span className="text-[#666] text-xs">Already admin</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
