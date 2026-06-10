"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { useUserRole } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, loading, roleLoading } = useUserRole();

  useEffect(() => {
    if (!loading && !roleLoading && isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, loading, roleLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div
            className="w-[70px] h-[70px] rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
          >
            <ShieldCheck size={32} className="text-[#0A0A0A]" />
          </div>
          <h1 className="font-[Cinzel] text-[1.8rem] text-[#F5F0E8] mb-2">Admin Portal</h1>
          <p className="text-[#666] text-sm">Devang Organics Management</p>
        </div>

        <div className="bg-[#161616] border border-[#2A2A2A] p-10">
          <div className="flex flex-col gap-5">
            <p className="text-[#C8C0B0] text-sm leading-6">
              Admin access is controlled by the Firestore <code>users</code> document.
              Sign in with your regular account, and only users whose role is manually set to <code>admin</code> can access the dashboard.
            </p>
            {user && !isAdmin && !roleLoading ? (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm">
                Signed in, but this account does not have admin access.
              </div>
            ) : null}
            <Link
              href={user ? "/" : "/login"}
              className="block text-center py-3.5 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-sm tracking-widest"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)" }}
            >
              {loading || roleLoading ? "CHECKING ACCESS..." : user ? "BACK TO STORE" : "SIGN IN"}
            </Link>
            <p className="text-[#666] text-xs text-center">
              New users stay <code>customer</code> by default until you change their role in Firebase.
            </p>
          </div>
        </div>

        <p className="text-center text-[#333] text-xs mt-6 flex items-center justify-center gap-1.5">
          <Lock size={11} className="text-[#444]" /> Secured admin area - authorized access only
        </p>
      </div>
    </div>
  );
}
