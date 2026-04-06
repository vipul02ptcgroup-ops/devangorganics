"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye, Package, Leaf, Coffee, Sparkles, Utensils } from "lucide-react";
import { useStore } from "@/lib/store";
import { Product } from "@/lib/data";

const categoryIcons: Record<string, React.ReactNode> = {
  "herbs":       <Leaf size={40} className="text-emerald-400 opacity-70" />,
  "herb-tea":    <Coffee size={40} className="text-amber-400 opacity-70" />,
  "natural-soaps": <Sparkles size={40} className="text-rose-300 opacity-70" />,
  "pickles":     <Utensils size={40} className="text-orange-400 opacity-70" />,
};

const categoryBg: Record<string, string> = {
  "herbs":         "from-emerald-900/40 to-emerald-800/20",
  "herb-tea":      "from-amber-900/40 to-amber-800/20",
  "natural-soaps": "from-rose-900/40 to-rose-800/20",
  "pickles":       "from-orange-900/40 to-orange-800/20",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const icon = categoryIcons[product.category] ?? <Package size={40} className="text-stone-400 opacity-70" />;
  const bg = categoryBg[product.category] ?? "from-stone-900/40 to-stone-800/20";

  return (
    <div className="group relative bg-[#161616] border border-[#2A2A2A] hover:border-[#C9A84C] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(201,168,76,0.12)] transition-all duration-300 overflow-hidden flex flex-col">

      {/* Image / Icon area */}
      <div className={`relative h-52 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`}>

        {/* Faint grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Product image or fallback icon */}
        {product.image ? (
          <img
            src={`/${product.image}`}
            alt={product.name}
            className="h-40 w-full object-contain px-4 relative z-10 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
            }}
          />
        ) : null}
        <div className="hidden absolute inset-0 items-center justify-center">
          {icon}
        </div>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A] font-bold text-[0.6rem] px-2.5 py-1 tracking-widest uppercase z-20">
            {product.badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="text-[#C8C0B0] text-xs tracking-widest border border-[#666] px-4 py-1.5 uppercase">Out of Stock</span>
          </div>
        )}

        {/* Action buttons — wishlist + quick view */}
        <div className="absolute right-2.5 bottom-2.5 flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-8 h-8 flex items-center justify-center border transition-all duration-200 cursor-pointer
              ${isWishlisted
                ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]"
                : "bg-black/80 border-[#2A2A2A] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C]"}`}
            aria-label="Toggle wishlist"
          >
            <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="w-8 h-8 flex items-center justify-center bg-black/80 border border-[#2A2A2A] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye size={13} />
          </Link>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-5 gap-2">

        {/* Category label */}
        <p className="text-[#666] text-[0.65rem] uppercase tracking-widest font-medium flex items-center gap-1">
          <span className="inline-flex scale-75">{icon}</span>
          {product.categories}
        </p>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[#F5F0E8] text-[0.9rem] leading-snug font-semibold hover:text-[#C9A84C] transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[#777] text-[0.75rem] leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className="text-[#C9A84C]"
                fill={i < Math.floor(product.rating) ? "#C9A84C" : "none"}
              />
            ))}
          </div>
          <span className="text-[#555] text-[0.7rem]">({product.reviews})</span>
        </div>

        {/* Price area */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {product.price ? (
              <>
                <span className="text-[#C9A84C] font-bold text-[1.05rem]">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[#555] text-sm line-through">₹{product.originalPrice}</span>
                )}
              </>
            ) : (
              <span className="text-[#C9A84C] text-sm font-semibold tracking-wide flex items-center gap-1.5">
                <ShoppingCart size={13} />
                Enquire for price
              </span>
            )}
          </div>
          <span className="text-[#444] text-[0.65rem] uppercase tracking-wider border border-[#2A2A2A] px-2 py-0.5">
            {product.inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => product.inStock && addToCart({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            weight: "",
            color: "#C9A84C",
          })}
          disabled={!product.inStock}
          className={`mt-2 w-full py-2.5 flex items-center justify-center gap-2 text-[0.72rem] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer
            ${product.inStock
              ? "bg-gradient-to-r from-[#C9A84C] via-[#E8C96A] to-[#9A7A2E] text-[#0A0A0A] hover:opacity-90 hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
              : "bg-[#1A1A1A] text-[#444] border border-[#2A2A2A] cursor-not-allowed"}`}
        >
          <ShoppingCart size={13} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
