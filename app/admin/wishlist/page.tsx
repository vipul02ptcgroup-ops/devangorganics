"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  Heart,
  Mail,
  Search,
  Tag,
  Users,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { WishlistSummaryRecord } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { resolveProductImageSrc } from "@/lib/product-images";
import { getWishlistSummaryClient } from "@/lib/wishlist-client";

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

export default function AdminWishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistSummaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const loadWishlist = async () => {
      setLoading(true);
      setError("");

      try {
        const wishlist = await getWishlistSummaryClient();
        if (!cancelled) {
          setWishlist(wishlist);
          setSelectedProductId((current) => {
            if (
              current !== null &&
              wishlist.some((entry) => entry.productId === current)
            ) {
              return current;
            }

            return wishlist[0]?.productId ?? null;
          });
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to load wishlist analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const totalAdds = useMemo(
    () => wishlist.reduce((sum, entry) => sum + entry.count, 0),
    [wishlist]
  );
  const totalUsers = useMemo(() => {
    const uniqueUsers = new Set(
      wishlist.flatMap((entry) => entry.users.map((userEntry) => userEntry.userId))
    );
    return uniqueUsers.size;
  }, [wishlist]);
  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        wishlist
          .map((entry) => entry.productCategory?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [wishlist]);
  const filteredWishlist = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return wishlist.filter((entry) => {
      const matchesSearch =
        !normalizedSearch ||
        entry.productName.toLowerCase().includes(normalizedSearch) ||
        String(entry.productId).includes(normalizedSearch) ||
        entry.users.some(
          (userEntry) =>
            userEntry.userName.toLowerCase().includes(normalizedSearch) ||
            userEntry.userEmail.toLowerCase().includes(normalizedSearch)
        );

      const matchesCategory =
        categoryFilter === "all" || entry.productCategory === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, search, wishlist]);
  const selectedEntry =
    filteredWishlist.find((entry) => entry.productId === selectedProductId) ??
    wishlist.find((entry) => entry.productId === selectedProductId) ??
    null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">WISHLIST</p>
            <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">Wishlist Insights</h1>
            <p className="text-[#666] text-sm mt-2 max-w-2xl">
              Every heart click from signed-in users is stored in Firebase and
              summarized here by product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-full lg:min-w-[540px]">
            {[
              {
                label: "Products",
                value: wishlist.length.toString(),
                icon: <Tag size={16} />,
              },
              {
                label: "Wishlist Adds",
                value: totalAdds.toString(),
                icon: <Heart size={16} />,
              },
              {
                label: "Interested Users",
                value: totalUsers.toString(),
                icon: <Users size={16} />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="border border-[#1A1A1A] bg-[#161616] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[#666] text-[0.72rem] tracking-[0.18em] uppercase">
                      {label}
                    </p>
                    <p className="font-[Cinzel] text-2xl text-[#C9A84C] mt-2">
                      {value}
                    </p>
                  </div>
                  <div className="text-[#C9A84C]">{icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-[#161616] border border-[#1A1A1A] p-6 text-[#C9A84C]">
            Loading wishlist insights...
          </div>
        ) : error ? (
          <div className="bg-[#161616] border border-red-500/30 p-6 text-red-300">
            {error}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-[#161616] border border-[#1A1A1A] p-8 text-center text-[#666]">
            No wishlist data found yet.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_420px]">
            <div className="overflow-hidden border border-[#1A1A1A] bg-[#161616]">
              <div className="border-b border-[#1A1A1A] px-5 py-4">
                <h2 className="font-[Cinzel] text-xl text-[#F5F0E8]">Wishlist</h2>
                <p className="text-[#666] text-sm mt-1">
                  {totalAdds} total wishlist adds
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
                      placeholder="Filter by product, product ID, user name, or email..."
                      className="w-full border border-[#2A2A2A] bg-[#0A0A0A] py-3 pl-10 pr-4 text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#444] focus:border-[#C9A84C]"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                    className="min-w-[210px] border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F0E8] outline-none transition-colors focus:border-[#C9A84C]"
                  >
                    <option value="all">All categories</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A1A] bg-[#111111]">
                      {["Product", "Wishlist Adds", "Users", "Action"].map(
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
                    {filteredWishlist.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-sm text-[#666]"
                        >
                          No wishlist items match the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredWishlist.map((entry) => {
                      const isSelected = selectedProductId === entry.productId;
                      const productImage = resolveProductImageSrc(
                        entry.productImage,
                        entry.productName
                      );

                      return (
                        <tr
                          key={entry.productId}
                          className={`border-b border-[#111111] transition-colors ${
                            isSelected ? "bg-[#111111]" : "hover:bg-[#121212]"
                          }`}
                        >
                          <td className="px-5 py-4 w-[45%]">
                            <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111111]">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={entry.productName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Heart size={18} className="text-[#C9A84C]" />
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
                            </div>
                          </td>
                          <td className="px-5 py-4 w-[20%]">
                            <span className="inline-flex items-center gap-2 text-sm text-[#C9A84C]">
                              <Heart size={14} fill="currentColor" />
                              {entry.count}
                            </span>
                          </td>
                          <td className="px-5 py-4 w-[13%] text-sm text-[#C8C0B0]">
                            {entry.users.length}
                          </td>
                          <td className="px-5 py-4 w-[22%]">
                            <button
                              onClick={() => setSelectedProductId(entry.productId)}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                                isSelected
                                  ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                                  : "border-[#2A2A2A] bg-[#111111] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                              }`}
                            >
                              <Eye size={14} />
                              {isSelected ? "Viewing" : "View"}
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
              {selectedEntry ? (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-[#1A1A1A] px-5 py-5">
                    <div>
                      <h2 className="font-[Cinzel] text-2xl text-[#F5F0E8]">
                        Users Who Wishlisted
                      </h2>
                      <p className="mt-2 text-sm text-[#666]">
                        Product:{" "}
                        <span className="font-semibold text-[#C8C0B0]">
                          {selectedEntry.productName}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProductId(null)}
                      className="text-[#666] transition-colors hover:text-[#C9A84C]"
                      aria-label="Close wishlist details"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-2xl border border-[#1A1A1A] bg-[#111111] p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616]">
                          {selectedEntry.productImage ? (
                            <img
                              src={resolveProductImageSrc(
                                selectedEntry.productImage,
                                selectedEntry.productName
                              )}
                              alt={selectedEntry.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Heart size={20} className="text-[#C9A84C]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#F5F0E8]">
                            {selectedEntry.productName}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-[#2A2A2A] px-3 py-1 text-[#C8C0B0]">
                              Product #{selectedEntry.productId}
                            </span>
                            <span className="rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[#C9A84C]">
                              {selectedEntry.count} wishlist adds
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedEntry.users.map((userEntry) => (
                        <div
                          key={userEntry.userId}
                          className="rounded-2xl border border-[#1A1A1A] bg-[#111111] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-[#F5F0E8]">
                                {userEntry.userName || "Customer"}
                              </p>
                              <a
                                href={`mailto:${userEntry.userEmail}`}
                                className="mt-1 inline-flex items-center gap-2 text-sm text-[#8EA3C7] transition-colors hover:text-[#C9A84C]"
                              >
                                <Mail size={14} />
                                {userEntry.userEmail || "No email available"}
                              </a>
                            </div>
                            <span className="rounded-full border border-[#2A2A2A] px-2.5 py-1 text-[0.72rem] text-[#666]">
                              UID
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 text-xs text-[#666]">
                            <p>{userEntry.userId}</p>
                            <div className="flex items-center gap-2">
                              <CalendarDays size={13} />
                              Added on {formatDate(userEntry.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[420px] items-center justify-center px-6 text-center text-[#666]">
                  Select a product to view the users who added it to their wishlist.
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
