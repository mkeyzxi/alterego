import { motion } from "framer-motion";
import Image from "next/image";

interface AvatarRendererProps {
  worldState: "neutral" | "optimal" | "critical";
  equippedPet: string | null;
}

export default function AvatarRenderer({ worldState, equippedPet }: AvatarRendererProps) {
  const isHealthy = worldState === "optimal";
  const avatarSrc = isHealthy ? "/img/avatar_healthy.png" : "/img/avatar_tired.png";
  const bgSrc = isHealthy ? "/img/bg_city_day.png" : "/img/bg_city_glitch.png";

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const glitchAnimation = {
    x: [0, -2, 2, -1, 1, 0],
    opacity: [1, 0.8, 0.9, 0.7, 0.9, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: "linear",
    },
  };

  const petMap: Record<string, string> = {
    pet_cat: "/img/pet_cat.png",
    pet_dog: "/img/pet_dog.png",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {/* City Background Layer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          zIndex: 1,
          opacity: worldState === "neutral" ? 0.3 : 0.5,
          transition: "opacity 1s ease",
        }}
      >
        <motion.div
          animate={worldState === "critical" ? glitchAnimation : {}}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <Image
            src={bgSrc}
            alt="City background"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "bottom",
              filter:
                worldState === "critical"
                  ? "hue-rotate(180deg) saturate(0.5)"
                  : "none",
            }}
            priority
          />
        </motion.div>
      </div>

      {/* Avatar */}
      <motion.div
        animate={isHealthy ? floatAnimation : glitchAnimation}
        style={{
          position: "relative",
          zIndex: 10,
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "180px",
            height: "220px",
          }}
        >
          <Image
            src={avatarSrc}
            alt="Avatar"
            fill
            style={{
              objectFit: "contain",
              filter:
                worldState === "critical"
                  ? "brightness(0.7) saturate(0.6)"
                  : "drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))",
            }}
            priority
          />
        </div>

        {/* Equipped Pet */}
        {equippedPet && petMap[equippedPet] && (
          <motion.div
            animate={floatAnimation}
            style={{
              position: "absolute",
              bottom: "-10px",
              right: "-60px",
              width: "80px",
              height: "80px",
            }}
          >
            <Image
              src={petMap[equippedPet]}
              alt="Pet"
              fill
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
