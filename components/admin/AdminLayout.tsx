"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  Tags,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import AdminRoute from "@/components/auth/AdminRoute";
import { useAuth, useUserRole } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/categories", label: "Categories", Icon: Tags },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/admin/reviews", label: "Reviews", Icon: MessageSquare },
  { href: "/admin/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/admin/users", label: "Users", Icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { userProfile } = useUserRole();

  const initials = (userProfile?.name || userProfile?.email || "Admin")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#0A0A0A]">
        <aside
          className={`fixed top-0 left-0 bottom-0 z-[100] bg-[#111111] border-r border-[#1A1A1A] flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[260px]" : "w-16"}`}
        >
          <div className="flex items-center justify-between px-4 border-b border-[#1A1A1A] min-h-[64px] shrink-0">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <img
                  src="/Images/Logo.png"
                  alt="Devang Organics"
                  className="h-10 w-auto object-contain"
                />
                <span className="block text-[#666] text-[0.65rem] tracking-[0.2em]">
                  ADMIN PANEL
                </span>
              </div>
            ) : null}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#666] hover:text-[#C9A84C] transition-colors p-1 cursor-pointer bg-transparent border-none"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 py-3 overflow-y-auto">
            {navItems.map(({ href, label, Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-5 py-3 whitespace-nowrap text-sm no-underline transition-all duration-200 border-l-2 ${
                    isActive
                      ? "text-[#C9A84C] bg-[rgba(201,168,76,0.08)] border-l-[#C9A84C]"
                      : "text-[#C8C0B0] hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.04)] border-l-transparent"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen ? label : null}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#1A1A1A] shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-2 py-2.5 bg-transparent border-none text-[#666] hover:text-red-400 cursor-pointer text-sm whitespace-nowrap transition-colors duration-200"
            >
              <LogOut size={18} className="shrink-0" />
              {sidebarOpen ? "Logout" : null}
            </button>
          </div>
        </aside>

        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-[260px]" : "ml-16"}`}
        >
          <header className="h-16 bg-[#111111] border-b border-[#1A1A1A] flex items-center justify-between px-8 sticky top-0 z-50 shrink-0">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                placeholder="Search admin panel..."
                className="pl-9 pr-4 py-2 w-60 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative bg-transparent border-none text-[#666] hover:text-[#C9A84C] cursor-pointer transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] rounded-full text-[0.6rem] text-[#0A0A0A] flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-[Cinzel] text-xs font-bold text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
                >
                  {initials || "AD"}
                </div>
                <div>
                  <p className="text-[#F5F0E8] text-sm font-semibold leading-tight">
                    {userProfile?.name || "Admin"}
                  </p>
                  <p className="text-[#666] text-xs leading-tight">
                    {userProfile?.email || "Administrator"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
