# Full Animation Website - Akalpa Landing Page

## 🎬 Overview
Website telah diubah menjadi FULL ANIMASI dengan scroll-based frame animation seperti MotionHero.

## 📁 Structure

### Components:
1. **MotionHero** - Hero section dengan animasi frame (section 1)
2. **Section2** - About section dengan animasi frame dari folder `section2/`
3. **Section3** - Layanan section dengan animasi frame dari folder `section3/`

### Removed Components:
- ❌ HeroSection (static content)
- ❌ SocialMediaSection
- ❌ Footer

## 🎨 Animation System

### AnimatedSection Component
Komponen reusable yang digunakan untuk Section 2 dan 3:

```javascript
<AnimatedSection
  folderPath="section2"      // Folder containing ezgif-frame-*.jpg
  sectionId="section2"       // HTML ID untuk navigation
  title="..."                // Judul section
  subtitle="..."             // Subtitle/deskripsi
  ctaText="..."              // Tombol CTA text
  accentColor="gold"         // Warna aksen (optional)
/>
```

### How It Works:
1. **Preloads** semua frame images (40 frames per section)
2. **Canvas rendering** dengan smooth scaling
3. **Scroll-based animation** - scroll menentukan frame yang ditampilkan
4. **Fixed canvas** - animasi tetap terlihat saat scroll
5. **Overlay gradient** - untuk readability text

### Animation Features:
- ✅ 40 frame animation per section
- ✅ Scroll-controlled playback
- ✅ Fixed canvas background
- ✅ Fade in/out CTA button
- ✅ Scroll hint indicator
- ✅ Smooth transitions

## 📂 Frame Files

### Section 2 (About):
- Location: `/section2/ezgif-frame-001.jpg` sampai `ezgif-frame-040.jpg`
- Total: 40 frames

### Section 3 (Layanan):
- Location: `/section3/ezgif-frame-001.jpg` sampai `ezgif-frame-040.jpg`
- Total: 40 frames

## 🎯 Navigation

### Desktop:
- Home (logo) → Scroll ke MotionHero
- Tentang → #section2
- Layanan → #section3
- Konsultasi Gratis → WhatsApp

### Mobile:
- Hamburger menu dengan link yang sama

## 🚀 How to Run

```bash
python3 main.py
```

### Yang Akan Terjadi:
1. Dev server start di port 5173
2. Chrome auto-open ke localhost:5173
3. Scroll untuk melihat animasi section 2 dan 3
4. CTA muncul setelah 60% scroll di setiap section

## 📱 Responsive

### Desktop (> 900px):
- Full animation experience
- Fixed canvas background
- Overlay text dengan gradient

### Mobile (< 900px):
- Animation tetap berjalan
- Text tetap terlihat dengan overlay
- Hamburger menu untuk navigation

## 🎨 Design System

### Colors:
- Background: var(--cream) #f5f0e6
- Primary: var(--gold) #e9b824
- Text: var(--navy) #1b2a3a

### Typography:
- Heading: Outfit (900 weight)
- Body: Plus Jakarta Sans

### Animations:
- Framer Motion untuk UI elements
- Canvas-based untuk frame animation
- CSS keyframes untuk scroll indicator

## 📊 Performance

### Optimization:
- Frame preloading dengan error handling
- requestAnimationFrame untuk smooth rendering
- Passive scroll listeners
- Image smoothing quality set to 'high'

### File Size:
- Each frame: ~20-50KB
- Total per section: ~1-2MB (preloaded)
- Build time: ~215ms

## 🔧 Technical Details

### Scroll Height:
- MotionHero: 300vh (original)
- Section2: 250vh
- Section3: 250vh

### Frame Calculation:
```javascript
progress = scrolled / sectionHeight
frameIndex = Math.floor(progress * totalFrames)
```

### Canvas Sizing:
- Cover mode (scale to fill)
- Center aligned
- High quality smoothing

## ✨ Key Features

1. **Full Scroll Animation** - Tidak ada static section
2. **Reusable Component** - AnimatedSection bisa dipakai untuk section lain
3. **Smooth Performance** - optimized rendering
4. **Consistent Design** - Same design system throughout
5. **Mobile Ready** - Responsive di semua ukuran layar

## 🎬 User Experience

1. User buka website → MotionHero animation plays
2. Scroll down → Section 2 animation plays (About)
3. Continue scroll → Section 3 animation plays (Layanan)
4. CTA button muncul di setiap section setelah 60% scroll
5. Click CTA → Opens WhatsApp

## 📝 Notes

- Pastikan folder `section2/` dan `section3/` ada di root project
- Frame files harus bernama `ezgif-frame-001.jpg` sampai `ezgif-frame-040.jpg`
- Untuk menambah section baru, cukup tambah folder dengan frame dan gunakan AnimatedSection component

## 🎉 Result

Website FULL ANIMASI yang smooth, modern, dan engaging!

Built with:
- React + Vite
- Framer Motion
- Canvas API
- Scroll-based animation
