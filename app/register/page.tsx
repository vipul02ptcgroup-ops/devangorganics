"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 5%", background: "linear-gradient(135deg, #0A0A0A, #111111)" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", fontWeight: 700, background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DEVANG</span>
            <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C9A84C" }}>ORGANICS</div>
          </Link>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#F5F0E8", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Join the Devang Organics family</p>
        </div>

        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2.5rem" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { field: "name", label: "Full Name", placeholder: "Your full name", Icon: User, type: "text" },
              { field: "email", label: "Email Address", placeholder: "you@example.com", Icon: Mail, type: "email" },
              { field: "phone", label: "Phone Number", placeholder: "+91 91208 79879", Icon: Phone, type: "tel" },
            ].map(({ field, label, placeholder, Icon, type }) => (
              <div key={field}>
                <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  <input type={type} placeholder={placeholder} value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type={show ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  style={{ width: "100%", padding: "12px 44px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#C8C0B0", fontSize: "0.8rem", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
              I agree to the <Link href="#" style={{ color: "#C9A84C" }}>Terms of Service</Link> and <Link href="#" style={{ color: "#C9A84C" }}>Privacy Policy</Link>
            </label>
            <Link href="/profile" style={{ display: "block", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textAlign: "center", textDecoration: "none" }}>
              CREATE ACCOUNT
            </Link>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#666", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#C9A84C", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
