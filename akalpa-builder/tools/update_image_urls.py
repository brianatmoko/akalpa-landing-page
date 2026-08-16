#!/usr/bin/env python3
"""
update_image_urls.py
====================
Akalpa Inovasi — Otomatisasi Pemetaan URL Gambar Google Drive

Script ini membaca file `drive_links.txt` (atau input langsung),
memetakan 140+ link gambar Google Drive berdasarkan nama filenya,
lalu otomatis memperbarui seluruh HTML/CSS/JS dan membangun ulang
`output/akalpa-full-blogger-theme.xml`!

Format `drive_links.txt` yang didukung:
1. Baris berisi URL/ID dan Nama File:
   https://drive.google.com/file/d/1ABCxyz.../view  punya-ide.webp
   001.jpg -> https://lh3.googleusercontent.com/d/1XYZabc...
   1ABCxyz... punya-ide.webp
2. Atau tempelan teks mentah dari Google Drive / link sharing

Cara Pakai:
  python tools/update_image_urls.py
"""

import os
import re
import sys
import subprocess

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DRIVE_TXT    = os.path.join(PROJECT_ROOT, "drive_links.txt")

def convert_to_direct_drive_url(drive_input):
    """Konversi file ID atau Google Drive URL ke format Direct Image URL (lh3 / uc)."""
    drive_input = drive_input.strip()
    # Jika sudah merupakan URL direct lh3
    if "lh3.googleusercontent.com" in drive_input:
        return drive_input
    
    # Ekstrak file ID dari berbagai format URL Google Drive
    match = re.search(r'(?:file/d/|id=|/d/|id=)([a-zA-Z0-9_-]{28,35})', drive_input)
    if match:
        file_id = match.group(1)
        return f"https://lh3.googleusercontent.com/d/{file_id}"
    
    # Jika input adalah file ID murni (33 karakter)
    if re.match(r'^[a-zA-Z0-9_-]{28,35}$', drive_input):
        return f"https://lh3.googleusercontent.com/d/{drive_input}"
    
    return drive_input

def parse_drive_links():
    """Membaca drive_links.txt dan mengembalikan dict: { filename: direct_url }."""
    if not os.path.exists(DRIVE_TXT):
        print(f"⚠️  File {DRIVE_TXT} belum dibuat.")
        print("   Buat file 'drive_links.txt' di folder utama proyek dan tempelkan link/ID gambar di dalamnya.")
        return {}

    with open(DRIVE_TXT, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    url_map = {}
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        # Ekstrak nama file (misal 001.jpg, punya-ide.webp, Akalpa-Logos.png, octocat.svg)
        fname_match = re.search(r'([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))', line, re.IGNORECASE)
        # Ekstrak file ID atau URL
        url_match = re.search(r'(https?://[^\s]+|[a-zA-Z0-9_-]{28,35})', line)

        if fname_match and url_match:
            fname = fname_match.group(1)
            raw_url = url_match.group(1)
            direct_url = convert_to_direct_drive_url(raw_url)
            url_map[fname] = direct_url
            print(f"✓ Mapped: {fname} -> {direct_url}")

    print(f"\n📊 Total {len(url_map)} gambar berhasil dipetakan.")
    return url_map

def apply_url_replacements(url_map):
    """Ganti semua path gambar lokal (assets/...) dengan URL Google Drive di HTML/CSS/JS."""
    if not url_map:
        print("⚠️ Tidak ada pemetaan yang bisa diterapkan.")
        return

    print("\n🔄 Memperbarui file HTML/CSS/JS proyek...")

    target_files = [
        os.path.join(PROJECT_ROOT, "index.src.html"),
        os.path.join(PROJECT_ROOT, "index.html"),
        os.path.join(PROJECT_ROOT, "templates.html"),
        os.path.join(PROJECT_ROOT, "templates-curator.html"),
        os.path.join(PROJECT_ROOT, "css", "main.css"),
        os.path.join(PROJECT_ROOT, "js", "main.js")
    ]

    count_replaced = 0
    for file_path in target_files:
        if not os.path.exists(file_path):
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        for fname, drive_url in url_map.items():
            # Ganti variasi path lokal:
            # - assets/mascot/punya-ide.webp -> drive_url
            # - assets/frames/hero3/001.jpg -> drive_url
            # - assets/Akalpa-Logos.png -> drive_url
            # - Akalpa-Logos.png -> drive_url
            patterns = [
                r'assets/(?:mascot|frames/[^/]+|github)/' + re.escape(fname),
                r'assets/' + re.escape(fname),
                r'\b' + re.escape(fname) + r'\b'
            ]
            for pat in patterns:
                content = re.sub(pat, drive_url, content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            count_replaced += 1
            print(f"✅ Diperbarui: {os.path.basename(file_path)}")

    print(f"\n🎉 Selesai memperbarui {count_replaced} file proyek!")

def rebuild_theme():
    """Jalankan package_and_build_blogger_theme.py untuk membuat akalpa-full-blogger-theme.xml baru."""
    builder_script = os.path.join(SCRIPT_DIR, "package_and_build_blogger_theme.py")
    if os.path.exists(builder_script):
        print("\n🔨 Membangun ulang file Theme XML Blogger...")
        subprocess.run([sys.executable, builder_script], check=True)

def main():
    print("=" * 65)
    print("  AKALPA INOVASI — OTOMATISASI PEMETAAN GAMBAR GOOGLE DRIVE")
    print("=" * 65)

    url_map = parse_drive_links()
    if url_map:
        apply_url_replacements(url_map)
        rebuild_theme()
    else:
        print("\nSilakan buat file `drive_links.txt` dan tempelkan link/ID gambar dari Google Drive.")

if __name__ == "__main__":
    main()
