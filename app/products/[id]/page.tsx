"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight, Share2, Package, CheckCircle } from "lucide-react";
import { products } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id)) || products[0];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const discount = Math.round(((product.regular_price - product.price) / product.regular_price) * 100);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: "1rem 5%", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
        <Link href="/" style={{ color: "#666", textDecoration: "none" }}>Home</Link>
        <ChevronRight size={14} style={{ color: "#666" }} />
        <Link href="/products" style={{ color: "#666", textDecoration: "none" }}>Products</Link>
        <ChevronRight size={14} style={{ color: "#666" }} />
        <span style={{ color: "#C9A84C" }}>{product.name}</span>
      </div>

      <div style={{ padding: "3rem 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="detail-grid">
          {/* Image */}
          <div>
            <div style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15))`, height: "450px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2A2A2A", position: "relative", overflow: "hidden" }}>
              {product.image ? (
                <img
                  src={`/${product.image}`}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2rem" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div style={{ display: "none", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0 }}>
                <Package size={96} style={{ color: "#C9A84C", opacity: 0.4 }} />
              </div>
              {product.badge && (
                <span style={{ position: "absolute", top: "16px", left: "16px", background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A0A0A", fontFamily: "Cinzel, serif", fontSize: "0.7rem", fontWeight: 700, padding: "4px 12px", letterSpacing: "0.05em" }}>
                  {product.badge}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(201,168,76,0.12))", border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Package size={24} style={{ color: "#C9A84C", opacity: 0.6 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", fontFamily: "Raleway, sans-serif", marginBottom: "0.5rem" }}>
              {product.category.replace(/-/g, " ").toUpperCase()}
            </p>
            <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8", marginBottom: "1rem", lineHeight: 1.2 }}>{product.name}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "#C9A84C" : "none"} style={{ color: "#C9A84C" }} />)}
              </div>
              <span style={{ color: "#C9A84C", fontSize: "0.9rem" }}>{product.rating}</span>
              <span style={{ color: "#666", fontSize: "0.875rem" }}>({product.reviews} reviews)</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #2A2A2A" }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#C9A84C" }}>₹{product.price}</span>
              <span style={{ color: "#666", fontSize: "1rem", textDecoration: "line-through" }}>₹{product.regular_price}</span>
              <span style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", padding: "3px 10px", fontSize: "0.8rem", fontWeight: 700 }}>
                {discount}% OFF
              </span>
            </div>

            <p style={{ color: "#C8C0B0", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem", fontFamily: "Cormorant Garamond, serif" }}>
              {product.description}
            </p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {[["Net Weight", product.weight], ["Category", product.category.replace(/-/g, " ")], ["Status", product.inStock ? "In Stock" : "Out of Stock"]].map(([k, v]) => (
                <div key={k} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "8px 16px" }}>
                  <p style={{ color: "#666", fontSize: "0.7rem", letterSpacing: "0.08em" }}>{k}</p>
                  <p style={{ color: "#C9A84C", fontSize: "0.85rem", fontFamily: "Cinzel, serif", marginTop: "2px" }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #2A2A2A" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "12px 16px" }}><Minus size={16} /></button>
                <span style={{ color: "#F5F0E8", padding: "12px 20px", fontSize: "1rem", minWidth: "40px", textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "12px 16px" }}><Plus size={16} /></button>
              </div>
              <button onClick={() => { for(let i=0;i<qty;i++) addToCart({id:product.id,name:product.name,price:product.price,weight:product.weight,color:product.color}); }}
                disabled={!product.inStock}
                style={{ flex: 1, background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.08em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <ShoppingCart size={18} /> ADD TO CART
              </button>
              <button onClick={() => toggleWishlist(product.id)} style={{ background: isWishlisted ? "#C9A84C" : "transparent", border: "1px solid #C9A84C", padding: "14px 16px", cursor: "pointer", color: isWishlisted ? "#0A0A0A" : "#C9A84C" }}>
                <Heart size={18} fill={isWishlisted ? "#0A0A0A" : "none"} />
              </button>
            </div>

            <Link href="/checkout" style={{ display: "block", width: "100%", background: "transparent", border: "1px solid #C9A84C", padding: "14px", color: "#C9A84C", fontFamily: "Cinzel, serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.08em", textAlign: "center", textDecoration: "none", marginBottom: "2rem" }}>
              BUY NOW
            </Link>

            <div style={{ display: "flex", gap: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #2A2A2A" }}>
              {[[Truck, "Free Shipping", "Above ₹499"], [Shield, "Secure Payment", "100% Safe"], [RotateCcw, "Easy Returns", "7 Days Policy"]].map(([Icon, title, desc]: any) => (
                <div key={title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
                  <Icon size={20} style={{ color: "#C9A84C", marginBottom: "6px" }} />
                  <p style={{ color: "#F5F0E8", fontSize: "0.75rem", fontWeight: 600 }}>{title}</p>
                  <p style={{ color: "#666", fontSize: "0.7rem" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #2A2A2A" }}>
            {["description", "benefits", "reviews"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ background: "none", border: "none", borderBottom: tab === t ? "2px solid #C9A84C" : "2px solid transparent", color: tab === t ? "#C9A84C" : "#666", padding: "14px 24px", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "-1px" }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ padding: "2rem 0" }}>
            {tab === "description" && <p style={{ color: "#C8C0B0", lineHeight: 1.9, fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>{product.description} This product is sourced directly from certified organic farms, ensuring the highest quality and purity. Each batch is carefully tested to meet our rigorous standards before reaching your doorstep.</p>}
            {tab === "benefits" && (
              <ul style={{ color: "#C8C0B0", lineHeight: 2, paddingLeft: "1.5rem" }}>
                {["100% natural and organic ingredients", "No artificial preservatives or additives", "Sourced directly from certified farms", "Tested for purity and potency", "Eco-friendly packaging"].map(b => (
                  <li key={b} style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", listStyle: "none" }}>
                    <CheckCircle size={14} style={{ color: "#C9A84C", flexShrink: 0 }} /> {b}
                  </li>
                ))}
              </ul>
            )}
            {tab === "reviews" && (
              <div style={{ display: "grid", gap: "1rem" }}>
                {[{ name: "Priya S.", rating: 5, text: "Excellent quality! Highly recommend.", date: "2 weeks ago" }, { name: "Rahul M.", rating: 4, text: "Very good product, great value for money.", date: "1 month ago" }].map((r, i) => (
                  <div key={i} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <span style={{ color: "#F5F0E8", fontWeight: 600, fontSize: "0.875rem" }}>{r.name}</span>
                        <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "#C9A84C" : "none"} style={{ color: "#C9A84C" }} />)}
                        </div>
                      </div>
                      <span style={{ color: "#666", fontSize: "0.75rem" }}>{r.date}</span>
                    </div>
                    <p style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#C9A84C", marginBottom: "2rem" }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="rel-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){.detail-grid{grid-template-columns:1fr!important;} .rel-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}
