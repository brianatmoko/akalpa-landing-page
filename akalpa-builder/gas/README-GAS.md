# Panduan Setup GAS Backend — Akalpa Inovasi Template System

## Langkah 1: Buat Google Sheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **+ Spreadsheet baru** (kosong)
3. Beri nama: **"Akalpa Template DB"**
4. Catat URL-nya (berisi Spreadsheet ID)

---

## Langkah 2: Buka Google Apps Script

1. Di Google Sheet, klik menu: **Ekstensi > Apps Script**
2. Hapus semua kode default yang ada
3. Copy-paste seluruh isi file `Code.gs` ke editor
4. **WAJIB**: Ganti baris berikut dengan token rahasia Anda:
   ```js
   CURATOR_TOKEN: "GANTI_DENGAN_TOKEN_RAHASIA_ANDA_MIN32CHAR",
   ```
   Contoh token yang baik: `Akalpa2026_CuratorSecret_xK9mP3qR7nT2vL`
5. Klik **Simpan** (ikon floppy disk / Ctrl+S)
6. Beri nama project: **"Akalpa Template API"**

---

## Langkah 3: Jalankan setupSheet()

1. Di editor GAS, pilih fungsi `setupSheet` dari dropdown
2. Klik tombol **▶ Run**
3. Jika muncul popup izin → klik **Review Permissions > Allow**
4. Kembali ke Google Sheet → cek sheet "Templates" sudah muncul dengan header kolom

---

## Langkah 4: Deploy sebagai Web App

1. Klik tombol **Deploy > New Deployment**
2. Klik ikon ⚙️ (gear) di samping "Select type" → pilih **Web App**
3. Isi konfigurasi:
   - **Description**: `Akalpa Template API v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Klik **Deploy**
5. Klik **Authorize Access** → pilih akun Google Anda → Allow
6. **SALIN URL Web App** — contoh:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXX/exec
   ```
   > Simpan URL ini, akan dibutuhkan di Studio Curator!

---

## Langkah 5: Masukkan URL ke Studio Curator

1. Buka `templates-curator.html` di browser
2. Login dengan kode akses `akalpa2026`
3. Di bagian **Konfigurasi GAS API**, masukkan:
   - **GAS API URL**: (paste URL dari langkah 4)
   - **Curator Token**: (token rahasia yang Anda set di Code.gs)
4. Klik **Simpan Konfigurasi GAS**
5. Coba tambah 1 template → klik Simpan
6. Buka Google Sheet → data harus muncul realtime!

---

## Langkah 6: Update Blogger Theme

1. Jalankan Python converter:
   ```bash
   python tools/html_to_blogger_xml.py
   ```
   (Masukkan GAS URL saat diminta)
2. Buka output `output/akalpa-templates-theme.xml`
3. Di Blogger: **Theme > Customize > Edit HTML** → paste XML, Save
4. Halaman template Blogger sekarang fetch data realtime dari GAS!

---

## Cara Update Deployment GAS

Setiap kali edit `Code.gs`:
1. Deploy > **Manage deployments**
2. Klik ✎ Edit pada deployment yang ada
3. Version: **New version**
4. Klik **Deploy**
> URL tidak berubah, Anda tidak perlu update di mana-mana.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Unauthorized` saat POST | Token di Curator ≠ Token di Code.gs |
| Data tidak muncul di Blogger | Cek GAS URL di localStorage browser |
| `Sheet tidak ditemukan` | Jalankan `setupSheet()` dulu |
| CORS error | GAS sudah handle CORS otomatis untuk `doGet` |
| Quota exceeded | GAS free tier: 6 min/hari exec time, 20k read/hari |
