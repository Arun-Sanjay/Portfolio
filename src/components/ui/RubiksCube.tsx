"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { type CubeChapterData } from "@/hooks/useCubeChapter";
import { SKILLS, PROJECTS, ACHIEVEMENTS, EDUCATION, CONTACT } from "@/lib/constants";

const SIZE = 340;
const HALF = SIZE / 2;
const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains)" };

const faceBase: React.CSSProperties = {
  position: "absolute",
  width: SIZE,
  height: SIZE,
  backfaceVisibility: "hidden",
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid rgba(0,240,255,0.07)",
};

/* Chapter-specific accent colors */
const CH_ACCENT: Record<number, string> = {
  1: "#00F0FF",
  2: "#A855F7",
  3: "#10B981",
  4: "#C9A84C",
  5: "#00F0FF",
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ═══ HUD Face ═══ */
function HudFace({ data, flash }: { data: CubeChapterData; flash: boolean }) {
  const accent = CH_ACCENT[data.chapter] || "#00F0FF";
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(160deg, #080812 0%, #030306 100%)",
      display: "flex", flexDirection: "column",
      position: "relative",
      opacity: flash ? 0.5 : 1,
      transition: "opacity 0.15s ease",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 5 }).map((_, i) => {
          const pos = ((i + 1) / 6) * SIZE;
          return (
            <g key={i}>
              <line x1={pos} y1={0} x2={pos} y2={SIZE} stroke={hexToRgba(accent, 0.025)} strokeWidth={1} />
              <line x1={0} y1={pos} x2={SIZE} y2={pos} stroke={hexToRgba(accent, 0.025)} strokeWidth={1} />
            </g>
          );
        })}
        <path d="M10,28 L10,10 L28,10" fill="none" stroke={hexToRgba(accent, 0.2)} strokeWidth={1.5} />
        <path d={`M${SIZE - 10},${SIZE - 28} L${SIZE - 10},${SIZE - 10} L${SIZE - 28},${SIZE - 10}`} fill="none" stroke={hexToRgba(accent, 0.2)} strokeWidth={1.5} />
        <path d={`M${SIZE - 28},10 L${SIZE - 10},10 L${SIZE - 10},28`} fill="none" stroke={hexToRgba(accent, 0.2)} strokeWidth={1.5} />
        <path d={`M10,${SIZE - 28} L10,${SIZE - 10} L28,${SIZE - 10}`} fill="none" stroke={hexToRgba(accent, 0.2)} strokeWidth={1.5} />
      </svg>

      <div style={{
        position: "absolute", inset: 0, display: "grid",
        gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(3,1fr)",
        gap: 3, padding: 8, pointerEvents: "none", zIndex: 2,
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            borderRadius: 6,
            border: `1px solid ${hexToRgba(accent, 0.035)}`,
            background: `linear-gradient(145deg, ${hexToRgba(accent, 0.012)} 0%, transparent 100%)`,
          }} />
        ))}
      </div>

      <div style={{
        position: "relative", zIndex: 3, flex: 1,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "22px 28px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...mono, fontSize: 9, letterSpacing: "0.3em", color: hexToRgba(accent, 0.6), fontWeight: 600 }}>
            CH.0{data.chapter}
          </span>
          <div style={{ width: 5, height: 5, background: accent, boxShadow: `0 0 6px ${accent}` }} />
        </div>

        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <div className="liquid-metal" style={{ ...mono, fontSize: 32, fontWeight: 700, lineHeight: 1, marginBottom: 14, letterSpacing: "0.06em" }}>
            {data.title}
          </div>
          <div style={{ width: 40, height: 1, margin: "0 auto 14px", background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: 500, letterSpacing: "0.06em" }}>
            {data.subtitle}
          </div>
          {data.details.map((line, i) => (
            <div key={i} style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 2, letterSpacing: "0.04em" }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ ...mono, fontSize: 8, letterSpacing: "0.25em", color: hexToRgba(accent, 0.25) }}>
            [ CLICK TO EXPAND ]
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══ Expanded detail content ═══ */
const DETAIL: Record<number, { title: string; content: React.ReactNode }> = {
  1: {
    title: "ORIGIN",
    content: (
      <div>
        <p style={{ ...mono, fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.9, marginBottom: 32 }}>
          Full stack developer and founder. B.Tech Computer Science (Cyber Security) at RVCE Bangalore.
          Building products that solve real problems — from gamified productivity apps to AI-powered academic platforms.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[{ n: "3", l: "PRODUCTS SHIPPED" }, { n: "20+", l: "BETA USERS" }, { n: "4TH", l: "SEMESTER" }].map((s) => (
            <div key={s.l} style={{ textAlign: "center", padding: "24px 12px", background: "rgba(0,240,255,0.03)", border: "1px solid rgba(0,240,255,0.08)" }}>
              <div className="liquid-metal" style={{ ...mono, fontSize: 28, fontWeight: 700 }}>{s.n}</div>
              <div style={{ ...mono, fontSize: 9, color: "rgba(0,240,255,0.4)", marginTop: 8, letterSpacing: "0.15em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  2: {
    title: "THE STACK",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {Object.entries(SKILLS).map(([cat, skills]) => (
          <div key={cat}>
            <h3 style={{ ...mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#A855F7", fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(168,85,247,0.15)" }}>{cat}</h3>
            {(skills as string[]).map((s: string) => (
              <div key={s} style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{s}</div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  3: {
    title: "PROJECTS",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {PROJECTS.map((p, idx) => (
          <div key={idx} style={{ padding: 24, background: "rgba(16,185,129,0.02)", border: "1px solid rgba(16,185,129,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
              <h3 style={{ ...mono, fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.title}</h3>
            </div>
            <p style={{ ...mono, fontSize: 12, color: "rgba(16,185,129,0.5)", marginBottom: 10, letterSpacing: "0.06em" }}>{p.subtitle}</p>
            <p style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.8 }}>{p.description}</p>
          </div>
        ))}
      </div>
    ),
  },
  4: {
    title: "THE ARENA",
    content: (
      <div>
        <div style={{ padding: 28, background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.12)", marginBottom: 16 }}>
          <h3 style={{ ...mono, fontSize: 14, fontWeight: 700, color: "rgba(201,168,76,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{ACHIEVEMENTS[0].title}</h3>
          <p style={{ ...mono, fontSize: 13, color: "rgba(201,168,76,0.5)", marginBottom: 14 }}>{ACHIEVEMENTS[0].subtitle}</p>
          <p style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: 14 }}>{ACHIEVEMENTS[0].description}</p>
          <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{ACHIEVEMENTS[0].journey}</p>
          <p style={{ ...mono, fontSize: 11, color: "rgba(201,168,76,0.35)", marginTop: 10 }}>{ACHIEVEMENTS[0].date}</p>
        </div>
        <div style={{ padding: 24, background: "rgba(201,168,76,0.015)", border: "1px solid rgba(201,168,76,0.06)" }}>
          <h3 style={{ ...mono, fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{EDUCATION.institution}</h3>
          <p style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{EDUCATION.degree}</p>
          <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>{EDUCATION.semester} · {EDUCATION.years}</p>
        </div>
      </div>
    ),
  },
  5: {
    title: "SIGNAL",
    content: (
      <div style={{ textAlign: "center" }}>
        <p style={{ ...mono, fontSize: 15, color: "rgba(255,255,255,0.35)", lineHeight: 1.9, marginBottom: 36 }}>
          Open to projects, collaborations, and conversations about building things that matter.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[{ label: "GITHUB", href: CONTACT.github }, { label: "EMAIL", href: "#" }, { label: "LINKEDIN", href: "#" }].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{
              ...mono, fontSize: 11, letterSpacing: "0.15em", color: "rgba(0,240,255,0.5)",
              textDecoration: "none", padding: "14px 32px",
              border: "1px solid rgba(0,240,255,0.1)", background: "rgba(0,240,255,0.02)",
            }}>{l.label}</a>
          ))}
        </div>
      </div>
    ),
  },
};

/* ═══ Iron Man Expansion ═══ */
const STAGGER = [4, 1, 3, 5, 7, 0, 2, 6, 8];
const ROT_X = [30, 40, 25, 45, 50, 35, 20, 38, 28];
const ROT_Y = [-25, 0, 25, -20, 0, 20, -25, 0, 25];
const PANEL_ALPHA = [0.04, 0.025, 0.04, 0.025, 0.06, 0.025, 0.04, 0.025, 0.04];

function ExpandedView({ chapter, onClose }: { chapter: number; onClose: () => void }) {
  const d = DETAIL[chapter];
  if (!d) return null;
  const accent = CH_ACCENT[chapter] || "#00F0FF";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 9999, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(30px)",
        cursor: "pointer", overflow: "hidden",
      }}
      onClick={onClose}
    >
      {/* 9 panels fly from cube center */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)",
        gap: 3, padding: "3vh 3vw",
      }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const order = STAGGER.indexOf(i);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.02, opacity: 0, rotateX: ROT_X[i], rotateY: ROT_Y[i] }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0 }}
              exit={{ scale: 0.02, opacity: 0, rotateX: -ROT_X[i], rotateY: -ROT_Y[i] }}
              transition={{ delay: order * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: hexToRgba(accent, PANEL_ALPHA[i]),
                border: `1px solid ${hexToRgba(accent, 0.06)}`,
                transformStyle: "preserve-3d",
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "8vh 10vw", overflowY: "auto",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860, width: "100%", cursor: "default", position: "relative" }}>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: -10, right: -10,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            background: hexToRgba(accent, 0.06), border: `1px solid ${hexToRgba(accent, 0.15)}`,
            color: hexToRgba(accent, 0.6), cursor: "pointer", ...mono, fontSize: 16,
          }}>
            ✕
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <span style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", color: hexToRgba(accent, 0.6) }}>CH.0{chapter}</span>
            <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${hexToRgba(accent, 0.4)}, transparent)` }} />
            <span style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: hexToRgba(accent, 0.25) }}>DEEP DIVE</span>
          </div>
          <h2 style={{ ...mono, fontSize: 38, fontWeight: 700, marginBottom: 28, lineHeight: 1.1, letterSpacing: "0.06em", color: accent }}>
            {d.title}
          </h2>
          <div style={{ width: 80, height: 1, marginBottom: 36, background: `linear-gradient(90deg, ${hexToRgba(accent, 0.4)}, transparent)` }} />
          {d.content}
        </div>
      </motion.div>

      {/* Close hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "absolute", bottom: "4vh", left: "50%", transform: "translateX(-50%)",
          ...mono, fontSize: 9, letterSpacing: "0.25em", color: hexToRgba(accent, 0.25), pointerEvents: "none",
        }}
      >
        [ CLICK ANYWHERE TO CLOSE ]
      </motion.div>
    </motion.div>
  );
}

/* ═══ Main Cube ═══ */
interface Props {
  data: CubeChapterData;
  flash: boolean;
  rotY?: number;
  rotX?: number;
  rotZ?: number;
}

export default function RubiksCube({ data, flash, rotY = 0, rotX = 0, rotZ = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const accent = CH_ACCENT[data.chapter] || "#00F0FF";
  const continuousTransform = `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
  const face = <HudFace data={data} flash={flash} />;

  return (
    <>
      <div onClick={() => setExpanded(true)} style={{ position: "relative", width: SIZE, height: SIZE, cursor: "pointer" }}>
        {/* Outer glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: SIZE * 2, height: SIZE * 2, borderRadius: "50%",
          background: `radial-gradient(circle, ${hexToRgba(accent, 0.04)} 0%, transparent 55%)`,
          filter: "blur(80px)", pointerEvents: "none", transition: "background 0.8s",
        }} />
        {/* Inner glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: SIZE * 1.1, height: SIZE * 1.1, borderRadius: "50%",
          background: `radial-gradient(circle, ${hexToRgba(accent, 0.08)} 0%, transparent 70%)`,
          filter: "blur(40px)", pointerEvents: "none", transition: "background 0.8s",
          animation: "cubeGlow 4s ease-in-out infinite",
        }} />
        {/* Edge ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: SIZE + 20, height: SIZE + 20, borderRadius: 20,
          border: `1px solid ${hexToRgba(accent, 0.08)}`,
          boxShadow: `0 0 30px ${hexToRgba(accent, 0.04)}, inset 0 0 30px ${hexToRgba(accent, 0.02)}`,
          pointerEvents: "none", transition: "all 0.8s",
        }} />

        <div style={{ perspective: 1200, perspectiveOrigin: "center center", width: SIZE, height: SIZE, position: "relative", zIndex: 1 }}>
          <div style={{ width: SIZE, height: SIZE, transformStyle: "preserve-3d", transform: continuousTransform }}>
            <div style={{ ...faceBase, transform: `translateZ(${HALF}px)` }}>{face}</div>
            <div style={{ ...faceBase, transform: `rotateY(90deg) translateZ(${HALF}px)` }}>{face}</div>
            <div style={{ ...faceBase, transform: `rotateY(180deg) translateZ(${HALF}px)` }}>{face}</div>
            <div style={{ ...faceBase, transform: `rotateY(-90deg) translateZ(${HALF}px)` }}>{face}</div>
            <div style={{ ...faceBase, transform: `rotateX(90deg) translateZ(${HALF}px)` }}>{face}</div>
            <div style={{ ...faceBase, transform: `rotateX(-90deg) translateZ(${HALF}px)` }}>{face}</div>
          </div>
        </div>
      </div>

      {/* Portal to body — bypasses transform parent stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {expanded && <ExpandedView chapter={data.chapter} onClose={() => setExpanded(false)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
