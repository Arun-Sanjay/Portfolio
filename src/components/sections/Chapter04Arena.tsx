"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowText from "@/components/ui/GlowText";
import Card from "@/components/ui/Card";
import { ACHIEVEMENTS, EDUCATION } from "@/lib/constants";

export default function Chapter04Arena() {
  const progress = useScrollProgress();
  if (progress < 0.70 || progress > 0.88) return null;

  const o = progress < 0.73 ? Math.max(0, (progress - 0.70) / 0.03)
    : progress > 0.86 ? Math.max(0, 1 - (progress - 0.86) / 0.02) : 1;
  const a = ACHIEVEMENTS[0];

  return (
    <section
      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}
      aria-label="Chapter 04: The Arena"
    >
      {/* Text on right — cube is centered */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "clamp(24px, 5vw, 80px)",
        paddingLeft: "50%",
        opacity: o,
      }}>
        <div style={{ maxWidth: "500px" }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} style={{ pointerEvents: "auto" }}>
              <SectionLabel chapter="04" title="THE ARENA" />
            </motion.div>
            <motion.h2 variants={fadeUp} style={{
              fontFamily: "var(--font-playfair)", fontWeight: 700, color: "#fff",
              fontSize: "clamp(38px, 5.5vw, 80px)", lineHeight: 0.95, marginBottom: "32px",
            }}>
              <GlowText>Tested In <em style={{ fontStyle: "italic" }}>Competition</em></GlowText>
            </motion.h2>

            <motion.div variants={fadeUp} style={{ marginBottom: "16px", pointerEvents: "auto" }}>
              <Card gold>
                <h3 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "15px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{a.title}</h3>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "13px", color: "rgba(201,168,76,0.7)", marginBottom: "10px" }}>{a.subtitle}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "8px" }}>{a.description}</p>
                <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>{a.journey}</p>
                <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "rgba(201,168,76,0.5)" }}>{a.date}</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} style={{ pointerEvents: "auto" }}>
              <Card>
                <h3 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "13px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{EDUCATION.institution}</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{EDUCATION.degree}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{EDUCATION.semester} · {EDUCATION.years}</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
