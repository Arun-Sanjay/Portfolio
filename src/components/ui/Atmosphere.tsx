"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number; left: number; delay: number; duration: number;
  size: number; opacity: number; drift: number;
}

export default function Atmosphere() {
  const atmoRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles client-side only to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 25,
        size: 1 + Math.random() * 3,
        opacity: 0.04 + Math.random() * 0.12,
        drift: -20 + Math.random() * 40,
      }))
    );
  }, []);

  // Scroll-driven gradient shift
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!atmoRef.current) return;
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      // Shift gradient positions with scroll
      const x1 = 20 + p * 30;
      const y1 = 50 - p * 20;
      const x2 = 80 - p * 40;
      const y2 = 20 + p * 30;
      const x3 = 50 + Math.sin(p * Math.PI * 2) * 20;
      const y3 = 80 - p * 30;

      atmoRef.current.style.setProperty("--atmo-x1", `${x1}%`);
      atmoRef.current.style.setProperty("--atmo-y1", `${y1}%`);
      atmoRef.current.style.setProperty("--atmo-x2", `${x2}%`);
      atmoRef.current.style.setProperty("--atmo-y2", `${y2}%`);
      atmoRef.current.style.setProperty("--atmo-x3", `${x3}%`);
      atmoRef.current.style.setProperty("--atmo-y3", `${y3}%`);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* A. Scroll-driven atmospheric gradient */}
      <div ref={atmoRef} className="atmosphere" />

      {/* B. Film grain */}
      <div className="grain-overlay" />

      {/* C. Vignette */}
      <div className="vignette" />

      {/* D. Ambient particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        {particles.map((p, i) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: i % 3 === 0 ? "rgba(0, 240, 255, 0.6)" : "rgba(255, 255, 255, 0.5)",
              opacity: 0,
              animation: `particleDrift ${p.duration}s ${p.delay}s linear infinite`,
              ["--p-opacity" as string]: p.opacity,
              ["--p-drift" as string]: `${p.drift}px`,
            }}
          />
        ))}
      </div>
    </>
  );
}
