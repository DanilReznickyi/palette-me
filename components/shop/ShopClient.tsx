// components/shop/ShopClient.tsx
"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar, { FiltersState } from "@/components/shop/FilterSidebar";
import { PRODUCTS, Product } from "@/components/shop/mockData";

type SortKey = "price-asc" | "price-desc" | "newest" | "rating";

export default function ShopClient() {
  // поиск по словам (title/description/categories)
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const [filters, setFilters] = useState<FiltersState>({
    sizes: new Set(),
    minPrice: 0,
    maxPrice: 0,
    categories: new Set(),
  });

  const [quick, setQuick] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = PRODUCTS.filter((p) => {
      const byQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categories.some((c) => c.includes(q as any));
      const bySize = filters.sizes.size === 0 || filters.sizes.has(p.size);
      const byPrice =
        (filters.minPrice === 0 || p.price >= filters.minPrice) &&
        (filters.maxPrice === 0 || p.price <= filters.maxPrice);
      const byCat =
        filters.categories.size === 0 ||
        p.categories.some((c) => filters.categories.has(c));

      return byQuery && bySize && byPrice && byCat;
    });

    switch (sort) {
      case "price-asc":
        arr = arr.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        arr = arr.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        arr = arr.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        arr = arr.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    }
    return arr;
  }, [query, filters, sort]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Верхняя панель: поиск + сортировка */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: nature, forest, city…"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-11 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔎
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest first</option>
            <option value="rating">Best rating</option>
          </select>
        </div>
      </div>

      {/* Контент: sidebar + grid */}
      <div className="flex gap-6">
        <FilterSidebar
          state={filters}
          onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        />

        <section className="flex-1">
          <div className="mb-3 text-sm text-slate-500">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </div>
        </section>
      </div>

      {/* QUICK VIEW modal */}
      {quick && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuick(null)}
        >
          <div
            className="max-w-3xl w-full rounded-2xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.15s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <QuickView product={quick} onClose={() => setQuick(null)} />
          </div>
        </div>
      )}
    </main>
  );
}

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const img = useMemo(() => {
    const { makePlaceholder } = require("@/components/shop/mockData");
    return makePlaceholder(product.title, product.price + 7);
  }, [product]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <img src={img} alt={product.title} className="h-72 md:h-full w-full object-cover" />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">{product.title}</h3>
          <button
            title="Close"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-slate-600">{product.description}</p>
        <div className="mt-3 flex items-center gap-2 text-amber-600">
          <span>★ {product.rating}</span>
          <span className="text-slate-400">({product.reviews} reviews)</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-indigo-600">€{product.price}</div>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs">{product.size}</span>
        </div>

        <button
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold shadow hover:bg-indigo-500 active:scale-[.99] transition"
          onClick={() => alert("Added to cart (stub)")}
        >
          Add to cart
        </button>

        <a
          href={`/shop/${product.slug}`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-medium hover:bg-slate-50 transition"
        >
          Open product page
        </a>
      </div>
    </div>
  );
}
