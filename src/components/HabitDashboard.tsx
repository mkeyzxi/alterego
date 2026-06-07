import { motion, AnimatePresence } from "framer-motion";
import { Moon, Droplets, Footprints, CheckCircle, Sparkles, Plus } from "lucide-react";

interface HabitDashboardProps {
  habits: { sleep: boolean; water: number; walk: boolean };
  onToggleSleep: () => void;
  onToggleWalk: () => void;
  onAddWater: () => void;
  worldState: "neutral" | "optimal" | "critical";
  questCompleted: boolean;
}

export default function HabitDashboard({
  habits,
  onToggleSleep,
  onToggleWalk,
  onAddWater,
  worldState,
  questCompleted,
}: HabitDashboardProps) {
  // Count completed: sleep (bool) + water===8 (bool) + walk (bool)
  const completedCount =
    (habits.sleep ? 1 : 0) +
    (habits.water === 8 ? 1 : 0) +
    (habits.walk ? 1 : 0);

  const isOptimal = worldState === "optimal";
  const isCritical = worldState === "critical";

  // Boolean habit items (sleep, walk)
  const boolHabits = [
    {
      key: "sleep" as const,
      label: "Tidur Tepat Waktu",
      description: "Tidur sebelum jam 11 malam",
      icon: Moon,
      color: "#818cf8",
      checked: habits.sleep,
      onToggle: onToggleSleep,
    },
    {
      key: "walk" as const,
      label: "Jalan Kaki",
      description: "Minimal 30 menit berjalan",
      icon: Footprints,
      color: "#34d399",
      checked: habits.walk,
      onToggle: onToggleWalk,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={`
        w-full bottom-0 absolute p-4 z-20
        md:absolute md:top-5 md:right-5 md:w-80 md:bottom-auto md:p-0
        ${isCritical ? "animate-glitch" : ""}
      `}
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

        {/* Habit Items — stacked flex-col */}
        <div className="flex flex-col gap-2.5">
          {/* Boolean habits: Sleep & Walk */}
          {boolHabits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.key}
                id={`habit-${item.key}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => !questCompleted && item.onToggle()}
                disabled={questCompleted}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${
                    item.checked
                      ? `${item.color}55`
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background: item.checked
                    ? `${item.color}15`
                    : "rgba(255,255,255,0.03)",
                  cursor: questCompleted ? "default" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.3s ease",
                  opacity: questCompleted && !item.checked ? 0.5 : 1,
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
                    background: item.checked
                      ? `${item.color}30`
                      : "rgba(255,255,255,0.05)",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {item.checked ? (
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
                      color: item.checked ? item.color : "rgba(255,255,255,0.8)",
                      textDecoration: item.checked ? "line-through" : "none",
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

          {/* Water Counter — Instruction #1 */}
          <motion.button
            id="habit-water"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => !questCompleted && onAddWater()}
            disabled={questCompleted || habits.water >= 8}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "12px",
              border: `1px solid ${
                habits.water === 8
                  ? "#38bdf855"
                  : "rgba(255,255,255,0.08)"
              }`,
              background: habits.water === 8
                ? "#38bdf815"
                : "rgba(255,255,255,0.03)",
              cursor: questCompleted || habits.water >= 8 ? "default" : "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.3s ease",
              opacity: questCompleted && habits.water < 8 ? 0.5 : 1,
            }}
            whileHover={!questCompleted && habits.water < 8 ? { scale: 1.02 } : {}}
            whileTap={!questCompleted && habits.water < 8 ? { scale: 0.98 } : {}}
          >
            {/* Icon / Check */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: habits.water === 8
                  ? "#38bdf830"
                  : "rgba(255,255,255,0.05)",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}
            >
              <AnimatePresence mode="wait">
                {habits.water === 8 ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle size={20} style={{ color: "#38bdf8" }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Droplets size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Label + Counter */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: habits.water === 8 ? "#38bdf8" : "rgba(255,255,255,0.8)",
                  textDecoration: habits.water === 8 ? "line-through" : "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Minum Air</span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: habits.water === 8 ? "#38bdf8" : "#94a3b8",
                    background: habits.water === 8
                      ? "rgba(56, 189, 248, 0.15)"
                      : "rgba(255,255,255,0.08)",
                    padding: "2px 10px",
                    borderRadius: "8px",
                  }}
                >
                  {habits.water}/8 🥤
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Klik untuk menambah gelas</span>
                {habits.water < 8 && !questCompleted && (
                  <Plus size={14} style={{ color: "#38bdf8" }} />
                )}
              </div>
            </div>

            {/* Water Progress Indicator */}
            <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    background: i < habits.water ? "#38bdf8" : "rgba(255,255,255,0.1)",
                    scale: i < habits.water ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: "6px",
                    height: "16px",
                    borderRadius: "3px",
                  }}
                />
              ))}
            </div>
          </motion.button>
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
