"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Leaf } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 5%", background: "linear-gradient(135deg, #0A0A0A, #111111)" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", fontWeight: 700, background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DEVANG</span>
            <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C9A84C" }}>ORGANICS</div>
          </Link>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#F5F0E8", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Sign in to your account</p>
        </div>

        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2.5rem" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type={show ? "text" : "password"} placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  style={{ width: "100%", padding: "12px 44px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C8C0B0", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember: e.target.checked})} style={{ accentColor: "#C9A84C" }} />
                Remember me
              </label>
              <Link href="#" style={{ color: "#C9A84C", fontSize: "0.8rem", textDecoration: "none" }}>Forgot password?</Link>
            </div>
            <Link href="/profile" style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textAlign: "center", textDecoration: "none" }}>
              SIGN IN
            </Link>
          </form>

          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#2A2A2A" }} />
            <span style={{ color: "#666", fontSize: "0.8rem" }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#2A2A2A" }} />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            {["Google", "Facebook"].map(provider => (
              <button key={provider} style={{ flex: 1, background: "#0A0A0A", border: "1px solid #2A2A2A", padding: "12px", color: "#C8C0B0", cursor: "pointer", fontFamily: "Raleway, sans-serif", fontSize: "0.85rem", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#2A2A2A")}>
                {provider}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#666", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#C9A84C", textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
