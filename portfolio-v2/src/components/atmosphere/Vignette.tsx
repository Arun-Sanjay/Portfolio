"use client";

export default function Vignette() {
  return (
    <div
      className="fixed inset-0 z-[99] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)",
      }}
      aria-hidden="true"
    />
  );
}
