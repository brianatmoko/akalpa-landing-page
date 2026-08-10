# Akalpa Landing Page - Full Animation Structure

## 🎬 Section Order (Framer Motion Style)

Website memiliki 3 section utama dengan scroll-based animation:

1. **MotionHero** (Hero Section)
   - Folder: `/frame motion/ezgif-45560c8f299a909c-jpg/`
   - Frames: 50 frames (ezgif-frame-001.jpg - ezgif-frame-050.jpg)
   - Scroll Height: 300vh

2. **Section2** (About)
   - Folder: `/section2/`
   - Frames: 40 frames (ezgif-frame-001.jpg - ezgif-frame-040.jpg)
   - Scroll Height: 250vh

3. **Section3** (Layanan)
   - Folder: `/section3/`
   - Frames: 40 frames (ezgif-frame-001.jpg - ezgif-frame-040.jpg)
   - Scroll Height: 250vh

## 📁 File Structure

```
akalpa-landing-page/
├── frame motion/
│   └── ezgif-45560c8f299a909c-jpg/
│       ├── ezgif-frame-001.jpg (50 frames total)
│       ├── ezgif-frame-002.jpg
│       └── ...
├── section2/
│   ├── ezgif-frame-001.jpg (40 frames total)
│   ├── ezgif-frame-002.jpg
│   └── ...
├── section3/
│   ├── ezgif-frame-001.jpg (40 frames total)
│   ├── ezgif-frame-002.jpg
│   └── ...
└── src/
    └── components/
        ├── MotionHero.jsx (Hero animation)
        ├── AnimatedSection.jsx (Reusable component)
        ├── Section2.jsx (About section)
        └── Section3.jsx (Layanan section)
```

## 🎯 How It Works

### 1. MotionHero (Hero Section)
- **Path**: `/frame motion/ezgif-45560c8f299a909c-jpg/ezgif-frame-{003}.jpg`
- **Component**: `MotionHero.jsx`
- **Features**:
  - 50 frame animation
  - Fixed canvas background
  - Scroll-based playback
  - CTA button after 60% scroll
  - Scroll hint indicator

### 2. Section2 (About)
- **Path**: `/section2/ezgif-frame-{003}.jpg`
- **Component**: `Section2.jsx` → `AnimatedSection.jsx`
- **Features**:
  - 40 frame animation
  - Title: "Bukan Cuma Website, Solusi Bisnis"
  - Subtitle: About Akalpa Inovasi
  - CTA: "Mulai Konsultasi"

### 3. Section3 (Layanan)
- **Path**: `/section3/ezgif-frame-{003}.jpg`
- **Component**: `Section3.jsx` → `AnimatedSection.jsx`
- **Features**:
  - 40 frame animation
  - Title: "Layanan Profesional untuk Bisnis Kamu"
  - Subtitle: About services
  - CTA: "Lihat Layanan"

## 🔄 Animation Flow

```
User scrolls down
    ↓
MotionHero plays (50 frames over 300vh)
    ↓
Section2 plays (40 frames over 250vh)
    ↓
Section3 plays (40 frames over 250vh)
    ↓
End
```

## 🎨 Design System

### Colors:
- Cream: #f5f0e6
- Gold: #e9b824
- Navy: #1b2a3a

### Typography:
- Heading: Outfit (900 weight)
- Body: Plus Jakarta Sans

### Animations:
- Canvas-based frame animation
- Framer Motion for UI elements
- Scroll-based playback

## 🚀 Usage

### Run the website:
```bash
python3 main.py
```

### Add new section:
1. Create folder with frames (ezgif-frame-001.jpg, etc.)
2. Create component using AnimatedSection
3. Add to App.jsx

## 📊 Frame Naming Convention

All frames must follow this pattern:
- `ezgif-frame-001.jpg` (3-digit padding)
- `ezgif-frame-002.jpg`
- ...
- `ezgif-frame-040.jpg` (or 050 for hero)

## ✨ Key Features

1. **Sequential Animation** - Hero → Section2 → Section3
2. **Scroll-Controlled** - User controls animation speed
3. **Smooth Transitions** - 60fps canvas rendering
4. **Reusable Components** - AnimatedSection for any section
5. **Mobile Ready** - Responsive design

## 🎬 Experience

1. Open website → Hero animation starts
2. Scroll down → Hero continues + Section2 appears
3. Continue scroll → Section2 animation plays
4. Continue scroll → Section3 animation plays
5. Each section has CTA button at 60% scroll

Built with React, Vite, Framer Motion, and Canvas API.
