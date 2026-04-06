"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "5rem 5%", textAlign: "center", background: "linear-gradient(135deg, #0A0A0A, #161616)" }}>
        <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>GET IN TOUCH</p>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2.5rem", color: "#F5F0E8", marginBottom: "1rem" }}>Contact Us</h1>
        <p style={{ color: "#C8C0B0", maxWidth: "500px", margin: "0 auto", lineHeight: 1.8, fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
          We'd love to hear from you. Send us a message and we'll respond within 24 hours.
        </p>
      </section>

      <div style={{ padding: "5rem 5%", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem" }} className="contact-grid">
        {/* Info */}
        <div>
          <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1.1rem", marginBottom: "2rem", letterSpacing: "0.05em" }}>REACH US</h2>
          {[
            { Icon: MapPin, title: "Our Store", detail: "123 Nature's Way, Ahmedabad, Gujarat 380001" },
            { Icon: Phone, title: "Call Us", detail: "+91 98765 43210" },
            { Icon: Mail, title: "Email Us", detail: "hello@devangorganics.com" },
            { Icon: Clock, title: "Working Hours", detail: "Mon–Sat: 9am – 6pm IST" },
          ].map(({ Icon, title, detail }) => (
            <div key={title} style={{ display: "flex", gap: "16px", marginBottom: "2rem", alignItems: "flex-start" }}>
              <div style={{ width: "46px", height: "46px", border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} style={{ color: "#C9A84C" }} />
              </div>
              <div>
                <p style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", fontSize: "0.85rem", marginBottom: "4px" }}>{title}</p>
                <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.6 }}>{detail}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#161616", border: "1px solid #C9A84C33" }}>
            <p style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "0.85rem", marginBottom: "0.5rem" }}>BUSINESS INQUIRIES</p>
            <p style={{ color: "#C8C0B0", fontSize: "0.8rem", lineHeight: 1.7 }}>For bulk orders, wholesale, and partnerships, reach us at business@devangorganics.com</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2.5rem" }}>
          <h2 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", fontSize: "1.3rem", marginBottom: "2rem" }}>Send a Message</h2>
          {sent ? (
            <div style={{ padding: "2rem", textAlign: "center", border: "1px solid #C9A84C", background: "rgba(201,168,76,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <CheckCircle size={48} style={{ color: "#C9A84C" }} />
              </div>
              <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>Message Sent Successfully!</p>
              <p style={{ color: "#C8C0B0", fontSize: "0.875rem", marginTop: "0.5rem" }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {[["name", "Full Name", "Your full name"], ["email", "Email Address", "your@email.com"]].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px", fontFamily: "Raleway, sans-serif" }}>{label}</label>
                    <input type={field === "email" ? "email" : "text"} placeholder={placeholder} value={(form as any)[field]}
                      onChange={e => setForm({...form, [field]: e.target.value})} required
                      style={{ width: "100%", padding: "12px 16px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Subject</label>
                <input placeholder="How can we help?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
                  style={{ width: "100%", padding: "12px 16px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Message</label>
                <textarea placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={5}
                  style={{ width: "100%", padding: "12px 16px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem", resize: "vertical" }} />
              </div>
              <button type="submit" style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Send size={16} /> SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`@media(max-width:800px){.contact-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
