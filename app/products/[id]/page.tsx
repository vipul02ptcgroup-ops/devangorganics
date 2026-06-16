"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle,
  ChevronRight,
  Coffee,
  Heart,
  Leaf,
  MessageCircle,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
  Utensils,
} from "lucide-react";
import type { ProductReviewRecord } from "@/lib/api-types";
import type { Product } from "@/lib/data";
import { useProducts } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import ProductCard from "@/components/products/ProductCard";
import { getProductImageCandidates } from "@/lib/product-images";
import { getReviewsForProductClient, saveReviewClient } from "@/lib/reviews-client";

const categoryIcons: Record<string, React.ReactNode> = {
  herbs: <Leaf size={18} />,
  "herb-tea": <Coffee size={18} />,
  "natural-soaps": <Sparkles size={18} />,
  pickles: <Utensils size={18} />,
};

function buildBenefitList(product: Product) {
  if (product.attributes && Object.keys(product.attributes).length > 0) {
    return Object.entries(product.attributes).map(([title, text]) => ({
      title,
      text,
    }));
  }

  const source = product.shortDescription || product.description || "";
  const pieces = source
    .split(/[\.\n]| - /)
    .map((item) => item.trim())
    .filter((item) => item.length > 15)
    .slice(0, 5);

  if (pieces.length > 0) {
    return pieces.map((text, index) => ({
      title: `Feature ${index + 1}`,
      text,
    }));
  }

  return [
    { title: "Natural", text: "Made with nature-inspired ingredients and careful sourcing." },
    { title: "Flexible", text: "Suitable for customers looking for wellness-focused products." },
    { title: "Safe Handling", text: "Product information is shown only when available in your catalog." },
  ];
}

function renderRating(rating?: number) {
  if (typeof rating !== "number" || Number.isNaN(rating)) {
    return "Not rated yet";
  }

  return rating.toFixed(1);
}

function formatReviewDate(value?: string | null) {
  if (!value) {
    return "Recently";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sortReviewsByNewest(items: ProductReviewRecord[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loading } = useProducts();
  const { user, userProfile } = useAuth();
  const product = products.find((entry) => entry.id === Number(id)) || null;
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState<"description" | "benefits" | "details">(
    "description"
  );
  const [productReviews, setProductReviews] = useState<ProductReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFormError, setReviewFormError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const categoryIcon =
    (product && categoryIcons[product.category]) || <Package size={18} />;
  const imageCandidates = useMemo(
    () =>
      product ? getProductImageCandidates(product.image || "", product.name) : [],
    [product]
  );
  const activeImage = imageCandidates[imageIndex] || "";
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const relatedProducts = product
    ? products
        .filter((entry) => entry.category === product.category && entry.id !== product.id)
        .slice(0, 4)
    : [];
  const benefitList = product ? buildBenefitList(product) : [];
  const hasPrice = typeof product?.price === "number";
  const hasRegularPrice = typeof product?.regular_price === "number";
  const currentUserReview = useMemo(
    () =>
      user ? productReviews.find((entry) => entry.userId === user.uid) ?? null : null,
    [productReviews, user]
  );
  const reviewAverage = useMemo(() => {
    if (productReviews.length === 0) {
      return product?.rating ?? 0;
    }

    const total = productReviews.reduce((sum, entry) => sum + entry.rating, 0);
    return total / productReviews.length;
  }, [product?.rating, productReviews]);
  const reviewCount = productReviews.length || product?.reviews || 0;
  const discount =
    hasPrice &&
    hasRegularPrice &&
    (product?.regular_price || 0) > (product?.price || 0)
      ? Math.round(
          (((product?.regular_price || 0) - (product?.price || 0)) /
            (product?.regular_price || 1)) *
            100
        )
      : 0;
  const whatsappUrl = product
    ? `https://wa.me/91123456789?text=${encodeURIComponent(
        `Hello, I would like to enquire about: ${product.name}`
      )}`
    : "#";

  useEffect(() => {
    setImageIndex(0);
    setQty(1);
  }, [product?.id]);

  useEffect(() => {
    let cancelled = false;

    if (!product) {
      setProductReviews([]);
      setReviewsLoading(false);
      return;
    }

    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const nextReviews = await getReviewsForProductClient(product.id);

        if (!cancelled) {
          setProductReviews(nextReviews);
        }
      } catch (error) {
        if (!cancelled) {
          setReviewsError(
            error instanceof Error ? error.message : "Failed to load reviews."
          );
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    if (currentUserReview) {
      setReviewRating(currentUserReview.rating);
      setReviewComment(currentUserReview.comment);
      return;
    }

    setReviewRating(5);
    setReviewComment("");
  }, [currentUserReview]);

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
          This product is not available in your catalog right now.
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
        <Link href="/" className="hover:text-[#C9A84C] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-[#C9A84C] transition-colors">
          Products
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#C9A84C] line-clamp-1 max-w-[220px]">{product.name}</span>
      </nav>

      <div className="px-[5%] py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-start">
          <div className="space-y-4">
            <div className="relative min-h-[420px] border border-[#2A2A2A] bg-gradient-to-br from-[#C9A84C]/10 via-[#161616] to-[#0A0A0A] flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="relative z-10 max-h-[80%] max-w-[82%] object-contain"
                  onError={() => {
                    if (imageIndex < imageCandidates.length - 1) {
                      setImageIndex((current) => current + 1);
                    }
                  }}
                />
              ) : (
                <div className="relative z-10 text-[#C9A84C]">{categoryIcon}</div>
              )}

              {product.badge ? (
                <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A] text-[0.6rem] font-black tracking-[0.15em] uppercase px-3 py-1">
                  {product.badge}
                </span>
              ) : null}

              {!product.inStock ? (
                <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
                  <span className="border border-[#666] text-[#C8C0B0] text-xs tracking-widest uppercase px-6 py-2">
                    Out of Stock
                  </span>
                </div>
              ) : null}
            </div>

            {imageCandidates.length > 1 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {imageCandidates.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setImageIndex(index)}
                    className={`border p-2 bg-[#111111] transition-colors ${
                      imageIndex === index
                        ? "border-[#C9A84C]"
                        : "border-[#2A2A2A] hover:border-[#C9A84C]/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-16 w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-[#C9A84C] text-xs tracking-[0.25em] uppercase">
              <span className="inline-flex items-center gap-2">
                {categoryIcon}
                {product.categories || "Uncategorized"}
              </span>
              {product.stock !== null && product.stock !== undefined ? (
                <span className="border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-2 py-1 tracking-[0.15em]">
                  Stock: {product.stock}
                </span>
              ) : null}
            </div>

            <div>
              <h1 className="font-[Cinzel] text-3xl lg:text-4xl leading-tight">
                {product.name || "Unnamed product"}
              </h1>
              {product.shortDescription ? (
                <p className="text-[#C8C0B0] text-base leading-7 mt-4">
                  {product.shortDescription}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className="text-[#C9A84C]"
                    fill={
                      index < Math.round(reviewAverage || 0) ? "#C9A84C" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-[#666] text-sm">
                {renderRating(reviewAverage)}
                {reviewCount ? ` (${reviewCount} reviews)` : ""}
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <span className="font-[Cinzel] text-3xl text-[#C9A84C]">
                {hasPrice ? `Rs${product.price}` : "Price on request"}
              </span>
              {hasRegularPrice ? (
                <span className="text-[#666] line-through text-lg">
                  Rs{product.regular_price}
                </span>
              ) : null}
              {discount > 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                  <Tag size={14} />
                  {discount}% OFF
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                ["Stock", product.inStock ? "Available" : "Out of stock"],
                ["Category", product.categories || "Not set"],
                ["Weight", product.weight || "Not set"],
                ["Rating", renderRating(reviewAverage)],
              ].map(([label, value]) => (
                <div key={label} className="border border-[#2A2A2A] bg-[#161616] p-4">
                  <p className="text-[#666] text-[0.7rem] uppercase tracking-[0.18em] mb-2">
                    {label}
                  </p>
                  <p className="text-[#F5F0E8] text-sm">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-[#C8C0B0] leading-7">
              {product.description || "Detailed product information will appear here when available."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-[#2A2A2A] bg-[#111111]">
                <button
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="px-3 py-3 text-[#C8C0B0]"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 min-w-12 text-center">{qty}</span>
                <button
                  onClick={() => setQty((value) => value + 1)}
                  className="px-3 py-3 text-[#C8C0B0]"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => {
                  for (let count = 0; count < qty; count += 1) {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price ?? 0,
                      weight: product.weight,
                      color: product.color,
                      image: product.image,
                    });
                  }
                }}
                disabled={!product.inStock}
                className={`flex items-center gap-2 px-6 py-3 font-[Cinzel] ${
                  product.inStock
                    ? "bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0A]"
                    : "bg-[#161616] border border-[#2A2A2A] text-[#666]"
                }`}
              >
                <ShoppingCart size={16} />
                {product.inStock ? "Add to Cart" : "Unavailable"}
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    router.push(
                      `/login?next=${encodeURIComponent("/profile?tab=wishlist")}`
                    );
                    return;
                  }

                  void toggleWishlist({
                    productId: product.id,
                    productName: product.name,
                    productImage: product.image,
                  });
                }}
                className={`p-3 border ${
                  isWishlisted
                    ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                    : "border-[#2A2A2A] text-[#C8C0B0]"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { icon: <Truck size={15} />, label: "Delivery", value: "Across India" },
                { icon: <Shield size={15} />, label: "Trust", value: "Handled with care" },
                { icon: <CheckCircle size={15} />, label: "Support", value: "Safe backend-connected flow" },
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
              <div className="flex flex-wrap border-b border-[#2A2A2A]">
                {[
                  ["description", "Description"],
                  ["benefits", "Benefits"],
                  ["details", "Details"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key as typeof tab)}
                    className={`px-4 py-3 text-sm uppercase tracking-widest ${
                      tab === key ? "text-[#C9A84C]" : "text-[#666]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="p-5 text-[#C8C0B0] leading-7">
                {tab === "description" ? (
                  <p>
                    {product.description ||
                      product.shortDescription ||
                      "Description is not available for this product yet."}
                  </p>
                ) : null}

                {tab === "benefits" ? (
                  <ul className="space-y-3">
                    {benefitList.map((entry) => (
                      <li key={`${entry.title}-${entry.text}`} className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-[#C9A84C] mt-1 shrink-0" />
                        <span>
                          <strong className="text-[#F5F0E8]">{entry.title}:</strong> {entry.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {tab === "details" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ["Product ID", String(product.id)],
                      ["Category", product.categories || "Not set"],
                      [
                        "Stock Count",
                        product.stock !== null && product.stock !== undefined
                          ? String(product.stock)
                          : "Not available",
                      ],
                      ["Availability", product.inStock ? "In Stock" : "Out of Stock"],
                    ].map(([label, value]) => (
                      <div key={label} className="border border-[#2A2A2A] bg-[#111111] p-4">
                        <p className="text-[#666] text-xs uppercase tracking-[0.18em] mb-2">
                          {label}
                        </p>
                        <p className="text-[#F5F0E8]">{value}</p>
                      </div>
                    ))}
                  </div>
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

        <div className="mt-16 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <section className="border border-[#2A2A2A] bg-[#161616]">
            <div className="border-b border-[#2A2A2A] px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase">
                    Reviews
                  </p>
                  <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8] mt-2">
                    Customer Reviews
                  </h2>
                </div>

                <div className="text-sm text-[#666]">
                  <span className="text-[#F5F0E8]">{renderRating(reviewAverage)}</span>
                  {" "}average from {reviewCount} review{reviewCount === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {reviewsLoading ? (
                <div className="border border-[#2A2A2A] bg-[#111111] px-4 py-6 text-[#C9A84C]">
                  Loading reviews...
                </div>
              ) : reviewsError ? (
                <div className="border border-red-500/30 bg-red-500/10 px-4 py-6 text-red-200">
                  {reviewsError}
                </div>
              ) : productReviews.length === 0 ? (
                <div className="border border-[#2A2A2A] bg-[#111111] px-4 py-6 text-sm text-[#666]">
                  No customer reviews yet. Be the first to share your experience with
                  this product.
                </div>
              ) : (
                productReviews.map((entry) => (
                  <article
                    key={entry.id}
                    className="border border-[#2A2A2A] bg-[#111111] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-[#F5F0E8]">
                          {entry.userName || "Verified Customer"}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#666]">
                          {formatReviewDate(entry.updatedAt || entry.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              className="text-[#C9A84C]"
                              fill={index < entry.rating ? "#C9A84C" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#666]">{entry.rating}/5</span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[#C8C0B0]">
                      {entry.comment}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="border border-[#2A2A2A] bg-[#161616]">
            <div className="border-b border-[#2A2A2A] px-6 py-5">
              <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase">
                Share Feedback
              </p>
              <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8] mt-2">
                {currentUserReview ? "Update Your Review" : "Write a Review"}
              </h2>
              <p className="mt-2 text-sm text-[#666]">
                Signed-in customers can rate this product and leave feedback that
                appears on the product page and in the admin panel.
              </p>
            </div>

            <div className="p-6">
              {!user ? (
                <div className="space-y-4 border border-[#2A2A2A] bg-[#111111] p-5">
                  <p className="text-sm leading-7 text-[#C8C0B0]">
                    Please sign in to add a review for this product.
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        `/login?next=${encodeURIComponent(`/products/${product.id}`)}`
                      )
                    }
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] px-5 py-3 font-[Cinzel] text-sm text-[#0A0A0A]"
                  >
                    Sign In to Review
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={async (event) => {
                    event.preventDefault();

                    const trimmedComment = reviewComment.trim();

                    if (!trimmedComment) {
                      setReviewFormError("Please add a short review before submitting.");
                      setReviewSuccess("");
                      return;
                    }

                    setReviewSubmitting(true);
                    setReviewFormError("");
                    setReviewSuccess("");

                    try {
                      const reviewRecord: ProductReviewRecord = {
                        id: `${user.uid}_${product.id}`,
                        userId: user.uid,
                        userEmail: userProfile?.email || user.email || "",
                        userName:
                          userProfile?.name || user.displayName || "Customer",
                        productId: product.id,
                        productName: product.name,
                        productImage: product.image,
                        productCategory: product.categories || "Others",
                        rating: reviewRating,
                        comment: trimmedComment,
                        createdAt:
                          currentUserReview?.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };

                      await saveReviewClient(reviewRecord);

                      setProductReviews((current) =>
                        sortReviewsByNewest([
                          reviewRecord,
                          ...current.filter((entry) => entry.id !== reviewRecord.id),
                        ])
                      );
                      setReviewSuccess(
                        currentUserReview
                          ? "Your review has been updated."
                          : "Your review has been submitted."
                      );
                    } catch (error) {
                      setReviewFormError(
                        error instanceof Error
                          ? error.message
                          : "Failed to submit your review."
                      );
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                >
                  <div>
                    <p className="text-sm text-[#F5F0E8]">Your Rating</p>
                    <div className="mt-3 flex gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1;
                        const isActive = value <= reviewRating;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setReviewRating(value)}
                            className={`flex h-11 w-11 items-center justify-center border transition-colors ${
                              isActive
                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                                : "border-[#2A2A2A] bg-[#111111] text-[#666] hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                            }`}
                            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                          >
                            <Star size={16} fill={isActive ? "currentColor" : "none"} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="review-comment"
                      className="text-sm text-[#F5F0E8]"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      placeholder="Tell other customers what stood out about this product..."
                      className="mt-3 min-h-[160px] w-full border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-sm leading-7 text-[#F5F0E8] outline-none transition-colors placeholder:text-[#444] focus:border-[#C9A84C]"
                    />
                  </div>

                  <div className="border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-sm text-[#666]">
                    Reviewing as{" "}
                    <span className="text-[#F5F0E8]">
                      {userProfile?.name || user.displayName || "Customer"}
                    </span>
                    {user.email ? ` (${user.email})` : ""}
                  </div>

                  {reviewFormError ? (
                    <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {reviewFormError}
                    </div>
                  ) : null}

                  {reviewSuccess ? (
                    <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {reviewSuccess}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] px-5 py-3 font-[Cinzel] text-sm text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {reviewSubmitting
                      ? "Saving Review..."
                      : currentUserReview
                        ? "Update Review"
                        : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <BadgeCheck size={18} className="text-[#C9A84C]" />
              <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8]">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
