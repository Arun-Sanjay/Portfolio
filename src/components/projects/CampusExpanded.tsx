"use client";

import { motion } from "framer-motion";

const CREAM = "#F5F1E8";
const DARK = "#1A1A1A";
const TERRACOTTA = "#D4732A";
const MUTED = "#6B6560";

const stagger = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0, 0, 0.2, 1] as const } },
};

const algorithms = [
  {
    title: "pgvector RAG",
    description: "Semantic search over academic content using vector embeddings and retrieval-augmented generation",
  },
  {
    title: "Dijkstra\u2019s Algorithm",
    description: "Optimal placement pathway routing through skill graphs and career trajectories",
  },
  {
    title: "Whisper + MediaPipe",
    description: "Lecture transcription with speech-to-text and gesture analysis for engagement tracking",
  },
];

export default function CampusExpanded({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        color: DARK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 36,
          right: 40,
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "transparent",
          border: `1px solid rgba(26,26,26,0.15)`,
          color: MUTED,
          fontSize: 18,
          fontFamily: "var(--font-inter), sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = TERRACOTTA;
          e.currentTarget.style.color = TERRACOTTA;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(26,26,26,0.15)";
          e.currentTarget.style.color = MUTED;
        }}
      >
        &times;
      </button>

      {/* Main content */}
      <motion.div
        style={{
          maxWidth: 768,
          margin: "0 auto",
          padding: "100px 24px 80px",
          position: "relative",
        }}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Section label */}
        <motion.div
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: MUTED,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          /Research Project
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(40px, 7vw, 56px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: DARK,
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}
        >
          CampusIQ
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 20,
            fontStyle: "italic",
            color: MUTED,
            lineHeight: 1.4,
            marginBottom: 32,
          }}
        >
          An AI-powered academic &amp; placement platform for engineering students
        </motion.p>

        {/* Horizontal rule */}
        <motion.div
          variants={fadeUp}
          style={{
            width: "100%",
            height: 1,
            background: `rgba(26,26,26,0.12)`,
            marginBottom: 32,
          }}
        />

        {/* Description */}
        <motion.div
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16,
            lineHeight: 1.75,
            color: "#3D3A36",
            marginBottom: 48,
          }}
        >
          <p style={{ marginBottom: 16 }}>
            CampusIQ is a comprehensive AI platform designed for engineering
            students at RVCE Bangalore. The system combines pgvector-powered
            RAG pipelines for semantic search over academic content with
            Dijkstra&apos;s algorithm for computing optimal placement pathways
            through skill and career graphs.
          </p>
          <p>
            Lecture content is processed through OpenAI&apos;s Whisper for
            transcription, while MediaPipe handles gesture and engagement
            analysis during live sessions. The result is an end-to-end
            platform that understands both the content and the context of
            learning.
          </p>
        </motion.div>

        {/* Algorithm cards */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {algorithms.map((algo) => (
            <div
              key={algo.title}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(26,26,26,0.10)",
                borderRadius: 10,
                padding: "24px 20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  color: TERRACOTTA,
                  letterSpacing: "0.02em",
                  marginBottom: 10,
                }}
              >
                {algo.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: MUTED,
                }}
              >
                {algo.description}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Second rule */}
        <motion.div
          variants={fadeUp}
          style={{
            width: "100%",
            height: 1,
            background: `rgba(26,26,26,0.08)`,
            marginBottom: 32,
          }}
        />

        {/* Team section */}
        <motion.div
          variants={fadeUp}
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: MUTED,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Team
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#3D3A36",
            }}
          >
            6-person team &middot; Under Dr. Krishnappa H K &middot; RVCE Bangalore
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          variants={fadeUp}
          style={{ marginBottom: 48 }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: MUTED,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Status
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: TERRACOTTA,
            }}
          >
            ACTIVE DEVELOPMENT &middot; 2025&ndash;2026
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "20px 24px",
            background: "rgba(26,26,26,0.03)",
            borderRadius: 8,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: MUTED,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Stack
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 13,
              letterSpacing: "0.05em",
              color: "#3D3A36",
              lineHeight: 1.8,
            }}
          >
            Next.js &middot; Python &middot; PostgreSQL &middot; pgvector &middot; Whisper &middot; MediaPipe
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          variants={fadeUp}
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(26,26,26,0.06)",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 14,
            fontStyle: "italic",
            color: MUTED,
            textAlign: "center",
          }}
        >
          Rashtreeya Vidyalaya College of Engineering, Bangalore
        </motion.div>
      </motion.div>
    </div>
  );
}
