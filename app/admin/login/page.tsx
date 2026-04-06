"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";

const ADMIN_CREDENTIALS = { username: "admin", password: "devang@2026" };

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (
        form.username === ADMIN_CREDENTIALS.username &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("adminAuth", "true");
        router.push("/admin");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-[70px] h-[70px] rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
          >
            <ShieldCheck size={32} className="text-[#0A0A0A]" />
          </div>
          <h1 className="font-[Cinzel] text-[1.8rem] text-[#F5F0E8] mb-2">Admin Portal</h1>
          <p className="text-[#666] text-sm">Devang Organics Management</p>
        </div>

        {/* Form card */}
        <div className="bg-[#161616] border border-[#2A2A2A] p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-[#C8C0B0] text-xs mb-1.5 tracking-wide">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#C8C0B0] text-xs mb-1.5 tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none placeholder:text-[#444] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#666] hover:text-[#C9A84C] cursor-pointer transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 border-none text-[#0A0A0A] cursor-pointer font-[Cinzel] font-bold text-sm tracking-widest transition-opacity disabled:opacity-60 mt-1"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)" }}
            >
              {loading ? "VERIFYING…" : "ACCESS DASHBOARD"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#333] text-xs mt-6 flex items-center justify-center gap-1.5">
          <Lock size={11} className="text-[#444]" /> Secured admin area — authorised access only
        </p>
      </div>
    </div>
  );
}
