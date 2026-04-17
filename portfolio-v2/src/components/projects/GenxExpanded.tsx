"use client";

import { motion } from "framer-motion";

const CHARCOAL = "#1A1612";
const WARM_WHITE = "#E8D9C5";
const ORANGE = "#FF6B1A";
const CAUTION = "#FFD700";
const WARM_MUTED = "rgba(232,217,197,0.4)";

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

const specs = [
  { id: "SPEC_01", label: "COMPONENT SOURCING", value: "SP ROAD BANGALORE" },
  { id: "SPEC_02", label: "MODEL", value: "COMMISSION-BASED" },
  { id: "SPEC_03", label: "PARTNERSHIP", value: "SMART GAMING STORE" },
  { id: "SPEC_04", label: "SERVICE", value: "END-TO-END CUSTOM BUILDS" },
];

const processSteps = ["LEAD", "QUOTE", "SOURCE", "BUILD", "DELIVER"];

const bottomStats = [
  { value: "SP ROAD", label: "BANGALORE" },
  { value: "COMMISSION", label: "MODEL" },
  { value: "CUSTOM", label: "BUILDS" },
];

export default function GenxExpanded({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CHARCOAL,
        color: WARM_WHITE,
        fontFamily: "var(--font-jetbrains), monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blueprint grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(30,60,120,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,60,120,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 40,
          right: 40,
          zIndex: 10,
          background: "rgba(255,107,26,0.06)",
          border: `1px solid rgba(255,107,26,0.35)`,
          color: ORANGE,
          padding: "8px 24px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,107,26,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,107,26,0.06)";
        }}
      >
        [ CLOSE ]
      </button>

      {/* Main content */}
      <motion.div
        style={{
          maxWidth: 896,
          margin: "0 auto",
          padding: "100px 24px 80px",
          position: "relative",
          zIndex: 2,
        }}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Orange accent line */}
        <motion.div
          variants={fadeUp}
          style={{
            width: 120,
            height: 4,
            background: ORANGE,
            marginBottom: 32,
          }}
        />

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(36px, 6vw, 48px)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: WARM_WHITE,
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          GENX BUILDS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 16,
            letterSpacing: "0.06em",
            color: WARM_MUTED,
            marginBottom: 32,
            textTransform: "uppercase",
          }}
        >
          Custom PC Building &middot; Bangalore
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          style={{
            width: "100%",
            height: 1,
            background: `rgba(255,107,26,0.25)`,
            marginBottom: 40,
          }}
        />

        {/* Blueprint-style specs */}
        <motion.div
          variants={fadeUp}
          style={{
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: WARM_MUTED,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            SPECIFICATIONS:
          </div>
          {specs.map((spec) => (
            <div
              key={spec.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid rgba(232,217,197,0.06)",
                fontSize: 14,
                gap: 0,
              }}
            >
              <span
                style={{
                  color: ORANGE,
                  fontWeight: 700,
                  minWidth: 80,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}
              >
                {spec.id}
              </span>
              <span
                style={{
                  color: "rgba(232,217,197,0.15)",
                  margin: "0 16px",
                  flexShrink: 0,
                }}
              >
                &#x2503;
              </span>
              <span
                style={{
                  color: "rgba(232,217,197,0.3)",
                  marginRight: 8,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                  fontSize: 12,
                }}
              >
                {spec.label}:
              </span>
              <span
                style={{
                  color: WARM_WHITE,
                  letterSpacing: "0.04em",
                }}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Hazard tape stripe */}
        <motion.div
          variants={fadeUp}
          style={{
            width: "100%",
            height: 8,
            marginBottom: 40,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${ORANGE},
              ${ORANGE} 10px,
              ${CHARCOAL} 10px,
              ${CHARCOAL} 20px
            )`,
            opacity: 0.4,
          }}
        />

        {/* Process flow */}
        <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: WARM_MUTED,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            PROCESS FLOW:
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0,
            }}
          >
            {processSteps.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: i === 0 ? ORANGE : WARM_WHITE,
                    padding: "8px 16px",
                    border: `1px solid ${i === 0 ? `rgba(255,107,26,0.4)` : "rgba(232,217,197,0.1)"}`,
                    background: i === 0 ? "rgba(255,107,26,0.08)" : "transparent",
                  }}
                >
                  {step}
                </span>
                {i < processSteps.length - 1 && (
                  <span
                    style={{
                      color: "rgba(232,217,197,0.2)",
                      margin: "0 8px",
                      fontSize: 18,
                    }}
                  >
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Commission warning label */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "inline-block",
            padding: "10px 24px",
            border: `1px solid ${ORANGE}`,
            color: ORANGE,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginBottom: 48,
            background: "rgba(255,107,26,0.04)",
          }}
        >
          {"[ \u26A0 COMMISSION ONLY ]"}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            marginBottom: 48,
            background: "rgba(255,107,26,0.15)",
          }}
        >
          {bottomStats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: CHARCOAL,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: ORANGE,
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: WARM_MUTED,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(232,217,197,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: WARM_MUTED,
          }}
        >
          <span>GENX_BUILDS // 2025</span>
          <span style={{ color: CAUTION, opacity: 0.35 }}>OPERATIONAL</span>
          <span>BANGALORE, INDIA</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
