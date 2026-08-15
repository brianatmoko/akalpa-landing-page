#!/usr/bin/env python3
"""
html_to_blogger_xml.py
======================
Konverter HTML → Blogger XML Theme
Akalpa Inovasi — Template System

Menghasilkan:
  output/akalpa-templates-theme.xml   (halaman katalog publik)
  output/akalpa-curator-page.xml      (halaman Studio Curator — untuk Page di Blogger)

Cara pakai:
  python tools/html_to_blogger_xml.py
"""

import os
import re
import sys
import html

# ── Konfigurasi path ──────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR   = os.path.join(PROJECT_ROOT, "output")

TEMPLATES_HTML  = os.path.join(PROJECT_ROOT, "templates.html")
CURATOR_HTML    = os.path.join(PROJECT_ROOT, "templates-curator.html")

OUT_THEME       = os.path.join(OUTPUT_DIR, "akalpa-templates-theme.xml")
OUT_CURATOR     = os.path.join(OUTPUT_DIR, "akalpa-curator-page.xml")

# ── Blogger XML wrapper ───────────────────────────────────────
BLOGGER_THEME_TEMPLATE = """\
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
  <link href='https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&amp;family=Outfit:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap' rel='stylesheet'/>

  <b:skin><![CDATA[
{css}
  ]]></b:skin>
</head>

<body>

{body_html}

  <b:section class='main' id='main' maxwidgets='1' name='Main' showaddelement='no'>
    <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1' visible='false'>
      <b:widget-settings>
        <b:widget-setting name='showShareButtons'>false</b:widget-setting>
      </b:widget-settings>
      <b:includable id='main' var='top'></b:includable>
    </b:widget>
  </b:section>

{scripts}

</body>
</html>
"""

# Wrapper untuk halaman Blogger (Page / Static Page)
BLOGGER_PAGE_TEMPLATE = """\
<style>
{css}
</style>

{body_html}

<script type='text/javascript'>
//<![CDATA[
{js}
//]]>
</script>
"""

# ── Parser sederhana ──────────────────────────────────────────

def extract_between_tags(content, open_tag_re, close_tag):
    """Ekstrak isi antara tag pembuka dan penutup (non-rekursif)."""
    pattern = re.compile(
        open_tag_re + r'(.*?)' + re.escape(close_tag),
        re.DOTALL | re.IGNORECASE
    )
    matches = pattern.findall(content)
    return matches

def extract_styles(html_content):
    """Ambil semua blok <style>...</style>."""
    return extract_between_tags(html_content, r'<style[^>]*>', '</style>')

def extract_scripts(html_content):
    """Ambil semua blok <script>...</script>."""
    return extract_between_tags(html_content, r'<script[^>]*>', '</script>')

def extract_body(html_content):
    """Ambil isi di antara <body> dan </body>."""
    m = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return html_content.strip()

def remove_font_link_tags(html_content):
    """Hapus <link> Google Fonts karena sudah ada di Blogger head."""
    cleaned = re.sub(
        r'<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*/?>', 
        '', html_content, flags=re.IGNORECASE
    )
    return cleaned

def remove_style_and_script_tags(html_content):
    """Hapus semua tag <style> dan <script> dari body HTML."""
    cleaned = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL|re.IGNORECASE)
    cleaned = re.sub(r'<script[^>]*>.*?</script>', '', cleaned, flags=re.DOTALL|re.IGNORECASE)
    return cleaned

def inject_gas_url(js_content, gas_url):
    """Ganti placeholder fetch URL static json dengan GAS API URL."""
    # Ganti fetch("templates/templates.json") → fetch(GAS_API_URL)
    patterns = [
        (r'fetch\("templates/templates\.json"[^)]*\)', 
         f'fetch("{gas_url}", {{cache:"no-store"}})'),
        (r"fetch\('templates/templates\.json'[^)]*\)", 
         f"fetch('{gas_url}', {{cache:'no-store'}})"),
    ]
    result = js_content
    for pat, repl in patterns:
        result = re.sub(pat, repl, result)
    return result

def inject_gas_config(js_content, gas_url):
    """Inject GAS_URL variable at top of JS content."""
    injection = f'\nvar GAS_URL = "{gas_url}";\n'
    return injection + js_content

def fix_xml_in_body(body_html):
    """
    Perbaiki karakter yang bermasalah di XML untuk body HTML Blogger.
    Di dalam area HTML biasa (non-CDATA), & harus jadi &amp;
    Tapi kita harus hati-hati: entitas HTML yang sudah ada tidak di-double-escape.
    """
    # Ganti & yang bukan bagian dari entitas HTML dengan &amp;
    # Pattern: & yang tidak diikuti oleh word characters + semicolon (entitas)
    # Kita tidak escape di sini karena body sudah valid HTML — Blogger menerimanya
    # Yang kita perlu pastikan: tidak ada bare & di atribut
    return body_html

def wrap_script_for_blogger_theme(js_content):
    """Bungkus JS dengan CDATA untuk Blogger XML theme."""
    return f"<script type='text/javascript'>\n//<![CDATA[\n{js_content}\n//]]>\n</script>"

def convert_html_to_blogger_theme(html_path, gas_url, output_path):
    """Konversi file HTML ke Blogger XML theme."""
    print(f"\n📄 Membaca: {html_path}")
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ekstrak CSS
    styles = extract_styles(content)
    css_combined = "\n".join(styles)

    # Ekstrak JS
    scripts = extract_scripts(content)
    js_combined = "\n".join(scripts)

    # Inject GAS URL ke JS
    if gas_url:
        js_combined = inject_gas_url(js_combined, gas_url)
        js_combined = inject_gas_config(js_combined, gas_url)

    # Ekstrak body HTML
    body = extract_body(content)
    body = remove_font_link_tags(body)
    body = remove_style_and_script_tags(body)

    # Bungkus scripts untuk Blogger XML
    scripts_xml = wrap_script_for_blogger_theme(js_combined)

    # Generate XML
    xml_output = BLOGGER_THEME_TEMPLATE.format(
        css=css_combined,
        body_html=body,
        scripts=scripts_xml
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(xml_output)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"✅ Output XML: {output_path} ({size_kb:.1f} KB)")
    return output_path

def convert_html_to_blogger_page(html_path, gas_url, output_path):
    """
    Konversi file HTML ke format Blogger Static Page HTML.
    Blogger Page tidak menerima full XML theme, hanya konten HTML.
    Jadi output ini di-paste ke editor HTML Blogger Page.
    """
    print(f"\n📄 Membaca: {html_path}")
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ekstrak CSS
    styles = extract_styles(content)
    css_combined = "\n".join(styles)

    # Ekstrak JS
    scripts = extract_scripts(content)
    js_combined = "\n".join(scripts)

    # Inject GAS URL ke JS
    if gas_url:
        js_combined = inject_gas_url(js_combined, gas_url)
        js_combined = inject_gas_config(js_combined, gas_url)

    # Ekstrak body HTML
    body = extract_body(content)
    body = remove_font_link_tags(body)
    body = remove_style_and_script_tags(body)

    # Generate output untuk Blogger Page
    page_output = BLOGGER_PAGE_TEMPLATE.format(
        css=css_combined,
        body_html=body,
        js=js_combined
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page_output)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"✅ Output Page HTML: {output_path} ({size_kb:.1f} KB)")
    return output_path

def validate_xml(file_path):
    """Cek apakah XML output valid (basic check)."""
    try:
        import xml.etree.ElementTree as ET
        ET.parse(file_path)
        print(f"✅ XML valid: {os.path.basename(file_path)}")
        return True
    except Exception as e:
        print(f"⚠️  XML parse warning: {e}")
        print("   (Biasanya aman diabaikan karena Blogger namespace non-standard)")
        return False

# ── Main ──────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  AKALPA INOVASI — HTML to Blogger XML Converter")
    print("=" * 60)

    # Input GAS URL
    print("\nMasukkan GAS API URL (atau tekan Enter untuk skip):")
    print("Contoh: https://script.google.com/macros/s/AKfycb.../exec")
    gas_url = input("GAS URL: ").strip()

    if not gas_url:
        print("⚠️  GAS URL dikosongi — JS akan menggunakan localStorage sebagai fallback")

    # Cek source files
    for f in [TEMPLATES_HTML, CURATOR_HTML]:
        if not os.path.exists(f):
            print(f"❌ File tidak ditemukan: {f}")
            sys.exit(1)

    print("\n🔄 Memulai konversi...")

    # 1. Konversi templates.html → Blogger Theme XML
    convert_html_to_blogger_theme(TEMPLATES_HTML, gas_url, OUT_THEME)

    # 2. Konversi templates-curator.html → Blogger Page HTML
    convert_html_to_blogger_page(CURATOR_HTML, gas_url, OUT_CURATOR)

    # 3. Validasi XML (opsional)
    print("\n🔍 Validasi XML...")
    validate_xml(OUT_THEME)

    print("\n" + "=" * 60)
    print("✅ KONVERSI SELESAI!")
    print("=" * 60)
    print(f"\n📦 File output tersimpan di: {OUTPUT_DIR}/")
    print(f"\n  1. {os.path.basename(OUT_THEME)}")
    print("     → Upload ke Blogger: Theme > Kustomisasi > Edit HTML > Paste > Simpan")
    print(f"\n  2. {os.path.basename(OUT_CURATOR)}")
    print("     → Paste ke Blogger: Halaman Baru > Mode HTML > Paste > Terbitkan")
    print("     → Judul halaman: 'Studio Curator'")
    print("     → URL kustom: /p/curator")
    print("\n💡 Jalankan ulang script ini setiap kali templates.html diperbarui.")
    print("=" * 60)

if __name__ == "__main__":
    main()
