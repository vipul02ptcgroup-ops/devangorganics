"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUp, ArrowDown, Star } from "lucide-react";
import { products } from "@/lib/data";

const stats = [
  { label: "Total Revenue", value: "₹4,82,340", change: "+18.2%", up: true, Icon: TrendingUp },
  { label: "Total Orders", value: "1,284", change: "+12.5%", up: true, Icon: ShoppingBag },
  { label: "Customers", value: "8,472", change: "+9.1%", up: true, Icon: Users },
  { label: "Products", value: "68", change: "-2.3%", up: false, Icon: Package },
];

const recentOrders = [
  { id: "ORD-2024-001", customer: "Priya Sharma", items: 3, total: 1248, status: "Delivered", date: "Dec 15" },
  { id: "ORD-2024-002", customer: "Rahul Mehta", items: 1, total: 599, status: "Processing", date: "Dec 16" },
  { id: "ORD-2024-003", customer: "Anita Desai", items: 5, total: 2100, status: "Shipped", date: "Dec 16" },
  { id: "ORD-2024-004", customer: "Vikram Patel", items: 2, total: 898, status: "Pending", date: "Dec 17" },
  { id: "ORD-2024-005", customer: "Sneha Shah", items: 4, total: 1640, status: "Delivered", date: "Dec 17" },
];

const statusClasses: Record<string, string> = {
  Delivered: "text-green-500 bg-green-500/10",
  Processing: "text-[#C9A84C] bg-[#C9A84C]/10",
  Shipped: "text-blue-400 bg-blue-400/10",
  Pending: "text-gray-400 bg-gray-400/10",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Dashboard</h1>
          <p className="text-[#666] text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, change, up, Icon }) => (
            <div key={label} className="bg-[#161616] border border-[#1A1A1A] p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#666] text-xs tracking-wider mb-2">{label}</p>
                  <p className="font-[Cinzel] text-2xl text-[#C9A84C]">{value}</p>
                </div>
                <div className="w-11 h-11 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center">
                  <Icon size={20} className="text-[#C9A84C]" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {up
                  ? <ArrowUp size={14} className="text-green-500" />
                  : <ArrowDown size={14} className="text-red-500" />}
                <span className={`text-xs ${up ? "text-green-500" : "text-red-500"}`}>{change}</span>
                <span className="text-[#666] text-xs">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          {/* Recent Orders */}
          <div className="bg-[#161616] border border-[#1A1A1A] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-[Cinzel] text-sm text-[#C9A84C] tracking-wider">RECENT ORDERS</h2>
              <a href="/admin/orders" className="text-[#666] text-xs hover:text-[#C9A84C] transition-colors">View all →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Order", "Customer", "Items", "Total", "Status", "Date"].map(h => (
                      <th key={h} className="text-left text-[#666] text-xs tracking-wider pb-3 border-b border-[#1A1A1A] font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b border-[#111]">
                      <td className="py-3 text-[#C9A84C] text-xs font-[Cinzel]">{o.id}</td>
                      <td className="py-3 text-[#C8C0B0] text-xs pr-4">{o.customer}</td>
                      <td className="py-3 text-[#C8C0B0] text-xs">{o.items}</td>
                      <td className="py-3 text-[#C9A84C] text-sm font-[Cinzel]">₹{o.total}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2.5 py-0.5 ${statusClasses[o.status] || "text-[#666]"}`}>{o.status}</span>
                      </td>
                      <td className="py-3 text-[#666] text-xs">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#161616] border border-[#1A1A1A] p-6">
            <h2 className="font-[Cinzel] text-sm text-[#C9A84C] tracking-wider mb-6">TOP PRODUCTS</h2>
            {products
              .sort((a, b) => b.reviews - a.reviews)
              .slice(0, 5)
              .map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-[#111]">
                  <span className="text-[#C9A84C] font-[Cinzel] text-base w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#C8C0B0] text-xs mb-0.5 truncate">{p.name}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#C9A84C" className="text-[#C9A84C]" />
                      <span className="text-[#666] text-[0.7rem]">{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                  <span className="text-[#C9A84C] font-[Cinzel] text-sm shrink-0">₹{p.price}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
