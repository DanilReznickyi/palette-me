"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutRedirect() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const step = sp.get("step");
    router.replace("/cart" + (step ? "" : ""));
  }, [router, sp]);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold">Redirecting…</h1>
    </main>
  );
}
