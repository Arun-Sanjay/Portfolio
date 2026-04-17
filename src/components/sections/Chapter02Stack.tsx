"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowText from "@/components/ui/GlowText";
import { SKILLS } from "@/lib/constants";

const CATEGORIES = [
  { name: "Frontend", skills: SKILLS.frontend },
  { name: "Backend", skills: SKILLS.backend },
  { name: "Mobile", skills: SKILLS.mobile },
  { name: "Tools", skills: SKILLS.tools },
];

const TUNNEL_STATS = [
  { text: "15+ Technologies", range: [0.30, 0.34] },
  { text: "3 Products Shipped", range: [0.34, 0.37] },
  { text: "1 Mission: Build.", range: [0.37, 0.41] },
];

export default function Chapter02Stack() {
  const progress = useScrollProgress();

  if (progress < 0.14 || progress > 0.44) return null;

  // Title fades in 0.16–0.22, fades out 0.28–0.32
  const titleIn = progress < 0.16 ? 0 : Math.min(1, (progress - 0.16) / 0.06);
  const titleOut = progress > 0.28 ? Math.max(0, 1 - (progress - 0.28) / 0.04) : 1;
  const titleOpacity = titleIn * titleOut;

  const inTunnel = progress >= 0.29;

  return (
    <section
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
      }}
      aria-label="Chapter 02: The Stack"
    >
      {/* Title + skills — on RIGHT side (cube is on left) */}
      {!inTunnel && titleOpacity > 0 && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "clamp(24px, 5vw, 80px)",
            paddingLeft: "50%",
            opacity: titleOpacity,
          }}
        >
          <div style={{ maxWidth: "500px" }}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ pointerEvents: "auto" }}>
              <SectionLabel chapter="02" title="THE STACK" />
            </motion.div>

            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#ffffff",
              fontSize: "clamp(38px, 5.5vw, 80px)",
              lineHeight: 0.95,
              marginBottom: "40px",
              opacity: 0.9,
            }}>
              <GlowText>
                The <em style={{ fontStyle: "italic" }}>Tools</em>
                <br />
                I Build With
              </GlowText>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {CATEGORIES.map((cat, idx) => {
                const catVis = progress > 0.20 + idx * 0.02
                  ? Math.min(1, (progress - (0.20 + idx * 0.02)) / 0.03) : 0;
                return (
                  <div key={cat.name} style={{ opacity: catVis }}>
                    <h3 style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "6px",
                      fontWeight: 700,
                    }}>
                      {cat.name}
                    </h3>
                    {cat.skills.map((s) => (
                      <p key={s} style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "3px",
                      }}>
                        {s}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tunnel stats — centered */}
      {inTunnel && (
        <div style={{ width: "100%", textAlign: "center" }}>
          <AnimatePresence mode="wait">
            {TUNNEL_STATS.map((stat, idx) =>
              progress >= stat.range[0] && progress < stat.range[1] ? (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.08 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 700,
                    fontSize: "clamp(32px, 4.5vw, 64px)",
                    color: "#ffffff",
                  }}>
                    <GlowText>{stat.text}</GlowText>
                  </span>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
