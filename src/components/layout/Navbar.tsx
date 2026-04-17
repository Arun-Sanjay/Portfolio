"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToProgress } from "@/lib/smoothScroll";
import { CHAPTERS } from "@/lib/scrollConfig";

const NAV_LINKS = CHAPTERS.map((ch) => ({
  label: ch.label,
  progress: ch.range.start,
}));

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (targetProgress: number) => {
    scrollToProgress(targetProgress);
    setIsOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(24px, 5vw, 80px)",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(0,240,255,0.06)",
      }}>
        <button onClick={() => handleNavClick(0)} style={{
          fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600,
          color: "#00F0FF", letterSpacing: "0.15em",
          background: "none", border: "none", cursor: "pointer",
          textTransform: "uppercase",
        }}>
          ARUN_SANJAY
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
          {NAV_LINKS.map((link) => (
            <button key={link.label} onClick={() => handleNavClick(link.progress)} style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 400,
              color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer",
              letterSpacing: "0.2em", textTransform: "uppercase",
              transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00F0FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              /{link.label}
            </button>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} style={{
          color: "rgba(0,240,255,0.6)", background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-jetbrains)", fontSize: 20,
        }} aria-label="Menu">
          {isOpen ? "\u2715" : "\u2630"}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.96)", backdropFilter: "blur(30px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
              pointerEvents: "auto",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button key={link.label} onClick={() => handleNavClick(link.progress)} style={{
                fontFamily: "var(--font-jetbrains)", fontSize: 16, fontWeight: 400,
                color: "rgba(0,240,255,0.5)", letterSpacing: "0.25em",
                background: "none", border: "none", cursor: "pointer",
                textTransform: "uppercase",
              }}>
                /{link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
