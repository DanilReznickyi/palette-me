// lib/pbn/generate.ts
import sharp from "sharp";
import { customAlphabet } from "nanoid";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const quantize = require("quantize"); // MMCQ (median cut), чистый JS — стабильно в Node/Windows

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 12);

export type GenParams = {
  colors: number;         // 8..48
  detail: number;         // 1..5 (↑ → мельче области)
  paper: "A4" | "A3" | "A2";
  contour: number;        // 1..3 px
  withNumbers: boolean;
};

export type GenResult = {
  id: string;
  svg: string;
  previewPng: Buffer;
  width: number;
  height: number;
  palette: { hex: string; index: number }[];
};

// ---------- helpers ----------
function toHex(r: number, g: number, b: number) {
  const h = (x: number) => x.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function rdp(points: [number, number][], epsilon = 0.8): [number, number][] {
  if (points.length < 3) return points;
  const lineDist = (p: [number, number], a: [number, number], b: [number, number]) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
    const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D || 1;
    const t = Math.max(0, Math.min(1, dot / lenSq));
    const xx = x1 + C * t, yy = y1 + D * t;
    const dx = x - xx, dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };
  let dmax = 0, idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = lineDist(points[i], points[0], points[points.length - 1]);
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax > epsilon) {
    const a = rdp(points.slice(0, idx + 1), epsilon);
    const b = rdp(points.slice(idx), epsilon);
    return a.slice(0, -1).concat(b);
  }
  return [points[0], points[points.length - 1]];
}

function centroid(pixels: number[], width: number): [number, number] {
  let sx = 0, sy = 0;
  for (const i of pixels) {
    const y = (i / width) | 0;
    const x = i - y * width;
    sx += x + 0.5;
    sy += y + 0.5;
  }
  const n = Math.max(1, pixels.length);
  return [sx / n, sy / n];
}

function traceBoundary(labelMap: Int32Array, width: number, height: number, regionLabel: number) {
  const visited = new Set<number>();
  const contours: [number, number][][] = [];

  const isBoundary = (x: number, y: number) => {
    const idx = y * width + x;
    if (labelMap[idx] !== regionLabel) return false;
    const N = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1],
    ];
    for (const [dx, dy] of N) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) return true;
      if (labelMap[ny * width + nx] !== regionLabel) return true;
    }
    return false;
  };

  const dirs = [
    [1, 0],[1, 1],[0, 1],[-1, 1],
    [-1, 0],[-1, -1],[0, -1],[1, -1],
  ] as const;
  const nextCW = (d: number) => (d + 7) & 7;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = y * width + x;
      if (!isBoundary(x, y) || visited.has(id)) continue;

      let bx = x, by = y, dir = 0;
      const poly: [number, number][] = [];
      let first = true;

      while (true) {
        visited.add(by * width + bx);
        poly.push([bx + 0.5, by + 0.5]);

        let found = false;
        let tryDir = nextCW(dir);
        for (let k = 0; k < 8; k++) {
          const [dx, dy] = dirs[tryDir];
          const nx = bx + dx, ny = by + dy;
          if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
            if (labelMap[ny * width + nx] === regionLabel && isBoundary(nx, ny)) {
              bx = nx; by = ny; dir = tryDir; found = true; break;
            }
          }
          tryDir = (tryDir + 1) & 7;
        }
        if (!found) break;
        if (!first && bx === x && by === y) break;
        first = false;
      }

      if (poly.length > 2) contours.push(rdp(poly, 0.8));
    }
  }
  return contours;
}

// ---------- core ----------
export async function generatePaintByNumbers(
  fileBuffer: Buffer,
  params: GenParams
): Promise<GenResult> {
  const id = nanoid();

  // 1) декод + ограничение размера
  const maxW = 1600;
  const img = sharp(fileBuffer, { limitInputPixels: 20000 * 20000 }).ensureAlpha();
  const meta = await img.metadata();
  const scale = meta.width && meta.width > maxW ? maxW / meta.width : 1;

  const { data, info } = await img
    .resize({
      width: meta.width ? Math.round(meta.width * scale) : undefined,
      height: meta.height ? Math.round(meta.height * scale) : undefined,
      fit: "inside",
      withoutEnlargement: true,
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // 2) Квантование до K цветов (MMCQ quantize)
  // Для скорости берём сэмпл: каждый 2-й пиксель (можно сделать шаг адаптивным)
  const step = 2;
  const samples: number[][] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const p = (y * width + x) * 3;
      samples.push([data[p], data[p + 1], data[p + 2]]);
    }
  }
  const q = quantize(samples, Math.max(2, Math.min(256, params.colors)));
  const pal = q.palette() as number[][]; // массив [r,g,b]

  // строим карту индексов для каждого пикселя (по ближайшему цвету из палитры)
  const idxMap = new Int32Array(width * height);
  for (let i = 0, p = 0; i < idxMap.length; i++, p += 3) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    let best = 0, bd = 1e12;
    for (let k = 0; k < pal.length; k++) {
      const dr = r - pal[k][0], dg = g - pal[k][1], db = b - pal[k][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bd) { bd = d; best = k; }
    }
    idxMap[i] = best;
  }

  // 3) Связные компоненты (4-связность) + фильтр мелочи по detail
  const labelMap = new Int32Array(width * height).fill(-1);
  let currentLabel = 0;
  const regions: { label: number; colorIndex: number; pixels: number[] }[] = [];
  const minArea = Math.round((width * height) / (1200 - params.detail * 150));
  const stack: number[] = [];

  for (let i = 0; i < idxMap.length; i++) {
    if (labelMap[i] !== -1) continue;
    const colorIdx = idxMap[i];
    stack.length = 0;
    stack.push(i);
    labelMap[i] = currentLabel;
    const pixels: number[] = [i];

    while (stack.length) {
      const s = stack.pop()!;
      const y = (s / width) | 0;
      const x = s - y * width;
      const neigh = [[1,0],[-1,0],[0,1],[0,-1]] as const;
      for (const [dx, dy] of neigh) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        if (labelMap[ni] !== -1) continue;
        if (idxMap[ni] === colorIdx) {
          labelMap[ni] = currentLabel;
          stack.push(ni);
          pixels.push(ni);
        }
      }
    }

    if (pixels.length < minArea) {
      const counts = new Map<number, number>();
      for (const p of pixels) {
        const y = (p / width) | 0, x = p - y * width;
        const neigh = [[1,0],[-1,0],[0,1],[0,-1]] as const;
        for (const [dx, dy] of neigh) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          const cl = labelMap[ni];
          if (cl !== currentLabel && cl !== -1) counts.set(cl, (counts.get(cl) || 0) + 1);
        }
      }
      let bestLabel = -1, bestCount = -1;
      counts.forEach((v, k) => { if (v > bestCount) { bestCount = v; bestLabel = k; } });
      if (bestLabel !== -1) {
        for (const p of pixels) labelMap[p] = bestLabel;
        continue;
      }
    }

    regions.push({ label: currentLabel, colorIndex: colorIdx, pixels });
    currentLabel++;
  }

  // 4) Контуры + номера
  const paths: string[] = [];
  const labels: { x: number; y: number; idx: number }[] = [];

  for (const r of regions) {
    const contours = traceBoundary(labelMap, width, height, r.label);
    for (const poly of contours) {
      if (poly.length < 3) continue;
      const d = ["M", poly[0][0].toFixed(2), poly[0][1].toFixed(2)];
      for (let i = 1; i < poly.length; i++) d.push("L", poly[i][0].toFixed(2), poly[i][1].toFixed(2));
      d.push("Z");
      paths.push(`<path d="${d.join(" ")}" fill="none" stroke="#000" stroke-width="${params.contour}"/>`);
    }
    if (params.withNumbers && r.pixels.length > 20) {
      const [cx, cy] = centroid(r.pixels, width);
      labels.push({ x: cx, y: cy, idx: r.colorIndex + 1 });
    }
  }

  // 5) SVG + PNG превью
  const scaleByPaper = { A4: 1, A3: 1.4142, A2: 2.0 } as const;
  const S = scaleByPaper[params.paper] ?? 1;
  const W = Math.round(width * S);
  const H = Math.round(height * S);

  const numbersLayer = params.withNumbers
    ? labels.map(l =>
        `<text x="${(l.x * S).toFixed(2)}" y="${(l.y * S).toFixed(2)}" font-size="${10 * S}" text-anchor="middle" dominant-baseline="central" fill="#444">${l.idx}</text>`
      ).join("")
    : "";

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">` +
    `<rect width="${W}" height="${H}" fill="#fff"/>` +
    `<g transform="scale(${S})">${paths.join("")}</g>` +
    numbersLayer +
    `</svg>`;

  const previewPng = await sharp(Buffer.from(svg)).png().toBuffer();

  // палитра в HEX
  const paletteRes: { hex: string; index: number }[] = pal.map((rgb: number[], i: number) => ({
    hex: toHex(rgb[0], rgb[1], rgb[2]),
    index: i,
  }));

  return { id, svg, previewPng, width: W, height: H, palette: paletteRes };
}
