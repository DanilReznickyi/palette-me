"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSlider() {
  const images = ["/works1.jpg", "/works2.jpg", "/works3.jpg"];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % images.length), 3500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
      {/* Лента */}
      <div
        className="flex transition-transform duration-700 will-change-transform"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {images.map((src) => (
          <div key={src} className="relative min-w-full">

            <div
              className="relative w-full"
              style={{ aspectRatio: "16 / 9" }}
            >
              <Image
                src={src}
                alt="Showcase"
                fill
                priority
                className="object-cover select-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
