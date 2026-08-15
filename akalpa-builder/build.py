#!/usr/bin/env python3
"""Build index.html dari index.src.html — memperluas placeholder {{ic:<nama>}}
menjadi SVG nyata dari js/icons.js (subset Tabler, MIT). JANGAN edit index.html
langsung; edit index.src.html lalu jalankan script ini.

Cara pakai:
    python3 websites/akalpa-builder/build.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_icons() -> dict:
    src = (ROOT / "js" / "icons.js").read_text(encoding="utf-8")
    m = re.search(r"WPB\.ICONS\s*=\s*(\{.*?\});", src, re.S)
    if not m:
        raise SystemExit("Tidak menemukan WPB.ICONS di js/icons.js")
    return json.loads(m.group(1))


def expand(html: str, icons: dict) -> tuple[str, list[str]]:
    missing: list[str] = []

    def repl(m: re.Match) -> str:
        name = m.group(1)
        svg = icons.get(name)
        if svg is None:
            missing.append(name)
            return ""
        return svg

    out = re.sub(r"\{\{ic:([a-z0-9-]+)\}\}", repl, html)
    return out, missing


def main() -> int:
    icons = load_icons()
    src = (ROOT / "index.src.html").read_text(encoding="utf-8")
    out, missing = expand(src, icons)
    if missing:
        print(f"PERINGATAN: ikon tidak ditemukan: {sorted(set(missing))}", file=sys.stderr)
    (ROOT / "index.html").write_text(out, encoding="utf-8")
    print(f"OK — index.html ditulis ({len(out):,} byte). Ikon dipakai: "
          f"{len(set(re.findall(r'{{ic:([a-z0-9-]+)}}', src)))}. Missing: {len(set(missing))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
