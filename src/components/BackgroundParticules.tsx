// BackgroundParticles.tsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const BackgroundParticles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // ✅ compatible avec les packages installés
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: { value: "#000000" },
        },
        particles: {
          number: {
            value: 100,
            density: { enable: true, area: 800 },
          },
          color: { value: "#ffffff" },
          opacity: {
            value: 0.3,
            random: true,
          },
          size: {
            value: 1.5,
            random: true,
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            outModes: {
              default: "out",
            },
          },
        },
      }}
    />
  );
};

export default BackgroundParticles;
