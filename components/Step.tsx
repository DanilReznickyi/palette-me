"use client";

import Reveal from "@/components/Reveal";
import Image from "next/image";

type CTA = { label: string; href: string; variant?: "yellow" | "indigo" };

type StepProps = {
  number: number;
  title: string;
  text: string;
  imageLeft?: boolean;
  id?: string;
  cta?: CTA;
  imageSrc?: string; // <— добавили проп
};

export default function Step({
  number,
  title,
  text,
  imageLeft = false,
  id,
  cta,
  imageSrc,
}: StepProps) {
  return (
    <section
      id={id}
      className="min-h-screen md:min-h-[60vh] flex items-center bg-white px-6"
    >
      <div
        className={`container mx-auto grid items-center gap-10 md:grid-cols-2 ${
          imageLeft ? "" : "md:[&>*:first-child]:order-2"
        }`}
      >
        {/* Картинка */}
        <Reveal>
          <div className="relative">
            <div
              className={`step-figure relative aspect-video w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg transform ${
                imageLeft ? "md:rotate-3" : "md:-rotate-3"
              } hover:rotate-0 transition`}
              aria-label="Illustration"
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`Step ${number} illustration`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={number <= 2}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-slate-500">
                  <span className="text-sm">Illustration</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            </div>
          </div>
        </Reveal>

        {/* Текст + CTA */}
        <Reveal>
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-indigo-600 font-semibold">
              Step {number}
            </p>
            <h3 className="mb-4 text-3xl md:text-4xl font-extrabold">{title}</h3>
            <p className="text-lg leading-relaxed text-slate-600">{text}</p>

            {cta && (
              <div className="mt-6">
                <a
                  href={cta.href}
                  className={
                    cta.variant === "yellow"
                      ? "inline-flex px-5 py-3 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300"
                      : "inline-flex px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  }
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
