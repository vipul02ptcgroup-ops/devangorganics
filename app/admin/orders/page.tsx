"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Eye } from "lucide-react";

const orders = [
  { id: "ORD-2024-001", customer: "Priya Sharma", email: "priya@gmail.com", items: ["Tulsi Green Tea", "Ashwagandha"], total: 1248, status: "Delivered", date: "Dec 15, 2024", payment: "Card" },
  { id: "ORD-2024-002", customer: "Rahul Mehta", email: "rahul@gmail.com", items: ["Brahmi Capsules"], total: 499, status: "Processing", date: "Dec 16, 2024", payment: "UPI" },
  { id: "ORD-2024-003", customer: "Anita Desai", email: "anita@gmail.com", items: ["Mango Pickle", "Rose Soap", "Moringa"], total: 2100, status: "Shipped", date: "Dec 16, 2024", payment: "Card" },
  { id: "ORD-2024-004", customer: "Vikram Patel", email: "vikram@gmail.com", items: ["Neem Soap", "Chamomile Tea"], total: 448, status: "Pending", date: "Dec 17, 2024", payment: "COD" },
  { id: "ORD-2024-005", customer: "Sneha Shah", email: "sneha@gmail.com", items: ["Lavender Oil", "Mixed Pickle"], total: 998, status: "Delivered", date: "Dec 17, 2024", payment: "UPI" },
  { id: "ORD-2024-006", customer: "Arjun Kumar", email: "arjun@gmail.com", items: ["Peppermint Tea", "Moringa Powder"], total: 728, status: "Processing", date: "Dec 18, 2024", payment: "Card" },
];

const statusClasses: Record<string, string> = {
  Delivered: "text-green-500 bg-green-500/10",
  Processing: "text-[#C9A84C] bg-[#C9A84C]/10",
  Shipped: "text-blue-400 bg-blue-400/10",
  Pending: "text-gray-400 bg-gray-400/10",
};

const quickStats = [
  { label: "All", count: orders.length, color: "text-[#C9A84C]" },
  { label: "Pending", count: orders.filter(o => o.status === "Pending").length, color: "text-gray-400" },
  { label: "Processing", count: orders.filter(o => o.status === "Processing").length, color: "text-[#C9A84C]" },
  { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, color: "text-green-500" },
];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = orders.filter(
    o =>
      (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)) &&
      (!statusFilter || o.status === statusFilter)
  );

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Orders</h1>
          <p className="text-[#666] text-sm mt-0.5">{orders.length} total orders</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {quickStats.map(({ label, count, color }) => (
            <div key={label} className="bg-[#161616] border border-[#1A1A1A] p-4 text-center">
              <p className={`font-[Cinzel] text-2xl ${color}`}>{count}</p>
              <p className="text-[#666] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161616] border border-[#1A1A1A] px-6 py-4 mb-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-xs focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-xs focus:border-[#C9A84C] focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {["Pending", "Processing", "Shipped", "Delivered"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[#111] hover:bg-[#111] transition-colors">
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel] text-xs">{o.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-[#F5F0E8] text-sm">{o.customer}</p>
                    <p className="text-[#666] text-xs">{o.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[#C8C0B0] text-xs">{o.items.length} items</td>
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel]">₹{o.total}</td>
                  <td className="px-4 py-3.5 text-[#C8C0B0] text-xs">{o.payment}</td>
                  <td className="px-4 py-3.5">
                    <select
                      defaultValue={o.status}
                      className={`border-none px-2.5 py-1 text-xs cursor-pointer focus:outline-none ${statusClasses[o.status] ?? "text-[#666]"}`}
                    >
                      {["Pending", "Processing", "Shipped", "Delivered"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-[#666] text-xs">{o.date}</td>
                  <td className="px-4 py-3.5">
                    <button className="flex items-center gap-1 bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer px-3 py-1.5 text-xs hover:bg-[rgba(201,168,76,0.2)] transition-colors">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
