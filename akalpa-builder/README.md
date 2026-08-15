# Akalpa Inovasi — Landing Page (Vanilla)

Website studio **Akalpa Inovasi** (custom website studio) — vanilla HTML/CSS/JS murni,
tema terang elegan **bone + navy + light orange**, dengan aset nyata dari proyek
referensi: **130 frame background** + **12 pose maskot (karakter)**.

## Menjalankan

```bash
cd websites/akalpa-builder
python3 -m http.server 8377
# buka http://127.0.0.1:8377/
```

## Bangun ulang

| Langkah | Perintah |
|---|---|
| Salin frame + kompres maskot + generate ikon | `python3 prep_assets.py` |
| Expand placeholder ikon `{{ic:...}}` → SVG | `python3 build.py` |

`index.html` TIDAK diedit manual — edit `index.src.html`, lalu `python3 build.py`.

## Struktur

```
websites/akalpa-builder/
├── index.src.html        ← sumber halaman (placeholder {{ic:nama}})
├── build.py              ← expand ikon → index.html
├── prep_assets.py        ← salin/kompres aset dari proyek referensi
├── css/main.css          ← design system + semua section
├── js/main.js            ← canvas animation, maskot, interaksi
├── js/icons.js           ← ikon Tabler (di-generate)
└── assets/
    ├── frames/hero3/     ← 40 frame section3 (hero scroll-driven: siang→malam)
    ├── frames/sec2/      ← 40 frame (band "Tentang" + parallax)
    ├── frames/sec3/      ← 40 frame (band CTA)
    ├── github/octocat.svg← mark Octocat (watermark section GitHub)
    └── mascot/*.webp     ← 12 pose maskot (kompres 25MB → 390KB)
```

## Aset

- **Frame background**: diambil dari proyek referensi akalpa-landing-page
  (`frame motion/`, `section2/`, `section3/`) — dipakai HANYA sebagai aset
  background, bukan menyalin struktur situsnya.
- **Maskot**: 12 pose PNG (1024×1536) dari `Downloads/Infografis pose/` —
  dikompres ke WebP 640px. Pemakaian:
  - `sapaan` — hero (menyapa pengunjung)
  - `punya-ide` / `mencatat` / `grafik-naik` — 3 langkah proses
  - `menunjuk` — CTA (menunjuk tombol konsultasi)
  - `bagus` — footer (jempol)

## Hero canvas

Section hero = 320vh scroll story: 50 frame gambar dirender ke `<canvas>`
berdasarkan progress scroll (frame 0 = malam gelap → frame 49 = langit biru).
Teks & maskot muncul di 55% scroll. Preloader menunggu 50 frame siap.
`prefers-reduced-motion` → frame terakhir statis + konten langsung tampil.

## v10 (halaman Free Template + Studio Curator dashboard)

- **Link "Powered by Natifly.com" DIHAPUS dari footer** — tidak ada kerja sama
  dengan Netlify; deploy dilakukan di tempat lain. Footer link diganti
  "Free Template".
- **Tombol hero "Lihat Fokus Kami" → "Free Template"** (href `templates.html`)
  + link nav "Free Template" (desktop, mobile, footer).
- **`templates.html` (halaman publik, terpisah dari landing):** daftar
  template gratis — pencarian **berdasarkan kode/nama/tag** (auto-generated
  `#AKA-###`), chip kategori, kartu dengan **gambar via LINK href (bukan
  upload — disk terbatas)**, lazy-load + fallback gradient bila gagal,
  tombol "Salin Kode" (klipboard), link GitHub, CTA klaim via WhatsApp.
  Data: `templates/templates.json` (fetch).
- **`templates-curator.html` (Studio Curator portal):** gate otentikasi WebCrypto
  SHA-256 (default passcode `akalpa2026`) · form tambah/edit/hapus template
  (kode auto-generated melanjutkan nomor terakhir, kategori, deskripsi,
  gambar URL, link GitHub, tags, featured) · localStorage & sessionStorage aman
  · export **download/copy `templates.json`** + import JSON ter-sanitasi.
  Dilengkapi Honeypot Trap (`honeypot.html`) & Cloudflare Security Headers (`_headers`, `_redirects`).
- Verifikasi CDP: 4 kartu render, cari "AKA-002" → 1 hasil, chip kategori
  (Section → 3, Hero → 1), salin kode & link GitHub jalan, curator portal
  (gate salah ditolak / benar masuk, tambah → count +1, auto-code lanjut
  #AKA-002, localStorage tersimpan), 0 error & 0 overflow di semua ukuran.

## v9 (pose keren + sistem layout v2 semua section)

- **Pose hero diganti**: `senang` → **`keren`** (pose cool, bbox x 106–370 / y 50–564).
- **Plan besar layout semua section** — dokumen `LAYOUT-SISTEM.md` (breakpoint
  MOBILE ≤768 / TABLET 769–1100 / DESKTOP ≥1101 + peta layout per section):
  - **Container**: gutter responsif 20px / 24px / 32px.
  - **Section-head**: margin responsif (34/44/52px) + varian `.left` dgn sub
    tidak auto-center.
  - **Tentang**: flex → **grid `minmax(0,1fr) auto`** — maskot `align-self:end`
    rata-bawah di kanan (desktop/tablet), stacked pusat di mobile.
  - **GitHub stats**: flex → **panel grid 4 kolom** dengan pembatas vertikal
    (desktop), 2×2 tanpa panel di tablet/mobile.
  - **FAQ**: section-head **sticky** (≥901px) — tetap terlihat saat daftar
    discroll.
  - **Footer**: maskot disembunyikan di mobile agar tidak menutupi teks.
- Verifikasi CDP 1440/1024/390: pose keren (720/360/190px), about grid
  `784px 276px` (maskot end), gh-stats 4/2/2 kolom (pembatas 0/1/1/1px),
  faq sticky (desktop) vs static (mobile), footer-mascot tampil ≥769 &
  tersembunyi ≤768, container 32/24/20px, 0 overlap, 0 overflow, 0 error.

## v8 (hero grid responsif v2 + pose senang)

- **Pose hero diganti**: `sapaan` (melambai) → **`senang`** (tersenyum) — pose
  baru mengisi bidang lebih lebar (bbox x 16–413 vs 32–381) sehingga terbaca
  saat besar.
- **Aksen "Benar-Benar Ngomong" kembali kuning** (bukan putih) — hanya bagian
  dasar judul yang putih; aksen `em` memakai `--yellow` (verifikasi:
  base `rgb(255,255,255)`, em `rgb(246,201,111)`).
- **Sistem GRID RESPONSIF V2 (hero, terkunci per perangkat)** — layout paten
  per breakpoint, tidak mengikuti aliran antar perangkat:
  | Perangkat | Layout | Maskot |
  |---|---|---|
  | DESKTOP (≥1101px) | 2 kolom `"text mascot"`, teks rata-kiri | **BESAR `min(88vh,720px)`** — mengisi sisi kanan penuh (desktop tidak lagi banyak kosong) |
  | TABLET (769–1100) | 2 kolom `"text mascot"`, teks rata-kiri | sedang `min(50vh,360px)` |
  | MOBILE (≤768px) | stacked `"text" "mascot"`, teks pusat | kecil `min(26vh,190px)` di bawah teks |
  - Grid didefinisikan via `grid-template-areas` + `grid-template-columns`
    per breakpoint (bukan absolute positioning) — setiap perangkat punya
    kolom/ukuran/perataan sendiri.
  - Layar pendek (≤768px & ≤720px tinggi): skala judul/sub/pills + maskot
    lebih kecil agar stacked layout tidak terpotong; `padding-bottom`
    menyisakan ruang scroll-hint (tanpa tabrakan maskot↔hint).
- Verifikasi CDP 5 ukuran (1440/1024/820/768/390): `gridTemplateAreas`
  benar per breakpoint, overlap maskot↔konten = 0, overlap maskot↔scroll-hint
  = 0, 0 horizontal overflow.

## v7 (pose maskot besar + judul hero putih)

- **Judul hero "Automasi AI & Website yang Benar-Benar Ngomong" → putih polos**
  (termasuk bagian `em`; sebelumnya cream + aksen kuning — navy fase gelap
  terlalu gelap untuk aksen). Verifikasi: `rgb(255,255,255)` di computed style.
- **Maskot diperbesar di semua ukuran** agar pose terlihat:
  | Maskot | Sebelum | Sesudah |
  |---|---|---|
  | Hero (sapaan) | 120–280px / mobile 100px | 170–430px (40vh) / tablet ≤300 / mobile ≤165 |
  | Tentang (menunjuk) | 180–280px / tablet 160 | 230–440px (46vh) / tablet 235 |
  | Footer (bagus) | 150 / tablet 110 | 230 / tablet 175 |
- **Rim light kuning hangat** (drop-shadow glow): karakter berbaju navy tidak
  tenggelam di latar gelap (hero siang→malam, band tentang, footer) —
  terverifikasi piksel: 1183 px glow hangat di area maskot vs 23 px di kontrol.
- **Anti-tabrakan mobile**: di ≤480 konten hero naik (-7vh) + maskot
  proporsional vh (21vh) sehingga tidak menabrak baris pills produk;
  layar pendek (≤740px tinggi) skala judul/sub/pills diperkecil.
  Terverifikasi di 390×844 / 390×740 / 390×667 / 414×896 / 768×1024 /
  1440×900: overlap 0 semuanya.

## v6 (section masuk/keluar + hapus label)

- **Label eyebrow dihapus** (permintaan user: "terlalu freak"): Startup Teknologi
  · Yogyakarta (hero + brand-sub nav/footer), Mengapa Akalpa, Fokus Kami,
  Tentang Akalpa, Open Source, Kata Mereka, FAQ — heading section langsung
  tanpa pre-label. Style CSS `.eyebrow`/`.eyebrow-dot` ikut dibersihkan.
- **Animasi masuk & keluar per section** (`.sec-anim`): konten section dibungkus
  `.sec-inner` yang fade + slide (masuk translateY 36px→0, keluar → -24px) saat
  section masuk/keluar viewport (IntersectionObserver, threshold 6%).
- **Object masuk berurutan**: setiap `.reveal`/`.reveal-l`/`.reveal-scale` di
  dalam section masuk dengan stagger (90ms + 65ms × indeks) setelah section
  tampil; saat keluar semua ikut fade-out. Masuk lagi → animasi diulang.
- **Wave TIDAK ikut animasi** (`.sec-anim .wave-wrap { transition: none }` dan
  wave berada di luar `.sec-inner`) → tidak ada celah terpotong di perbatasan.
  Dekorasi absolut (deco-circle, octocat, contribution graph, about-bg/scrim,
  footer-mascot) juga statis.
- Hero (canvas scroll-story) & interaksinya tidak tersentuh.

## Verifikasi

- Chrome CDP: 0 error konsol, semua section ada, maskot ter-render,
  0 horizontal overflow di 1440/768/390 px.
- Interaksi: menu mobile, carousel testimoni, FAQ accordion, countup statistik.

## v2 (perbaikan profesional)

- **Section dipangkas** (sesuai permintaan user): Layanan, Proses, CTA/Kontak
  dan milestone rail dihapus → fokus: Hero → Tech → Stats → Tentang →
  Testimoni → FAQ → Footer.
- **Hero diganti frame section3** (40 frame: siang cerah → senja → malam dengan
  bulan): teks & maskot muncul di fase gelap (p≥0.6), nav/scrim beralih otomatis
  (`body.hero-dark`) di p≥0.45. Nav 3 state: navy atas frame terang → cream atas
  frame gelap → solid bone setelah hero.
- **Parallax di section lain**: band Tentang (bg bergerak) + lingkaran dekoratif
  stats & testimoni via `[data-parallax="kecepatan"]`.
- **Anti-AI-slop** (riset komunitas: 7 dimensi AI slop, pedoman Vercel,
  925Studios): `text-wrap: balance` pada heading, easing kustom
  `cubic-bezier(0.22,1,0.36,1)` + spring, durasi bervariasi per properti,
  reveal bervariasi (fade-up / fade-left / scale), padding section bervariasi,
  `tabular-nums` pada statistik, micro-interaction tombol (ikon geser + pulse),
  `…` bukan `...`, `touch-action: manipulation`, `meta theme-color`.
- Skill komunitas baru terinstall: `vercel-labs/agent-skills@web-design-guidelines`.

## v5 (shape full-bg + wave divider + redesign GitHub)

- **Shape = background tambahan SELURUH hero** (bukan panel area teks): saat
  headline tampil, `.hero-scrim` full-cover gradasi navy (≈45%) menggelapkan
  seluruh canvas — bukan hanya belakang teks. Panel `::before` di area teks
  dihapus.
- **Palet fase gelap diperbaiki** (hindari navy di atas gelap): tombol CTA
  hero beralih dari navy → **orange terang** (`#f2a35c`) dengan teks navy,
  badge brand → orange, ghost button border lebih terang. Tulisan kini kontras
  jelas di atas latar gelap.
- **Section Fokus diberi padding-bottom 104px** agar tidak menempel ke band
  Tentang.
- **Wave divider SVG dengan BENTUK BERBEDA-BEDA per perbatasan** (sesuai
  permintaan user), dipasang dengan **teknik standar yang benar** (riset:
  tailwindcolor.tools Section Divider Generator + pola Website-PKKMB-FV-UNY):
  1. Wave `position: absolute; bottom: 0` **di dalam section ATAS**.
  2. **fill SVG = warna section BAWAH** → menyatu mulus tanpa seam.
  3. Bagian transparan di atas kurva menampilkan warna section ATAS → bentuk
     wave (kontras 2 warna) terlihat hidup di perbatasan.
  4. Khusus wave → band Tentang (gambar): scrim atas dibuat zona solid
     navy-deep (±66px) agar wave menyatu ke gambar dengan mulus.
  6 wave dengan 6 bentuk SVG berbeda (semua path unik):
  - strip→stats: gelombang klasik 2 punuk asimetris (bone)
  - stats→fokus: simetris 4 punuk rata (bg-2, fokus kini bg-2)
  - fokus→tentang: lembah tunggal dalam (navy-deep)
  - github→testimoni: zigzag tajam (bone)
  - testimoni→faq: kerang/scallop halus (bg-2)
  - faq→footer: sapuan naik ke kanan (navy)
  Wave tentang→github DIHAPUS (sesuai permintaan user). Contribution graph
  GitHub dinaikkan ke bottom 96px agar tidak tertutup wave.
- **Redesign section GitHub**: background gradasi navy + radial glow halus,
  strip terminal `$ git clone https://github.com/akalpainovasi` dengan kursor
  berkedip, kartu repo lebih rapi (nama `@repo` + badge Public hijau + meta
  dengan pembatas), baris statistik (12+ repo · 500+ star · 30+ kontributor ·
  80+ PR).

## v4 (scrim hero + section GitHub Open Source)

- **Scrim gelap 45% saat headline tampil** — `body.hero-text` mengaktifkan
  `.hero-scrim` (rgba navy 45% full-cover) + shape panel rounded + blur di
  belakang konten hero (`::before`), sehingga headline *"Automasi AI &
  Website yang Benar-Benar Ngomong"* selalu terbaca jelas di atas canvas
  siang→malam (p≥0.6, sinkron dengan teks/maskot).
- **Section `#github` (Open Source)** — band navy-deep yang mencolok dengan
  watermark Octocat (SVG official, di-download dari Wikimedia), contribution
  graph 4×15 sel (pola deterministik via JS), 4 kartu repo (hermes, openclaw,
  moko-ai, akalpa-web-builder) dengan bahasa + star + fork, CTA tombol
  slide-arrow ala Uiverse "Jelajahi Semua Repo" + "Follow @akalpainovasi" →
  semuanya mengarah ke **github.com/akalpainovasi** (tujuan utama mayoritas
  pengunjung landing page).
- **Polish section lain**: ikon pada 4 kartu statistik, nomor 01–04 pada kartu
  fokus + link "Lihat Repo", nav & footer + link **Open Source** (#github),
  marquee + Open Source/GitHub.
- **Manfaat aset open-source**: CTA slide-arrow diadaptasi dari pustaka Uiverse
  (content/uiverse), struktur CTA 2-kolom terinspirasi HyperUI
  (content/hyperui), mark Octocat dari brand resmi GitHub (Wikimedia).

## v3 (konten penuh — identitas asli Akalpa Inovasi)

- **Hero = frame section3** (konfirmasi user: ganti `ezgif-45560c8f299a909c-jpg` →
  `akalpa-landing-page/section3`). 40 frame siang → malam + pills produk
  (Hermes · OpenClaw · Moko AI).
- **Identitas perusahaan**: startup teknologi dari **Yogyakarta** (sejak 2024),
  fokus **automasi AI** (Hermes, OpenClaw, Moko AI) + **web design kustom**
  dengan **Akalpa Web Builder** (alat buatan sendiri).
- **Section baru `#fokus`**: 4 kartu bergaya terminal (header dot + nama file
  mono) — Hermes, OpenClaw, Moko AI, Web Design Kustom.
- **Isi diperkaya**: stats + intro & note, Tentang 2 paragraf + chips
  (Automasi AI · Web Design · Yogyakarta), testimoni 4 slide dengan kota klien,
  FAQ 7 item (termasuk Hermes/OpenClaw/Moko AI/lokasi), footer kontak lengkap
  (WhatsApp +62 851-9124-0994, email, @akalpa.inovasi, Yogyakarta, Natifly,
  "Hand-crafted dengan Akalpa Web Builder").
