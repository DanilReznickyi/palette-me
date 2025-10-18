"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Stepper from "@/components/checkout/Stepper";
import ShippingForm, { ShippingData } from "@/components/checkout/ShippingForm";
import PaymentForm, { PaymentData } from "@/components/checkout/PaymentForm";
import OrderDone from "@/components/checkout/OrderDone";
import { useCart } from "@/lib/cartStore";
import { makePlaceholder } from "@/components/shop/mockData";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [shipping, setShipping] = useState<ShippingData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (items.length === 0 && step !== 1) setStep(1);
  }, [items.length, step]);

  const canGoNext = useMemo(() => {
    if (step === 1) return items.length > 0;
    if (step === 2) return !!shipping;
    if (step === 3) return !!payment;
    return false;
  }, [step, items.length, shipping, payment]);

  const goNext = () => {
    if (step === 3) setStep(4);
    else setStep((s) => (s + 1) as any);
  };
  const goBack = () => setStep((s) => (Math.max(1, s - 1) as any));

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold">Checkout</h1>

      <Stepper step={step} />

      <div className="mt-8">
        {step === 1 && (
          <>
            {items.length === 0 ? (
              <p className="mt-6 text-slate-600">
                Cart is empty.{" "}
                <Link href="/shop" className="text-indigo-600 hover:underline">
                  Go to shop
                </Link>
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((i) => {
                    const thumb = (i as any)?.meta?.preview || makePlaceholder(i.title, i.price + 7);
                    return (
                      <div key={i.id} className="flex items-center gap-3 border rounded-xl p-3 bg-white">
                        {/* миниатюра */}
                        <div className="w-18 h-18 shrink-0 rounded-lg overflow-hidden border">
                          <img
                            src={thumb}
                            alt={i.title}
                            className="w-18 h-18 object-cover block"
                            width={72}
                            height={72}
                          />
                        </div>

                        {/* инфо */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate" title={i.title}>
                            {i.title}
                          </div>
                          <div className="text-sm text-slate-500">€{i.price}</div>

                          {(i as any)?.meta && (
                            <div className="mt-1 text-xs text-slate-500">
                              {(i as any).meta.paper && <span className="mr-2">Size: {(i as any).meta.paper}</span>}
                              {(i as any).meta.colors && <span className="mr-2">Colors: {(i as any).meta.colors}</span>}
                              {(i as any).meta.detail && <span className="mr-2">Detail: {(i as any).meta.detail}</span>}
                              {(i as any).meta.contour && <span className="mr-2">Contour: {(i as any).meta.contour}px</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(i.id, Math.max(1, i.qty - 1))}
                            className="w-8 h-8 rounded-lg border hover:bg-slate-50 cursor-pointer"
                            title="Decrease"
                          >
                            −
                          </button>
                          <input
                            value={i.qty}
                            onChange={(e) => setQty(i.id, Math.max(1, Number(e.target.value || 1)))}
                            className="w-12 h-8 text-center rounded-lg border"
                            type="number"
                            min={1}
                          />
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            className="w-8 h-8 rounded-lg border hover:bg-slate-50 cursor-pointer"
                            title="Increase"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(i.id)}
                          className="text-red-600 text-sm hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={clear}
                    className="px-6 py-3 rounded-lg border font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Clear cart
                  </button>

                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
                  >
                    Continue →
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {step === 2 && (
          <ShippingForm
            initial={shipping ?? undefined}
            onSubmit={(data) => {
              setShipping(data);
              setStep(3);
            }}
            onBack={goBack}
          />
        )}
        {step === 3 && shipping && (
          <PaymentForm
            total={total}
            shipping={shipping}
            onSubmit={(data) => {
              setPayment(data);
              setStep(4);
            }}
            onBack={goBack}
          />
        )}
        {step === 4 && shipping && payment && (
          <OrderDone
            total={total}
            shipping={shipping}
            payment={payment}
            onDone={() => {
              clear();
              window.location.href = "/shop";
            }}
          />
        )}
      </div>
    </main>
  );
}
