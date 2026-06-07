import { motion, AnimatePresence } from "framer-motion";
import { Moon, Droplets, Footprints, CheckCircle, Sparkles } from "lucide-react";

interface HabitDashboardProps {
  habits: { sleep: boolean; water: boolean; walk: boolean };
  onToggle: (key: "sleep" | "water" | "walk") => void;
  worldState: "neutral" | "optimal" | "critical";
  questCompleted: boolean;
}

const habitItems = [
  {
    key: "sleep" as const,
    label: "Tidur Tepat Waktu",
    description: "Tidur sebelum jam 11 malam",
    icon: Moon,
    color: "#818cf8",
  },
  {
    key: "water" as const,
    label: "Minum Air Cukup",
    description: "Minimal 8 gelas air putih",
    icon: Droplets,
    color: "#38bdf8",
  },
  {
    key: "walk" as const,
    label: "Jalan Kaki",
    description: "Minimal 30 menit berjalan",
    icon: Footprints,
    color: "#34d399",
  },
];

export default function HabitDashboard({
  habits,
  onToggle,
  worldState,
  questCompleted,
}: HabitDashboardProps) {
  const completedCount = Object.values(habits).filter(Boolean).length;
  const isOptimal = worldState === "optimal";
  const isCritical = worldState === "critical";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={isCritical ? "animate-glitch" : ""}
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 20,
        width: "320px",
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <div className="glass-panel" style={{ padding: "20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <Sparkles
            size={20}
            style={{
              color: isOptimal ? "#10b981" : isCritical ? "#f87171" : "#6366f1",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: isOptimal ? "#10b981" : isCritical ? "#f87171" : "#e2e8f0",
              letterSpacing: "0.5px",
            }}
          >
            DAILY QUEST
          </h2>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.1)",
            marginBottom: "16px",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ width: `${(completedCount / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: "3px",
              background: isOptimal
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : isCritical
                ? "linear-gradient(90deg, #ef4444, #f87171)"
                : "linear-gradient(90deg, #6366f1, #818cf8)",
            }}
          />
        </div>

        {/* Habit Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {habitItems.map((item, index) => {
            const Icon = item.icon;
            const checked = habits[item.key];

            return (
              <motion.button
                key={item.key}
                id={`habit-${item.key}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => !questCompleted && onToggle(item.key)}
                disabled={questCompleted}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${
                    checked
                      ? `${item.color}55`
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background: checked
                    ? `${item.color}15`
                    : "rgba(255,255,255,0.03)",
                  cursor: questCompleted ? "default" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.3s ease",
                  opacity: questCompleted && !checked ? 0.5 : 1,
                }}
                whileHover={!questCompleted ? { scale: 1.02 } : {}}
                whileTap={!questCompleted ? { scale: 0.98 } : {}}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: checked
                      ? `${item.color}30`
                      : "rgba(255,255,255,0.05)",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {checked ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle
                          size={20}
                          style={{ color: item.color }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Icon
                          size={18}
                          style={{
                            color: "rgba(255,255,255,0.4)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: checked ? item.color : "rgba(255,255,255,0.8)",
                      textDecoration: checked ? "line-through" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      marginTop: "2px",
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Status */}
        <AnimatePresence>
          {questCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: isOptimal
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(239, 68, 68, 0.15)",
                border: `1px solid ${
                  isOptimal
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
                fontSize: "12px",
                fontWeight: 600,
                color: isOptimal ? "#34d399" : "#f87171",
                textAlign: "center",
              }}
            >
              {isOptimal
                ? "🎉 Quest Selesai! Duniamu bersinar!"
                : "⚠️ Quest Selesai. Duniamu retak..."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
