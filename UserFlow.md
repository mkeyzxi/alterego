# User Flow & Mental Model (Versi 2.0 - Hybrid & Minigame Edition)
**Proyek:** ALTEREGO (MVP Lomba)
**Tenggat:** 72 Jam (Single Page Application - Next.js)

---

## Pemetaan Alur Pengguna Utama

**1. Layar Orientasi (Onboarding Screen)**
* **Aksi:** Pengguna mengakses URL. Sistem memvalidasi keberadaan profil di `localStorage`.
* **Interaksi:** Jika data kosong, layar orientasi muncul. Pengguna memasukkan nama pengguna dan memilih satu `avatar_healthy.png` dasar.
* **Transisi:** Pengguna mengklik "Mulai". Data disimpan, dan layar melakukan *fade-out* menuju Dasbor Utama.

**2. Dasbor Utama (Procedural Dashboard) – Status Netral**
* **Visual:** Latar belakang diatur ke palet netral. Mesin partikel (`tsparticles`) dalam kondisi *idle*. Avatar berada di tengah layar.
* **Aksi:** Pengguna berinteraksi dengan panel *Daily Quest* di HUD (Head-Up Display).
* **Input Pengguna:** Mencentang kotak validasi kebiasaan harian:
  * Tidur tepat waktu
  * Minum air
  * Jalan kaki

**3. Evaluasi State & Rendering Prosedural (Real-Time)**
* **Aksi:** *State* React mendeteksi perubahan *checkbox* dan memicu fungsi evaluasi mesin visual.
* **Percabangan Logika:**
  * **Kondisi A (Optimal - 3/3 Tercapai):** Avatar mempertahankan versi `healthy`. Transisi Tailwind memutar gradasi warna ke cerah/neon. Pustaka partikel dirender untuk memunculkan efek kunang-kunang/cahaya melayang. Tombol akses **Minigame** dan **Mystery Box** terbuka.
  * **Kondisi B (Kritis - < 3 Tercapai):** Avatar ditukar instan menjadi `tired`. Transisi warna memutar layar menjadi gelap/suram. Partikel dirender menjadi hujan asam atau kode matriks. Kelas animasi CSS `.animate-glitch` disuntikkan secara acak ke elemen panel UI. Akses *Minigame* ditutup.

**4. Retensi Interaktif: Minigame "Glitch Sweeper"**
* **Aksi:** Dalam Kondisi A, pengguna mengklik tombol "Bersihkan Dunia".
* **Interaksi:** UI Dasbor meredup. Elemen "virus/glitch digital" bermunculan secara acak di berbagai koordinat absolut layar dengan durasi hitung mundur 30 detik.
* **Tujuan:** Pengguna harus melakukan *tapping* (klik) secepat mungkin pada entitas virus tersebut sebelum menghilang.
* **Transisi:** Setelah 30 detik, skor akhir divalidasi, dan pengguna diarahkan untuk mengklaim *Mystery Box*.

**5. Interaksi Gacha (Mystery Box Modal)**
* **Aksi:** Pengguna mengklik ikon peti yang bergetar.
* **Interaksi:** *Modal pop-up* muncul. Mesin RNG (Random Number Generator) berjalan di belakang layar untuk mengekstrak satu aset secara acak (Skin Avatar, Item Virtual, Pet Digital, atau Title).
* **Visual:** Animasi CSS sederhana dari peti tertutup (`box_closed.png`) menjadi terbuka (`box_open.png`) dengan pendaran cahaya, diikuti tampilan aset hadiah.

**6. Panel Inventaris & Persistensi (Inventory Drawer)**
* **Aksi:** Pengguna menutup *modal* gacha.
* **Interaksi:** Pengguna dapat membuka *sidebar drawer* untuk memasang/melepas *Pet* atau *Item* yang baru saja didapat ke dalam Dasbor Utama.
* **Siklus Selesai:** Pembaruan *state* dunia dan inventaris disimpan di `localStorage`. Pengguna meninggalkan situs dengan tampilan dunia yang telah berevolusi (cerah + pet baru), memicu urgensi psikologis untuk mengulangi prosesnya besok.

---

## Diagram Alur Sederhana (Mental Model)

```text
[Masuk Web] 
   │
   ├─> (Data Kosong?) ──> [Layar Pembuatan Avatar] ──> Simpan Data
   │
   v
[Dasbor Utama] <───────────────────────────────────────────────────────┐
   │                                                                   │
   ├─> (Panel Centang Kebiasaan: Tidur, Air, Jalan)                    │
   │                                                                   │
   v                                                                   │
[State Engine Evaluasi]                                                │
   │                                                                   │
   ├─> [Target Gagal] ──> Tampilan Gelap, Partikel Hujan & Efek Glitch │
   │                                                                   │
   └─> [Target Lulus] ──> Tampilan Cerah, Partikel Cahaya              │
                            │                                          │
                            v                                          │
                   [Buka Akses Minigame]                               │
                            │                                          │
                            v                                          │
                  [Main Glitch Sweeper 30s]                            │
                            │                                          │
                            v                                          │
                   [Klaim Mystery Box Gacha]                           │
                            │                                          │
                            v                                          │
                    [Masuk/Atur Inventaris] ───────────────────────────┘
                    (Simpan localStorage, Reset Jam 00:00)