"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const summaryCards = [
  {
    label: "Dashboard",
    value: "Ready",
    note: "Admin shell is active",
    Icon: LayoutDashboard,
  },
  {
    label: "Products",
    value: "Placeholder",
    note: "Catalog tools can plug in here",
    Icon: Package,
  },
  {
    label: "Orders",
    value: "Placeholder",
    note: "Order workflows can live here",
    Icon: ShoppingBag,
  },
  {
    label: "Users",
    value: "Protected",
    note: "Visible only to admins",
    Icon: Users,
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">ADMIN PANEL</p>
          <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">Dashboard</h1>
          <p className="text-[#666] text-sm mt-2 max-w-2xl leading-6">
            This admin area is protected by your Firestore user role and keeps the
            existing Devang Organics black-and-gold styling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, note, Icon }) => (
            <div key={label} className="bg-[#161616] border border-[#1A1A1A] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#666] text-xs tracking-[0.2em] mb-2">{label}</p>
                  <p className="font-[Cinzel] text-2xl text-[#C9A84C]">{value}</p>
                  <p className="text-[#666] text-xs mt-2">{note}</p>
                </div>
                <div className="w-11 h-11 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center">
                  <Icon size={20} className="text-[#C9A84C]" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-[#C9A84C] text-xs">
                <ArrowUpRight size={12} />
                <span>Placeholder module</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-6">
          <div className="bg-[#161616] border border-[#1A1A1A] p-6">
            <h2 className="font-[Cinzel] text-sm text-[#C9A84C] tracking-[0.2em] mb-5">
              START HERE
            </h2>
            <div className="space-y-4">
              {[
                "Use Dashboard for a quick admin overview.",
                "Use Products for future catalog management tools.",
                "Use Orders for future fulfillment and status controls.",
                "Use Users for future customer and role management.",
              ].map((item) => (
                <div key={item} className="border border-[#1A1A1A] bg-[#111111] px-4 py-4 text-sm text-[#C8C0B0]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161616] border border-[#1A1A1A] p-6">
            <h2 className="font-[Cinzel] text-sm text-[#C9A84C] tracking-[0.2em] mb-5">
              ACCESS RULES
            </h2>
            <div className="space-y-4">
              <div className="border border-[#1A1A1A] bg-[#111111] px-4 py-4">
                <p className="text-[#F5F0E8] text-sm mb-1">Admins only</p>
                <p className="text-[#666] text-xs leading-6">
                  The admin panel is available only when the signed-in Firestore user
                  document has <code>role: "admin"</code>.
                </p>
              </div>
              <div className="border border-[#1A1A1A] bg-[#111111] px-4 py-4">
                <p className="text-[#F5F0E8] text-sm mb-1">Customers blocked</p>
                <p className="text-[#666] text-xs leading-6">
                  Customers do not see the admin entry point and are redirected away
                  from protected admin routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
