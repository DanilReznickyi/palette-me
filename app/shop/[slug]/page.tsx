"use client";

import { PRODUCTS, makePlaceholder } from "@/components/shop/mockData";
import { useCart } from "@/lib/cartStore";
import Link from "next/link";




export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
	const { add, open, items } = useCart();

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/shop" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to shop
        </Link>
      </main>
    );
  }

  const img = makePlaceholder(product.title, product.price + 13);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm bg-white">
          <img src={img} alt={product.title} className="w-full h-[420px] object-cover" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{product.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-amber-600">★ {product.rating}</span>
            <span className="text-slate-400">({product.reviews} reviews)</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{product.size}</span>
          </div>

          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 text-3xl font-extrabold text-indigo-600">€{product.price}</div>

          <div className="mt-6 flex gap-3">
					<button
  onClick={() => {
    const wasEmpty = items.length === 0;
    add({ id: product.id, title: product.title, price: product.price, slug: product.slug });
    if (wasEmpty) open();
  }}
  className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold shadow hover:bg-indigo-500 transition"
>
  Add to cart
</button>
            <a
              href="#reviews"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50 transition"
            >
              See reviews
            </a>
          </div>
        </div>
      </div>
      <section id="reviews" className="mt-12 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Reviews</h2>
        <div className="mt-4 space-y-4">
          <article className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Alice</span>
              <span className="text-amber-600 text-sm">★ ★ ★ ★ ☆</span>
            </div>
            <p className="mt-2 text-slate-600">
              Great starter kit. Clear numbering and satisfying color blocks.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Mark</span>
              <span className="text-amber-600 text-sm">★ ★ ★ ★ ★</span>
            </div>
            <p className="mt-2 text-slate-600">
              Loved the palette! I finished it over the weekend.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
