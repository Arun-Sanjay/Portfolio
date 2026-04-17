"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
}

export default function AmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 25,
      size: 1 + Math.random() * 2,
      opacity: 0.04 + Math.random() * 0.08,
      drift: -30 + Math.random() * 60,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes particleDrift {
          0% {
            transform: translateY(105vh) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-5vh) translateX(var(--drift));
            opacity: 0;
          }
        }
      `}</style>
      <div
        className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              bottom: 0,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.4)",
              opacity: p.opacity,
              ["--drift" as string]: `${p.drift}px`,
              animation: `particleDrift ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
