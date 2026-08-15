#!/usr/bin/env python3
"""Siapkan aset Akalpa Inovasi dari proyek referensi:
1. Salin 130 frame (hero 50 + sec2 40 + sec3 40) → assets/frames/
2. Kompres 12 pose maskot (PNG 1024x1536, ~25MB) → WebP (~50KB each)
3. Generate js/icons.js (subset Tabler) untuk ikon yang dipakai halaman

Jalankan:  python3 websites/akalpa-builder/prep_assets.py
"""
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
REF = Path("/home/brianatmokoo/Documents/Akalpa Project/akalpa-landing-page")

FRAME_SOURCES = {
    # hero memakai frame section3 (sesuai permintaan user: hapus frame motion,
    # ganti jadi section3). Folder diberi nama hero3 agar URL berubah → tidak
    # kena cache browser dari frame lama (ezgif).
    "hero3": REF / "section3",
    "sec2": REF / "section2",
    "sec3": REF / "section3",
}
MASCOT_SRC = REF / "public/mascot"

ICONS_JSON = Path("/home/brianatmokoo/Documents/Akalpa Project/web-parallax-builder/content/tabler/tabler_icons.json")

# Ikon yang dipakai halaman (nama Tabler)
NEEDED_ICONS = [
    # UI
    "menu", "x", "arrow-right", "arrow-up", "arrow-up-right", "chevron-down",
    "chevron-left", "chevron-right", "check", "circle-check", "star", "heart",
    "send", "quote", "sparkles", "external-link", "message-circle",
    # Layanan
    "target", "building", "building-store", "palette", "users-group", "users",
    "rocket", "bolt", "globe", "code", "layout-grid", "device-desktop",
    "device-mobile", "camera", "briefcase", "chart-bar", "trending-up",
    # Proses
    "messages", "pencil", "paint", "rocket", "photo",
    # Kontak / info
    "clock", "infinity", "calendar", "phone", "mail", "map-pin", "brand-whatsapp",
    "robot", "brain", "terminal", "device-mobile", "wand", "microscope",
    # Sosmed
    "brand-instagram", "brand-youtube", "brand-tiktok", "brand-github",
    "brand-x", "brand-linkedin",
    # Teknologi / dekorasi
    "cpu", "database", "shield-check", "world", "components", "stack-2",
    "git-fork", "git-branch", "eye", "download",
]


def copy_frames() -> None:
    for name, src in FRAME_SOURCES.items():
        dst = ROOT / "assets" / "frames" / name
        dst.mkdir(parents=True, exist_ok=True)
        frames = sorted(src.glob("*.jpg"))
        for f in frames:
            # rename seragam: 001.jpg, 002.jpg ...
            num = f.name  # ezgif-frame-001.jpg or frame-001.jpg
            m = re.search(r"(\d{3})", f.name)
            target = dst / f"{m.group(1)}.jpg"
            shutil.copy2(f, target)
        print(f"  frames/{name}: {len(frames)} → assets/frames/{name}")


def compress_mascots() -> None:
    dst = ROOT / "assets" / "mascot"
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(MASCOT_SRC.glob("*.png")):
        im = Image.open(f).convert("RGBA")
        # batasi tinggi agar ringan
        if im.height > 640:
            ratio = 640 / im.height
            im = im.resize((int(im.width * ratio), 640), Image.LANCZOS)
        target = dst / (f.stem + ".webp")
        im.save(target, "WEBP", quality=82, method=6)
        print(f"  mascot/{f.stem}.webp ({target.stat().st_size//1024} KB)")


def generate_icons() -> None:
    data = json.loads(ICONS_JSON.read_text(encoding="utf-8"))
    elements = data["elements"]
    if isinstance(elements, dict):
        by_id = elements
    else:
        by_id = {e["id"]: e for e in elements}
    out = ["/* icons.js — ikon SVG Tabler (MIT, subset terpilih untuk Akalpa Inovasi).",
           " * Dibangkitkan dari content/tabler/tabler_icons.json — JANGAN edit manual. */",
           "window.WPB = window.WPB || {};",
           "WPB.ICONS = {"]
    missing = []
    entries = []
    for name in NEEDED_ICONS:
        el = by_id.get(name)
        if el is None:
            missing.append(name)
            continue
        svg = el["svg"].replace("\n", " ").replace('  ', ' ')
        svg = re.sub(r"\s+", " ", svg).strip()
        entries.append(f" {json.dumps(name)}: {json.dumps(svg)}")
    out.append(",\n".join(entries))
    out.append("};")
    (ROOT / "js" / "icons.js").write_text("\n".join(out), encoding="utf-8")
    print(f"  icons.js: {len(NEEDED_ICONS) - len(missing)}/{len(NEEDED_ICONS)} ikon")
    if missing:
        print(f"  PERINGATAN ikon hilang: {missing}")


def main() -> int:
    print("1/3 Salin frame...")
    copy_frames()
    print("2/3 Kompres maskot...")
    compress_mascots()
    print("3/3 Generate ikon...")
    generate_icons()
    print("Selesai.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
