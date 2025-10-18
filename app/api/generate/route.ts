// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PY_BASE = process.env.PBN_URL || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const colors = Number(form.get("colors") || 24);
    const detail = Number(form.get("detail") || 3);
    const paper = String(form.get("paper") || "A4");
    const contour = Number(form.get("contour") || 2);
    const withNumbers = String(form.get("withNumbers") ?? "true");

    const fd = new FormData();
    fd.append("file", file, (file as File).name || "upload.jpg");
    fd.append("colors", String(colors));
    fd.append("detail", String(detail));
    fd.append("paper", paper);
    fd.append("contour", String(contour));
    fd.append("withNumbers", withNumbers);

    const pyRes = await fetch(`${PY_BASE}/generate`, { method: "POST", body: fd });
    const data = await pyRes.json().catch(() => null);

    if (!pyRes.ok || !data || data.error) {
      const msg = data?.error || `Python error (status ${pyRes.status})`;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const id: string =
      data.id ||
      crypto.createHash("md5").update(`${Date.now()}-${Math.random()}`).digest("hex").slice(0, 12);

    const svgStr: string | null = data.svg || null;
    const pngB64: string | null = data.preview_png_b64 || null;

    const outDir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(outDir, { recursive: true });

    let svgUrl: string | null = null;
    if (svgStr) {
      const svgPath = path.join(outDir, `${id}.svg`);
      await fs.writeFile(svgPath, svgStr, "utf8");
      svgUrl = `/generated/${id}.svg`;
    }

    let previewUrl: string | null = null;
    const pngPath = path.join(outDir, `${id}.png`);
    try {
      if (pngB64) {
        await fs.writeFile(pngPath, Buffer.from(pngB64, "base64"));
        previewUrl = `/generated/${id}.png`;
      } else if (svgStr) {
        const pngBuf = await sharp(Buffer.from(svgStr)).png().toBuffer();
        await fs.writeFile(pngPath, pngBuf);
        previewUrl = `/generated/${id}.png`;
      }
    } catch (err) {
      console.error("PNG creation failed:", err);
      previewUrl = svgUrl;
    }

    const palette =
      Array.isArray(data.palette) ? data.palette.map((p: any) => p.hex) : (data.colors || []);

    return NextResponse.json({
      id,
      svgUrl,
      previewUrl,
      width: data.width || null,
      height: data.height || null,
      palette,
    });
  } catch (e: any) {
    console.error("GENERATE ERROR:", e);
    return NextResponse.json(
      { error: e?.message || String(e) || "Generation failed (server)" },
      { status: 500 }
    );
  }
}
