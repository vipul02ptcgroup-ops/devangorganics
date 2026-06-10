"use client";
import { Leaf, Heart, Award, Users, User, FlaskConical } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "6rem 5%", background: "linear-gradient(135deg, #0A0A0A, #161616)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
        <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "1rem", position: "relative" }}>OUR STORY</p>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F0E8", marginBottom: "1.5rem", position: "relative" }}>
          Born from Nature,<br /><span style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Crafted with Love</span>
        </h1>
        <p style={{ color: "#C8C0B0", maxWidth: "600px", margin: "0 auto", lineHeight: 1.9, fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", position: "relative" }}>
          Founded with a passion for authentic organic living, Devang Organics brings the purest natural products from India's fertile lands to your home.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: "5rem 5%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="about-grid">
        <div>
          <div style={{ width: "100%", height: "400px", background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15))", border: "1px solid #C9A84C33", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={120} style={{ color: "#C9A84C", opacity: 0.6 }} />
          </div>
        </div>
        <div>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", marginBottom: "1rem" }}>OUR MISSION</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8", marginBottom: "1.5rem" }}>Purity in Every Product</h2>
          <p style={{ color: "#C8C0B0", lineHeight: 1.9, marginBottom: "1rem", fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
            At Devang Organics, we believe that what you put into your body and on your skin should be as pure as nature intended. Our journey began in the heart of Gujarat, where generations of farming wisdom meets modern organic practices.
          </p>
          <p style={{ color: "#C8C0B0", lineHeight: 1.9, fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
            Every product in our collection is carefully sourced, rigorously tested, and lovingly prepared to bring you the best of Ayurvedic wisdom without compromise.
          </p>
          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid #2A2A2A" }}>
            {[["2018", "Founded"], ["50K+", "Happy Customers"], ["200+", "Products"], ["100%", "Organic"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#C9A84C", fontWeight: 700 }}>{n}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.about-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Values */}
      <section style={{ padding: "5rem 5%", background: "#0D0D0D" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>WHAT DRIVES US</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Our Core Values</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="val-grid">
          {[
            { Icon: Leaf, title: "Purity", desc: "Every ingredient is sourced from certified organic farms with no pesticides or chemicals." },
            { Icon: Heart, title: "Care", desc: "We craft each product with genuine care for your health, wellness, and the environment." },
            { Icon: Award, title: "Quality", desc: "Rigorous testing ensures every product meets our highest standards before it reaches you." },
            { Icon: Users, title: "Community", desc: "We support local farmers and traditional knowledge keepers who preserve India's herbal wisdom." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem", textAlign: "center", transition: "border-color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2A2A2A")}>
              <div style={{ width: "60px", height: "60px", border: "1px solid #C9A84C", margin: "0 auto 1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={24} style={{ color: "#C9A84C" }} />
              </div>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1rem", letterSpacing: "0.05em" }}>{title}</h3>
              <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:800px){.val-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
      </section>

      {/* Team */}
      <section style={{ padding: "5rem 5%" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>THE PEOPLE</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Meet Our Team</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="team-grid">
          {[
            { name: "Devang Patel", role: "Founder & CEO", iconName: "User", desc: "Ayurvedic enthusiast with 15 years of experience in organic farming." },
            { name: "Meera Shah", role: "Head of Quality", iconName: "FlaskConical", desc: "Food scientist ensuring every product meets our strict purity standards." },
            { name: "Arjun Mehta", role: "Head of Sourcing", iconName: "Leaf", desc: "Works directly with 200+ farmers to source the finest organic ingredients." },
          ].map(person => (
            <div key={person.name} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem", textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.25))", borderRadius: "50%", margin: "0 auto 1.25rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #C9A84C33" }}>
                {person.iconName === "User" && <User size={32} style={{ color: "#C9A84C" }} />}
                {person.iconName === "FlaskConical" && <FlaskConical size={32} style={{ color: "#C9A84C" }} />}
                {person.iconName === "Leaf" && <Leaf size={32} style={{ color: "#C9A84C" }} />}
              </div>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", marginBottom: "4px" }}>{person.name}</h3>
              <p style={{ color: "#C9A84C", fontSize: "0.8rem", marginBottom: "1rem", fontFamily: "Raleway, sans-serif" }}>{person.role}</p>
              <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.7 }}>{person.desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:700px){.team-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </div>
  );
}
