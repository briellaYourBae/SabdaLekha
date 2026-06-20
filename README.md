# SabdaLekha

> Menangkap suara, menulis cerita.

SabdaLekha adalah aplikasi web edukasi yang membantu pengguna belajar dan menerjemahkan Bahasa Isyarat Indonesia (BISINDO), lengkap dengan fitur kamus huruf, penerjemah teks ke isyarat, dan pengenalan suara ke teks (speech-to-text).

## ✨ Fitur

- **🏠 Beranda** — Landing page dengan pengenalan SabdaLekha dan navigasi ke seluruh fitur.
- **🔤 Kamus Huruf A-Z** — Klik huruf apa saja untuk melihat peragaan bahasa isyaratnya.
- **✍️ Penerjemah Teks → Isyarat** — Ketik kata atau kalimat, sistem akan menampilkan gambar isyarat per kata; jika kata tidak dikenali, otomatis dieja per huruf.
- **🎙️ Speech-to-Text (Suara → Teks)** — Rekam suara langsung dari mikrofon dan diubah menjadi teks menggunakan Web Speech API.
- **🌓 Dark Mode** — Tema gelap/terang yang tersimpan otomatis di browser pengguna.
- **📱 Navbar Responsif** — Mendukung tampilan desktop (dropdown menu) dan mobile (burger menu slide-in).
- **📅 Tahun Footer Otomatis** — Tahun copyright di footer otomatis mengikuti tahun berjalan.

## 🗂️ Struktur Folder

```
SabdaLekha/
├── index.html                  # Halaman beranda (root)
├── pages/
│   ├── kamus-huruf.html        # Halaman Kamus Huruf A-Z
│   ├── penerjemah.html         # Halaman Penerjemah Teks → Isyarat
│   └── speech-to-text.html     # Halaman Speech-to-Text
├── css/
│   ├── style.css                # Style global + fallback layout
│   ├── navbar.css               # Style navbar, dropdown, burger menu
│   ├── kamus-huruf.css          # Style khusus halaman Kamus Huruf
│   ├── penerjemah.css           # Style khusus halaman Penerjemah
│   └── speech-to-text.css       # Style khusus halaman Speech-to-Text
├── js/
│   ├── main.js                   # Script global (particles, animasi, tahun footer)
│   ├── navbar.js                 # Logic navbar, dropdown, burger menu, dark mode
│   ├── kamus-huruf.js            # Logic interaksi Kamus Huruf
│   ├── penerjemah.js             # Logic Penerjemah Teks → Isyarat
│   └── speech-to-text.js         # Logic rekam suara & Speech Recognition
└── assets/
    └── images/
        ├── logov1.png            # Logo SabdaLekha
        └── huruf/                 # Gambar peragaan isyarat A-Z (a.png, b.png, ...)
```

> ⚠️ **Penting:** `index.html` berada di **root**, sedangkan 3 halaman lainnya berada di dalam folder **`pages/`**. Karena itu, semua path internal (CSS, JS, gambar, dan link antar halaman) wajib menggunakan prefix relatif:
> - Dari `index.html` → gunakan `./` (contoh: `./css/style.css`, `./pages/kamus-huruf.html`)
> - Dari file di dalam `pages/` → gunakan `../` untuk naik ke root (contoh: `../css/style.css`, `../index.html`) dan `./` untuk sesama file di `pages/` (contoh: `./penerjemah.html`)

## 🛠️ Tech Stack

- **HTML5** — Struktur halaman
- **[Tailwind CSS](https://tailwindcss.com/) (CDN)** — Utility-first styling
- **CSS3 custom** — Animasi, glassmorphism, dark mode, navbar premium
- **JavaScript (Vanilla)** — Tanpa framework/build tool
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** — Untuk fitur Speech-to-Text (membutuhkan browser Chrome/Edge)
- **Google Fonts (Inter)**

## 🚀 Cara Menjalankan

Karena seluruh aplikasi berbasis file statis (tanpa backend/server), cukup jalankan dengan local server sederhana — **jangan** buka langsung lewat `file://` karena beberapa browser memblokir permintaan resource lokal (CSS/JS) untuk alasan keamanan (CORS).

**Opsi 1 — Python:**
```bash
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

**Opsi 2 — VS Code Live Server Extension:**
Klik kanan pada `index.html` → `Open with Live Server`.

**Opsi 3 — Node.js (http-server):**
```bash
npx http-server .
```

## 🌐 Kompatibilitas Browser

| Fitur | Chrome/Edge | Firefox | Safari |
|---|---|---|---|
| Tampilan & Navigasi | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |
| Kamus Huruf & Penerjemah | ✅ | ✅ | ✅ |
| Speech-to-Text | ✅ | ⚠️ Terbatas | ⚠️ Terbatas |

> Fitur Speech-to-Text menggunakan Web Speech API yang dukungannya paling stabil di **Google Chrome** atau **Microsoft Edge**.

## 📝 Catatan Pengembangan

- Tailwind CSS dimuat melalui CDN (`cdn.tailwindcss.com`). Jika koneksi internet pengguna lambat atau domain CDN diblokir jaringan, `style.css` sudah dilengkapi **fallback CSS** untuk menjaga layout navbar & menu tetap rapi sementara Tailwind selesai dimuat.
- Tahun pada bagian footer (`© [tahun] SabdaLekha`) di-generate otomatis lewat JavaScript (`new Date().getFullYear()` di `main.js`), sehingga tidak perlu diperbarui manual setiap pergantian tahun.
- Gambar peragaan huruf/kata yang belum tersedia di folder `assets/images/` akan otomatis digantikan placeholder dari [ui-avatars.com](https://ui-avatars.com/).

## 📄 Lisensi

© 2026 SabdaLekha. All Rights Reserved.