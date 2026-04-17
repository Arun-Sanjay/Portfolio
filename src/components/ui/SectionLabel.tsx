"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

interface SectionLabelProps {
  chapter: string;
  title: string;
}

export default function SectionLabel({ chapter, title }: SectionLabelProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
    >
      <span style={{
        display: "inline-block", width: 6, height: 6, borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        boxShadow: "0 0 8px rgba(255,255,255,0.1)",
      }} />
      <span style={{
        fontFamily: "var(--font-jetbrains)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.25em",
        color: "rgba(255,255,255,0.3)",
        fontWeight: 500,
      }}>
        Chapter {chapter} — {title}
      </span>
    </motion.div>
  );
}
