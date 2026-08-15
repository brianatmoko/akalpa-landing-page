#!/usr/bin/env python3
"""
package_and_build_blogger_theme.py
===================================
Akalpa Inovasi — Full Blogger XML Theme & Asset Packager

Fungsi:
1. Membungkus seluruh aset (logo, mascot, frames, octocat) ke `output/akalpa-assets-for-drive.zip`
2. Menghasilkan daftar pemetaan aset `output/ASSET_URL_MAPPING_GUIDE.txt`
3. Membangun file XML Blogger Theme lengkap `output/akalpa-full-blogger-theme.xml`
   yang menggabungkan:
     - Main Landing Page (Beranda)
     - Katalog Free Templates
     - Studio Curator Portal (Vault Security Gate + Management)
     - Integration GAS Realtime API (Google Sheets)

Cara Pakai:
  python tools/package_and_build_blogger_theme.py
"""

import os
import re
import sys
import zipfile

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR   = os.path.join(PROJECT_ROOT, "output")

INDEX_HTML     = os.path.join(PROJECT_ROOT, "index.html")
TEMPLATES_HTML = os.path.join(PROJECT_ROOT, "templates.html")
CURATOR_HTML   = os.path.join(PROJECT_ROOT, "templates-curator.html")
MAIN_CSS       = os.path.join(PROJECT_ROOT, "css", "main.css")
MAIN_JS        = os.path.join(PROJECT_ROOT, "js", "main.js")
ASSETS_DIR     = os.path.join(PROJECT_ROOT, "assets")
LOGO_PNG       = os.path.join(PROJECT_ROOT, "Akalpa-Logos.png")

OUT_ZIP        = os.path.join(OUTPUT_DIR, "akalpa-assets-for-drive.zip")
OUT_MAP_GUIDE  = os.path.join(OUTPUT_DIR, "ASSET_URL_MAPPING_GUIDE.txt")
OUT_FULL_THEME = os.path.join(OUTPUT_DIR, "akalpa-full-blogger-theme.xml")

BLOGGER_FULL_TEMPLATE = """\
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection'
  xmlns='http://www.w3.org/1999/xhtml'
  xmlns:b='http://www.google.com/2005/gbl'
  xmlns:data='http://www.google.com/2005/gbl'
  xmlns:expr='http://www.google.com/2005/gbl'>

<head>
  <meta content='width=device-width, initial-scale=1' name='viewport'/>
  <b:include data='blog' name='all-head-content'/>
  <title><data:blog.pageTitle/></title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin"/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&amp;family=Outfit:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;600;700&amp;display=swap" rel="stylesheet"/>

  <b:skin><![CDATA[
{css_combined}
  ]]></b:skin>
</head>

<body>

  <!-- Navigasi Mode Tampilan (SPA Router untuk Blogger) -->
  <div id="akalpa-app-root">

    <!-- 1. LANDING PAGE SECTION -->
    <div id="view-home" class="akalpa-view">
{index_body}
    </div>

    <!-- 2. FREE TEMPLATES SECTION -->
    <div id="view-templates" class="akalpa-view" style="display:none">
{templates_body}
    </div>

    <!-- 3. STUDIO CURATOR SECTION -->
    <div id="view-curator" class="akalpa-view" style="display:none">
{curator_body}
    </div>

  </div>

  <b:section class='main' id='main' maxwidgets='1' name='Main' showaddelement='no'>
    <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1' visible='false'>
      <b:widget-settings>
        <b:widget-setting name='showShareButtons'>false</b:widget-setting>
      </b:widget-settings>
      <b:includable id='main' var='top'></b:includable>
    </b:widget>
  </b:section>

<script type='text/javascript'>
//<![CDATA[
{js_combined}

/* SPA Router for Blogger Views */
(function(){
  function route(){
    var hash = window.location.hash || "#home";
    var views = document.querySelectorAll(".akalpa-view");
    views.forEach(function(v){ v.style.display = "none"; });

    if(hash === "#templates" || window.location.pathname.indexOf("/p/templates") > -1){
      var vt = document.getElementById("view-templates");
      if(vt) vt.style.display = "block";
      window.scrollTo(0,0);
    } else if(hash === "#curator" || window.location.pathname.indexOf("/p/curator") > -1){
      var vc = document.getElementById("view-curator");
      if(vc) vc.style.display = "block";
      window.scrollTo(0,0);
    } else {
      var vh = document.getElementById("view-home");
      if(vh) vh.style.display = "block";
    }
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  route();
})();
//]]>
</script>

</body>
</html>
"""

def package_assets():
    """Kemas semua aset gambar ke file zip."""
    print("📦 Mengemas semua aset gambar ke ZIP...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    asset_files = []

    with zipfile.ZipFile(OUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
        if os.path.exists(LOGO_PNG):
            zipf.write(LOGO_PNG, "Akalpa-Logos.png")
            asset_files.append("Akalpa-Logos.png")

        for root, _, files in os.walk(ASSETS_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PROJECT_ROOT)
                zipf.write(full_path, rel_path)
                asset_files.append(rel_path)

    size_mb = os.path.getsize(OUT_ZIP) / (1024 * 1024)
    print(f"✅ Asset Zip dibuat: {OUT_ZIP} ({size_mb:.2f} MB)")

    # Buat file panduan pemetaan aset
    with open(OUT_MAP_GUIDE, 'w', encoding='utf-8') as f:
        f.write("============================================================\n")
        f.write("  AKALPA INOVASI — PANDUAN UPLOAD ASET KE GOOGLE DRIVE\n")
        f.write("============================================================\n\n")
        f.write("Folder Google Drive Tujuan:\n")
        f.write("https://drive.google.com/drive/folders/1Qyq3cRQkZoefM-M8K1Jybry2_GM50gxW?usp=sharing\n\n")
        f.write("Langkah:\n")
        f.write("1. Ekstrak file 'akalpa-assets-for-drive.zip'\n")
        f.write("2. Upload seluruh isi folder ke Google Drive di atas.\n")
        f.write("3. Dapatkan Link Publik / Direct Link untuk setiap gambar.\n\n")
        f.write("Daftar Aset yang Perlu Di-map:\n")
        f.write("------------------------------------------------------------\n")
        for a in sorted(asset_files):
            f.write(f"- {a}\n")

    print(f"✅ Panduan Pemetaan dibuat: {OUT_MAP_GUIDE}")
    return asset_files

def extract_body_content(html_file):
    """Ekstrak hanya konten di dalam tag <body>."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Hapus <script> dan <style>
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL|re.IGNORECASE)
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL|re.IGNORECASE)
    
    m = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
    if m:
        body = m.group(1).strip()
    else:
        body = content.strip()
    
    # Hapus link font
    body = re.sub(r'<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*/?>', '', body, flags=re.IGNORECASE)
    return body

def extract_styles(html_file):
    """Ekstrak blok <style> dari file HTML."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
    return "\n".join(matches)

def extract_scripts(html_file):
    """Ekstrak blok <script> dari file HTML."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    return "\n".join(matches)

def build_full_blogger_theme():
    """Gabungkan semua HTML, CSS, JS menjadi satu file Blogger XML theme besar."""
    print("\n🛠️  Membangun File Theme XML Blogger Lengkap...")

    # Load CSS utama
    main_css = ""
    if os.path.exists(MAIN_CSS):
        with open(MAIN_CSS, 'r', encoding='utf-8') as f:
            main_css = f.read()

    templates_css = extract_styles(TEMPLATES_HTML)
    curator_css = extract_styles(CURATOR_HTML)
    css_combined = main_css + "\n" + templates_css + "\n" + curator_css

    # Load JS utama
    main_js = ""
    if os.path.exists(MAIN_JS):
        with open(MAIN_JS, 'r', encoding='utf-8') as f:
            main_js = f.read()

    templates_js = extract_scripts(TEMPLATES_HTML)
    curator_js = extract_scripts(CURATOR_HTML)
    js_combined = main_js + "\n" + templates_js + "\n" + curator_js

    # Load Body dari 3 halaman
    index_body = extract_body_content(INDEX_HTML)
    templates_body = extract_body_content(TEMPLATES_HTML)
    curator_body = extract_body_content(CURATOR_HTML)

    # Sesuaikan link navigasi internal untuk Blogger SPA hash routing
    index_body = index_body.replace('href="templates.html"', 'href="#templates"')
    templates_body = templates_body.replace('href="index.html"', 'href="#home"')
    templates_body = templates_body.replace('href="templates.html"', 'href="#templates"')
    curator_body = curator_body.replace('href="templates.html"', 'href="#templates"')

    # Generate XML tanpa format() untuk menghindari bentrok kurung kurawal CSS/JS
    xml_content = BLOGGER_FULL_TEMPLATE
    xml_content = xml_content.replace("{css_combined}", css_combined)
    xml_content = xml_content.replace("{index_body}", index_body)
    xml_content = xml_content.replace("{templates_body}", templates_body)
    xml_content = xml_content.replace("{curator_body}", curator_body)
    xml_content = xml_content.replace("{js_combined}", js_combined)

    with open(OUT_FULL_THEME, 'w', encoding='utf-8') as f:
        f.write(xml_content)

    size_kb = os.path.getsize(OUT_FULL_THEME) / 1024
    print(f"✅ Full Blogger Theme XML Berhasil Dibuat: {OUT_FULL_THEME} ({size_kb:.1f} KB)")

def main():
    print("=" * 65)
    print("  AKALPA INOVASI — TOTAL BLOGGER MIGRATION & ASSET PACKAGER")
    print("=" * 65)

    package_assets()
    build_full_blogger_theme()

    print("\n" + "=" * 65)
    print("✅ PROSES SELESAI!")
    print("=" * 65)
    print(f"\n📁 Lokasi Hasil di folder output: {OUTPUT_DIR}/")
    print(f"  1. akalpa-assets-for-drive.zip")
    print("     → Upload zip ini (atau isinya) ke Google Drive Anda:")
    print("       https://drive.google.com/drive/folders/1Qyq3cRQkZoefM-M8K1Jybry2_GM50gxW?usp=sharing")
    print(f"  2. ASSET_URL_MAPPING_GUIDE.txt")
    print("     → Panduan daftar file gambar yang ada di dalam zip")
    print(f"  3. akalpa-full-blogger-theme.xml")
    print("     → Upload file XML ini ke Blogger: Tema > Kustomisasi > Edit HTML > Paste > Simpan")
    print("\n🚀 Website Akalpa Anda (Beranda + Template Catalog + Studio Curator + GAS Realtime) kini 100% berjalan di Blogger!")

if __name__ == "__main__":
    main()
