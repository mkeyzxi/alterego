import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Swords, Gift, Award } from "lucide-react";

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
  habits: { sleep: boolean; water: boolean; walk: boolean };
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
    habits: { sleep: false, water: false, walk: false },
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
        habits: { sleep: false, water: false, walk: false },
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

  // Calculate world state
  const completedCount = Object.values(data.habits).filter(Boolean).length;
  const worldState: "neutral" | "optimal" | "critical" = !data.questCompleted
    ? "neutral"
    : completedCount === 3
    ? "optimal"
    : "critical";

  // Handle habit toggle
  const handleToggle = useCallback(
    (key: "sleep" | "water" | "walk") => {
      if (data.questCompleted) return;

      const newHabits = { ...data.habits, [key]: !data.habits[key] };
      const allChecked = Object.values(newHabits).every(Boolean);
      const anyChecked = Object.values(newHabits).some(Boolean);
      const today = new Date().toISOString().split("T")[0];

      // Auto-complete quest when all 3 checked OR when user unchecks back
      // Quest completes on any submit action
      if (allChecked || (!allChecked && Object.values(newHabits).filter(Boolean).length > 0 && data.habits[key])) {
        setData((prev) => ({
          ...prev,
          habits: newHabits,
          questCompleted: allChecked,
          questDate: allChecked ? today : prev.questDate,
        }));
      } else {
        setData((prev) => ({
          ...prev,
          habits: newHabits,
        }));
      }
    },
    [data]
  );

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

      {/* Main Container */}
      <main
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: bgGradient,
          transition: "background 1.5s ease",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Layer 0+1: Procedural Background */}
        <ProceduralBackground worldState={worldState} />

        {/* Layer 2: Avatar + City */}
        <AvatarRenderer
          worldState={worldState}
          equippedPet={data.equippedPet}
        />

        {/* Equipped Item Display */}
        {data.equippedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              bottom: "50px",
              left: "calc(50% + 80px)",
              zIndex: 8,
              width: "60px",
              height: "60px",
              pointerEvents: "none",
            }}
          >
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              src={
                data.equippedItem === "item_plant"
                  ? "/img/item_plant.png"
                  : "/img/item_lamp.png"
              }
              alt="Equipped Item"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
              }}
            />
          </motion.div>
        )}

        {/* Layer 3: HUD */}
        {/* Habit Dashboard */}
        <HabitDashboard
          habits={data.habits}
          onToggle={handleToggle}
          worldState={worldState}
          questCompleted={data.questCompleted}
        />

        {/* Username & Title Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 20,
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
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
          </div>
          {data.equippedTitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#fbbf24",
                letterSpacing: "1px",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
              }}
            >
              <Award size={12} />
              {data.inventory.titles.find(
                (t) => t.id === data.equippedTitle
              )?.name || ""}
            </motion.div>
          )}
        </motion.div>

        {/* Submit Quest Button (when habits checked but not submitted) */}
        <AnimatePresence>
          {!data.questCompleted &&
            Object.values(data.habits).some(Boolean) && (
              <motion.button
                id="submit-quest-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={handleSubmitQuest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: "absolute",
                  bottom: "100px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 20,
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            gap: "12px",
          }}
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
