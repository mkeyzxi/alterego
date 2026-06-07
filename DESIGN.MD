# UI/UX Design & Component Architecture (DESIGN.md)

**Proyek:** ALTEREGO (MVP - Hybrid & Minigame Edition)
[cite_start]**Tujuan:** Menerjemahkan konsep "dunia virtual yang berubah [cite: 2]" ke dalam komponen hirarkis React yang efisien, mengintegrasikan rendering prosedural, dan _minigame_ tanpa mengorbankan performa.

## 1. Topografi Halaman (Z-Index Layering)

Sistem menggunakan pendekatan _Single Page Application_ (SPA) dengan tumpukan _layer_ absolut untuk memisahkan logika efek lingkungan dari antarmuka interaktif:

- **Layer 0 (Base Background):** Gradasi Tailwind CSS murni (merespons _state_).
- **Layer 1 (Procedural Engine):** Kanvas `tsparticles` untuk merender debu cahaya (sehat) atau hujan matriks digital (lelah).
- **Layer 2 (Avatar):** Entitas PNG statis (`avatar_healthy.png` atau `avatar_tired.png`) yang diposisikan di tengah dengan animasi _floating/glitch_ dari Framer Motion.
- **Layer 3 (HUD / Antarmuka):** Panel interaksi (Form kebiasaan, Indikator _Quest_, Tombol _Inventory_, dan Ikon _Mystery Box_).
- **Layer 4 (Minigame & Modals):** Kanvas _absolute overlay_ untuk _Glitch Sweeper_ dan _pop-up_ gacha (hanya muncul saat dipicu).

## 2. Struktur Komponen (Next.js / React)

Struktur folder diperbarui untuk mengakomodasi pustaka partikel dan minigame.

```text
/src
  ├── /components
  │     ├── ProceduralBackground.jsx  # Layer 1: Merender tsParticles (Cahaya vs Hujan Digital)
  │     ├── AvatarRenderer.jsx        # Layer 2: Menangani load PNG & animasi CSS/Framer Motion
  [cite_start]│     ├── HabitDashboard.jsx        # Layer 3: Formulir checkbox (Tidur tepat waktu [cite: 9][cite_start], Minum air [cite: 10][cite_start], Jalan kaki [cite: 11])
  │     ├── MysteryBoxModal.jsx       # Layer 4: Komponen tombol gacha & distribusi hadiah
  │     ├── InventoryDrawer.jsx       # Layer 4: Panel samping (Sidebar) untuk melihat item/pet/skin
  │     └── GlitchSweeperGame.jsx     # Layer 4: Logika klik koordinat minigame (Tapping nodes)
  │
  └── /app
        └── page.js                   # State Controller Utama (Mendistribusikan props ke semua komponen)
        3. Manajemen State (React Hook & LocalStorage)
Manajemen state di page.js diperluas untuk menangani rendering prosedural dan siklus minigame.

State Utama (app/page.js)
const [habits, setHabits] = useState({ sleep: false, water: false, walk: false })

const [worldState, setWorldState] = useState('neutral') // 'neutral' | 'optimal' | 'critical'

const [minigameActive, setMinigameActive] = useState(false)

const [inventory, setInventory] = useState({ skins: [], items: [], pets: [], titles: [] })

Aliran Data (Data Flow) Baru
Pengguna mengklik checkbox di HabitDashboard.jsx.

useEffect mengevaluasi total nilai habits.

Jika 3/3 terpenuhi, worldState berubah menjadi 'optimal'.

ProceduralBackground.jsx merespons 'optimal' dengan memuat konfigurasi partikel cahaya (tsparticles).

Tombol akses GlitchSweeperGame.jsx dirender di HUD. Jika diklik, minigameActive menjadi true, menutupi layar dengan area permainan selama 30 detik.

Setelah minigame selesai, MysteryBoxModal.jsx dipicu untuk membagikan hadiah.

4. Hirarki Visual & Tata Letak (Tailwind CSS Wireframe)
Container Utama (page.js): <main className="relative w-full h-screen overflow-hidden transition-colors duration-1000 flex items-center justify-center">

Partikel (ProceduralBackground.jsx): <div className="absolute inset-0 z-0 pointer-events-none">

Avatar Position (AvatarRenderer.jsx): <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">

Minigame Overlay (GlitchSweeperGame.jsx): <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
```
