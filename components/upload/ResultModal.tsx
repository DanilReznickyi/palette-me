"use client";

import { useEffect, useState } from "react";

type Color = { hex: string; index: number };

export default function ResultModal({
  open,
  imageUrl,
  palette,
  meta, // <- {paper, colors, detail, contour, withNumbers}
  onAddToCart,
  onClear,
  onClose,
}: {
  open: boolean;
  imageUrl: string;
  palette: Color[];
  meta: {
    paper: "A4" | "A3" | "A2";
    colors: number;
    detail: number;
    contour: number;
    withNumbers: boolean;
  };
  onAddToCart: () => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // запрет скролла страницы пока открыта модалка
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // сколько цветов показываем в «свернутом» виде
  const VISIBLE = 12;
  const shown = expanded ? palette : palette.slice(0, VISIBLE);
  const hasMore = palette.length > VISIBLE;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* фон */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* окно */}
      <div className="relative w-full max-w-[960px] bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden">
        {/* заголовок */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Preview & palette</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 grid place-items-center"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* контент: скролл только внутри окна */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="grid gap-6 p-5 md:grid-cols-[minmax(260px,1fr)_1fr]">
            {/* левая колонка — превью; сохраняем ориентацию */}
            <div className="flex items-start justify-center">
              <div className="w-full max-w-[520px]">
                <div className="rounded-xl border bg-slate-50 p-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-md object-contain"
                  />
                </div>
                {/* метаданные под превью на узких экранах */}
                <Meta meta={meta} className="mt-4 md:hidden" />
              </div>
            </div>

            {/* правая колонка — палитра и кнопки */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="font-semibold">Colors</span>{" "}
                  <span className="ml-1 rounded bg-slate-100 px-2 py-0.5 text-xs">
                    {palette.length}
                  </span>
                </div>

                {hasMore && !expanded && (
                  <button
                    className="text-sm font-medium text-indigo-600 hover:underline"
                    onClick={() => setExpanded(true)}
                  >
                    Show full palette ↓
                  </button>
                )}
                {expanded && hasMore && (
                  <button
                    className="text-sm font-medium text-indigo-600 hover:underline"
                    onClick={() => setExpanded(false)}
                  >
                    Collapse ↑
                  </button>
                )}
              </div>

              {/* палитра */}
              {palette.length === 0 ? (
                <p className="text-sm text-slate-500">Palette unavailable.</p>
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {shown.map((c) => (
                    <li
                      key={`${c.index}-${c.hex}`}
                      className="flex items-center gap-2 rounded-lg border px-2 py-2"
                      title={c.hex.toUpperCase()}
                    >
                      <span className="text-xs w-10 text-slate-500">#{c.index}</span>
                      <span
                        className="h-6 w-6 rounded-md border shrink-0"
                        style={{ background: c.hex }}
                        aria-hidden
                      />
                      <span className="text-xs font-mono text-slate-700">
                        {c.hex ? c.hex.toUpperCase() : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* метаданные справа на широких экранах */}
              <Meta meta={meta} className="hidden md:block mt-5" />

              {/* кнопки */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={onAddToCart}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  Add to cart
                </button>
                <button
                  onClick={onClear}
                  className="cursor-pointer px-4 py-2 rounded-lg border font-semibold hover:bg-slate-50"
                >
                  Clear & regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({
  meta,
  className = "",
}: {
  meta: {
    paper: "A4" | "A3" | "A2";
    colors: number;
    detail: number;
    contour: number;
    withNumbers: boolean;
  };
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-sm text-slate-700 grid grid-cols-2 gap-x-6 gap-y-1">
        <p>
          <span className="text-slate-500">Canvas:</span> <b>{meta.paper}</b>
        </p>
        <p>
          <span className="text-slate-500">Colors:</span> <b>{meta.colors}</b>
        </p>
        <p>
          <span className="text-slate-500">Detail:</span> <b>{meta.detail}</b>
        </p>
        <p>
          <span className="text-slate-500">Contour:</span> <b>{meta.contour}px</b>
        </p>
        <p className="col-span-2">
          <span className="text-slate-500">Numbers:</span>{" "}
          <b>{meta.withNumbers ? "Shown" : "Hidden"}</b>
        </p>
      </div>
    </div>
  );
}
