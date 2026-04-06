"use client";
import Link from "next/link";
import { Share2, MessageCircle, Send, Radio, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const socialIcons = [Share2, MessageCircle, Send, Radio];

  return (
    <footer style={{ background: "#0D0D0D", borderTop: "1px solid #2A2A2A", marginTop: "auto" }}>
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
      
      <div style={{ padding: "4rem 5% 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: "3rem" }} className="footer-grid">
        {/* Brand */}
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", fontWeight: 700, background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DEVANG</span>
            <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C9A84C", marginTop: "-4px" }}>ORGANICS</div>
          </div>
          <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "280px" }}>
            Bringing nature's finest organic products to your doorstep. Rooted in Ayurveda, crafted with love, delivered with trust.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {socialIcons.map((Icon, i) => (
              <a key={i} href="#" style={{ width: "38px", height: "38px", border: "1px solid #2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8C0B0", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; (e.currentTarget as HTMLElement).style.color = "#C9A84C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLElement).style.color = "#C8C0B0"; }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#C9A84C", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>QUICK LINKS</h4>
          {[["Home", "/"], ["About Us", "/about"], ["Products", "/products"], ["Contact", "/contact"], ["My Account", "/profile"]].map(([label, href]) => (
            <div key={href} style={{ marginBottom: "0.75rem" }}>
              <Link href={href} style={{ color: "#C8C0B0", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#C8C0B0")}>
                {label}
              </Link>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#C9A84C", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>CATEGORIES</h4>
          {[["Organic Tea", "organic-tea"], ["Natural Herbs", "natural-herbs"], ["Natural Soaps", "natural-soaps"], ["Pickles", "pickles"], ["Essential Oils", "essential-oils"]].map(([label, slug]) => (
            <div key={slug} style={{ marginBottom: "0.75rem" }}>
              <Link href={`/products?category=${slug}`} style={{ color: "#C8C0B0", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#C8C0B0")}>
                {label}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#C9A84C", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>CONTACT US</h4>
          {[
            { Icon: MapPin, text: "123 Nature's Way, Ahmedabad, Gujarat 380001" },
            { Icon: Phone, text: "+91 98765 43210" },
            { Icon: Mail, text: "hello@devangorganics.com" },
          ].map(({ Icon, text }, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "1rem", alignItems: "flex-start" }}>
              <Icon size={16} style={{ color: "#C9A84C", flexShrink: 0, marginTop: "3px" }} />
              <span style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#161616", border: "1px solid #2A2A2A" }}>
            <p style={{ color: "#C9A84C", fontSize: "0.75rem", fontFamily: "Cinzel, serif", letterSpacing: "0.08em", marginBottom: "8px" }}>NEWSLETTER</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input placeholder="Your email" style={{ flex: 1, padding: "8px 12px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.8rem" }} />
              <button style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", border: "none", padding: "8px 14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.7rem", fontWeight: 600 }}>GO</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #2A2A2A, transparent)", margin: "0 5%" }} />
      <div style={{ padding: "1.5rem 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ color: "#666", fontSize: "0.8rem" }}>© 2026 Devang Organics | Powered by PTCGRAM Private Limited. </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy Policy", "Terms of Service", "Return Policy"].map(label => (
            <Link key={label} href="#" style={{ color: "#666", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;}} @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important;}}`}</style>
    </footer>
  );
}
