"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useUserRole } from "@/lib/auth";

type AdminRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function AdminRoute({
  children,
  redirectTo = "/",
}: AdminRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading, roleLoading } = useUserRole();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!loading && !roleLoading && user && !isAdmin) {
      router.replace(redirectTo);
    }
  }, [isAdmin, loading, pathname, redirectTo, roleLoading, router, user]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#C8C0B0]">
        Verifying admin access...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#161616] border border-[#2A2A2A] p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 text-[#C9A84C]" size={40} />
          <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8] mb-3">Access Denied</h1>
          <p className="text-[#C8C0B0] text-sm leading-6">
            This area is available only to users whose Firestore role is set to
            admin.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
