"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { products, categories } from "@/lib/data";
import { Plus, Search, Edit, Trash2, Eye, Leaf, Coffee, Sparkles, Utensils, Package, Star, X } from "lucide-react";

const categoryIcon: Record<string, React.ReactNode> = {
  "herbs": <Leaf size={16} className="text-[#C9A84C]" />,
  "herb-tea": <Coffee size={16} className="text-[#C9A84C]" />,
  "natural-soaps": <Sparkles size={16} className="text-[#C9A84C]" />,
  "pickles": <Utensils size={16} className="text-[#C9A84C]" />,
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!catFilter || p.category === catFilter)
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Products</h1>
            <p className="text-[#666] text-sm mt-0.5">{products.length} total products</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-xs tracking-wider transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
          >
            <Plus size={16} /> ADD PRODUCT
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#161616] border border-[#1A1A1A] px-6 py-4 mb-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-xs focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
            />
          </div>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-xs cursor-pointer focus:border-[#C9A84C] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(h => (
                  <th key={h} className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-[#111] hover:bg-[#111] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center shrink-0 bg-[#0A0A0A]"
                      >
                        {categoryIcon[p.category] ?? <Package size={16} className="text-[#C9A84C]" />}
                      </div>
                      <div>
                        <p className="text-[#F5F0E8] text-sm">{p.name}</p>
                        <p className="text-[#666] text-xs">{p.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-[rgba(201,168,76,0.1)] text-[#C9A84C] px-2.5 py-0.5 text-xs">
                      {p.category.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[#C9A84C] font-[Cinzel] text-sm">₹{p.price}</p>
                    <p className="text-[#666] text-xs line-through">₹{p.originalPrice}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs ${p.inStock ? "text-green-500" : "text-red-500"}`}>
                      ● {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[#C9A84C] text-sm flex items-center gap-1"><Star size={12} fill="#C9A84C" /> {p.rating}</span>
                    <p className="text-[#666] text-xs">{p.reviews} reviews</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button className="bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer p-1.5 hover:bg-[rgba(201,168,76,0.2)] transition-colors"><Edit size={14} /></button>
                      <button className="bg-[rgba(59,130,246,0.1)] border-none text-blue-400 cursor-pointer p-1.5 hover:bg-[rgba(59,130,246,0.2)] transition-colors"><Eye size={14} /></button>
                      <button className="bg-[rgba(239,68,68,0.1)] border-none text-red-500 cursor-pointer p-1.5 hover:bg-[rgba(239,68,68,0.2)] transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-8">
            <div className="bg-[#161616] border border-[#C9A84C] p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-wider">ADD NEW PRODUCT</h2>
                <button onClick={() => setShowModal(false)} className="bg-transparent border-none text-[#666] hover:text-[#F5F0E8] cursor-pointer transition-colors flex items-center"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[["Product Name", "text", "Enter product name"], ["Weight/Volume", "text", "e.g. 100g, 30ml"]].map(([l, t, p]) => (
                  <div key={l}>
                    <label className="block text-[#C8C0B0] text-xs mb-1.5">{l}</label>
                    <input type={t} placeholder={p} className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]" />
                  </div>
                ))}
                <div>
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Category</label>
                  <select className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none">
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Badge</label>
                  <input placeholder="e.g. Bestseller, New, Organic" className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]" />
                </div>
                <div>
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Price (₹)</label>
                  <input type="number" placeholder="0" className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]" />
                </div>
                <div>
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Original Price (₹)</label>
                  <input type="number" placeholder="0" className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Description</label>
                  <textarea rows={3} placeholder="Product description..." className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none resize-y placeholder:text-[#444]" />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-[#C8C0B0] text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#C9A84C]" />
                    In Stock
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-xs tracking-wider hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
                >
                  SAVE PRODUCT
                </button>
                <button onClick={() => setShowModal(false)} className="bg-transparent border border-[#2A2A2A] px-5 py-3 text-[#666] hover:text-[#F5F0E8] cursor-pointer text-sm transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
