"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 right-0 w-[2px] h-screen z-50 bg-white/[0.03]">
      <div
        className="w-full transition-none"
        style={{
          height: `${progress * 100}%`,
          backgroundColor: "#00F0FF",
          boxShadow: "0 0 6px rgba(0,240,255,0.4), 0 0 12px rgba(0,240,255,0.15)",
        }}
      />
    </div>
  );
}
