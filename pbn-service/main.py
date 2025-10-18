# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
from cv2 import ximgproc  # noqa: F401
import uuid
import math

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

# ----------------- utils -----------------
def to_hex(rgb):
    r, g, b = [int(x) for x in rgb]
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def place_number_xy(mask_uint8: np.ndarray):
    """
    Возвращает точку (x, y) для номера как максимум distance transform.
    На входе mask_uint8 = {0,255} бинарная маска компоненты.
    """
    if mask_uint8.max() == 0:
        return None
    # тонкая «эрозия» границы, чтобы цифра не липла к контуру
    er = cv2.erode(mask_uint8, np.ones((3,3), np.uint8), iterations=1)
    if er.max() == 0:
        er = mask_uint8
    dist = cv2.distanceTransform(er, cv2.DIST_L2, 5)
    y, x = np.unravel_index(np.argmax(dist), dist.shape)
    return (float(x), float(y))

# ----------------- preprocessing -----------------
def enhance_image_for_seg(rgb: np.ndarray) -> np.ndarray:
    """
    Лёгкое повышение контраста + шумоподавление, чтобы сегментация «держала» границы.
    """
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    L, A, B = cv2.split(lab)
    # CLAHE по L — локальный контраст
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    L = clahe.apply(L)
    lab = cv2.merge([L, A, B])
    bgr = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    # мягкий bilateral, чтобы сгладить шум и сохранить края
    bgr = cv2.bilateralFilter(bgr, d=7, sigmaColor=40, sigmaSpace=40)
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

# ----------------- superpixels & palette -----------------
def slic_superpixels(img_rgb: np.ndarray, region_size: int, ruler: float = 10.0, iters: int = 15, min_element: int = 25):
    bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    slic = cv2.ximgproc.createSuperpixelSLIC(
        bgr,
        algorithm=cv2.ximgproc.SLICO,
        region_size=region_size,
        ruler=ruler,
    )
    slic.iterate(iters)
    if min_element > 0:
        slic.enforceLabelConnectivity(min_element)
    labels = slic.getLabels().astype(np.int32)      # HxW
    count = slic.getNumberOfSuperpixels()
    return labels, count

def kmeans_palette_lab(img_rgb: np.ndarray, k: int):
    H, W, _ = img_rgb.shape
    bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    data = lab.reshape(-1, 3).astype(np.float32)
    # повышаем точность: больше итераций и eps поменьше
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 60, 0.5)
    _compactness, labels, centers_lab = cv2.kmeans(
        data, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS
    )
    centers_lab = centers_lab.astype(np.uint8)
    centers_lab_img = centers_lab.reshape(-1,1,3)
    centers_bgr = cv2.cvtColor(centers_lab_img, cv2.COLOR_Lab2BGR).reshape(-1,3)
    centers_rgb = cv2.cvtColor(centers_bgr[None,:,:].astype(np.uint8), cv2.COLOR_BGR2RGB).reshape(-1,3)
    idx_map = labels.reshape(H, W).astype(np.int32)
    return centers_rgb, idx_map

# ----------------- core -----------------
def generate_svg(img_rgb: np.ndarray, k: int, detail: int, paper: str, contour: int, with_numbers: bool, ultra: bool):
    H, W, _ = img_rgb.shape

    # 1) pre
    img_pre = enhance_image_for_seg(img_rgb)

    # Подбираем размер суперпикселя относительно разрешения и detail.
    # Чем выше detail — тем меньше суперпиксель.
    # Нормируем на ширину ~ 1600 px.
    base = max(W, H) / 1600.0
    base = max(1.0, base)
    region_size = {
        1: int(44 / base),
        2: int(32 / base),
        3: int(24 / base),
        4: int(18 / base),
        5: int(14 / base),
    }[int(detail)]
    region_size = max(8, region_size)

    slic_iter = 20 if ultra else 15
    labels_sup, n_sup = slic_superpixels(img_pre, region_size=region_size, ruler=10.0, iters=slic_iter, min_element=25)

    # 2) palette in LAB + mаппинг суперпикселей к центрам
    centers_rgb, _ = kmeans_palette_lab(img_pre, k)
    sup_mean = np.zeros((n_sup, 3), dtype=np.float32)
    for s in range(n_sup):
        mask = (labels_sup == s)
        if mask.any():
            sup_mean[s] = img_pre[mask].mean(axis=0)
    diff = sup_mean[:, None, :] - centers_rgb[None, :, :].astype(np.float32)
    dist2 = np.sum(diff * diff, axis=2)                 # (n_sup, k)
    sup2col = np.argmin(dist2, axis=1).astype(np.int32) # (n_sup,)
    idx_map = sup2col[labels_sup]                       # (H, W)

    # 3) contours + labels
    # минимальная площадь области зависит от детальности/разрешения
    px_total = W * H
    # при ultra разрешаем мельче
    base_min = (1100 - detail * 150)
    if ultra:
        base_min = (900 - detail * 140)
    base_min = max(400, base_min)
    min_area = max(16, int(px_total / base_min))

    # точность аппроксимации
    eps_rel = {1: 0.012, 2: 0.009, 3: 0.006, 4: 0.004, 5: 0.0028}[int(detail)]
    if ultra:
        eps_rel *= 0.8

    paths = []
    labels_text = []

    # Небольшая пост-фильтрация карт индексов, чтобы убрать одиночные «шумы».
    idx_map = cv2.medianBlur(idx_map.astype(np.uint8), 3).astype(np.int32)

    for color_idx in range(k):
        mask = (idx_map == color_idx).astype(np.uint8) * 255
        if mask.max() == 0:
            continue

        num, lab, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
        for label in range(1, num):
            area = int(stats[label, cv2.CC_STAT_AREA])
            if area < min_area:
                continue
            x, y = stats[label, cv2.CC_STAT_LEFT], stats[label, cv2.CC_STAT_TOP]
            w, h = stats[label, cv2.CC_STAT_WIDTH], stats[label, cv2.CC_STAT_HEIGHT]
            roi = (lab[y:y+h, x:x+w] == label).astype(np.uint8) * 255

            cnts, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
            for cnt in cnts:
                if len(cnt) < 3:
                    continue
                peri = cv2.arcLength(cnt, True)
                eps = max(0.5, eps_rel * peri)
                approx = cv2.approxPolyDP(cnt, eps, True)

                poly = [(float(p[0][0] + x), float(p[0][1] + y)) for p in approx]
                d = ["M", f"{poly[0][0]:.2f}", f"{poly[0][1]:.2f}"]
                for (px, py) in poly[1:]:
                    d += ["L", f"{px:.2f}", f"{py:.2f}"]
                d += ["Z"]
                paths.append({"d": " ".join(d), "idx": color_idx})

                if with_numbers:
                    # более надёжная расстановка номеров: максимум distance transform
                    cxcy = place_number_xy(roi)
                    if cxcy is not None:
                        cx, cy = cxcy
                        labels_text.append({"x": x + cx, "y": y + cy, "idx": color_idx + 1})

    # 4) scale to paper
    scale_by_paper = {"A4": 1.0, "A3": 1.4142, "A2": 2.0}
    S = float(scale_by_paper.get(paper, 1.0))
    W_out, H_out = int(W * S), int(H * S)

    path_str = "".join(
        f'<path d="{p["d"]}" fill="none" stroke="#000" stroke-width="{contour}"/>' for p in paths
    )
    nums_str = "".join(
        f'<text x="{l["x"]*S:.2f}" y="{l["y"]*S:.2f}" font-size="{9.5*S:.1f}" '
        f'text-anchor="middle" dominant-baseline="central" fill="#444">{l["idx"]}</text>'
        for l in labels_text
    )

    svg = (
        f'<?xml version="1.0" encoding="UTF-8"?>'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W_out}" height="{H_out}" '
        f'viewBox="0 0 {W_out} {H_out}" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">'
        f'<rect width="{W_out}" height="{H_out}" fill="#fff"/>'
        f'<g transform="scale({S})">{path_str}</g>'
        f'{nums_str}'
        f'</svg>'
    )

    palette_hex = [to_hex(c) for c in centers_rgb]
    return svg, W_out, H_out, palette_hex

# ----------------- endpoint -----------------
@app.post("/generate")
async def generate(
    file: UploadFile = File(...),
    colors: int = Form(24),
    detail: int = Form(3),
    paper: str = Form("A4"),
    contour: int = Form(2),
    withNumbers: bool = Form(True),
    ultra: bool = Form(False),         # добавил флаг «ультра-точности»
    maxWidth: int = Form(2200),        # можно поднять до 3000–3400 на мощной машине
):
    try:
        raw = await file.read()
        img = Image.open(BytesIO(raw)).convert("RGB")

        # поднимаем потолок разрешения — выше точность границ (цена — RAM/время)
        max_w = int(clamp(maxWidth, 1200, 3600))
        if img.width > max_w:
            h = int(img.height * (max_w / img.width))
            img = img.resize((max_w, h), Image.LANCZOS)

        img_rgb = np.array(img)

        k = int(clamp(colors, 8, 48))
        d = int(clamp(detail, 1, 5))
        paper = paper if paper in ("A4", "A3", "A2") else "A4"
        contour = int(clamp(contour, 1, 3))
        ultra = bool(ultra)

        svg, W, H, palette_hex = generate_svg(
            img_rgb, k, d, paper, contour, withNumbers, ultra
        )

        return JSONResponse({
            "id": uuid.uuid4().hex[:12],
            "svg": svg,
            "width": W,
            "height": H,
            "palette": [{"hex": h, "index": i} for i, h in enumerate(palette_hex)],
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
