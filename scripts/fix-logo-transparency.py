"""
Elimina fondos negros/grises y deja solo el logo Emprenor (transparente).
Uso: python scripts/fix-logo-transparency.py
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Instale Pillow: pip install pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

# Solo el negro puro se propaga por flood desde los bordes
FLOOD_THRESHOLD = 55
# Tras el flood, quitar halos grises (no morado ni blanco)
HALO_MAX_LUMINANCE = 105
HALO_MAX_SATURATION = 35


def is_purple_logo_pixel(r: int, g: int, b: int) -> bool:
    """Morado Emprenor: canal azul dominante (incluye antialiasing)."""
    mx = max(r, g, b)
    if mx < 28:
        return False
    if b < r - 5 or b < g - 8:
        return False
    if (b - min(r, g)) < 5 and mx < 55:
        return False
    return b >= r - 3


def is_white_logo_pixel(r: int, g: int, b: int) -> bool:
    return min(r, g, b) >= 140


def is_foreground(r: int, g: int, b: int) -> bool:
    return is_purple_logo_pixel(r, g, b) or is_white_logo_pixel(r, g, b)


def saturation(r: int, g: int, b: int) -> int:
    return max(r, g, b) - min(r, g, b)


def flood_remove_edge_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    def is_flood_bg(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a == 0:
            return True
        if is_foreground(r, g, b):
            return False
        return max(r, g, b) < FLOOD_THRESHOLD

    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if (x, y) in visited or x < 0 or x >= w or y < 0 or y >= h:
            continue
        if not is_flood_bg(x, y):
            continue
        visited.add((x, y))
        px[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q.append((x + dx, y + dy))

    return img


def remove_dark_halos(img: Image.Image) -> Image.Image:
    """Quita halos: solo permanece morado/blanco del logo (corte duro)."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if is_foreground(r, g, b):
                # Antialiasing: premultiplicar sobre transparente (evita halo gris)
                px[x, y] = (r, g, b, a)
                continue
            px[x, y] = (0, 0, 0, 0)

    return img


def trim_transparent(img: Image.Image, padding: int = 4) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - padding)
    y0 = max(0, y0 - padding)
    x1 = min(img.width, x1 + padding)
    y1 = min(img.height, y1 + padding)
    return img.crop((x0, y0, x1, y1))


def process_logo(path: Path, *, trim: bool = True) -> None:
    if not path.exists():
        print(f"  omitido: {path.name}")
        return
    img = Image.open(path)
    img = flood_remove_edge_background(img)
    img = remove_dark_halos(img)
    if trim:
        img = trim_transparent(img)
    img.save(path, "PNG", optimize=True)
    bbox = img.getbbox()
    print(f"  OK {path.relative_to(ROOT)} {img.size}" + (f" bbox={bbox}" if bbox else ""))


def create_icon_from_white_logo(white_logo: Path, icon_path: Path) -> None:
    if not white_logo.exists():
        return
    img = Image.open(white_logo)
    img = flood_remove_edge_background(img)
    img = remove_dark_halos(img)
    w, _ = img.size
    left = img.crop((0, 0, int(w * 0.28), img.height))
    left = trim_transparent(left, padding=2)
    side = max(left.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - left.width) // 2
    oy = (side - left.height) // 2
    square.paste(left, (ox, oy), left)
    square = square.resize((128, 128), Image.Resampling.LANCZOS)
    square.save(icon_path, "PNG", optimize=True)
    print(f"  OK {icon_path.relative_to(ROOT)} (icono)")


def main() -> None:
    logos = [
        PUBLIC / "images" / "logo-emprenor.png",
        PUBLIC / "images" / "logo-emprenor-large.png",
        PUBLIC / "images" / "logo-emprenor-white.png",
        PUBLIC / "images" / "logo-emprenor-dark.png",
        PUBLIC / "apple-icon.png",
        PUBLIC / "icon-192.png",
        PUBLIC / "icon-512.png",
    ]

    print("Procesando logos (fondo transparente)...")
    for p in logos:
        process_logo(p)

    create_icon_from_white_logo(
        PUBLIC / "images" / "logo-emprenor-white.png",
        PUBLIC / "images" / "logo-icon-inverted.png",
    )
    print("Listo.")


if __name__ == "__main__":
    main()
