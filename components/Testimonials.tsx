"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";

type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  initials: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Emily W.",
    city: "Berlin",
    rating: 5,
    text: "Amazing! My photo turned into a clean numbered template. The kit arrived quickly.",
    initials: "EW",
  },
  {
    id: "r2",
    name: "Luca R.",
    city: "Milan",
    rating: 4,
    text: "Great quality and easy to follow. I painted it with my daughter on weekend 🙂",
    initials: "LR",
  },
  {
    id: "r3",
    name: "Sophie K.",
    city: "Paris",
    rating: 5,
    text: "Loved the color legend and crisp lines. Ordering another one as a gift!",
    initials: "SK",
  },
];

export default function Testimonials() {
  // 👇 все хуки — ВНУТРИ компонента
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // mоки (потом заменим реальными данными auth + заказы)
  const isLoggedIn = false;
  const hasOrders = false;
  const canReview = isLoggedIn && hasOrders;

  // автопрокрутка
  useEffect(() => {
    const id = setInterval(() => setIndex((x) => (x + 1) % REVIEWS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-indigo-600 font-semibold">
              What people say
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Testimonials</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex((index - 1 + REVIEWS.length) % REVIEWS.length)}
              className="h-10 w-10 rounded-lg border hover:bg-slate-100"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((index + 1) % REVIEWS.length)}
              className="h-10 w-10 rounded-lg border hover:bg-slate-100"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        {/* Лента */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {REVIEWS.map((r) => (
              <article key={r.id} className="min-w-full">
                <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200
                                 flex items-center justify-center font-bold text-slate-700"
                      aria-hidden="true"
                    >
                      {r.initials}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-slate-500">{r.city}</p>
                        </div>
                        <StarRating value={r.rating} />
                      </div>

                      <p className="mt-4 text-slate-700 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Точки */}
        <div className="mt-6 flex justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === i ? "bg-indigo-600" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Оставить отзыв */}
        <div className="mt-10 flex justify-center">
          <button
            disabled={!canReview}
            onClick={() => setModalOpen(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              canReview
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
            title={
              canReview
                ? "Leave your review"
                : "Only registered customers with at least one order can leave a review"
            }
          >
            Leave a review
          </button>
        </div>

        {/* Модалка */}
        <ReviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmitted={() => alert("Thanks! Your review will appear after moderation.")}
        />
      </div>
    </section>
  );
}
