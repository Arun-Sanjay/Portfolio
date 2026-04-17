"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 15,
  duration: 10 + Math.random() * 15,
  opacity: 0.2 + Math.random() * 0.4,
}));

export default function MobileBackground() {
  const progress = useScrollProgress();

  // Shift gradient colors based on chapter
  let gradientColor = "rgba(20, 30, 60, 0.3)";
  if (progress > 0.7) {
    gradientColor = "rgba(60, 50, 20, 0.2)"; // Gold tint for arena
  } else if (progress > 0.4) {
    gradientColor = "rgba(15, 15, 30, 0.3)"; // Darker for projects
  } else if (progress > 0.2) {
    gradientColor = "rgba(20, 20, 50, 0.4)"; // Deep blue for stack
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* Radial gradient that shifts per chapter */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${gradientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle secondary glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, rgba(74, 111, 165, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* CSS particle dots */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            bottom: "-5px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `mobile-particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
