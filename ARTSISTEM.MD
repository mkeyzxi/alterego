# Art & UI System Guidelines (Asset Manifest)
**Proyek:** ALTEREGO (MVP)
**Pendekatan Visual:** 2D Flat / Pixel Art dengan Manipulasi CSS DOM

## 1. Kebutuhan File Aset Utama (Unduh Malam Ini)
Gunakan format **.PNG (Transparent Background)** atau **.SVG**. Jangan gunakan format .JPG karena akan merusak ilusi lapisan dunia virtual. Total aset yang diwajibkan hanya 10 file.

### A. Avatar Pengguna (2 File)
* `avatar_healthy.png` -> Karakter berdiri tegak, tersenyum, atau memiliki postur berenergi.
* `avatar_tired.png` -> Karakter membungkuk, warna lebih pucat, atau ekspresi lelah.

### B. Lingkungan / Latar Belakang (2 File)
* `bg_city_day.png` -> Siluet kota atau kamar yang rapi (Transparan di bagian atas agar bisa diwarnai dengan CSS).
* `bg_city_glitch.png` -> Siluet yang sama, tetapi dengan detail retak atau berantakan.

### C. Aset Hadiah Mystery Box (6 File)
* `box_closed.png` -> Gambar peti atau kado tertutup.
* `box_open.png` -> Gambar peti terbuka dengan cahaya.
* `item_plant.png` -> (Item) Tanaman hias kecil.
* `item_lamp.png` -> (Item) Lampu neon estetik.
* `pet_cat.png` -> (Pet) Kucing digital/robot.
* `pet_dog.png` -> (Pet) Anjing digital.

---

## 2. Palet Warna State Lingkungan (Tailwind CSS Configuration)
Jangan mengatur warna di file CSS eksternal. Gunakan kelas utilitas Tailwind berikut secara dinamis pada kontainer utama (misal: `<main>`) menggunakan operator *ternary* di React.

### State: Sehat / Cerah (100% Kebiasaan Terpenuhi)
* **Background Utama:** `bg-gradient-to-br from-teal-100 to-emerald-300` (Memberikan kesan segar dan organik).
* **Warna Teks Utama:** `text-emerald-900`
* **Aksen Tombol:** `bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/50`

### State: Lelah / Gelap (Gagal Memenuhi Kebiasaan)
* **Background Utama:** `bg-gradient-to-br from-slate-900 to-zinc-900` (Suram, gelap, digital).
* **Warna Teks Utama:** `text-red-400`
* **Aksen Tombol:** `bg-red-900/50 border border-red-500 text-red-500`

---

## 3. Direktori Animasi (CSS Animations)
Tambahkan konfigurasi *keyframes* ini ke dalam file `tailwind.config.js` untuk menggerakkan aset PNG transparan agar tidak terlihat seperti gambar mati.

### A. Animasi Melayang (Idle Avatar Sehat)
Gunakan untuk `avatar_healthy.png` dan aset Pet.
* **Class:** `animate-float`
* **Keyframes:** Bergerak pada sumbu Y (`translateY`) dari `0px` ke `-10px` secara bolak-balik.
* **Durasi:** `3s ease-in-out infinite`

### B. Animasi Glitch (Avatar Lelah & Lingkungan Rusak)
Gunakan untuk `avatar_tired.png` dan judul teks dasbor saat target harian gagal.
* **Class:** `animate-glitch`
* **Keyframes:** Bergeser acak pada sumbu X (`translateX`) sejauh `2px` dan `-2px` dengan opacity berkedip.
* **Durasi:** `0.2s linear infinite`

### C. Animasi Getar (Mystery Box Siap Dibuka)
Gunakan pada elemen `box_closed.png` untuk menarik perhatian pengguna agar mengkliknya.
* **Class:** `animate-wiggle`
* **Keyframes:** Rotasi bergantian dari `-3deg` ke `3deg`.
* **Durasi:** `1s ease-in-out infinite`