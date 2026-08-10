# Aset 3D Landing Page Akalpa — Panduan & Prompt Generator

Semua aset harus dalam format **GLB (glTF 2.0 Binary)** dan ditaruh di folder **`public/models/`**.
Landing page otomatis mendeteksi file yang ada — kalau file tidak ada, adegan 3D tetap jalan tanpa error.

---

## A. ASET UTAMA (WAJIB): Maskot Alpaka "Akalpa"

| | |
|---|---|
| **Lokasi final** | `public/models/alpaca.glb` |
| **Peran** | Maskot 3D di tengah hero — melayang lembut, paralaks ikut kursor, dengan bayangan sentuh |
| **Skala target** | Tinggi model ±2.0 unit dunia, telapak kaki di `y = 0` |
| **Budget** | 10.000–30.000 segitiga, file < 3 MB |

### A1. Prompt TEKS-ke-3D (tempel apa adanya ke Meshy / Tripo / Luma Genie / Rolldream)

> An adorable cute alpaca 3D mascot character for a website brand, full body, standing upright.
> Chibi cartoon style with round soft proportions, oversized head, big expressive dark-brown eyes
> with tiny white shine dots, small smiling mouth, pink blush on cheeks, small upright pointed
> ears, fluffy wool all over the body like a soft cloud (slightly wavy cotton texture, no long
> fur strands). Body color warm cream #F5F0E6, belly/chest and face fluff slightly lighter snow
> white. Wearing a small knitted gold scarf (#E9B824) around the neck as the only accessory,
> with tiny cream tassels. One front hoof raised up waving "hello" toward the viewer, the other
> front hoof resting relaxed at the side. Two short stubby legs, tiny fluffy tail.
> Friendly warm expression, looking straight at camera.
> Clean low-poly stylized game-ready model: smooth rounded shapes, matte felt-plush finish,
> no harsh edges, no z-fighting.
> Single character ONLY — absolutely no background, no ground, no floor shadow, no text, no
> watermark, no props, no other objects. Character centered, facing the camera.
> UV unwrapped with one 1024x1024 base color texture (albedo only, flat neutral lighting,
> NO baked shadows, NO baked lighting, NO baked ambient occlusion).

**Negative prompt:** background, ground, floor, shadow plane, text, logo, watermark, extra props,
realistic fur, long hair, human features, extra limbs, tentacles, low quality, artifacts,
z-fighting, overlapping meshes, non-uniform scale.

### A2. Prompt IMAGE-ke-3D (REKOMENDASI — hasil paling mirip brand)

Gunakan gambar acuan: **`public/mascot/sapaan.png`** (pose alpaka menyapa sudah pas).

> Recreate this exact cute alpaca character as an adorable 3D mascot. Keep the same pose,
> body proportions, fur color warm cream (#F5F0E6), and the same friendly waving expression.
> Chibi cartoon style, soft plush-felt material, smooth rounded shapes, game-ready low-poly.
> Single character, centered, facing forward, no background, no ground, no text, no extra
> props. UV unwrapped, 1024px albedo base color only, no baked lighting or shadows.

Kalau generator memberi glTF (folder + beberapa file), konversi ke GLB:
`npx gltf-transform optimize model.gltf alpaca.glb` (atau ekspor Blender → `.glb`).

### A3. Checklist teknis SEBELUM disimpan (kritis)

- [ ] Format **GLB**, nama persis `alpaca.glb`, di `public/models/`
- [ ] Orientasi **Y-up**, muka menghadap **-Z** (menuju kamera); root node tanpa rotasi tersembunyi; scale = 1 (apply transform)
- [ ] **Pivot di lantai**: titik origin tepat di tengah-tengah telapak kaki, `y = 0`
- [ ] Material **MeshStandardMaterial**-compatible: base color + (opsional) roughness/metalness map; metalness rendah, roughness sedang-tinggi (matte)
- [ ] **Tidak ada baked light/AO/shadow** di tekstur (adegan ini menyinari ulang dengan lampu krem & emas)
- [ ] Opaque penuh (jangan pakai alpha/transparency) — lapisan 2D di depannya sudah menangani efek transparan
- [ ] Uji cepat: buka `index.html` dev → maskot muncul, melayang pelan, gerak halus mengikuti kursor

---

## B. ASET OPSIONAL (AKSEN): Sparkle / Bintang Emas

| | |
|---|---|
| **Lokasi final** | `public/models/spark.glb` |
| **Peran** | Nanti dipakai sebagai aksen melayang di sekitar maskot (belum di-wire ke kode — siap untuk iterasi berikutnya) |

### B1. Prompt TEKS-ke-3D

> A small stylized golden 4-pointed star sparkle charm, smooth rounded 3D cartoon style, glossy
> soft plastic, color gold #E9B824, gentle rounded corners, flat back face, soft matte-gold
> finish, single object, centered, no background, no text, no props. Low-poly game-ready,
> albedo only, no baked lighting.

### B2. Prompt IMAGE-ke-3D

Acuan: simbol `✦` emas di brand. Prompt: *"Recreate this golden star symbol as a small cute
3D charm, smooth glossy plastic, gold #E9B824, single object, centered, no background."*

---

## C. Template Prompt Cepat untuk Aksen Lain (saat dibutuhkan)

Cukup ganti kalimat deskriptor — struktur & bagian "negatif" tetap sama:

- **Mini laptop** (untuk ikon "jasa custom website"): *"small cute chibi laptop, rounded corners,
  cream #F5F0E6 body with gold #E9B824 keyboard accents, glossy plastic, screen closed, sticker
  of an alpaca face on the lid..."*
- **Pohon Polylepis/Queñua** (tema Andes): *"stylized cartoon Andean queñua tree, peeling
  cinnamon-bark trunk, soft rounded green foliage cloud..."*
- **Grafik naik** (ikon pertumbuhan bisnis): *"small 3D bar chart going up with a tiny gold
  arrow, pastel cream bars, cute rounded cartoon style..."*

Bagian yang WAJIB selalu ada di akhir: *"single object, centered, facing camera, no background,
no ground, no text, no props, low-poly game-ready, albedo only, no baked lighting or shadows."*

---

## D. Cara Kerja di Kode (supaya tahu batasannya)

- `src/components/Hero3D.jsx` → `useMascotReady()` HEAD-check `/models/alpaca.glb`, lalu `useLoader(GLTFLoader, ...)`.
- Skala di scene: `scale 1.15`, posisi `y -0.55`, kamera `z = 9` fov `42` — cocok untuk tinggi model ±2.0 unit.
- Jika file tidak ada → canvas 3D kosong & transparan (aman, tanpa error di konsol).
- Satu mesin lampu: ambient krem + directional krem + point emas. Material model tidak boleh membawa baked light agar tetap konsisten dengan tone ini.
