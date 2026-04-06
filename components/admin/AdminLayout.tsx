"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings,
  LogOut, Menu, X, Bell, Search, Shield
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/categories", label: "Categories", Icon: Tag },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthed(true);
    } else {
      router.replace("/admin/login");
    }
    setAuthChecked(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.replace("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Shield size={40} className="text-[#C9A84C] animate-pulse" />
          <p className="text-[#666] text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[100] bg-[#111111] border-r border-[#1A1A1A] flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[260px]" : "w-16"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 border-b border-[#1A1A1A] min-h-[64px] shrink-0">
          {sidebarOpen && (
            <div>
              <span
                className="font-[Cinzel] text-base font-bold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                DEVANG
              </span>
              <span className="block text-[#666] text-[0.65rem] tracking-[0.2em]">ADMIN PANEL</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#666] hover:text-[#C9A84C] transition-colors p-1 cursor-pointer bg-transparent border-none"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
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
                {sidebarOpen && label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1A1A1A] shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2.5 bg-transparent border-none text-[#666] hover:text-red-400 cursor-pointer text-sm whitespace-nowrap transition-colors duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-[260px]" : "ml-16"}`}>
        {/* Top bar */}
        <header className="h-16 bg-[#111111] border-b border-[#1A1A1A] flex items-center justify-between px-8 sticky top-0 z-50 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              placeholder="Search..."
              className="pl-9 pr-4 py-2 w-60 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative bg-transparent border-none text-[#666] hover:text-[#C9A84C] cursor-pointer transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] rounded-full text-[0.6rem] text-[#0A0A0A] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-[Cinzel] text-xs font-bold text-[#0A0A0A]"
                style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
              >AD</div>
              <div>
                <p className="text-[#F5F0E8] text-sm font-semibold leading-tight">Admin</p>
                <p className="text-[#666] text-xs leading-tight">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
