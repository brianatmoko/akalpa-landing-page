# Section 2 - About Section

## Deskripsi
Section 2 telah dibuat dengan desain yang simple, natural, dan rapi — serupa dengan hero section.

## Fitur Utama

### 1. **Desain Minimalis & Bersih**
- Background cream (#f5f0e6) dengan pattern dot halus
- Accent warna navy dan gold yang konsisten dengan hero section
- Layout grid 2 kolom (responsive ke 1 kolom di mobile)
- Tidak ada komponen yang berlebihan

### 2. **Konten yang Relevan**
- **Bagian Kiri:**
  - Label "Tentang Kami" dengan badge gold
  - Heading dengan gradient gold
  - Deskripsi singkat tentang Akalpa
  - 4 poin keunggulan dengan icon checklist
  - CTA button "Mulai Konsultasi"

- **Bagian Kanan:**
  - Card statistik dengan 4 metrik (20+ Project, 100% Klien Puas, <14 Hari, ∞ Revisi)
  - Gold circle decoration
  - Floating badge animasi "Berkualitas & Terpercaya"

- **Bagian Bawah:**
  - Divider line dengan label "Mengapa Memilih Kami"
  - 3 kolom cards: Desain Kustom, Performa Maksimal, Dukungan Berkelanjutan

### 3. **Animasi Halus**
- Fade up animation saat scroll (menggunakan Framer Motion)
- Stagger animation untuk children elements
- Hover effect pada cards dan buttons
- Floating badge dengan animasi naik-turun

### 4. **Responsive Design**
- Desktop: Grid 2 kolom
- Mobile (< 900px): Stack menjadi 1 kolom
- Semua elemen menyesuaikan layar dengan baik

## File yang Diubah

### Dibuat:
- `src/components/Section2.jsx` - Komponen section 2 baru

### Diubah:
- `src/App.jsx` - Menambahkan import dan render Section2
- `src/index.css` - Menambahkan responsive style untuk `.section2-grid`

## Struktur Komponen

```
Section2/
├── Tentang Kami (Left)
│   ├── Badge Label
│   ├── Heading dengan Gradient
│   ├── Description
│   ├── Feature List (4 items)
│   └── CTA Button
├── Visual Card (Right)
│   ├── Stats Grid (4 cards)
│   ├── Gold Circle Decoration
│   └── Floating Badge
└── Why Choose Us (Bottom)
    └── 3 Feature Cards
```

## Konsistensi dengan Hero Section
- ✅ Warna palette yang sama (cream, navy, gold)
- ✅ Typography yang sama (Outfit + Plus Jakarta Sans)
- ✅ Border style dengan box-shadow
- ✅ Animasi Framer Motion yang serupa
- ✅ Pattern dot background
- ✅ Responsive breakpoints yang konsisten

## Cara Menggunakan

Section 2 otomatis muncul di antara HeroSection dan SocialMediaSection. Untuk mengubah konten:

1. Edit teks langsung di `src/components/Section2.jsx`
2. Ganti data statistik di bagian stats array
3. Modify feature list sesuai kebutuhan

## Build Status
✅ Build berhasil
✅ Dev server running di http://localhost:5173
✅ Tidak ada error atau warning
