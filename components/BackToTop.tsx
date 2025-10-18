"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const threshold = window.innerHeight * 0.7;
      setShow(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="
        fixed bottom-6 right-6 z-50
        h-12 w-12 rounded-full
        bg-indigo-600 text-white
        shadow-lg ring-1 ring-black/10
        hover:bg-indigo-500 transition
        flex items-center justify-center
      "
      title="Back to top"
    >
      ↑
    </button>
  );
}
