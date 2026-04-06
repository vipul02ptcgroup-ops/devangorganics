"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { categories } from "@/lib/data";
import { Plus, Edit, Trash2, Leaf, Coffee, Sparkles, Utensils, Package } from "lucide-react";

export default function AdminCategories() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Categories</h1>
            <p className="text-[#666] text-sm mt-0.5">{categories.length} product categories</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-xs tracking-wider hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
          >
            <Plus size={16} /> ADD CATEGORY
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-[#161616] border border-[#1A1A1A] p-6 hover:border-[rgba(201,168,76,0.3)] transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 border border-[#C9A84C33] bg-[#0A0A0A] flex items-center justify-center">
                  {cat.iconName === "Leaf" && <Leaf size={28} className="text-[#C9A84C]" />}
                  {cat.iconName === "Coffee" && <Coffee size={28} className="text-[#C9A84C]" />}
                  {cat.iconName === "Sparkles" && <Sparkles size={28} className="text-[#C9A84C]" />}
                  {cat.iconName === "Utensils" && <Utensils size={28} className="text-[#C9A84C]" />}
                  {!["Leaf","Coffee","Sparkles","Utensils"].includes(cat.iconName) && <Package size={28} className="text-[#C9A84C]" />}
                </div>
                <div className="flex gap-1.5">
                  <button className="bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer p-1.5 hover:bg-[rgba(201,168,76,0.2)] transition-colors"><Edit size={14} /></button>
                  <button className="bg-[rgba(239,68,68,0.1)] border-none text-red-500 cursor-pointer p-1.5 hover:bg-[rgba(239,68,68,0.2)] transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-[Cinzel] text-[#F5F0E8] mb-1">{cat.name}</h3>
              <p className="text-[#666] text-xs">{cat.count} products</p>
              <div className="mt-4 h-1 bg-[#0A0A0A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, #E8C96A)",
                    width: `${Math.min((cat.count / 20) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-8">
            <div className="bg-[#161616] border border-[#C9A84C] p-8 w-full max-w-md">
              <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-wider mb-6">ADD CATEGORY</h2>
              <div className="flex flex-col gap-4">
                {[["Category Name", "e.g. Herb's"], ["Slug", "e.g. herbs"], ["Icon Name", "e.g. Leaf, Coffee, Sparkles"]].map(([label, placeholder]) => (
                  <div key={label}>
                    <label className="block text-[#C8C0B0] text-xs mb-1.5">{label}</label>
                    <input
                      placeholder={placeholder}
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-xs tracking-wider hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
                >
                  SAVE
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
