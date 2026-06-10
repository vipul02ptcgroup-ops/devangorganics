"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
};

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  message = "Checking your account...",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, redirectTo, router, user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8C0B0", textAlign: "center", padding: "2rem" }}>
        {message}
      </div>
    );
  }

  return <>{children}</>;
}
