"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowText from "@/components/ui/GlowText";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PROJECTS } from "@/lib/constants";

export default function Chapter03Projects() {
  const progress = useScrollProgress();
  if (progress < 0.40 || progress > 0.72) return null;

  const titleOpacity =
    progress < 0.42 ? Math.max(0, (progress - 0.40) / 0.02)
    : progress > 0.46 ? Math.max(0, 1 - (progress - 0.46) / 0.02)
    : 1;

  return (
    <section
      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}
      aria-label="Chapter 03: What I've Built"
    >
      <div style={{
        width: "100%",
        paddingLeft: "clamp(24px, 5vw, 80px)",
        paddingRight: "50%", // cube is on right
      }}>
        {titleOpacity > 0 && (
          <div style={{ opacity: titleOpacity, marginBottom: "32px" }}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} style={{ pointerEvents: "auto" }}>
                <SectionLabel chapter="03" title="WHAT I'VE BUILT" />
              </motion.div>
              <motion.h2 variants={fadeUp} style={{
                fontFamily: "var(--font-playfair)", fontWeight: 700, color: "#fff",
                fontSize: "clamp(38px, 5.5vw, 80px)", lineHeight: 0.95,
              }}>
                <GlowText>Projects That <em style={{ fontStyle: "italic" }}>Ship</em></GlowText>
              </motion.h2>
            </motion.div>
          </div>
        )}

        {PROJECTS.map((project, idx) => {
          const { start, end } = project.scrollRange;
          const vis = progress >= start - 0.01 && progress < end + 0.01;
          if (!vis) return null;
          const o = progress < start ? Math.max(0, 1 - (start - progress) / 0.01)
            : progress > end ? Math.max(0, 1 - (progress - end) / 0.01) : 1;

          return (
            <motion.div key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: o, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: "480px", pointerEvents: "auto" }}
            >
              <Card>
                <h3 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "16px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                  {project.subtitle}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "12px" }}>
                  {project.description}
                </p>
                <ul style={{ marginBottom: "14px" }}>
                  {project.highlights.map((h, i) => (
                    <li key={i} style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.45)", display: "flex", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: "#A6DAFF", flexShrink: 0 }}>·</span>{h}
                    </li>
                  ))}
                </ul>
                {project.stack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {project.stack.map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                )}
                {"team" in project && project.team && (
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "10px" }}>{project.team}</p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
