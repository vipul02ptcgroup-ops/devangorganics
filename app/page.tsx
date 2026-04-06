"use client";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Truck, Award, Star, ChevronRight, Coffee, Sparkles, Utensils } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { products, categories, testimonials } from "@/lib/data";

export default function HomePage() {
  const featured = products.slice(0, 4);
  const bestsellers = products.filter(p => p.badge === "Bestseller" || p.reviews > 100).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0D0D0D 100%)" }}>
        {/* Decorative */}
        {/* <div style={{ position: "absolute", top: "10%", right: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "3%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents: "none" }} /> */}
        
        <div style={{ padding: "0 5%", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid #C9A84C33", padding: "6px 16px", marginBottom: "1.5rem" }}>
              <Leaf size={14} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.75rem", fontFamily: "Raleway, sans-serif", letterSpacing: "0.15em" }}>100% CERTIFIED ORGANIC</span>
            </div>
            <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem" }}>
              <span style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nature's Finest</span>
              <br />
              <span style={{ color: "#F5F0E8" }}>Delivered to</span>
              <br />
              <span style={{ color: "#F5F0E8" }}>Your Door</span>
            </h1>
            <p style={{ color: "#C8C0B0", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "480px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
              Rooted in Ayurveda, crafted with love. Premium organic teas, herbs, soaps, and pickles with no artificial preservatives.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/products" style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", color: "#0A0A0A", padding: "14px 32px", textDecoration: "none", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "8px" }}>
                SHOP NOW <ArrowRight size={16} />
              </Link>
              <Link href="/about" style={{ background: "transparent", border: "1px solid #C9A84C", color: "#C9A84C", padding: "14px 32px", textDecoration: "none", fontFamily: "Cinzel, serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                OUR STORY
              </Link>
            </div>
            <div style={{ display: "flex", gap: "2rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #2A2A2A" }}>
              {[["500+", "Products"], ["50K+", "Customers"], ["100%", "Organic"], ["4.9", "Rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#C9A84C", fontWeight: 700 }}>{num}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem", letterSpacing: "0.08em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div style={{ width: "380px", height: "380px", borderRadius: "50%", border: "1px solid #C9A84C33", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: "300px", height: "300px", borderRadius: "50%", border: "1px solid #C9A84C22", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={96} style={{ color: "#C9A84C", opacity: 0.6 }} />
              </div>
              {/* Floating badges */}
              {[
                { icon: <Coffee size={28} style={{ color: "#C9A84C" }} />, label: "Herb Tea", angle: -45, r: 190 },
                { icon: <Sparkles size={28} style={{ color: "#C9A84C" }} />, label: "Natural Soap", angle: 45, r: 190 },
                { icon: <Utensils size={28} style={{ color: "#C9A84C" }} />, label: "Pickles", angle: 135, r: 190 },
                { icon: <Leaf size={28} style={{ color: "#C9A84C" }} />, label: "Herbs", angle: -135, r: 190 },
              ].map(({ icon, label, angle, r }) => {
                const x = Math.cos((angle * Math.PI) / 180) * r;
                const y = Math.sin((angle * Math.PI) / 180) * r;
                return (
                  <div key={label} style={{ position: "absolute", left: `calc(50% + ${x}px - 35px)`, top: `calc(50% + ${y}px - 35px)`, width: "70px", height: "70px", background: "#161616", border: "1px solid #2A2A2A", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`@media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;text-align:center}}`}</style>
      </section>

      {/* Features */}
      <section style={{ padding: "4rem 5%", background: "#0D0D0D", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="features-grid">
          {[
            { Icon: Leaf, title: "100% Organic", desc: "Certified natural ingredients, no chemicals" },
            { Icon: Shield, title: "No Preservatives", desc: "Fresh, pure products with natural shelf life" },
            { Icon: Truck, title: "Free Shipping", desc: "On all orders above ₹499 across India" },
            { Icon: Award, title: "Quality Assured", desc: "Tested and certified for purity and potency" },
          ].map(({ Icon, title, desc }) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "1.5rem", border: "1px solid #1A1A1A", transition: "border-color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C33")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#1A1A1A")}>
              <div style={{ width: "56px", height: "56px", border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Icon size={24} style={{ color: "#C9A84C" }} />
              </div>
              <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#C9A84C", marginBottom: "8px", letterSpacing: "0.05em" }}>{title}</h3>
              <p style={{ color: "#666", fontSize: "0.8rem", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:800px){.features-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
      </section>

      {/* Categories */}
      <section style={{ padding: "5rem 5%" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "0.5rem" }}>EXPLORE</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2.2rem", color: "#F5F0E8", marginBottom: "1rem" }}>Our Categories</h2>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="cat-grid content-center">
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem 1rem", textAlign: "center", transition: "all 0.3s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLElement).style.background = "#161616"; }}>
                {/* <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{cat.icon}</div> */}
                <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", color: "#C9A84C", letterSpacing: "0.05em", marginBottom: "4px" }}>{cat.name}</h3>
                <p style={{ color: "#666", fontSize: "0.7rem" }}>{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
        <style>{`@media(max-width:900px){.cat-grid{grid-template-columns:repeat(3,1fr)!important;}} @media(max-width:500px){.cat-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "5rem 5%", background: "#0D0D0D" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "0.5rem" }}>HANDPICKED</p>
            <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Featured Products</h2>
          </div>
          <Link href="/products" style={{ color: "#C9A84C", textDecoration: "none", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
            VIEW ALL <ChevronRight size={16} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="prod-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <style>{`@media(max-width:900px){.prod-grid{grid-template-columns:repeat(2,1fr)!important;}} @media(max-width:500px){.prod-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Banner */}
      <section style={{ padding: "5rem 5%", background: "linear-gradient(135deg, #0A0A0A, #161616)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "1rem" }}>SPECIAL OFFER</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2.5rem", color: "#F5F0E8", marginBottom: "1rem", lineHeight: 1.2 }}>
            Get <span style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>20% OFF</span> on Your First Order
          </h2>
          <p style={{ color: "#C8C0B0", fontSize: "1rem", marginBottom: "2rem", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
            Use code <strong style={{ color: "#C9A84C", fontStyle: "normal" }}>DEVANG20</strong> at checkout. Valid for new customers only.
          </p>
          <Link href="/products" style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", color: "#0A0A0A", padding: "14px 36px", textDecoration: "none", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em" }}>
            CLAIM OFFER
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      <section style={{ padding: "5rem 5%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "0.5rem" }}>TOP PICKS</p>
            <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Bestsellers</h2>
          </div>
          <Link href="/products" style={{ color: "#C9A84C", textDecoration: "none", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
            VIEW ALL <ChevronRight size={16} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="prod-grid2">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <style>{`@media(max-width:900px){.prod-grid2{grid-template-columns:repeat(2,1fr)!important;}} @media(max-width:500px){.prod-grid2{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "5rem 5%", background: "#0D0D0D" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "Raleway, sans-serif", marginBottom: "0.5rem" }}>REVIEWS</p>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>What Our Customers Say</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="test-grid">
          {testimonials.map(t => (
            <div key={t.id} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "1rem" }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < t.rating ? "#C9A84C" : "none"} style={{ color: "#C9A84C" }} />)}
              </div>
              <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cinzel, serif", fontSize: "0.75rem", fontWeight: 700, color: "#0A0A0A" }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ color: "#F5F0E8", fontWeight: 600, fontSize: "0.875rem", fontFamily: "Raleway, sans-serif" }}>{t.name}</p>
                  <p style={{ color: "#666", fontSize: "0.75rem" }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:900px){.test-grid{grid-template-columns:repeat(2,1fr)!important;}} @media(max-width:500px){.test-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </div>
  );
}
