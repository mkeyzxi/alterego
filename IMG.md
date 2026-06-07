# Asset Image Manifest (/public/img)

**Deskripsi:** Daftar aset visual berformat PNG transparan yang digunakan untuk merender antarmuka dan _state_ dunia virtual ALTEREGO.

## 1. Avatar Karakter (Player State)

Aset ini dirender di tengah layar. Perubahannya dipicu oleh fungsi validasi input kebiasaan harian pengguna.

- **`avatar_healthy.png`**: Karakter berdiri tegak dan berenergi. Ditampilkan saat pengguna memenuhi 100% _daily quest_ (tidur cukup, minum air, jalan kaki).
- **`avatar_tired.png`**: Karakter membungkuk dan pucat. Ditampilkan sebagai penalti visual saat pengguna gagal memenuhi target kebiasaan harian.

## 2. Lingkungan Virtual (World Background)

Aset ini digunakan sebagai _layer_ latar belakang. Menggunakan manipulasi _class_ Tailwind CSS pada elemen _wrapper_ untuk mengubah atmosfer kota.

- **`bg_city_day.png`**: Siluet kota yang rapi. Digabungkan dengan gradasi CSS cerah (misal: teal/emerald) untuk merepresentasikan dunia yang sehat.
- **`bg_city_glitch.png`**: Siluet kota yang retak dan berantakan. Digabungkan dengan warna latar CSS gelap (slate/zinc) dan efek animasi _glitch_ saat pengguna malas/begadang.

## 3. Sistem Gacha & Inventaris (Mystery Box)

Aset interaktif untuk mekanik gamifikasi dan _reward_ retensi pengguna.

- **`box_closed.png`**: Ikon Mystery Box yang muncul dan bisa diklik ketika _quest_ harian selesai.
- **`box_open.png`**: Ikon transisi saat modal gacha terbuka dan mengeluarkan cahaya.
- **`item_lamp.png`**: Hadiah kategori "Item Virtual" (Lampu neon).
- **`item_plant.png`**: Hadiah kategori "Item Virtual" (Tanaman hias).
- **`pet_cat.png`**: Hadiah kategori "Pet Digital" (Kucing robot).
- **`pet_dog.png`**: Hadiah kategori "Pet Digital" (Anjing robot).

## 4. Skin Avatar (Kustomisasi Visual)

Aset pengganti untuk karakter utama yang didapatkan melalui sistem Gacha, digunakan untuk mempertahankan retensi pengguna.

- **`skin_cyberpunk.png`**: Kostum avatar alternatif bertema jaket _cyberpunk_ neon dan celana _techwear_.
- **`skin_fantasy.png`**: Kostum avatar alternatif bertema jubah fantasi mistis dengan tongkat kayu.

## 5. Lencana & Gelar (Title/Badge)

Ikon visual yang merepresentasikan pencapaian atau gelar pengguna di dalam Dasbor Utama.

- **`badge_rookie.png`**: Lencana perunggu geometris berbentuk perisai untuk gelar pemula.
- **`badge_master.png`**: Emblem emas holografik dengan mahkota digital untuk pencapaian tingkat tinggi.
