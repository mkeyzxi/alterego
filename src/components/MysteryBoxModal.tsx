import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Gift } from "lucide-react";

export type RewardCategory = "skins" | "items" | "pets" | "titles";

export interface Reward {
  id: string;
  name: string;
  category: RewardCategory;
  image?: string;
  rarity: "common" | "rare" | "epic";
}

const REWARD_POOL: Reward[] = [
  { id: "skin_gold", name: "Golden Aura", category: "skins", rarity: "epic" },
  { id: "skin_neon", name: "Neon Glow", category: "skins", rarity: "rare" },
  { id: "skin_shadow", name: "Shadow Cloak", category: "skins", rarity: "rare" },
  { id: "item_plant", name: "Tanaman Hias", category: "items", image: "/img/item_plant.png", rarity: "common" },
  { id: "item_lamp", name: "Lampu Neon", category: "items", image: "/img/item_lamp.png", rarity: "common" },
  { id: "pet_cat", name: "Kucing Robot", category: "pets", image: "/img/pet_cat.png", rarity: "rare" },
  { id: "pet_dog", name: "Anjing Robot", category: "pets", image: "/img/pet_dog.png", rarity: "rare" },
  { id: "title_hero", name: "Sang Pahlawan", category: "titles", rarity: "epic" },
  { id: "title_warrior", name: "Pejuang Sehat", category: "titles", rarity: "common" },
  { id: "title_explorer", name: "Penjelajah", category: "titles", rarity: "common" },
  { id: "title_champion", name: "Juara Hidup", category: "titles", rarity: "rare" },
];

interface MysteryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: Reward) => void;
}

export default function MysteryBoxModal({ isOpen, onClose, onReward }: MysteryBoxModalProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "reveal">("closed");
  const [reward, setReward] = useState<Reward | null>(null);

  const handleOpen = useCallback(() => {
    setPhase("opening");

    setTimeout(() => {
      const randomReward = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      setReward(randomReward);
      setPhase("reveal");
      onReward(randomReward);
    }, 1500);
  }, [onReward]);

  const handleClose = useCallback(() => {
    setPhase("closed");
    setReward(null);
    onClose();
  }, [onClose]);

  const rarityColors: Record<string, string> = {
    common: "#94a3b8",
    rare: "#818cf8",
    epic: "#f59e0b",
  };

  const rarityGlow: Record<string, string> = {
    common: "rgba(148, 163, 184, 0.3)",
    rare: "rgba(129, 140, 248, 0.5)",
    epic: "rgba(245, 158, 11, 0.5)",
  };

  const categoryIcons: Record<RewardCategory, string> = {
    skins: "✨",
    items: "🎁",
    pets: "🐾",
    titles: "🏆",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && phase === "reveal") handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="glass-panel"
            style={{
              padding: "40px",
              textAlign: "center",
              maxWidth: "380px",
              width: "90%",
              position: "relative",
            }}
          >
            {/* Close Button */}
            {phase === "reveal" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X size={16} />
              </motion.button>
            )}

            {/* Title */}
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: "22px",
                fontWeight: 800,
                marginBottom: "24px",
                letterSpacing: "1px",
              }}
            >
              <Gift
                size={22}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "middle",
                  color: "#f59e0b",
                }}
              />
              MYSTERY BOX
            </h3>

            {/* Box Phase */}
            <AnimatePresence mode="wait">
              {phase === "closed" && (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.div
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: "150px",
                      height: "150px",
                      margin: "0 auto 20px",
                      position: "relative",
                      cursor: "pointer",
                      filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))",
                    }}
                    onClick={handleOpen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src="/img/box_closed.png"
                      alt="Mystery Box"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </motion.div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Ketuk untuk membuka!
                  </p>
                </motion.div>
              )}

              {phase === "opening" && (
                <motion.div
                  key="opening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1, 1.15, 1, 1.2, 1.5],
                      rotate: [0, -5, 5, -5, 5, 0, 0],
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                      width: "150px",
                      height: "150px",
                      margin: "0 auto 20px",
                      position: "relative",
                      filter: "drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))",
                    }}
                  >
                    <Image
                      src="/img/box_closed.png"
                      alt="Opening..."
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{
                      color: "#f59e0b",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Membuka...
                  </motion.p>
                </motion.div>
              )}

              {phase === "reveal" && reward && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  {/* Open Box */}
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      margin: "0 auto 16px",
                      position: "relative",
                      filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))",
                    }}
                  >
                    <Image
                      src="/img/box_open.png"
                      alt="Opened!"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  {/* Reward Display */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      padding: "20px",
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, ${rarityGlow[reward.rarity]}, transparent)`,
                      border: `1px solid ${rarityColors[reward.rarity]}40`,
                    }}
                  >
                    {reward.image ? (
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "0 auto 12px",
                          position: "relative",
                          filter: `drop-shadow(0 0 15px ${rarityGlow[reward.rarity]})`,
                        }}
                      >
                        <Image
                          src={reward.image}
                          alt={reward.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "12px",
                        }}
                      >
                        {categoryIcons[reward.category]}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: rarityColors[reward.rarity],
                        marginBottom: "4px",
                      }}
                    >
                      {reward.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: rarityColors[reward.rarity],
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        opacity: 0.7,
                      }}
                    >
                      {reward.rarity} • {reward.category.replace("s", "")}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
