import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Package, Wand2, PawPrint, Award, Trash2 } from "lucide-react";
import type { Reward, RewardCategory } from "./MysteryBoxModal";

interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Record<RewardCategory, Reward[]>;
  equippedPet: string | null;
  equippedItem: string | null;
  equippedTitle: string | null;
  onEquipPet: (id: string | null) => void;
  onEquipItem: (id: string | null) => void;
  onEquipTitle: (id: string | null) => void;
}

const categoryConfig = [
  { key: "pets" as const, label: "Pet Digital", icon: PawPrint, color: "#f472b6" },
  { key: "items" as const, label: "Item Virtual", icon: Package, color: "#38bdf8" },
  { key: "skins" as const, label: "Skin Avatar", icon: Wand2, color: "#a78bfa" },
  { key: "titles" as const, label: "Title", icon: Award, color: "#fbbf24" },
];

export default function InventoryDrawer({
  isOpen,
  onClose,
  inventory,
  equippedPet,
  equippedItem,
  equippedTitle,
  onEquipPet,
  onEquipItem,
  onEquipTitle,
}: InventoryDrawerProps) {
  const handleEquip = (reward: Reward) => {
    switch (reward.category) {
      case "pets":
        onEquipPet(equippedPet === reward.id ? null : reward.id);
        break;
      case "items":
        onEquipItem(equippedItem === reward.id ? null : reward.id);
        break;
      case "titles":
        onEquipTitle(equippedTitle === reward.id ? null : reward.id);
        break;
    }
  };

  const isEquipped = (reward: Reward) => {
    switch (reward.category) {
      case "pets":
        return equippedPet === reward.id;
      case "items":
        return equippedItem === reward.id;
      case "titles":
        return equippedTitle === reward.id;
      default:
        return false;
    }
  };

  const rarityColors: Record<string, string> = {
    common: "#94a3b8",
    rare: "#818cf8",
    epic: "#f59e0b",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "360px",
              maxWidth: "90vw",
              zIndex: 46,
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#e2e8f0",
                  letterSpacing: "1px",
                }}
              >
                📦 INVENTARIS
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "10px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 24px",
              }}
            >
              {categoryConfig.map((cat) => {
                const items = inventory[cat.key];
                const Icon = cat.icon;

                return (
                  <div key={cat.key} style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Icon size={16} style={{ color: cat.color }} />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: cat.color,
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                        }}
                      >
                        {cat.label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.3)",
                          marginLeft: "auto",
                        }}
                      >
                        {items.length} item
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px dashed rgba(255,255,255,0.1)",
                          textAlign: "center",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        Belum ada {cat.label.toLowerCase()}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "8px",
                        }}
                      >
                        {items.map((reward, idx) => {
                          const equipped = isEquipped(reward);
                          const canEquip = ["pets", "items", "titles"].includes(
                            reward.category
                          );

                          return (
                            <motion.div
                              key={`${reward.id}-${idx}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => canEquip && handleEquip(reward)}
                              style={{
                                padding: "10px 6px",
                                borderRadius: "12px",
                                background: equipped
                                  ? `${cat.color}20`
                                  : "rgba(255,255,255,0.04)",
                                border: equipped
                                  ? `2px solid ${cat.color}`
                                  : "1px solid rgba(255,255,255,0.08)",
                                textAlign: "center",
                                cursor: canEquip ? "pointer" : "default",
                                position: "relative",
                                transition: "all 0.3s ease",
                              }}
                            >
                              {equipped && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: cat.color,
                                    boxShadow: `0 0 8px ${cat.color}`,
                                  }}
                                />
                              )}

                              {reward.image ? (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    margin: "0 auto 6px",
                                    position: "relative",
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
                                    fontSize: "24px",
                                    marginBottom: "6px",
                                  }}
                                >
                                  {reward.category === "skins"
                                    ? "✨"
                                    : "🏆"}
                                </div>
                              )}

                              <div
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  color: "rgba(255,255,255,0.7)",
                                  lineHeight: "1.3",
                                }}
                              >
                                {reward.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "8px",
                                  fontWeight: 600,
                                  color: rarityColors[reward.rarity],
                                  textTransform: "uppercase",
                                  marginTop: "3px",
                                  letterSpacing: "1px",
                                }}
                              >
                                {reward.rarity}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
