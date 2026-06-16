"use client";
import Link from "next/link";
import { Leaf, Shield, Truck, Award, Star, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { testimonials } from "@/lib/data";
import { useProducts } from "@/lib/products";

export default function HomePage() {
  const { publicProducts, publicCategories, loading } = useProducts();
  const featured = publicProducts.slice(0, 4);
  const bestsellers = publicProducts.filter(p => p.badge === "Bestseller" || p.reviews > 100).slice(0, 4);
  const heroSectionStyle = {
    position: "relative" as const,
    overflow: "hidden",
    width: "100%",
  };

  return (
    <div>
      {/* Hero */}
      <section style={heroSectionStyle} aria-label="Hero banner image" className="hero-section">
        <img
          src="/Images/herobanner.png"
          alt="Devang Organics hero banner"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
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
          {publicCategories.map(cat => (
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
          {loading ? (
            <div style={{ color: "#C9A84C", gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0" }}>
              Loading products from Firebase...
            </div>
          ) : (
            featured.map(p => <ProductCard key={p.id} product={p} />)
          )}
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
          {loading ? (
            <div style={{ color: "#C9A84C", gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0" }}>
              Loading products from Firebase...
            </div>
          ) : (
            bestsellers.map(p => <ProductCard key={p.id} product={p} />)
          )}
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
