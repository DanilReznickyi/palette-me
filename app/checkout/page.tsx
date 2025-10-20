"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutRedirect() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    router.replace("/cart");
  }, [router, sp]);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold">Redirecting…</h1>
    </main>
  );
}
