"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowText from "@/components/ui/GlowText";
import { Code2, Mail, ExternalLink } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const LINKS = [
  { label: "GitHub", href: CONTACT.github, icon: Code2 },
  { label: "Email", href: CONTACT.email ? `mailto:${CONTACT.email}` : "#", icon: Mail },
  { label: "LinkedIn", href: CONTACT.linkedin || "#", icon: ExternalLink },
];

export default function Chapter05Signal() {
  const progress = useScrollProgress();
  if (progress < 0.86) return null;

  const o = Math.min(1, (progress - 0.86) / 0.04);

  return (
    <section
      style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      aria-label="Chapter 05: Signal"
    >
      <div style={{ maxWidth: "500px", textAlign: "center", opacity: o, padding: "0 24px" }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", pointerEvents: "auto" }}>
            <SectionLabel chapter="05" title="SIGNAL" />
          </motion.div>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: "var(--font-playfair)", fontWeight: 700, color: "#fff",
            fontSize: "clamp(38px, 5.5vw, 80px)", lineHeight: 0.95, marginBottom: "40px",
          }}>
            <GlowText>Let&apos;s Build <em style={{ fontStyle: "italic" }}>Something</em></GlowText>
          </motion.h2>

          <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "48px", pointerEvents: "auto" }}>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-jetbrains)", fontSize: "13px", color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: "8px" }}
                aria-label={l.label}
              >
                <l.icon size={16} style={{ opacity: 0.5 }} />
                {l.label}
              </a>
            ))}
          </motion.div>

          <motion.footer variants={fadeUp}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>&copy; 2026 S Arun Sanjay</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }}>Built with Next.js, Three.js, and too much ambition.</p>
          </motion.footer>
        </motion.div>
      </div>
    </section>
  );
}
