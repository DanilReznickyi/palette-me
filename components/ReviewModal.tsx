"use client";

import { useEffect, useRef, useState } from "react";

export default function ReviewModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = text.trim().length >= 10 && rating >= 1 && rating <= 5;

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      if (!res.ok) throw new Error("Failed");
      onClose();
      onSubmitted?.();
      setText("");
      setRating(5);
    } catch (e) {
      alert("Could not send review. Try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition ${open ? "bg-black/40" : "bg-black/0 pointer-events-none"}
      `}
      aria-hidden={!open}
    >
      <div
        ref={wrapRef}
        className={`
          w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10
          transition transform origin-center
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-xl font-bold mb-4">Leave a review</h3>

        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const active = n <= rating;
            return (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`h-9 w-9 rounded-md border flex items-center justify-center ${
                  active ? "bg-yellow-400 border-yellow-400" : "hover:bg-slate-100"
                }`}
                aria-label={`Set rating ${n}`}
              >
                ★
              </button>
            );
          })}
        </div>

        <label className="block text-sm font-medium mb-1">Your review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="What did you like? Was it easy to paint?"
          className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit || loading}
            onClick={submit}
            className={`px-4 py-2 rounded-lg text-white ${
              canSubmit && !loading
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          By submitting, you agree your review may be shown publicly (after moderation).
        </p>
      </div>
    </div>
  );
}
