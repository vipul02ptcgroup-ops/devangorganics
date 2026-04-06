"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Bell, Shield, Globe } from "lucide-react";

const inputClass = "w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none";
const labelClass = "block text-[#C8C0B0] text-xs mb-1.5";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div>
        <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8] mb-8">Settings</h1>
        <div className="flex flex-col gap-6">

          {/* Store Info */}
          <div className="bg-[#161616] border border-[#1A1A1A] p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <Globe size={18} className="text-[#C9A84C]" />
              <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-wider">STORE INFORMATION</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Store Name", "Devang Organics"],
                ["Tagline", "Pure & Natural Products"],
                ["Email", "ptcvirar@gmail.com"],
                ["Phone", "+91 91208 79879"],
              ].map(([l, v]) => (
                <div key={l}>
                  <label className={labelClass}>{l}</label>
                  <input defaultValue={v} className={inputClass} />
                </div>
              ))}
              <div className="col-span-full">
                <label className={labelClass}>Store Address</label>
                <textarea
                  defaultValue="Virar (East), Maharashtra, India"
                  rows={2}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#161616] border border-[#1A1A1A] p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <Bell size={18} className="text-[#C9A84C]" />
              <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-wider">NOTIFICATIONS</h2>
            </div>
            {[
              ["New order placed", true],
              ["Low stock alerts", true],
              ["Customer reviews", false],
              ["Monthly reports", true],
            ].map(([label, def]) => (
              <div key={label as string} className="flex justify-between items-center py-3 border-b border-[#1A1A1A]">
                <span className="text-[#C8C0B0] text-sm">{label}</span>
                <input type="checkbox" defaultChecked={def as boolean} className="accent-[#C9A84C] w-4 h-4 cursor-pointer" />
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="bg-[#161616] border border-[#1A1A1A] p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <Shield size={18} className="text-[#C9A84C]" />
              <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-wider">SECURITY</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Current Password", "New Password", "Confirm Password"].map(l => (
                <div key={l}>
                  <label className={labelClass}>{l}</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-8 py-3 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-sm tracking-widest hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)" }}
            >
              <Save size={16} /> SAVE ALL SETTINGS
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
