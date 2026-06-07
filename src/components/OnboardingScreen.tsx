import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, ChevronRight, Sparkles } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (username: string) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"name" | "ready">("name");

  const handleSubmit = () => {
    if (username.trim().length < 2) return;
    setStep("ready");
  };

  const handleStart = () => {
    onComplete(username.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          textAlign: "center",
          maxWidth: "420px",
          width: "90%",
          padding: "20px",
        }}
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginBottom: "32px" }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "#e2e8f0",
              letterSpacing: "4px",
              marginBottom: "8px",
              textShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            ALTER<span style={{ color: "#818cf8" }}>EGO</span>
          </h1>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Dunia virtual yang berubah seiring dirimu
          </p>
        </motion.div>

        {/* Avatar Preview */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "140px",
            height: "170px",
            margin: "0 auto 32px",
            position: "relative",
            filter: "drop-shadow(0 0 25px rgba(99, 102, 241, 0.3))",
          }}
        >
          <Image
            src="/img/avatar_healthy.png"
            alt="Avatar"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </motion.div>

        {step === "name" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Username Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: "20px",
              }}
            >
              <User size={20} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
              <input
                id="onboarding-username"
                type="text"
                placeholder="Masukkan nama kamu..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                maxLength={20}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#e2e8f0",
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              id="onboarding-submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={username.trim().length < 2}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background:
                  username.trim().length >= 2
                    ? "linear-gradient(135deg, #6366f1, #818cf8)"
                    : "rgba(255,255,255,0.08)",
                color:
                  username.trim().length >= 2 ? "white" : "rgba(255,255,255,0.3)",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: username.trim().length >= 2 ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              Lanjutkan
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {step === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              style={{
                color: "#e2e8f0",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Selamat datang, <span style={{ color: "#818cf8" }}>{username}</span>!
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                marginBottom: "28px",
                lineHeight: "1.6",
              }}
            >
              Dunia virtualmu menunggu. Selesaikan quest harianmu
              <br />
              untuk membuat dunia ini bersinar!
            </p>

            <motion.button
              id="onboarding-start"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              <Sparkles size={20} />
              Mulai Petualangan
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
