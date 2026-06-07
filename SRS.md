# System Requirements Specification (SRS)
## Proyek: ALTEREGO (Gamified Habit Tracker) - Hybrid Visual Edition
**Versi:** 2.0 (Expanded MVP untuk Kompetisi)
**Pendekatan Visual:** Hybrid (Static Assets + Procedural Code-Driven Environment)

---

## 1. Pendahuluan
### 1.1 Tujuan Sistem
[cite_start]ALTEREGO adalah website game bertema dunia virtual yang dirancang secara khusus agar berubah sesuai dengan kebiasaan hidup penggunanya[cite: 2]. [cite_start]Jika pengguna menerapkan pola hidup sehat, maka dunia virtual dan avatar mereka akan ikut membaik[cite: 3]. [cite_start]Tujuan utamanya adalah mendorong demografi Gen Z agar lebih bersemangat menjalani kebiasaan sehat melalui mekanisme gamifikasi yang seru, estetis, dan tidak membosankan[cite: 4].

### 1.2 Batasan Proyek & Rendering
Sistem ini menggunakan arsitektur antarmuka hibrida:
* **Entitas Statis:** Avatar, *Mystery Box*, dan *Item* inventaris menggunakan aset gambar `.png` berlatar transparan.
* **Lingkungan Prosedural:** Efek cuaca, atmosfer dunia, dan elemen *glitch* dirender secara *real-time* menggunakan DOM manipulation (CSS/Framer Motion) dan algoritma partikel (`tsparticles`) untuk menekan beban memori dan meniadakan kebutuhan aset latar belakang beresolusi tinggi.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### F-01: Orientasi Pengguna
* [cite_start]**F-01.1:** Sistem harus menyediakan antarmuka bagi pengguna untuk membuat karakter avatar dasar saat pertama kali masuk ke dalam website[cite: 6, 7].

### F-02: Engine Pelacak Kebiasaan (Habit Tracker)
* [cite_start]**F-02.1:** Sistem harus menyediakan formulir *Daily Quest* bagi pengguna untuk mencatat kebiasaan harian mereka[cite: 8, 16].
* [cite_start]**F-02.2:** Input data wajib mencakup tiga metrik utama: Tidur tepat waktu[cite: 9][cite_start], Minum air[cite: 10][cite_start], dan Jalan kaki[cite: 11].
* [cite_start]**F-02.3:** Website harus mampu membaca dan mengevaluasi data masukan tersebut secara instan (*real-time state calculation*)[cite: 12].

### F-03: Procedural State Environment (Logika Perubahan Dunia)
[cite_start]Dunia virtual harus bereaksi dan berubah mengikuti data kebiasaan pengguna[cite: 13].
* [cite_start]**F-03.1 (State: Optimal):** Jika target harian (tidur cukup, minum air, jalan kaki) terpenuhi, sistem harus merender avatar (`avatar_healthy.png`), mengubah latar belakang CSS menjadi cerah, mengaktifkan efek partikel cahaya menggunakan `tsparticles`, dan memunculkan *Mystery Box*[cite: 14].
* [cite_start]**F-03.2 (State: Kritis):** Jika pengguna malas bergerak, begadang, dan tidak minum air, sistem harus menukar avatar (`avatar_tired.png`), mengubah CSS kota menjadi gelap/suram, dan secara acak menyuntikkan efek *glitch* pada elemen DOM/teks[cite: 15].

### F-04: Mekanik Gacha & Inventaris
* [cite_start]**F-04.1:** Pengguna diberikan satu kesempatan untuk membuka *Mystery Box* setelah menyelesaikan *daily quest*[cite: 16, 17].
* **F-04.2:** Algoritma acak (*RNG*) akan mendistribusikan satu dari empat kategori hadiah:
  * [cite_start]**Skin avatar:** Tampilan atau kostum khusus untuk karakter pengguna[cite: 18].
  * [cite_start]**Item virtual:** Benda digital yang digunakan untuk menghias dunia virtual[cite: 19].
  * [cite_start]**Pet digital:** Hewan pendamping virtual di dunia ALTEREGO[cite: 21].
  * [cite_start]**Title khusus:** Gelar virtual representasi pencapaian[cite: 22].
* [cite_start]**F-04.3:** Sistem harus mendorong pengguna untuk kembali keesokan harinya guna melihat perubahan baru pada dunia mereka[cite: 23].

### F-05: Retensi Interaktif (Minigame "Glitch Sweeper")
* **F-05.1:** Sistem menyediakan *minigame* mini-DOM berdurasi 30 detik yang hanya bisa diakses saat *State: Optimal*.
* **F-05.2:** *Minigame* mengharuskan pengguna mengklik (*tapping*) elemen "virus digital" yang muncul secara acak (koordinat absolut) di layar untuk membersihkan dunia virtual.

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### NF-01: Kinerja Rendering Prosedural
* Animasi partikel (`tsparticles`) dan transisi lingkungan wajib dibatasi maksimal **100 partikel aktif** di layar pada perangkat seluler untuk menjaga stabilitas 60 FPS.
* Perubahan *state* lingkungan (cerah ke gelap) tidak boleh memicu *re-render* total pada komponen *Habit Form* atau mematikan aliran musik latar jika ada.

### NF-02: Penyimpanan Sisi Klien (Data Persistence)
* Seluruh data inventaris (*item*, *pet*, status avatar) dan riwayat kebiasaan wajib dienkode dan disimpan dalam `localStorage`.
* Sistem memiliki mekanisme pengecekan *timestamp* untuk me-reset formulir *daily quest* pada pukul 00:00 waktu setempat, namun mempertahankan koleksi aset inventaris.

---

## 4. Stack Teknologi & Paket Instalasi Dasar

| Komponen Arsitektur | Teknologi / Pustaka (Library) |
| :--- | :--- |
| **Kerangka Kerja UI** | Next.js (React) |
| **Manipulasi Styling & Layout** | Tailwind CSS |
| **Animasi Elemen Antarmuka** | Framer Motion (`npm i framer-motion`) |
| **Procedural Environment (Partikel)** | tsParticles (`npm i react-tsparticles tsparticles`) |
| **Ikon Antarmuka (HUD/UI)** | Lucide React (`npm i lucide-react`) |
| **Penyimpanan Data** | Native Browser `localStorage` API |

---

## 5. Struktur Komponen (Frontend React)

```text
/src
  ├── /components
  │     ├── ProceduralBackground.jsx  # Merender tsParticles (Cahaya vs Hujan Digital)
  │     ├── AvatarRenderer.jsx        # Menangani load PNG & animasi floating/glitch CSS
  │     ├── HabitDashboard.jsx        # Formulir centang & kalkulasi skor
  │     ├── MysteryBoxModal.jsx       # Animasi gacha & distribusi hadiah
  │     ├── InventoryDrawer.jsx       # Menampilkan array JSON hadiah
  │     └── GlitchSweeperGame.jsx     # Logika klik koordinat minigame
  │
  └── /app
        └── page.js                   # Container state utama (State Management Controller)