# System Requirements Specification (SRS)
## Proyek: ALTEREGO (Gamified Habit Tracker)
**Versi:** 1.0 (MVP untuk Kompetisi/Purwarupa)
**Target Tenggat Waktu:** 3 Hari Pengerjaan

---

## 1. Pendahuluan
### 1.1 Tujuan Sistem
[cite_start]ALTEREGO adalah website gamifikasi yang bertema dunia virtual, dirancang khusus untuk mengubah kebiasaan hidup pengguna menjadi metrik permainan[cite: 2]. [cite_start]Tujuan utamanya adalah mendorong anak Gen Z untuk menjalani kebiasaan sehat melalui pendekatan yang seru, estetik, dan tidak membosankan[cite: 4].

### 1.2 Batasan Proyek (MVP Scope)
Mengingat tenggat waktu kompetisi, rilis ini dibatasi pada **High-Fidelity Interactive Prototype**. Rendering dunia virtual menggunakan manipulasi antarmuka (DOM/CSS) berbasis gambar (PNG transparan/SVG), bukan *game engine* berbasis Canvas/WebGL. Penyimpanan data memanfaatkan *Client-Side Storage* untuk memangkas waktu pengembangan *Back-End*.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### F-01: Inisiasi Pengguna & Avatar
* [cite_start]**F-01.1:** Sistem harus memfasilitasi pembuatan karakter avatar dasar oleh pengguna saat pertama kali masuk[cite: 6, 7].
* **F-01.2:** Sistem harus menyimpan nama pengguna dan status kepemilikan aset secara lokal.

### F-02: Input Kebiasaan Harian (Daily Habit Input)
* [cite_start]**F-02.1:** Sistem harus menyediakan formulir antarmuka bagi pengguna untuk mencentang kebiasaan harian[cite: 8].
* [cite_start]**F-02.2:** Parameter kebiasaan wajib mencakup: Tidur tepat waktu [cite: 9][cite_start], Minum air [cite: 10][cite_start], dan Jalan kaki[cite: 11].

### F-03: Mesin Logika Status Dunia (World State Engine)
* [cite_start]**F-03.1:** Sistem harus membaca dan memproses data input harian pengguna secara instan[cite: 12].
* [cite_start]**F-03.2 (Kondisi Sehat):** Jika ketiga kebiasaan terpenuhi, sistem harus mengubah visual avatar menjadi sehat, latar belakang kota virtual menjadi cerah, dan memunculkan *Mystery Box*[cite: 14].
* [cite_start]**F-03.3 (Kondisi Buruk):** Jika pengguna malas bergerak, begadang, dan kurang minum, sistem harus merender avatar menjadi lelah, mengubah kota virtual menjadi gelap, dan menerapkan efek *glitch* pada antarmuka[cite: 15].

### F-04: Sistem Quest & Gacha Hadiah
* [cite_start]**F-04.1:** Sistem harus memverifikasi penyelesaian *daily quest* pengguna[cite: 16].
* [cite_start]**F-04.2:** Sistem harus memiliki fungsi acak (*randomizer*) untuk membuka *Mystery Box*[cite: 17].
* **F-04.3:** Hadiah yang diekstraksi dari *Mystery Box* harus terdiri dari:
  * [cite_start]**Skin avatar:** Kostum khusus untuk karakter pengguna[cite: 18].
  * [cite_start]**Item virtual:** Dekorasi digital untuk dunia virtual[cite: 19].
  * [cite_start]**Pet digital:** Hewan pendamping karakter utama[cite: 21].
  * [cite_start]**Title khusus:** Gelar pencapaian virtual[cite: 22].

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### NF-01: Estetika Visual & Kinerja UI
* Transisi antara status "Sehat/Cerah" dan "Lelah/Gelap" harus berjalan mulus menggunakan animasi CSS murni dengan minimal **60 FPS** untuk mencegah patah-patah (*stuttering*).
* Desain antarmuka harus responsif dan mendukung pendekatan *mobile-first*.

### NF-02: Kinerja & Penyimpanan (Data Persistence)
* Waktu pemuatan halaman awal (*Initial Load Time*) tidak boleh melebihi 2 detik. Aset PNG/SVG harus dikompresi.
* [cite_start]Data *state* pengguna (inventaris hadiah, status kota) harus disimpan di dalam `localStorage` peramban untuk memastikan perubahan tetap ada saat pengguna kembali keesokan harinya[cite: 23].

---

## 4. Arsitektur & Teknologi (Tech Stack)

Untuk mencapai fungsionalitas di atas dalam waktu 72 jam, tumpukan teknologi berikut akan digunakan:

| Komponen | Teknologi Terpilih | Alasan Penggunaan (Scope 3 Hari) |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js / React.js | Memungkinkan pembuatan komponen UI modular (Avatar, Form, Box) dan manajemen *state* halaman secara cepat. |
| **Styling & Animasi** | Tailwind CSS | Menulis efek transisi, gradasi warna dunia (cerah/gelap), dan *glitch animation* tanpa meninggalkan file komponen HTML. |
| **Manajemen Aset** | PNG Transparan & SVG | Manipulasi objek ringan melalui DOM. Mengabaikan kebutuhan *engine* 3D yang berat. |
| **Database / State** | LocalStorage API (Mock DB) | Memotong waktu *setup server*. Data cukup menetap di perangkat klien untuk keperluan demonstrasi kompetisi. |

---

## 5. Struktur Data (JSON Mockup untuk LocalStorage)

```json
{
  "userProfile": {
    "name": "Player1",
    "lastLogin": "2026-06-06",
    "currentState": "healthy" 
  },
  "habitsToday": {
    "sleep": true,
    "water": true,
    "walk": false
  },
  "inventory": {
    "skins": ["default_skin"],
    "pets": ["cyber_cat"],
    "titles": ["The Beginner"]
  }
}