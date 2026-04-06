"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { products, categories } from "@/lib/data";
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Leaf,
  Coffee,
  Sparkles,
  Utensils,
  Package,
  Search,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";

const categoryIconMap: Record<string, React.ReactNode> = {
  "Leaf":     <Leaf size={16} />,
  "Coffee":   <Coffee size={16} />,
  "Sparkles": <Sparkles size={16} />,
  "Utensils": <Utensils size={16} />,
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("category") || "";
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = products
    .filter((p) => !selectedCat || p.category === selectedCat)
    .filter((p) =>
      !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="px-[5%] pb-20">
      {/* Page Hero */}
      <div className="text-center py-14 pb-10">
        <p className="text-[#C9A84C] text-[0.7rem] tracking-[0.35em] uppercase mb-2 font-medium">Browse Our Collection</p>
        <h1 className="text-[2.5rem] font-bold text-[#F5F0E8] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
          {selectedCat
            ? categories.find((c) => c.slug === selectedCat)?.name ?? "Products"
            : "All Products"}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-[#555] text-sm">{filtered.length} products found</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden mb-4 flex items-center gap-2 border border-[#2A2A2A] bg-[#161616] text-[#C8C0B0] px-4 py-2 text-sm transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C] w-full justify-center"
      >
        <Filter size={15} />
        {showFilters ? "Hide Filters" : "Show Filters"}
        <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
      </button>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={`w-56 flex-shrink-0 space-y-4 ${showFilters ? "block" : "hidden"} lg:block`}>

          {/* Search */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-4">
            <h3 className="text-[#C9A84C] text-[0.78rem] tracking-widest uppercase mb-3 font-bold" style={{ fontFamily: "Cinzel, serif" }}>
              Search
            </h3>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#C8C0B0] pl-8 pr-8 py-2 text-xs focus:outline-none focus:border-[#C9A84C] placeholder:text-[#444]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#C9A84C]">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-4">
            <h3 className="text-[#C9A84C] text-[0.78rem] tracking-widest uppercase mb-3 font-bold" style={{ fontFamily: "Cinzel, serif" }}>
              Categories
            </h3>
            {/* All products */}
            <button
              onClick={() => setSelectedCat("")}
              className={`w-full flex items-center justify-between py-2 text-[0.82rem] border-b border-[#1A1A1A] transition-colors cursor-pointer
                ${selectedCat === "" ? "text-[#C9A84C]" : "text-[#C8C0B0] hover:text-[#C9A84C]"}`}
            >
              <span className="flex items-center gap-2">
                <Package size={14} />
                All Products
              </span>
              <span className="text-[#555] text-xs bg-[#0A0A0A] px-1.5 py-0.5">{products.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(selectedCat === cat.slug ? "" : cat.slug)}
                className={`w-full flex items-center justify-between py-2 text-[0.82rem] border-b border-[#1A1A1A] last:border-0 transition-colors cursor-pointer
                  ${selectedCat === cat.slug ? "text-[#C9A84C]" : "text-[#C8C0B0] hover:text-[#C9A84C]"}`}
              >
                <span className="flex items-center gap-2">
                  {categoryIconMap[cat.iconName] ?? <Package size={14} />}
                  {cat.name}
                </span>
                <span className="text-[#555] text-xs bg-[#0A0A0A] px-1.5 py-0.5">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* In Stock indicator */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-4">
            <h3 className="text-[#C9A84C] text-[0.78rem] tracking-widest uppercase mb-3 font-bold" style={{ fontFamily: "Cinzel, serif" }}>
              Availability
            </h3>
            <div className="flex items-center gap-2 text-[0.82rem] text-[#C8C0B0]">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{products.filter((p) => p.inStock).length} In Stock</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 p-3.5 bg-[#161616] border border-[#2A2A2A] gap-3 flex-wrap">
            <p className="text-[#555] text-sm flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Showing <span className="text-[#C9A84C] font-semibold">{filtered.length}</span> results
            </p>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex border border-[#2A2A2A]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1.5 flex items-center transition-colors ${viewMode === "grid" ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#555] hover:text-[#C9A84C]"}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-1.5 flex items-center transition-colors ${viewMode === "list" ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#555] hover:text-[#C9A84C]"}`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* Sort */}
              <div className="relative flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-1.5 text-[0.78rem] text-[#C8C0B0] hover:border-[#C9A84C] transition-colors">
                <ArrowUpDown size={12} className="text-[#555]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-[#C8C0B0] text-[0.78rem] focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  <option value="featured">Featured</option>
                  <option value="name-asc">Name: A → Z</option>
                  <option value="name-desc">Name: Z → A</option>
                  <option value="rating">Best Rating</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 text-[#555] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category chips */}
          {selectedCat && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[#555] text-xs">Filter:</span>
              <span className="flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs px-3 py-1">
                {categories.find((c) => c.slug === selectedCat)?.name}
                <button onClick={() => setSelectedCat("")} className="hover:text-white transition-colors">
                  <X size={11} />
                </button>
              </span>
            </div>
          )}

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package size={48} className="text-[#2A2A2A] mb-4" />
              <p className="text-[#555] text-lg">No products found</p>
              <button
                onClick={() => { setSelectedCat(""); setSearchQuery(""); }}
                className="mt-4 text-[#C9A84C] text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-[#C9A84C]">
          <div className="flex flex-col items-center gap-3">
            <Leaf size={32} className="animate-pulse" />
            <span className="text-sm tracking-widest uppercase">Loading Products...</span>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
