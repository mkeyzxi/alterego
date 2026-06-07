import { motion } from "framer-motion";
import Image from "next/image";

interface AvatarRendererProps {
  worldState: "neutral" | "optimal" | "critical";
  equippedPet: string | null;
  equippedItem: string | null;
}

export default function AvatarRenderer({
  worldState,
  equippedPet,
  equippedItem,
}: AvatarRendererProps) {
  const isHealthy = worldState === "optimal";
  const avatarSrc = isHealthy ? "/img/avatar_healthy.png" : "/img/avatar_tired.png";
  const bgSrc = isHealthy ? "/img/bg_city_day.png" : "/img/bg_city_glitch.png";

  const glitchAnimation = {
    x: [0, -2, 2, -1, 1, 0],
    opacity: [1, 0.8, 0.9, 0.7, 0.9, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: "linear" as const,
    },
  };

  const petMap: Record<string, string> = {
    pet_cat: "/img/pet_cat.png",
    pet_dog: "/img/pet_dog.png",
  };

  const itemMap: Record<string, string> = {
    item_plant: "/img/item_plant.png",
    item_lamp: "/img/item_lamp.png",
  };

  return (
    <>
      {/* City Background Layer */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1]"
        style={{
          height: "50%",
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
            sizes="100vw"
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

      {/* Instruction #2: Avatar — center bottom with breathe animation */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 md:w-64 w-48 pointer-events-none"
      >
        <motion.div
          animate={
            worldState === "critical"
              ? glitchAnimation
              : {} /* breathe handled by CSS class */
          }
          className={worldState !== "critical" ? "animate-breathe" : ""}
        >
          <Image
            src={avatarSrc}
            alt="Avatar"
            width={256}
            height={320}
            className="w-full h-auto object-contain"
            style={{
              filter:
                worldState === "critical"
                  ? "brightness(0.7) saturate(0.6)"
                  : "drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))",
            }}
            priority
          />
        </motion.div>
      </div>

      {/* Instruction #2: Pet — bottom-right corner */}
      {equippedPet && petMap[equippedPet] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-10 right-10 z-10 md:w-32 w-24 pointer-events-none animate-breathe"
        >
          <Image
            src={petMap[equippedPet]}
            alt="Pet"
            width={128}
            height={128}
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
            }}
          />
        </motion.div>
      )}

      {/* Instruction #2: Item — bottom-left corner */}
      {equippedItem && itemMap[equippedItem] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-10 left-10 z-10 md:w-32 w-24 pointer-events-none animate-breathe"
        >
          <Image
            src={itemMap[equippedItem]}
            alt="Equipped Item"
            width={128}
            height={128}
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
            }}
          />
        </motion.div>
      )}
    </>
  );
}
