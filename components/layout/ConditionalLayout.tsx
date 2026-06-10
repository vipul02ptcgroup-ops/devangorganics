"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  
  if (isAdmin) return <>{children}</>;
  
  return (
    <>
      <Header />
      <CartDrawer />
      <main style={{ minHeight: "60vh" }}>{children}</main>
      <Footer />
    </>
  );
}
