"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Product, makePlaceholder } from "./mockData";
import { useCart } from "@/lib/cartStore";

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
}) {
  const img = useMemo(
    () => makePlaceholder(product.title, product.price),
    [product]
  );

	const { add, openCart, items } = useCart();

  return (
    <div className="group h-full flex flex-col rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {/* image */}
      <div className="relative">
        <img
          src={img}
          alt={product.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-sm font-medium shadow hover:bg-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          Quick view
        </button>
      </div>

      {/* body */}
      <div className="flex-1 p-4 flex flex-col">
        <Link
          href={`/shop/${product.slug}`}
          className="font-semibold text-lg hover:text-indigo-600 line-clamp-1"
          title={product.title}
        >
          {product.title}
        </Link>

        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
          {product.description}
        </p>

        {/* price + rating */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-indigo-600 font-bold">€{product.price}</div>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <span aria-hidden>★</span>
            <span className="font-medium">{product.rating}</span>
            <span className="text-slate-400">({product.reviews})</span>
          </div>
        </div>

        {/* tags (фиксируем по высоте, чтобы низ карточки не плавал) */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 min-h-[28px]">
          <span className="rounded bg-slate-100 px-2 py-0.5">{product.size}</span>
          {product.categories.slice(0, 2).map((c) => (
            <span
              key={c}
              className="rounded bg-slate-100 px-2 py-0.5 capitalize line-clamp-1"
              title={c}
            >
              {c}
            </span>
          ))}
        </div>

        {/* buttons (прижаты вниз) */}
        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const wasEmpty = items.length === 0;
              add({
                id: product.id,
                title: product.title,
                price: product.price,
                slug: product.slug,
              });
							if (wasEmpty) openCart();
            }}
            className="h-11 rounded-xl border border-slate-300 px-4 font-medium hover:bg-slate-50 active:translate-y-px cursor-pointer"
          >
            Add to cart
          </button>

          <Link
            href={`/shop/${product.slug}`}
            className="h-11 rounded-xl bg-indigo-600 px-4 text-white font-medium hover:bg-indigo-500 active:translate-y-px grid place-items-center text-center"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
