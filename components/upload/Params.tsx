// components/upload/Params.tsx
"use client";

type Paper = "A4" | "A3" | "A2";

export default function Params({
  colors, setColors,
  detail, setDetail,
  paper, setPaper,
  contour, setContour,
  withNumbers, setWithNumbers,
}: {
  colors: number; setColors: (v: number) => void;
  detail: number; setDetail: (v: number) => void;
  paper: Paper; setPaper: (v: Paper) => void;
  contour: number; setContour: (v: number) => void;
  withNumbers: boolean; setWithNumbers: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold">Parameters</h3>

      {/* Colors */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">Colors: {colors}</label>
          <span className="text-xs text-slate-500">8–48</span>
        </div>
        <input
          type="range"
          min={8}
          max={48}
          step={2}
          value={colors}
          onChange={(e) => setColors(Number(e.target.value))}
          className="w-full"
        />
        <p className="mt-1 text-xs text-slate-500">
          More colors — richer painting, longer processing.
        </p>
      </div>

      {/* Detail */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="font-medium">Detail level: {detail}</label>
          <span className="text-xs text-slate-500">1–5</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={detail}
          onChange={(e) => setDetail(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Paper */}
      <div className="mt-5">
        <label className="font-medium block mb-2">Paper size</label>
        <select
          value={paper}
          onChange={(e) => setPaper(e.target.value as Paper)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="A4">A4 (21×29.7 cm)</option>
          <option value="A3">A3 (29.7×42 cm)</option>
          <option value="A2">A2 (42×59.4 cm)</option>
        </select>
      </div>

      {/* Contour */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="font-medium">Contour thickness: {contour}</label>
          <span className="text-xs text-slate-500">1–3 px</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={1}
          value={contour}
          onChange={(e) => setContour(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Numbers */}
      <label className="mt-5 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={withNumbers}
          onChange={(e) => setWithNumbers(e.target.checked)}
          className="h-4 w-4"
        />
        Show numbers on areas
      </label>
    </div>
  );
}
