# LAYOUT-SISTEM.md — Plan Besar Penyusun Layout (Desktop · Tablet · Mobile)

> Sistem tata letak terpadu seluruh section situs Akalpa Inovasi.
> Setiap perangkat punya **layout paten (terkunci)** — tidak ada elemen yang
> "mengikuti aliran" antar perangkat. Sistem ini adalah cikal bakal
> **Sistem Responsif v2** yang akan menjadi fitur Akalpa Web Builder.

---

## 1. Breakpoint (Satu Sumber Kebenaran)

| Tier | Rentang | Nama |
|---|---|---|
| **MOBILE** | ≤ 768px | ponsel potret / iPad potret |
| **TABLET** | 769 – 1100px | iPad lanskap / tablet kecil |
| **DESKTOP** | ≥ 1101px | layar lebar |

Aturan keras: setiap media query di CSS **hanya memakai breakpoint ini**.
Tidak ada breakpoint liar di tengah-tengah.

## 2. Token Layout

| Token | Mobile | Tablet | Desktop |
|---|---|---|---|
| Gutter `.container` | 20px | 24px | 32px |
| Jarak antar kartu | 14px | 18px | 20–22px |
| Margin `.section-head` | 34px | 44px | 52px |
| Grid hero (v2) | 1 kolom stacked | 2 kolom `text mascot` | 2 kolom `text mascot` |

## 3. Peta Layout per Section

| Section | DESKTOP (≥1101) | TABLET (769–1100) | MOBILE (≤768) |
|---|---|---|---|
| **Hero** | grid `"text mascot"` — teks kiri, **maskot besar** `min(88vh,720px)` kanan | grid `"text mascot"` — teks kiri, maskot sedang `min(50vh,360px)` | stacked `"text" "mascot"` — teks pusat, maskot kecil `min(26vh,190px)` bawah |
| **Tech strip** | marquee 1 baris (sama semua tier) | marquee | marquee (padding lebih kecil) |
| **Stats** | grid 4 kolom | grid 2×2 | grid 2×2 |
| **Fokus** | grid 4 kolom | grid 2×2 | grid 1 kolom |
| **Tentang** | grid `minmax(0,1fr) auto` — kartu kiri, **maskot rata-bawah** kanan | grid 2 kolom (maskot lebih kecil) | stacked pusat — kartu, lalu maskot |
| **GitHub** | head pusat + terminal + **repo 4 kolom** + **stats panel 4 kolom (bergaris)** + CTA | terminal + repo 2×2 + stats 2×2 | terminal (scroll) + repo 1 kolom + stats 2×2 |
| **Testimoni** | carousel ≤760px pusat | carousel | carousel full-lebar |
| **FAQ** | grid `0.85fr 1.15fr` — **head sticky** kiri + daftar kanan | 1 kolom (≤900) | 1 kolom |
| **Footer** | grid 3 kolom `1.5fr 1fr 1.2fr` + maskot kanan | 2 kolom | 1 kolom (maskot disembunyikan) |

## 4. Prinsip

1. **Grid, bukan absolute** — posisi disusun via `grid-template-areas` /
   `grid-template-columns` per breakpoint; absolute hanya untuk dekorasi
   (wave, deco-circle, watermark).
2. **Maskot = aset layout** — ukurannya ditetapkan per tier (besar/sedang/
   kecil), bukan proporsional mengikuti konten.
3. **Wave tidak ikut animasi** — dekorasi statis agar tidak ada celah
   terpotong di perbatasan (lihat v6).
4. **Section masuk dulu, object menyusul** — animasi section (`.sec-inner`)
   lalu reveal berurutan (stagger 90ms + 65ms × indeks).

## 5. Implementasi Referensi

- Hero: blok **HERO — GRID RESPONSIF V2** di `css/main.css` (pola baku:
  `grid-template-areas` + `grid-template-columns` + `min()` untuk ukuran
  maskot per tier).
- Section lain: `css/main.css` bagian RESPONSIVE (breakpoint 1100/768/640/480
  konsisten dengan tabel di atas).
