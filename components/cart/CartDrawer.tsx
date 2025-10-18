// components/cart/CartDrawer.tsx
"use client";
import Link from "next/link";
import { useCart } from "@/lib/cartStore";

export default function CartDrawer() {
  const { isOpen, close, items, setQty, remove, clear } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      {/* backdrop */}
      <div
        onClick={close}
        className={[
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl",
          "transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-label="Cart"
      >
        <header className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-bold">Your cart</h2>
          <button onClick={close} title="Close" className="rounded-full p-2 hover:bg-slate-100">
            ✕
          </button>
        </header>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <p className="text-slate-600">Cart is empty.</p>
          ) : (
            items.map((i) => (
<div key={i.id} className="flex items-center gap-3 border rounded-xl p-3">
  <div className="flex-1">
    <Link href={i.slug ? `/shop/${i.slug}` : "#"} className="font-semibold hover:text-indigo-600">
      {i.title}
    </Link>
    <div className="text-sm text-slate-500">€{i.price}</div>

    {/* meta кратко */}
    {i.meta && (
      <div className="mt-1 text-xs text-slate-500">
        {i.meta.paper ? <span className="mr-2">Size: {i.meta.paper}</span> : null}
        {i.meta.colors ? <span className="mr-2">Colors: {i.meta.colors}</span> : null}
        {i.meta.detail ? <span className="mr-2">Detail: {i.meta.detail}</span> : null}
        {i.meta.contour ? <span className="mr-2">Contour: {i.meta.contour}px</span> : null}
      </div>
    )}
  </div>

  <div className="flex items-center gap-2">
    <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 rounded-lg border hover:bg-slate-50">−</button>
    <input
      value={i.qty}
      onChange={(e) => setQty(i.id, Number(e.target.value || 1))}
      className="w-12 h-8 text-center rounded-lg border"
      type="number"
      min={1}
    />
    <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 rounded-lg border hover:bg-slate-50">+</button>
  </div>

  <button onClick={() => remove(i.id)} className="text-red-600 text-sm">Remove</button>
</div>

            ))
          )}
        </div>

        <footer className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={clear} className="flex-1 rounded-xl border px-4 py-2.5 hover:bg-slate-50">
              Clear
            </button>
            <Link
              href="/cart"
              onClick={close}
              className="flex-1 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-center font-semibold hover:bg-indigo-500"
            >
              Checkout
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
