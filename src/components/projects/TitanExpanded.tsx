"use client";

import { motion } from "framer-motion";

const CYAN = "#5CE0D2";
const MAGENTA = "#FF00E5";

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

const features = [
  "Gamified XP & leveling system",
  "Cross-platform React Native app",
  "Real-time sync with Supabase",
  "Habit tracking with streak multipliers",
  "Performance analytics dashboard",
];

const stats = [
  { value: "20+", label: "BETA USERS" },
  { value: "ANDROID", label: "PLATFORM" },
  { value: "MAR 2026", label: "LAUNCHED" },
];

const techStack = [
  "REACT NATIVE",
  "EXPO",
  "ZUSTAND",
  "MMKV",
  "REANIMATED",
  "SUPABASE",
];

export default function TitanExpanded({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#E0F5F3",
        fontFamily: "var(--font-jetbrains), monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanlines overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(92,224,210,0.02) 2px, rgba(92,224,210,0.02) 4px)",
        }}
      />

      {/* Grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(92,224,210,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(92,224,210,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner HUD brackets */}
      <div aria-hidden="true" style={{ position: "fixed", top: 24, left: 24, width: 40, height: 40, borderTop: `1px solid ${CYAN}`, borderLeft: `1px solid ${CYAN}`, opacity: 0.5, zIndex: 3 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: 24, right: 24, width: 40, height: 40, borderTop: `1px solid ${CYAN}`, borderRight: `1px solid ${CYAN}`, opacity: 0.5, zIndex: 3 }} />
      <div aria-hidden="true" style={{ position: "fixed", bottom: 24, left: 24, width: 40, height: 40, borderBottom: `1px solid ${CYAN}`, borderLeft: `1px solid ${CYAN}`, opacity: 0.5, zIndex: 3 }} />
      <div aria-hidden="true" style={{ position: "fixed", bottom: 24, right: 24, width: 40, height: 40, borderBottom: `1px solid ${CYAN}`, borderRight: `1px solid ${CYAN}`, opacity: 0.5, zIndex: 3 }} />

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 40,
          right: 40,
          zIndex: 10,
          background: "rgba(92,224,210,0.05)",
          border: `1px solid rgba(92,224,210,0.3)`,
          color: CYAN,
          padding: "8px 20px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(92,224,210,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(92,224,210,0.05)";
        }}
      >
        [ ESC // CLOSE ]
      </button>

      {/* Main content */}
      <motion.div
        style={{
          maxWidth: 896,
          margin: "0 auto",
          padding: "100px 24px 80px",
          position: "relative",
          zIndex: 3,
        }}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* System status label */}
        <motion.div
          variants={fadeUp}
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: CYAN,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: CYAN, display: "inline-block", animation: "titanPulse 2s ease-in-out infinite" }} />
          SYS_STATUS: ONLINE
          <span style={{ animation: "titanBlink 1s step-end infinite", marginLeft: 2 }}>_</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(36px, 6vw, 48px)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: CYAN,
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          TITAN PROTOCOL
        </motion.h1>

        {/* Cyan divider */}
        <motion.div
          variants={fadeUp}
          style={{
            width: "100%",
            height: 1,
            background: CYAN,
            opacity: 0.4,
            marginBottom: 20,
          }}
        />

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(224,245,243,0.7)",
            marginBottom: 48,
            maxWidth: 600,
          }}
        >
          A gamified productivity system that turns discipline into XP.
          Built for those who treat personal growth as a game worth winning.
        </motion.p>

        {/* Stats grid */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            marginBottom: 48,
            background: "rgba(92,224,210,0.15)",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#000000",
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: CYAN,
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "rgba(224,245,243,0.4)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Feature list */}
        <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "rgba(224,245,243,0.3)",
              marginBottom: 16,
            }}
          >
            SYSTEM_FEATURES:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "rgba(224,245,243,0.8)",
                }}
              >
                <span style={{ color: CYAN, flexShrink: 0, fontWeight: 700 }}>&gt;</span>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack strip */}
        <motion.div
          variants={fadeUp}
          style={{
            marginBottom: 48,
            padding: "16px 20px",
            background: "rgba(92,224,210,0.04)",
            border: "1px solid rgba(92,224,210,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "rgba(224,245,243,0.3)",
              marginBottom: 10,
            }}
          >
            TECH_STACK:
          </div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "rgba(224,245,243,0.6)",
              lineHeight: 1.8,
            }}
          >
            {techStack.join(" \u00B7 ")}
          </div>
        </motion.div>

        {/* Action button */}
        <motion.div variants={fadeUp}>
          <a
            href="https://github.com/Arun-Sanjay"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              border: `1px solid ${CYAN}`,
              color: CYAN,
              fontSize: 13,
              letterSpacing: "0.12em",
              textDecoration: "none",
              transition: "all 0.2s",
              background: "rgba(92,224,210,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(92,224,210,0.12)";
              e.currentTarget.style.boxShadow = `0 0 20px rgba(92,224,210,0.15)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(92,224,210,0.04)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {"[ VIEW ON GITHUB \u2197 ]"}
          </a>
        </motion.div>

        {/* Bottom HUD line */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid rgba(92,224,210,0.1)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(224,245,243,0.2)",
          }}
        >
          <span>TITAN_OS v2.6.0</span>
          <span style={{ color: MAGENTA, opacity: 0.4 }}>NODE_ACTIVE</span>
          <span>SESSION_ENCRYPTED</span>
        </motion.div>
      </motion.div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes titanBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes titanPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
