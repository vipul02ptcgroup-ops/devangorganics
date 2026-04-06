"use client";
import React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star, ShoppingCart, Heart, Minus, Plus,
  Truck, Shield, RotateCcw, ChevronRight,
  Package, CheckCircle, MessageCircle,
  Leaf, Coffee, Sparkles, Utensils,
  Tag, BadgeCheck
} from "lucide-react";
import { products } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

const categoryIcons: Record<string, React.ReactNode> = {
  "herbs":         <Leaf size={18} />,
  "herb-tea":      <Coffee size={18} />,
  "natural-soaps": <Sparkles size={18} />,
  "pickles":       <Utensils size={18} />,
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const [qty, setQty]       = useState(1);
  const [imgError, setImgError] = useState(false);
  const [tab, setTab]       = useState<"description" | "benefits" | "reviews">("description");
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const hasPrice        = product.price !== null && product.price !== undefined;
  const hasRegularPrice = product.regular_price !== null && product.regular_price !== undefined;
  const discount =
    hasPrice && hasRegularPrice && product.regular_price! > product.price!
      ? Math.round(((product.regular_price! - product.price!) / product.regular_price!) * 100)
      : 0;

  const whatsappNumber  = "91123456789";
  const whatsappMessage = encodeURIComponent(`Hello, I would like to enquire about: ${product.name}`);
  const whatsappUrl     = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const categoryIcon = categoryIcons[product.category] ?? <Package size={18} />;

  const defaultBenefits = [
    "100% natural and organic ingredients",
    "No artificial preservatives or additives",
    "Sourced directly from certified organic farms",
    "Tested for purity and potency",
    "Eco-friendly and sustainable packaging",
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 px-[5%] py-4 border-b border-[#1A1A1A] text-xs text-[#666]">
        <Link href="/" className="hover:text-[#C9A84C] transition-colors duration-150">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-[#C9A84C] transition-colors duration-150">Products</Link>
        <ChevronRight size={12} />
        <span className="text-[#C9A84C] line-clamp-1 max-w-[200px]">{product.name}</span>
      </nav>

      {/* ─── Main grid ─────────────────────────────────────────── */}
      <div className="px-[5%] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* LEFT – image */}
          <div className="space-y-3">

            {/* Hero image box */}
            <div className="relative h-[400px] sm:h-[460px] border border-[#2A2A2A] bg-gradient-to-br from-[#C9A84C]/10 to-[#0A0A0A] flex items-center justify-center overflow-hidden">
              {/* dot grid */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              
                <img
                  src={`/${product.image}`}
                  alt={product.name}
                  className="relative z-10 max-h-[85%] max-w-[85%] w-auto h-auto object-     transition-transform duration-500 hover:scale-105"
                  onError={() => setImgError(true)}
                />
              

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A] text-[0.6rem] font-black tracking-[0.15em] uppercase px-3 py-1">
                  {product.badge}
                </span>
              )}

              {/* Out of stock */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
                  <span className="border border-[#666] text-[#C8C0B0] text-xs tracking-widest uppercase px-6 py-2">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {/* <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`w-[72px] h-[72px] border flex items-center justify-center transition-colors duration-200 cursor-pointer
                    ${i === 0
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-[#2A2A2A] bg-[#111] hover:border-[#C9A84C]/40"}`}
                >
                  
                    <img
                      src={`/${product.image}`}
                      alt=""
                      className="w-full h-full object-contain p-2"
                      onError={() => {}}
                    />
                   
                </button>
              ))}
            </div> */}
          </div>

          {/* RIGHT – info */}
          <div className="space-y-5">

            {/* Category pill */}
            <span className="inline-flex items-center gap-1.5 text-[#C9A84C] text-[0.65rem] tracking-[0.18em] uppercase font-semibold">
              {categoryIcon}
              {product.categories}
            </span>

            {/* Name */}
            <h1 className="font-['Cinzel',serif] text-2xl sm:text-3xl leading-snug text-[#F5F0E8]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i} size={14} className="text-[#C9A84C]"
                    fill={i < Math.floor(product.rating) ? "#C9A84C" : "none"}
                  />
                ))}
              </div>
              <span className="text-[#C9A84C] text-sm font-bold">{product.rating}</span>
              <span className="text-[#555] text-xs">({product.reviews} reviews)</span>
            </div>

            {/* ── Price ─────────────────────────── */}
            <div className="pb-5 border-b border-[#2A2A2A]">
              {hasPrice ? (
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="font-['Cinzel',serif] text-4xl font-bold text-[#C9A84C]">
                    ₹{product.price}
                  </span>
                  {hasRegularPrice && product.regular_price! > product.price! && (
                    <>
                      <span className="text-[#555] text-lg line-through">
                        ₹{product.regular_price}
                      </span>
                      <span className="bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-bold px-2.5 py-1">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-['Cinzel',serif] text-[#C9A84C] text-base tracking-wide">
                    Price on Enquiry
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ead57] text-white text-xs font-black tracking-widest uppercase px-5 py-3 transition-colors duration-200"
                  >
                    <MessageCircle size={14} />
                    Enquire on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[#C8C0B0] text-base leading-[1.85] font-['Cormorant_Garamond',serif] text-[1.05rem] line-clamp-2">
              {product.description ||
                "Premium quality organic product sourced directly from certified farms, ensuring the highest quality and purity."}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: <Tag size={11} />,       label: "Category", value: product.categories },
                { icon: <BadgeCheck size={11} />, label: "Status",   value: product.inStock ? "In Stock" : "Out of Stock" },
                { icon: <Package size={11} />,    label: "Weight",   value: product.weight },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-[#111] border border-[#232323] px-4 py-2.5 min-w-[100px]">
                  <p className="flex items-center gap-1 text-[#555] text-[0.58rem] uppercase tracking-widest mb-1">
                    {icon}{label}
                  </p>
                  <p className="text-[#C9A84C] text-sm font-semibold font-['Cinzel',serif] leading-none">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── CTA buttons ───────────────────── */}
          
              <div className="space-y-3 pt-1">
                <div className="flex gap-3 items-stretch">
                  {/* Qty */}
                  {/* <div className="flex items-center border border-[#2A2A2A]">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3.5 py-3 text-[#C8C0B0] hover:text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-4 py-3 text-sm font-bold text-[#F5F0E8] min-w-[2.5rem] text-center border-x border-[#2A2A2A]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-3.5 py-3 text-[#C8C0B0] hover:text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div> */}

                  {/* Add to Cart */}
                  {/* <button
                    onClick={() => {
                      for (let i = 0; i < qty; i++) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price!,
                          weight: product.weight,
                          color: product.color,
                        });
                      }
                    }}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 text-[0.72rem] font-black tracking-widest uppercase py-3 transition-all duration-200 cursor-pointer
                      ${product.inStock
                        ? "bg-gradient-to-r from-[#C9A84C] via-[#E8C96A] to-[#9A7A2E] text-[#0A0A0A] hover:opacity-90 hover:shadow-[0_6px_24px_rgba(201,168,76,0.3)]"
                        : "bg-[#1A1A1A] text-[#444] cursor-not-allowed"}`}
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button> */}

                  {/* Wishlist */}
                  {/* <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`px-4 py-3 border transition-all duration-200 cursor-pointer
                      ${isWishlisted
                        ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]"
                        : "border-[#2A2A2A] text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"}`}
                  >
                    <Heart size={15} fill={isWishlisted ? "#0A0A0A" : "none"} />
                  </button> */}
                </div>

                {/* Buy Now */}
                {/* <Link
                  href="/checkout"
                  className="block w-full text-center border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 text-[0.72rem] font-black tracking-widest uppercase py-3.5 transition-all duration-200"
                >
                  Buy Now
                </Link> */}
              </div>
          

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-2 pt-5 border-t border-[#1A1A1A]">
              {[
                { Icon: Truck,     title: "Free Shipping",  sub: "Above ₹499" },
                { Icon: Shield,    title: "Secure Payment", sub: "100% Safe" },
                { Icon: RotateCcw, title: "Easy Returns",   sub: "7 Days Policy" },
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5 p-3 bg-[#111] border border-[#1E1E1E]">
                  <Icon size={17} className="text-[#C9A84C]" />
                  <p className="text-[#F5F0E8] text-[0.62rem] font-bold tracking-wide leading-tight">{title}</p>
                  <p className="text-[#555] text-[0.58rem]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ──────────────────────────────────────────────── */}
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

        {/* ─── Related Products ──────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#1A1A1A]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-['Cinzel',serif] text-2xl text-[#C9A84C]">
                Related Products
              </h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-[0.65rem] text-[#555] hover:text-[#C9A84C] tracking-widest uppercase transition-colors"
              >
                View All <ChevronRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
