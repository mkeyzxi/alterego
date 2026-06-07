import { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

interface ProceduralBackgroundProps {
  worldState: "neutral" | "optimal" | "critical";
}

export default function ProceduralBackground({ worldState }: ProceduralBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const optimalConfig: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: { value: 50, density: { enable: true } },
        color: { value: ["#10b981", "#34d399", "#6ee7b7", "#fbbf24"] },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.2, max: 0.8 },
          animation: { enable: true, speed: 0.5, sync: false },
        },
        size: {
          value: { min: 2, max: 6 },
          animation: { enable: true, speed: 2, sync: false },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 1 },
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: { default: "out" as const },
        },
        twinkle: {
          particles: { enable: true, frequency: 0.05, opacity: 1 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const criticalConfig: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: { value: 80, density: { enable: true } },
        color: { value: ["#ef4444", "#f87171", "#22c55e", "#4ade80"] },
        shape: { type: "char", options: { char: { value: ["0", "1", "█", "▓", "░", "▒"], font: "monospace", weight: "400" } } },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: { enable: true, speed: 1, sync: false },
        },
        size: {
          value: { min: 6, max: 14 },
        },
        move: {
          enable: true,
          speed: { min: 1, max: 4 },
          direction: "bottom" as const,
          straight: true,
          outModes: { default: "out" as const },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const neutralConfig: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: { value: 20, density: { enable: true } },
        color: { value: ["#6366f1", "#818cf8", "#a5b4fc"] },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: { enable: true, speed: 0.3, sync: false },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 1, sync: false },
        },
        move: {
          enable: true,
          speed: { min: 0.1, max: 0.5 },
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: { default: "out" as const },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const config =
    worldState === "optimal"
      ? optimalConfig
      : worldState === "critical"
      ? criticalConfig
      : neutralConfig;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={config}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
