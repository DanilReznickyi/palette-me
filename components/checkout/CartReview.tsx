"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartStore";
import { makePlaceholder } from "@/components/shop/mockData";

export default function CartReview({ onNext }: { onNext: () => void }) {
  const { items, setQty, remove } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <p className="text-slate-600">
          Cart is empty.{" "}
          <Link href="/shop" className="text-indigo-600 hover:underline">Go to shop</Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((i) => {
              const thumb =
                (i.meta && (i.meta.preview as string)) ||
                makePlaceholder(i.title, i.price);
              return (
                <div
                  key={i.id}
                  className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={thumb}
                      alt={i.title}
                      className="h-24 w-32 rounded-lg object-cover border"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={i.slug ? `/shop/${i.slug}` : "#"}
                          className="font-semibold hover:text-indigo-600"
                        >
                          {i.title}
                        </Link>
                        <span className="text-slate-500">€{i.price}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">Qty: {i.qty}</span>
                      </div>

                      {/* краткое описание для кастомных */}
                      {i.meta && (
                        <div className="mt-1 text-xs text-slate-500">
                          {i.meta.paper && <span className="mr-2">Size: {i.meta.paper}</span>}
                          {i.meta.colors && <span className="mr-2">Colors: {i.meta.colors}</span>}
                          {i.meta.detail && <span className="mr-2">Detail: {i.meta.detail}</span>}
                          {i.meta.contour && <span className="mr-2">Contour: {i.meta.contour}px</span>}
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => setQty(i.id, Math.max(1, i.qty - 1))}
                          className="w-8 h-8 rounded-lg border hover:bg-slate-50 cursor-pointer"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <input
                          value={i.qty}
                          onChange={(e) =>
                            setQty(i.id, Math.max(1, Number(e.target.value || 1)))
                          }
                          className="w-14 h-8 text-center rounded-lg border"
                          type="number"
                          min={1}
                        />
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="w-8 h-8 rounded-lg border hover:bg-slate-50 cursor-pointer"
                          aria-label="Increase"
                        >
                          +
                        </button>

                        <button
                          onClick={() => remove(i.id)}
                          className="ml-3 text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total:</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
            >
              Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
