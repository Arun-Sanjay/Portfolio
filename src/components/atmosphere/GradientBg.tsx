"use client";

import { useEffect, useRef } from "react";

export default function GradientBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateGradients = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = scrollY / (document.documentElement.scrollHeight - vh);

      containerRef.current.style.setProperty(
        "--g1-x",
        `${30 + progress * 40}%`
      );
      containerRef.current.style.setProperty(
        "--g1-y",
        `${20 + progress * 30}%`
      );
      containerRef.current.style.setProperty(
        "--g2-x",
        `${70 - progress * 30}%`
      );
      containerRef.current.style.setProperty(
        "--g2-y",
        `${60 + progress * 20}%`
      );
      containerRef.current.style.setProperty(
        "--g3-x",
        `${50 + progress * 20}%`
      );
      containerRef.current.style.setProperty(
        "--g3-y",
        `${40 - progress * 15}%`
      );

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateGradients);
        ticking = true;
      }
    };

    updateGradients();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        ["--g1-x" as string]: "30%",
        ["--g1-y" as string]: "20%",
        ["--g2-x" as string]: "70%",
        ["--g2-y" as string]: "60%",
        ["--g3-x" as string]: "50%",
        ["--g3-y" as string]: "40%",
        background: `
          radial-gradient(
            ellipse 60% 50% at var(--g1-x) var(--g1-y),
            rgba(10, 15, 30, 0.6) 0%,
            transparent 70%
          ),
          radial-gradient(
            ellipse 50% 60% at var(--g2-x) var(--g2-y),
            rgba(15, 10, 25, 0.4) 0%,
            transparent 70%
          ),
          radial-gradient(
            ellipse 55% 45% at var(--g3-x) var(--g3-y),
            rgba(5, 10, 20, 0.3) 0%,
            transparent 70%
          )
        `,
      }}
      aria-hidden="true"
    />
  );
}
