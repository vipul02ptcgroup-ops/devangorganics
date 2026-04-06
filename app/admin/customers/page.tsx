"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Mail, Eye } from "lucide-react";

const customers = [
  { id: 1, name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 98765 11111", orders: 8, spent: 6820, joined: "Jan 2024", city: "Mumbai" },
  { id: 2, name: "Rahul Mehta", email: "rahul@gmail.com", phone: "+91 98765 22222", orders: 3, spent: 1497, joined: "Mar 2024", city: "Pune" },
  { id: 3, name: "Anita Desai", email: "anita@gmail.com", phone: "+91 98765 33333", orders: 12, spent: 9840, joined: "Nov 2023", city: "Ahmedabad" },
  { id: 4, name: "Vikram Patel", email: "vikram@gmail.com", phone: "+91 98765 44444", orders: 5, spent: 3210, joined: "Feb 2024", city: "Surat" },
  { id: 5, name: "Sneha Shah", email: "sneha@gmail.com", phone: "+91 98765 55555", orders: 7, spent: 5640, joined: "Apr 2024", city: "Vadodara" },
  { id: 6, name: "Arjun Kumar", email: "arjun@gmail.com", phone: "+91 98765 66666", orders: 2, spent: 1198, joined: "Dec 2024", city: "Rajkot" },
];

const summaryStats = [
  { label: "Total Customers", value: "8,472", color: "text-[#C9A84C]" },
  { label: "New This Month", value: "342", color: "text-green-500" },
  { label: "Total Revenue", value: "₹4.8L", color: "text-[#C9A84C]" },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search)
  );

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Customers</h1>
          <p className="text-[#666] text-sm mt-0.5">{customers.length} registered customers</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {summaryStats.map(({ label, value, color }) => (
            <div key={label} className="bg-[#161616] border border-[#1A1A1A] p-5">
              <p className="text-[#666] text-xs">{label}</p>
              <p className={`font-[Cinzel] text-2xl mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-[#161616] border border-[#1A1A1A] px-6 py-4 mb-4">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-xs focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Customer", "Contact", "City", "Orders", "Total Spent", "Joined", "Action"].map(h => (
                  <th key={h} className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-[#111] hover:bg-[#111] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-[Cinzel] text-[0.7rem] font-bold text-[#0A0A0A] shrink-0"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
                      >
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[#F5F0E8] text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[#C8C0B0] text-xs">{c.email}</p>
                    <p className="text-[#666] text-xs">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[#C8C0B0] text-sm">{c.city}</td>
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel]">{c.orders}</td>
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel]">₹{c.spent.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-[#666] text-xs">{c.joined}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button className="bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer p-1.5 hover:bg-[rgba(201,168,76,0.2)] transition-colors"><Eye size={14} /></button>
                      <button className="bg-[rgba(59,130,246,0.1)] border-none text-blue-400 cursor-pointer p-1.5 hover:bg-[rgba(59,130,246,0.2)] transition-colors"><Mail size={14} /></button>
                    </div>
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
