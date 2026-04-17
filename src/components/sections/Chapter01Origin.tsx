"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowText from "@/components/ui/GlowText";
import Button from "@/components/ui/Button";
import { scrollToProgress } from "@/lib/smoothScroll";

export default function Chapter01Origin() {
  const progress = useScrollProgress();

  // Fade out 0.08–0.16
  const exit = Math.max(0, (progress - 0.08) / 0.08);
  const opacity = Math.max(0, 1 - exit);
  const yShift = exit * -100;

  if (opacity <= 0) return null;

  return (
    <section
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        // Text on the LEFT, cube is on the RIGHT
        paddingLeft: "clamp(24px, 5vw, 80px)",
        paddingRight: "50%", // leave right half for cube
        opacity,
        transform: `translateY(${yShift}px)`,
      }}
      aria-label="Chapter 01: Origin"
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} style={{ pointerEvents: "auto" }}>
            <SectionLabel chapter="01" title="ORIGIN" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#ffffff",
              fontSize: "clamp(44px, 7vw, 100px)",
              lineHeight: 0.95,
              marginBottom: "28px",
            }}
          >
            <GlowText>
              I Build Things
              <br />
              That <em style={{ fontStyle: "italic" }}>Matter</em>
            </GlowText>
          </motion.h1>

          <motion.div variants={fadeUp} style={{ marginBottom: "28px" }}>
            <p style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(14px, 1.1vw, 17px)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.5)",
            }}>
              S Arun Sanjay — Full Stack Developer & Founder
              <br />
              B.Tech CS (Cyber Security) · RVCE Bangalore
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap", pointerEvents: "auto" }}
          >
            <Button variant="primary" onClick={() => scrollToProgress(0.42)}>
              View Projects
            </Button>
            <Button variant="secondary" href="https://github.com/Arun-Sanjay">
              GitHub
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
