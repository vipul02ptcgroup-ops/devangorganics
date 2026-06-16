"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Package,
  Search,
  Star,
  Trash2,
  User2,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/ui/StatCard";
import type { ProductReviewRecord } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { resolveProductImageSrc } from "@/lib/product-images";
import { deleteReviewClient, getAllReviewsClient } from "@/lib/reviews-client";

function formatDate(value?: string | null) {
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

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          className={index < rating ? "text-[#C9A84C]" : "text-[#3A3A3A]"}
          fill={index < rating ? "#C9A84C" : "none"}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      setLoading(true);
      setError("");

      try {
        const nextReviews = await getAllReviewsClient();

        if (!cancelled) {
          setReviews(nextReviews);
          setSelectedReviewId((current) => {
            if (current && nextReviews.some((entry) => entry.id === current)) {
              return current;
            }

            return nextReviews[0]?.id ?? null;
          });
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to load product reviews."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          reviews
            .map((entry) => entry.productCategory?.trim())
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reviews.filter((entry) => {
      const matchesSearch =
        !normalizedSearch ||
        entry.productName.toLowerCase().includes(normalizedSearch) ||
        String(entry.productId).includes(normalizedSearch) ||
        entry.userName.toLowerCase().includes(normalizedSearch) ||
        entry.userEmail.toLowerCase().includes(normalizedSearch) ||
        entry.comment.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" || entry.productCategory === categoryFilter;
      const matchesRating =
        ratingFilter === "all" || String(entry.rating) === ratingFilter;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [categoryFilter, ratingFilter, reviews, search]);

  const selectedReview =
    filteredReviews.find((entry) => entry.id === selectedReviewId) ??
    reviews.find((entry) => entry.id === selectedReviewId) ??
    null;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return "0.0";
    }

    const total = reviews.reduce((sum, entry) => sum + entry.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const reviewedProducts = useMemo(
    () => new Set(reviews.map((entry) => entry.productId)).size,
    [reviews]
  );

  const deleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId);
    setError("");

    try {
      await deleteReviewClient(reviewId);

      setReviews((current) => {
        const nextReviews = current.filter((entry) => entry.id !== reviewId);

        setSelectedReviewId((selected) => {
          if (selected !== reviewId) {
            return selected;
          }

          return nextReviews[0]?.id ?? null;
        });

        return nextReviews;
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to delete review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">REVIEWS</p>
            <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">
              Product Review Insights
            </h1>
            <p className="text-[#666] text-sm mt-2 max-w-2xl">
              Reviews submitted from the public product pages are stored in
              Firebase and managed here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 min-w-full lg:min-w-[540px]">
            <StatCard
              label="TOTAL REVIEWS"
              value={reviews.length}
              icon={<MessageSquare size={16} className="text-[#C9A84C]" />}
            />
            <StatCard
              label="AVERAGE RATING"
              value={averageRating}
              icon={<Star size={16} className="text-[#C9A84C]" />}
            />
            <StatCard
              label="REVIEWED PRODUCTS"
              value={reviewedProducts}
              icon={<Package size={16} className="text-[#C9A84C]" />}
            />
          </div>
        </div>

        {loading ? (
          <div className="border border-[#1A1A1A] bg-[#161616] p-6 text-[#C9A84C]">
            Loading reviews...
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-[#161616] p-6 text-red-300">
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-[#1A1A1A] bg-[#161616] p-8 text-center text-[#666]">
            No product reviews have been submitted yet.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_420px]">
            <div className="overflow-hidden border border-[#1A1A1A] bg-[#161616]">
              <div className="border-b border-[#1A1A1A] px-5 py-4">
                <h2 className="font-[Cinzel] text-xl text-[#F5F0E8]">Reviews</h2>
                <p className="mt-1 text-sm text-[#666]">
                  Search by customer, product, product ID, or review text.
                </p>
              </div>

              <div className="border-b border-[#1A1A1A] bg-[#141414] px-5 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search reviews..."
                      className="w-full border border-[#2A2A2A] bg-[#0A0A0A] py-3 pl-10 pr-4 text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#444] focus:border-[#C9A84C]"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="min-w-[180px] border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F0E8] outline-none transition-colors focus:border-[#C9A84C]"
                  >
                    <option value="all">All categories</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={ratingFilter}
                    onChange={(event) => setRatingFilter(event.target.value)}
                    className="min-w-[160px] border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F0E8] outline-none transition-colors focus:border-[#C9A84C]"
                  >
                    <option value="all">All ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={String(rating)}>
                        {rating} star{rating > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A1A] bg-[#111111]">
                      {["Product", "Reviewer", "Rating", "Review", "Date", "Action"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#666]"
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-[#666]"
                        >
                          No reviews match the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map((entry) => {
                        const isSelected = selectedReviewId === entry.id;
                        const productImage = resolveProductImageSrc(
                          entry.productImage,
                          entry.productName
                        );

                        return (
                          <tr
                            key={entry.id}
                            className={`border-b border-[#111111] transition-colors ${
                              isSelected ? "bg-[#111111]" : "hover:bg-[#121212]"
                            }`}
                          >
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setSelectedReviewId(entry.id)}
                                className="flex items-center gap-4 bg-transparent p-0 text-left"
                              >
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111111]">
                                  {productImage ? (
                                    <img
                                      src={productImage}
                                      alt={entry.productName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package size={18} className="text-[#C9A84C]" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#F5F0E8]">
                                    {entry.productName}
                                  </p>
                                  <p className="mt-1 text-xs text-[#666]">
                                    Product #{entry.productId}
                                  </p>
                                </div>
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-[#F5F0E8]">
                                {entry.userName || "Customer"}
                              </p>
                              <p className="mt-1 text-xs text-[#666]">
                                {entry.userEmail}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="space-y-2">
                                {renderStars(entry.rating)}
                                <p className="text-xs text-[#666]">{entry.rating}/5</p>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="max-w-[240px] line-clamp-3 text-sm text-[#C8C0B0]">
                                {entry.comment}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#666]">
                              {formatDate(entry.updatedAt || entry.createdAt)}
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => void deleteReview(entry.id)}
                                disabled={deletingReviewId === entry.id}
                                className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition-colors hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Trash2 size={14} />
                                {deletingReviewId === entry.id ? "Deleting..." : "Delete"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="border border-[#1A1A1A] bg-[#161616]">
              {selectedReview ? (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-[#1A1A1A] px-5 py-5">
                    <div>
                      <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8]">
                        Review Details
                      </h2>
                      <p className="mt-2 text-sm text-[#666]">
                        Product:{" "}
                        <span className="font-semibold text-[#C8C0B0]">
                          {selectedReview.productName}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReviewId(null)}
                      className="text-[#666] transition-colors hover:text-[#C9A84C]"
                      aria-label="Close review details"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-2xl border border-[#1A1A1A] bg-[#111111] p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616]">
                          {selectedReview.productImage ? (
                            <img
                              src={resolveProductImageSrc(
                                selectedReview.productImage,
                                selectedReview.productName
                              )}
                              alt={selectedReview.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-[#C9A84C]" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#F5F0E8]">
                            {selectedReview.productName}
                          </p>
                          <p className="mt-1 text-sm text-[#666]">
                            {selectedReview.productCategory || "Others"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-[#2A2A2A] px-3 py-1 text-[#C8C0B0]">
                              Product #{selectedReview.productId}
                            </span>
                            <span className="rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[#C9A84C]">
                              {selectedReview.rating}/5 rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#1A1A1A] bg-[#111111] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-[#F5F0E8]">
                            {selectedReview.userName || "Customer"}
                          </p>
                          <a
                            href={`mailto:${selectedReview.userEmail}`}
                            className="mt-1 inline-flex items-center gap-2 text-sm text-[#8EA3C7] transition-colors hover:text-[#C9A84C]"
                          >
                            <Mail size={14} />
                            {selectedReview.userEmail || "No email available"}
                          </a>
                        </div>
                        <span className="rounded-full border border-[#2A2A2A] px-2.5 py-1 text-[0.72rem] text-[#666]">
                          <User2 size={12} />
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        {renderStars(selectedReview.rating)}
                        <span className="text-sm text-[#666]">
                          {selectedReview.rating} out of 5
                        </span>
                      </div>

                      <div className="mt-4 rounded-2xl border border-[#1A1A1A] bg-[#161616] p-4 text-sm leading-7 text-[#C8C0B0]">
                        {selectedReview.comment}
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-[#666]">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={13} />
                          Submitted on {formatDate(selectedReview.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays size={13} />
                          Updated on {formatDate(selectedReview.updatedAt)}
                        </div>
                        <p>{selectedReview.userId}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[420px] items-center justify-center px-6 text-center text-[#666]">
                  Select a review to view the full customer feedback.
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
