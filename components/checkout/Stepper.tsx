"use client";

import {useLayoutEffect, useRef, useState} from "react";

type StepperProps = {
  /** 1..4 */
  step: 1 | 2 | 3 | 4;
};

const LABELS = ["Review", "Details", "Payment", "Done"] as const;

export default function Stepper({ step }: StepperProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [fillPx, setFillPx] = useState(0);

  // callback-ref для кружков — без возврата значения (void), чтобы TS не ругался
  const setDotRef = (idx: number) => (el: HTMLDivElement | null): void => {
    dotRefs.current[idx] = el;
  };

  // точное измерение: ширина заливки до центра активного кружка
  const measure = () => {
    const track = trackRef.current;
    const dot = dotRefs.current[(step - 1) as number];
    if (!track || !dot) return;

    const tr = track.getBoundingClientRect();
    const dr = dot.getBoundingClientRect();

    const centerX = dr.left - tr.left + dr.width / 2; // от левого края трека
    const clamped = Math.max(0, Math.min(centerX, tr.width));
    setFillPx(clamped);
  };

  // пересчёт при монтировании/изменении шага
  useLayoutEffect(() => {
    measure();
  }, [step]);

  // пересчёт при ресайзе
  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(trackRef.current);
    // на всякий случай — слушатель окна (для зума/панелей)
    const onWin = () => measure();
    window.addEventListener("resize", onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, []);

  return (
    <div className="mb-6">
      {/* Трек */}
      <div ref={trackRef} className="relative h-2 rounded-full bg-slate-200/80">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-indigo-500 transition-[width] duration-300"
          style={{ width: `${fillPx}px` }}
          aria-hidden
        />
      </div>

      {/* Подписи и кружки */}
      <div className="mt-4 grid grid-cols-4">
        {LABELS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3 | 4;
          const active = step === n;
          const passed = step > n;
          return (
            <div key={label} className="relative text-center">
              <div
                ref={setDotRef(i)}
                className={[
                  "mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  passed
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : active
                    ? "border-indigo-500 text-indigo-600"
                    : "border-slate-300 text-slate-400",
                ].join(" ")}
              >
                {n}
              </div>
              <div
                className={[
                  "mt-1 text-xs",
                  active ? "text-indigo-600 font-medium" : "text-slate-500",
                ].join(" ")}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
