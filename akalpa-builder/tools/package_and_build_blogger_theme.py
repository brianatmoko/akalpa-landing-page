#!/usr/bin/env python3
"""
package_and_build_blogger_theme.py
===================================
Akalpa Inovasi — Full Blogger XML Theme & Asset Packager

Fungsi:
1. Membungkus seluruh aset (logo, mascot, frames, octocat) ke `output/akalpa-assets-for-drive.zip`
2. Menghasilkan daftar pemetaan aset `output/ASSET_URL_MAPPING_GUIDE.txt`
3. Membangun file XML Blogger Theme lengkap `output/akalpa-full-blogger-theme.xml`
   dengan navbar global di luar SPA view dan sintaks XML 100% valid.

Cara Pakai:
  python tools/package_and_build_blogger_theme.py
"""

import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

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
/* ── Blogger Default UI Reset (AMAN: hanya target elemen Blogger, bukan elemen kustom) ── */

/* Sembunyikan UI bawaan Blogger */
#navbar-iframe, #b-navbar, #navbar-main,
.navbar-iframe-container { display: none !important; height: 0 !important; }

/* Widget Blog bawaan tidak tampil (karena kita punya konten sendiri) */
.widget-type-Blog, .widget-type-Attribution { display: none !important; }

/* Reset wrapper bawaan Blogger – PAKSA 100% Lebar Penuh (TANPA celah samping) */
.section, .section.main-section, section, #main-wrapper, #outer-wrapper, #content-wrapper,
#header-wrapper, #footer-wrapper, .akalpa-view, #akalpa-app-root {
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  float: none !important;
  box-sizing: border-box !important;
}

/* ── Blogger Mobile (?m=1) Responsive Support & Reset ── */
html.mobile, body.mobile, .mobile body, .mobile #akalpa-app-root,
.mobile .section, .mobile section, .mobile .akalpa-view,
body.mobile .section, body.mobile section, body.mobile .akalpa-view {
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  float: none !important;
}

/* Sembunyikan UI mobile bawaan Blogger */
.mobile #navbar-iframe, .mobile-link-button, .mobile-ad-button,
.mobile-index-contents, .mobile-post-outer, .mobile-main-mobile,
#b-placeholder, .widget-type-Blog.mobile {
  display: none !important;
  height: 0 !important;
  visibility: hidden !important;
}

/* Body & html: hanya reset margin/padding bawaan Blogger */
html { margin: 0 !important; padding: 0 !important; width: 100% !important; }
body { margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; width: 100% !important; }

/* Navbar Akalpa: selalu fixed di atas */
#siteHeader {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 1000 !important;
}

/* Subpage (template catalog & curator): navbar selalu solid */
body.on-subpage #siteHeader {
  background: rgba(247, 243, 234, 0.97) !important;
  backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid var(--border) !important;
  box-shadow: var(--shadow-1) !important;
  color: var(--navy) !important;
}
body.on-subpage #siteHeader .brand-name,
body.on-subpage #siteHeader .nav-links a { color: var(--navy) !important; }
body.on-subpage #siteHeader .brand-logo {
  border-color: var(--navy) !important;
  box-shadow: 2px 2px 0 var(--navy) !important;
}

/* Subpage padding atas (karena navbar fixed) */
#view-templates, #view-curator { padding-top: 88px !important; min-height: 90vh; }

/* Link navigasi tanpa garis bawah */
.nav-links a, .mobile-menu a, .footer-col a, .footer-socials a, a.brand {
  text-decoration: none !important;
}

/* ── END Blogger Reset ── */
{css_combined}
  ]]></b:skin>
</head>

<body>

  <!-- Navigasi Mode Tampilan (SPA Router untuk Blogger) -->
  <div id="akalpa-app-root">

    <!-- GLOBAL NAVBAR (Tampil di semua halaman) -->
{header_html}

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

/* SPA Router for Blogger Views (Mobile ?m=1 & Desktop Support) */
(function(){
  function getMobileQuery(){
    return (window.location.search || "").indexOf("m=1") > -1 ? "?m=1" : "";
  }

  function route(){
    var path = (window.location.pathname || "").toLowerCase();
    var search = (window.location.search || "").toLowerCase();
    var hash = (window.location.hash || "").toLowerCase();
    var views = document.querySelectorAll(".akalpa-view");
    views.forEach(function(v){ v.style.display = "none"; });

    var header = document.getElementById("siteHeader");
    document.body.classList.remove("on-subpage");

    var isTemplates = (
      hash === "#templates" ||
      hash === "#free-template" ||
      path.indexOf("/p/free-template") > -1 ||
      path.indexOf("/p/templates") > -1 ||
      search.indexOf("free-template") > -1
    );

    var isCurator = (
      hash === "#curator" ||
      path.indexOf("/p/curator") > -1 ||
      search.indexOf("curator") > -1
    );

    if(isTemplates){
      var vt = document.getElementById("view-templates");
      if(vt) vt.style.display = "block";
      document.body.classList.add("on-subpage");
      if(header) header.classList.add("is-scrolled");
      window.scrollTo(0,0);
    } else if(isCurator){
      var vc = document.getElementById("view-curator");
      if(vc) vc.style.display = "block";
      document.body.classList.add("on-subpage");
      if(header) header.classList.add("is-scrolled");
      window.scrollTo(0,0);
    } else {
      var vh = document.getElementById("view-home");
      if(vh) vh.style.display = "block";
      if(header) {
        if(window.scrollY < 200 && !document.body.classList.contains("hero-dark")) {
          header.classList.remove("is-scrolled");
        }
      }
    }
  }

  document.addEventListener("click", function(e){
    var a = e.target.closest("a");
    if(!a) return;
    var href = a.getAttribute("href");
    if(!href) return;

    var mQuery = getMobileQuery();

    if(href.indexOf("/p/free-template") > -1 || href.indexOf("/p/templates") > -1 || href === "#templates" || href === "templates.html"){
      e.preventDefault();
      if(window.history && window.history.pushState){
        window.history.pushState({view: "templates"}, "", "/p/free-template" + mQuery);
      } else {
        window.location.hash = "#templates";
      }
      route();
    } else if(href.indexOf("/p/curator") > -1 || href === "#curator" || href === "templates-curator.html"){
      e.preventDefault();
      if(window.history && window.history.pushState){
        window.history.pushState({view: "curator"}, "", "/p/curator" + mQuery);
      } else {
        window.location.hash = "#curator";
      }
      route();
    } else if(href === "#hero" || href === "#home" || href === "index.html" || href === "/"){
      if(window.location.pathname !== "/" || window.location.hash){
        e.preventDefault();
        if(window.history && window.history.pushState){
          window.history.pushState({view: "home"}, "", "/" + mQuery);
        } else {
          window.location.hash = "#home";
        }
        route();
      }
    }
  });

  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  window.addEventListener("DOMContentLoaded", route);
  route();
})();
//]]>
</script>

</body>
</html>
"""

def make_html_xml_compliant(html_str):
    """
    Mengonversi HTML agar 100% mematuhi aturan XML Blogger:
    - Void elements (img, input, br, hr, meta, link) harus self-closing (/>)
    - Atribut Boolean (data-scroll, hidden, readonly, dll) harus berkuotasi (attr="true")
    - Karakter & yang belum di-escape menjadi &amp;
    """
    html_str = re.sub(r'<img\b((?:[^"\'>]|"[^"]*"|\'[^\']*\')*?)(?<!/)>', r'<img\1 />', html_str, flags=re.IGNORECASE)
    html_str = re.sub(r'<input\b((?:[^"\'>]|"[^"]*"|\'[^\']*\')*?)(?<!/)>', r'<input\1 />', html_str, flags=re.IGNORECASE)
    html_str = re.sub(r'<br\b((?:[^"\'>]|"[^"]*"|\'[^\']*\')*?)(?<!/)>', r'<br\1 />', html_str, flags=re.IGNORECASE)
    html_str = re.sub(r'<hr\b((?:[^"\'>]|"[^"]*"|\'[^\']*\')*?)(?<!/)>', r'<hr\1 />', html_str, flags=re.IGNORECASE)

    for bool_attr in ['data-scroll', 'hidden', 'readonly', 'disabled', 'checked', 'required', 'autofocus', 'novalidate', 'multiple']:
        html_str = re.sub(r'\s+' + bool_attr + r'(?=[\s/>])', r' ' + bool_attr + r'="true"', html_str)

    html_str = re.sub(r'&(?!(?:[a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)', '&amp;', html_str)
    return html_str

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

    with open(OUT_MAP_GUIDE, 'w', encoding='utf-8') as f:
        f.write("============================================================\n")
        f.write("  AKALPA INOVASI — PANDUAN UPLOAD ASET KE GOOGLE DRIVE\n")
        f.write("============================================================\n\n")
        f.write("Folder Google Drive Tujuan:\n")
        f.write("https://drive.google.com/drive/folders/1Qyq3cRQkZoefM-M8K1Jybry2_GM50gxW?usp=sharing\n\n")
        f.write("Daftar Aset yang Perlu Di-map:\n")
        f.write("------------------------------------------------------------\n")
        for a in sorted(asset_files):
            f.write(f"- {a}\n")

    print(f"✅ Panduan Pemetaan dibuat: {OUT_MAP_GUIDE}")
    return asset_files

def scope_css(css_str, scope):
    """Mengisolasi (scope) seluruh rule CSS agar hanya berlaku di dalam scope ID (misal #view-templates atau #view-curator)."""
    # Hapus deklarasi :root ganda yang bisa merusak token utama
    css_str = re.sub(r':root\s*\{[^}]*\}', '', css_str)

    pattern = re.compile(r'([^{]+)\{([^}]+)\}')

    def scope_selectors(match):
        selectors_raw = match.group(1).strip()
        content = match.group(2).strip()

        if selectors_raw.startswith('@'):
            inner_scoped = pattern.sub(scope_selectors, content)
            return f"{selectors_raw} {{\n{inner_scoped}\n}}"

        selectors = [s.strip() for s in selectors_raw.split(',')]
        scoped_selectors = []

        for sel in selectors:
            if not sel:
                continue
            if sel in ['body', 'html']:
                scoped_selectors.append(scope)
            elif sel.startswith('*'):
                scoped_selectors.append(f"{scope} {sel}")
            elif sel.startswith('@keyframes') or sel.startswith(':root'):
                scoped_selectors.append(sel)
            else:
                scoped_selectors.append(f"{scope} {sel}")

        return f"{', '.join(scoped_selectors)} {{\n  {content}\n}}"

    tokens = re.split(r'(@media[^{]+\{\s*(?:[^{}]*\{[^{}]*\}\s*)*\})', css_str)
    output = []
    for token in tokens:
        if not token.strip():
            continue
        if token.strip().startswith('@media'):
            media_head = token[:token.find('{') + 1]
            media_body = token[token.find('{') + 1 : token.rfind('}')]
            scoped_body = pattern.sub(scope_selectors, media_body)
            output.append(f"{media_head}\n{scoped_body}\n}}")
        else:
            scoped_token = pattern.sub(scope_selectors, token)
            output.append(scoped_token)

    return "\n\n".join(output)

def extract_body_content(html_file):
    """Ekstrak hanya konten di dalam tag <body>."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL|re.IGNORECASE)
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL|re.IGNORECASE)
    
    m = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
    if m:
        body = m.group(1).strip()
    else:
        body = content.strip()
    
    body = re.sub(r'<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*/?>', '', body, flags=re.IGNORECASE)
    body = make_html_xml_compliant(body)
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

    main_css = ""
    if os.path.exists(MAIN_CSS):
        with open(MAIN_CSS, 'r', encoding='utf-8') as f:
            main_css = f.read()

    templates_css = scope_css(extract_styles(TEMPLATES_HTML), "#view-templates")
    curator_css = scope_css(extract_styles(CURATOR_HTML), "#view-curator")
    css_combined = main_css + "\n\n/* ── Scoped Subpage Styles ── */\n" + templates_css + "\n\n" + curator_css

    main_js = ""
    if os.path.exists(MAIN_JS):
        with open(MAIN_JS, 'r', encoding='utf-8') as f:
            main_js = f.read()

    templates_js = extract_scripts(TEMPLATES_HTML)
    curator_js = extract_scripts(CURATOR_HTML)
    js_combined = main_js + "\n" + templates_js + "\n" + curator_js

    index_body = extract_body_content(INDEX_HTML)
    templates_body = extract_body_content(TEMPLATES_HTML)
    curator_body = extract_body_content(CURATOR_HTML)

    # Ekstrak navbar <header id="siteHeader"> dari index_body agar diposisikan secara global
    header_html = ""
    header_match = re.search(r'(<header id="siteHeader".*?</header>)', index_body, re.DOTALL)
    if header_match:
        header_html = header_match.group(1)
        index_body = index_body.replace(header_html, "")

    # Hapus header redundan dari templates_body agar memakai global #siteHeader
    templates_body = re.sub(r'<header[^>]*>.*?</header>', '', templates_body, flags=re.DOTALL)

    # Ganti tag <header> di curator_body menjadi <div class="curator-header"> agar tidak konflik
    curator_body = re.sub(r'<header([^>]*)>', r'<div class="curator-header"\1>', curator_body)
    curator_body = curator_body.replace('</header>', '</div>')

    # Sesuaikan link navigasi internal untuk Blogger SPA hash routing
    header_html = header_html.replace('href="templates.html"', 'href="#templates"')
    header_html = header_html.replace('href="index.html"', 'href="#home"')
    index_body = index_body.replace('href="templates.html"', 'href="#templates"')
    templates_body = templates_body.replace('href="index.html"', 'href="#home"')
    templates_body = templates_body.replace('href="templates.html"', 'href="#templates"')
    curator_body = curator_body.replace('href="templates.html"', 'href="#templates"')

    # Generate XML
    xml_content = BLOGGER_FULL_TEMPLATE
    xml_content = xml_content.replace("{css_combined}", css_combined)
    xml_content = xml_content.replace("{header_html}", header_html)
    xml_content = xml_content.replace("{index_body}", index_body)
    xml_content = xml_content.replace("{templates_body}", templates_body)
    xml_content = xml_content.replace("{curator_body}", curator_body)
    xml_content = xml_content.replace("{js_combined}", js_combined)

    with open(OUT_FULL_THEME, 'w', encoding='utf-8') as f:
        f.write(xml_content)

    size_kb = os.path.getsize(OUT_FULL_THEME) / 1024
    print(f"✅ Full Blogger Theme XML Berhasil Dibuat: {OUT_FULL_THEME} ({size_kb:.1f} KB)")

    print("🔍 Menguji validitas XML...")
    try:
        test_xml = re.sub(r'</?b:[^>]*>', '', xml_content)
        test_xml = re.sub(r'\s+expr:[a-zA-Z-]+=\'[^\']*\'', '', test_xml)
        test_xml = re.sub(r'\s+expr:[a-zA-Z-]+=\"[^\"]*\"', '', test_xml)
        ET.fromstring(test_xml)
        print("🎉 VALIDASI XML 100% SUKSES! Siap di-upload ke Blogger tanpa error SAXParseException.")
    except ET.ParseError as pe:
        print(f"⚠️ Warning XML parsing test: {pe}")

def main():
    print("=" * 65)
    print("  AKALPA INOVASI — TOTAL BLOGGER MIGRATION & ASSET PACKAGER")
    print("=" * 65)

    package_assets()
    build_full_blogger_theme()

    print("\n" + "=" * 65)
    print("✅ PROSES SELESAI!")
    print("=" * 65)

if __name__ == "__main__":
    main()
