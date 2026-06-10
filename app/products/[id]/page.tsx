"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star, ShoppingCart, Heart, Minus, Plus,
  Truck, Shield, RotateCcw, ChevronRight,
  Package, CheckCircle, MessageCircle,
  Leaf, Coffee, Sparkles, Utensils,
  Tag, BadgeCheck
} from "lucide-react";
import { useProducts } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";
import { getProductImageCandidates } from "@/lib/product-images";

const categoryIcons: Record<string, React.ReactNode> = {
  "herbs":         <Leaf size={18} />,
  "herb-tea":      <Coffee size={18} />,
  "natural-soaps": <Sparkles size={18} />,
  "pickles":       <Utensils size={18} />,
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const matchedProduct = products.find((p) => p.id === Number(id));
  const product = matchedProduct || null;
  const safeProduct =
    product || {
      id: 0,
      name: "Product",
      category: "herbs",
      categories: "Herb's",
      price: null,
      regular_price: null,
      originalPrice: null,
      rating: 4.5,
      reviews: 0,
      description: "",
      inStock: false,
      image: "",
      weight: "50g",
      color: "Natural",
      attributes: null,
    };
  const related = products
    .filter((p) => p.category === safeProduct.category && p.id !== safeProduct.id)
    .slice(0, 4);

  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState<"description" | "benefits" | "reviews">("description");
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(safeProduct.id);

  const hasPrice = safeProduct.price !== null && safeProduct.price !== undefined;
  const hasRegularPrice =
    safeProduct.regular_price !== null && safeProduct.regular_price !== undefined;
  const discount =
    hasPrice && hasRegularPrice && safeProduct.regular_price! > safeProduct.price!
      ? Math.round(
          ((safeProduct.regular_price! - safeProduct.price!) / safeProduct.regular_price!) * 100
        )
      : 0;

  const whatsappNumber = "91123456789";
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to enquire about: ${safeProduct.name}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const categoryIcon = categoryIcons[safeProduct.category] ?? <Package size={18} />;
  const imageCandidates = useMemo(
    () => getProductImageCandidates(safeProduct.image || "", safeProduct.name),
    [safeProduct.image, safeProduct.name]
  );

  const defaultBenefits = [
    "100% natural and organic ingredients",
    "No artificial preservatives or additives",
    "Sourced directly from certified organic farms",
    "Tested for purity and potency",
    "Eco-friendly and sustainable packaging",
  ];

  useEffect(() => {
    setImageIndex(0);
  }, [safeProduct.id, safeProduct.image, safeProduct.name]);

  const activeImage = imageCandidates[imageIndex];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#C9A84C]">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-[5%]">
        <Package size={44} className="text-[#C9A84C]" />
        <h1 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Product not found</h1>
        <p className="text-[#666] max-w-md">
          This product is not available in Firebase right now.
        </p>
        <Link href="/products" className="text-[#C9A84C] hover:text-[#E8C96A] transition-colors">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <nav className="flex items-center gap-2 px-[5%] py-4 border-b border-[#1A1A1A] text-xs text-[#666]">
        <Link href="/" className="hover:text-[#C9A84C] transition-colors duration-150">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-[#C9A84C] transition-colors duration-150">Products</Link>
        <ChevronRight size={12} />
        <span className="text-[#C9A84C] line-clamp-1 max-w-[200px]">{safeProduct.name}</span>
      </nav>

      <div className="px-[5%] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          <div className="space-y-3">
            <div className="relative h-[400px] sm:h-[460px] border border-[#2A2A2A] bg-gradient-to-br from-[#C9A84C]/10 to-[#0A0A0A] flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={safeProduct.name}
                  className="relative z-10 max-h-[85%] max-w-[85%] w-auto h-auto object-contain transition-transform duration-500 hover:scale-105"
                  onError={() => {
                    if (imageIndex < imageCandidates.length - 1) {
                      setImageIndex((current) => current + 1);
                    }
                  }}
                />
              ) : (
                <div className="relative z-10 text-[#C9A84C]">{categoryIcon}</div>
              )}

              {safeProduct.badge && (
                <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A] text-[0.6rem] font-black tracking-[0.15em] uppercase px-3 py-1">
                  {safeProduct.badge}
                </span>
              )}

              {!safeProduct.inStock && (
                <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
                  <span className="border border-[#666] text-[#C8C0B0] text-xs tracking-widest uppercase px-6 py-2">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[#C9A84C] text-xs tracking-widest uppercase">
              {categoryIcon}
              <span>{safeProduct.categories}</span>
            </div>
            <h1 className="font-[Cinzel] text-3xl lg:text-4xl">{safeProduct.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-[#C9A84C]"
                    fill={i < Math.floor(safeProduct.rating) ? "#C9A84C" : "none"}
                  />
                ))}
              </div>
              <span className="text-[#666] text-sm">
                {safeProduct.rating} ({safeProduct.reviews} reviews)
              </span>
            </div>

            <div className="flex items-end gap-3">
              <span className="font-[Cinzel] text-3xl text-[#C9A84C]">
                {hasPrice ? `Rs${safeProduct.price}` : "Price on request"}
              </span>
              {hasRegularPrice ? (
                <span className="text-[#666] line-through text-lg">
                  Rs{safeProduct.regular_price}
                </span>
              ) : null}
              {discount > 0 ? (
                <span className="text-emerald-400 text-sm">{discount}% OFF</span>
              ) : null}
            </div>

            <p className="text-[#C8C0B0] leading-7">{safeProduct.description}</p>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#2A2A2A]">
                <button onClick={() => setQty((value) => Math.max(1, value - 1))} className="px-3 py-2 text-[#C8C0B0]">
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-12 text-center">{qty}</span>
                <button onClick={() => setQty((value) => value + 1)} className="px-3 py-2 text-[#C8C0B0]">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: safeProduct.id,
                    name: safeProduct.name,
                    price: safeProduct.price ?? 0,
                    weight: safeProduct.weight,
                    color: safeProduct.color,
                  })
                }
                className="flex items-center gap-2 px-6 py-3 font-[Cinzel] bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A]"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(safeProduct.id)}
                className="p-3 border border-[#2A2A2A] text-[#C8C0B0]"
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { icon: <Truck size={15} />, label: "Delivery", value: "Across India" },
                { icon: <Shield size={15} />, label: "Quality", value: "Tested & trusted" },
                { icon: <RotateCcw size={15} />, label: "Support", value: "Easy assistance" },
              ].map((item) => (
                <div key={item.label} className="border border-[#2A2A2A] bg-[#161616] p-4">
                  <div className="flex items-center gap-2 text-[#C9A84C] mb-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[#C8C0B0]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="border border-[#2A2A2A] bg-[#161616]">
              <div className="flex border-b border-[#2A2A2A]">
                {["description", "benefits", "reviews"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item as typeof tab)}
                    className={`px-4 py-3 text-sm uppercase tracking-widest ${tab === item ? "text-[#C9A84C]" : "text-[#666]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="p-5 text-[#C8C0B0] leading-7">
                {tab === "description" ? (
                  <p>{safeProduct.description}</p>
                ) : null}
                {tab === "benefits" ? (
                  <ul className="space-y-2">
                    {(safeProduct.attributes ? Object.keys(safeProduct.attributes) : defaultBenefits).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-[#C9A84C] mt-1 shrink-0" />
                        <span>
                          {safeProduct.attributes ? `${item}: ${safeProduct.attributes[item]}` : item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {tab === "reviews" ? (
                  <p>Customer reviews will appear here soon.</p>
                ) : null}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[#C9A84C]"
            >
              <MessageCircle size={16} />
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <BadgeCheck size={18} className="text-[#C9A84C]" />
              <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
