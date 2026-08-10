# Akalpa Motion & Environment — Research & Design System

Gabungan 2D (PNG berlapis, parallax) + 3D (Three.js) + Framer Motion.
Tagline animasi: **"Serius tapi menyenangkan, profesional tapi tidak kaku."**

---

## 1. Riset: Motion di Landing Page (2026)

### Tren utama (dari web design trends 2026)
1. **Illustrated Worlds** (trend #10) — doodle, kartun, ilustrasi tangan sebagai *seluruh* visual system. Paling pas dengan maskot alpaka.
2. **3D dalam konteks flat** — "depth tanpa full 3D scene". **Ini kunci gabungan 2D+3D kita**: lapis 3D di belakang, ilustrasi 2D di depan.
3. **Scroll-driven storytelling** — setiap section adalah "bab"; parallax lapis bergerak beda kecepatan memberi kedalaman.
4. **Motion sebagai identitas brand** — animasi menjadi "tanda tangan" merek (konsisten di semua section).
5. **Micro-interaction** — hover CTA, tombol, icon memantul — kecil, halus, tidak menyaingi.

### Pola framer-motion yang terbukti
| Pola | Kapan | Parameter |
|---|---|---|
| `whileInView` fade-up | Reveal teks/kartu | `amount: 0.3`, `once: true` |
| `staggerChildren` | grid layanan/sosmed | delay 0.08–0.12 |
| `useScroll` + `useTransform` | parallax layer per halaman | petakan progress 0–1 |
| `spring` | tombol/CTA | stiffness ~300, damping ~26 |
| `AnimatePresence` | transisi konten dinamis | — |
| `useReducedMotion` | aksesibilitas | nonaktifkan loop tanpa batas |

### Referensi GitHub yang dipelajari
- `AtlasNexusTech/framer-motion-ui` — page transition, scroll, parallax, gesture.
- `thedotmack/framer-motion-animations` — 97 pola (entrance, attention, specials).
- `olivierlarose/smooth-parallax-scroll` — parallax halus + Lenis + Framer.
- `vikash0064/ochi.studio` — studio modern dengan Framer + Tailwind.
- `motion.dev` — pustaka resmi (evolusi framer-motion).

### Prinsip performa
- Animasikan **hanya `transform` dan `opacity`** (jalan di kompositor).
- Antarmuka pointer-events none utk lapis dekoratif agar CTA tetap bisa diklik.
- `dpr [1, 1.5]` utk WebGL; lazy-load chunk 3D.
- Hormati `prefers-reduced-motion`.

---

## 2. Riset: Si Alpaka (Vicugna pacos)

### Habitat
- **Pegunungan Andes, Altiplano** — Peru (±80% populasi dunia), Bolivia, Chile, Ekuador, Argentina.
- Ketinggian **3.500–5.000 m dpl** (zona **Puna** — padang rumput tinggi, treeless di dataran).
- Iklim ekstrem: kering, berangin, **suhu bisa bervariasi ~40°C** dalam sehari.
- Bukan liar — hewan ternak; leluhurnya **Vicuña** (kerabat liar dengan bulu halus).

### Makanan
- Rumput **Ichu** (rumput khas Puna), rumput puna, semak, herbal, lumut.
- Di peternakan: rumput (orchard/timothy), alfalfa hay, pellet. Air segar selalu ada.
- Kaki bantalan lembut → **merumput tanpa merusak tanah** (sadar iklim).

### Pohon khas kawasan tempat tinggalnya
| Nama | Fakta | Bentuk visual |
|---|---|---|
| **Queñua / Polylepis** | Pohon **tertinggi di dunia** (sampai 5.000 m). Kulit berlapis tipis kemerahan terkelupas. | Batang bengkok-bengkok, "hutan terpesona" |
| **Eucalyptus** | Dibawa Kolonial, sekarang jadi ikon lanskap Andes tinggi. | Rumpun daun menjuntai ke bawah |
| **Molle / Schinus molle** | Lada Peru, asli Andes kering. | Kanopi bulat, ranting terkulai |
| **Caktus San Pedro** | kaktus kolumna khas Puna | siluet tegak runcing |

### Implikasi desain
- **Warna dunia alpaca**: krem matahari pagi, emas matahari tinggi, navy bayangan pegunungan, dusti hijau-sage rumput ichu.
- **Elemen 2D yang pernah kamu buat**: pegunungan berlapis (parallax), queñua batang bengkok, eukaliptus, rumput ichu, awan, matahari, condor Andes, kaktus.
- Story hero: *"Selamat datang di pegunungan tinggi — di sini kami pelihara ide-ide kamu jadi website."*

---

## 3. Arsitektur Layer 2D + 3D (Hero)

Urutan dari paling belakang ke paling depan di kolom visual hero:

```
Z-INDEX
   0   ██ 3D canvas (three.js bubble: partikel emas, torus, bentuk, GLB alpaca?)
   5   ▁▁ Layer paralaks 2D jauh: matahari, awan, gunung-jauh
   6   ▁▁ Layer 2D tengah: gunung-dekat, queñua, mole, kaktus
   7   ▁▁ Layer 2D dekat: rumput-ichu, foreground (parallax terbesar)
   8   ▔▔ Label UI mengambang (badge "React+Vite", "Fast & SEO")
   9   ██ Maskot 2D PNG (sapaan.png) — karakter utama
  10   ██ Konten: headline, CTA, stats (kiri) — & overlay apa pun
```

- Parallax scroll: gunung jauh gerak pelan (`transform` 0.15x), foreground lebih cepat (0.6x).
- Loop idle: awan drift, matahari pulse lembut, queued sway, rumput wave, maskot float.
- Mouse parallax: seluruh kiri visual miring ±2° mengikuti kursor (sambung dengan rig three.js).

---

## 4. Manifes Aset 2D (folder `public/scene/`)

Buat PNG transparan (backgroundless), lebar canvas ~2000px, gaya silhouette/warna selaras.

| File | Tema | Ukuran (%) | Parallax | Animasi |
|---|---|---|---|---|
| `sun-gold.png` | Matahari emas | 16% | 0.10 | sway lambat + glow |
| `cloud-far.png` | awan cream | 20% | 0.12 | drift kiri-kanan 30s |
| `cloud-near.png` | awan lebih besar | 26% | 0.22 | drift berlawanan |
| `mountain-far.png` | navy transparan 8% | 110% | 0.18 | statik |
| `mountain-mid.png` | navy 18% | 120% | 0.30 | statik |
|`queuna-1.png` | queñua bengkok | 26% | 0.42 | sway lembut |
| `queuna-2.png` | pasangan pohon | 34% | 0.52 | sway |
| `cactus-silueste.png` | kaktus San Pedro | 14% | 0.35 | — |
| `grass-ichu.png` | rumput ichu latar bawah | 40% | 0.62 | wave denting |
| `grass-edge.png` | foreground rumput | 55% | 0.75 | sway |
| `condor.png` | burung Andes | 8% | 0.55 | drift melayang |
|`star-gold.png` | bintang dekor | 12% | 0.10 | twinkle |

*Jika file belum ada, lapisan dilewati otomatis (graceful), jadi tidak rusak.*

---

## 5. Resep animasi per-elemen (framer-motion)

```js
// drift (awan/condor): loop x-luar
animate={{ x: [-40, 40, -40] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}

// sway (pohon): rotasi sumbuZ kecil
animate={{ rotate: [-1.2, 1.2, -1.2] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}

// wave (rumput): transformOrigin bottom
animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}

// parallax scroll → y = useTransform(scrollYProgress, [0,1], [0, -depth*120])

// entrance → whileInView fadeUp + scale, viewport once
```

### Transisi & buffer
- `type: 'spring'` untuk elemen baru hero/CTA; `ease: [0.22,1,0.36,1]` untuk reveal.
- Durasi default 0.55–0.7s; jangan pernah >1.2s.
- `amount: 0.2` sudah cukup untuk memicu reveal.