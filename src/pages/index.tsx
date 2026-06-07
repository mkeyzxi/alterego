import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Swords, Gift } from "lucide-react";

import HabitDashboard from "@/components/HabitDashboard";
import AvatarRenderer from "@/components/AvatarRenderer";
import MysteryBoxModal from "@/components/MysteryBoxModal";
import InventoryDrawer from "@/components/InventoryDrawer";
import GlitchSweeperGame from "@/components/GlitchSweeperGame";
import OnboardingScreen from "@/components/OnboardingScreen";
import type { Reward, RewardCategory } from "@/components/MysteryBoxModal";

// Dynamic import for tsparticles (client-only)
const ProceduralBackground = dynamic(
  () => import("@/components/ProceduralBackground"),
  { ssr: false }
);

// ===== LocalStorage helpers =====
const STORAGE_KEY = "alterego_data";

interface GameData {
  username: string;
  habits: { sleep: boolean; water: number; walk: boolean };
  questCompleted: boolean;
  questDate: string;
  inventory: Record<RewardCategory, Reward[]>;
  equippedPet: string | null;
  equippedItem: string | null;
  equippedTitle: string | null;
  mysteryBoxClaimed: boolean;
  minigamePlayed: boolean;
}

function getDefaultData(): GameData {
  return {
    username: "",
    habits: { sleep: false, water: 0, walk: false },
    questCompleted: false,
    questDate: "",
    inventory: { skins: [], items: [], pets: [], titles: [] },
    equippedPet: null,
    equippedItem: null,
    equippedTitle: null,
    mysteryBoxClaimed: false,
    minigamePlayed: false,
  };
}

function loadData(): GameData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw) as GameData;

    // Check if quest should be reset (new day)
    const today = new Date().toISOString().split("T")[0];
    if (parsed.questDate !== today) {
      return {
        ...parsed,
        habits: { sleep: false, water: 0, walk: false },
        questCompleted: false,
        questDate: "",
        mysteryBoxClaimed: false,
        minigamePlayed: false,
      };
    }

    return parsed;
  } catch {
    return getDefaultData();
  }
}

function saveData(data: GameData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== Main Page Component =====
export default function Home() {
  const [data, setData] = useState<GameData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setShowOnboarding(!loaded.username);
    setIsLoaded(true);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded && data.username) {
      saveData(data);
    }
  }, [data, isLoaded]);

  // Calculate world state — "optimal" requires sleep + water===8 + walk
  const allHabitsDone =
    data.habits.sleep && data.habits.water === 8 && data.habits.walk;
  const anyHabitDone =
    data.habits.sleep || data.habits.water > 0 || data.habits.walk;

  const worldState: "neutral" | "optimal" | "critical" = !data.questCompleted
    ? "neutral"
    : allHabitsDone
    ? "optimal"
    : "critical";

  // Handle boolean habit toggle (sleep, walk)
  const handleToggle = useCallback(
    (key: "sleep" | "walk") => {
      if (data.questCompleted) return;
      setData((prev) => ({
        ...prev,
        habits: { ...prev.habits, [key]: !prev.habits[key] },
      }));
    },
    [data.questCompleted]
  );

  // Handle water counter increment
  const handleAddWater = useCallback(() => {
    if (data.questCompleted) return;
    setData((prev) => ({
      ...prev,
      habits: {
        ...prev.habits,
        water: Math.min(prev.habits.water + 1, 8),
      },
    }));
  }, [data.questCompleted]);

  // Submit quest
  const handleSubmitQuest = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setData((prev) => ({
      ...prev,
      questCompleted: true,
      questDate: today,
    }));
  }, []);

  // Handle onboarding complete
  const handleOnboarding = useCallback((username: string) => {
    setData((prev) => ({ ...prev, username }));
    setShowOnboarding(false);
  }, []);

  // Handle reward
  const handleReward = useCallback((reward: Reward) => {
    setData((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [reward.category]: [...prev.inventory[reward.category], reward],
      },
      mysteryBoxClaimed: true,
    }));
  }, []);

  // Handle minigame complete
  const handleMinigameComplete = useCallback((_score: number) => {
    setShowMinigame(false);
    setData((prev) => ({ ...prev, minigamePlayed: true }));
    // Auto-open mystery box after minigame
    setTimeout(() => setShowMysteryBox(true), 500);
  }, []);

  // Equip handlers
  const handleEquipPet = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, equippedPet: id }));
  }, []);

  const handleEquipItem = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, equippedItem: id }));
  }, []);

  const handleEquipTitle = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, equippedTitle: id }));
  }, []);

  // Background gradient based on state
  const bgGradient =
    worldState === "optimal"
      ? "linear-gradient(135deg, #ccfbf1 0%, #6ee7b7 100%)"
      : worldState === "critical"
      ? "linear-gradient(135deg, #0f172a 0%, #18181b 100%)"
      : "linear-gradient(135deg, #1e293b 0%, #334155 100%)";

  if (!isLoaded) return null;

  return (
    <>
      <Head>
        <title>ALTEREGO - Gamified Habit Tracker</title>
        <meta
          name="description"
          content="Dunia virtual yang berubah seiring kebiasaan hidupmu. Jaga kesehatanmu, dan duniamu akan bersinar!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingScreen onComplete={handleOnboarding} />
        )}
      </AnimatePresence>

      {/* Main Container — Instruction #2: relative w-full h-screen */}
      <main className="relative w-full h-screen overflow-hidden font-[Outfit,sans-serif]"
        style={{
          background: bgGradient,
          transition: "background 1.5s ease",
        }}
      >
        {/* Layer 0+1: Procedural Background */}
        <ProceduralBackground worldState={worldState} />

        {/* Instruction #3: HUD Badge Header — top-left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-5 left-5 z-30 flex items-center gap-3 bg-white/20 backdrop-blur-md p-2 rounded-full"
        >
          <Image
            src="/img/badge_rookie.png"
            alt="Badge Rookie"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className="text-sm font-bold pr-3"
            style={{
              color:
                worldState === "optimal"
                  ? "#064e3b"
                  : "#e2e8f0",
              textShadow:
                worldState === "optimal"
                  ? "none"
                  : "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            {data.username}
          </span>
        </motion.div>

        {/* Instruction #2: Avatar — center bottom */}
        <AvatarRenderer
          worldState={worldState}
          equippedPet={data.equippedPet}
          equippedItem={data.equippedItem}
        />

        {/* Instruction #5: Habit Dashboard — mobile bottom full-width, md side panel */}
        <HabitDashboard
          habits={data.habits}
          onToggleSleep={() => handleToggle("sleep")}
          onToggleWalk={() => handleToggle("walk")}
          onAddWater={handleAddWater}
          worldState={worldState}
          questCompleted={data.questCompleted}
        />

        {/* Submit Quest Button (when habits checked but not submitted) */}
        <AnimatePresence>
          {!data.questCompleted && anyHabitDone && (
            <motion.button
              id="submit-quest-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleSubmitQuest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute z-20 hidden md:flex"
              style={{
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "14px 32px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Selesaikan Quest
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile Submit Quest Button — inside mobile panel area */}
        <AnimatePresence>
          {!data.questCompleted && anyHabitDone && (
            <motion.button
              id="submit-quest-btn-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleSubmitQuest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-[200px] left-1/2 -translate-x-1/2 z-30 flex md:hidden"
              style={{
                padding: "12px 28px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Selesaikan Quest
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3 md:flex hidden"
        >
          {/* Inventory Button */}
          <motion.button
            id="inventory-btn"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInventory(true)}
            className="glass-panel"
            style={{
              padding: "12px 20px",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "inherit",
            }}
          >
            <Package size={18} />
            Inventaris
          </motion.button>

          {/* Minigame Button (only in optimal state) */}
          <AnimatePresence>
            {worldState === "optimal" &&
              !data.minigamePlayed && (
                <motion.button
                  id="minigame-btn"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMinigame(true)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "16px",
                    border: "none",
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "inherit",
                    boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <Swords size={18} />
                  Bersihkan Dunia
                </motion.button>
              )}
          </AnimatePresence>

          {/* Mystery Box Button */}
          <AnimatePresence>
            {data.questCompleted &&
              !data.mysteryBoxClaimed &&
              (data.minigamePlayed || worldState !== "optimal") && (
                <motion.button
                  id="mystery-box-btn"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    rotate: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMysteryBox(true)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "16px",
                    border: "none",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1e293b",
                    fontFamily: "inherit",
                    boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  <Gift size={18} />
                  Mystery Box
                </motion.button>
              )}
          </AnimatePresence>
        </motion.div>

        {/* Layer 4: Modals & Overlays */}
        {/* Minigame */}
        <GlitchSweeperGame
          isActive={showMinigame}
          onComplete={handleMinigameComplete}
          onClose={() => setShowMinigame(false)}
        />

        {/* Mystery Box Modal */}
        <MysteryBoxModal
          isOpen={showMysteryBox}
          onClose={() => setShowMysteryBox(false)}
          onReward={handleReward}
        />

        {/* Inventory Drawer */}
        <InventoryDrawer
          isOpen={showInventory}
          onClose={() => setShowInventory(false)}
          inventory={data.inventory}
          equippedPet={data.equippedPet}
          equippedItem={data.equippedItem}
          equippedTitle={data.equippedTitle}
          onEquipPet={handleEquipPet}
          onEquipItem={handleEquipItem}
          onEquipTitle={handleEquipTitle}
        />
      </main>
    </>
  );
}
