"use client";

import { useEffect, useRef } from "react";
import { initSmoothScroll, scrollToProgress } from "@/lib/smoothScroll";
import { useCubeMotion } from "@/hooks/useCubeMotion";
import { useCubeChapter } from "@/hooks/useCubeChapter";
import Navbar from "@/components/layout/Navbar";
import ChapterIndicator from "@/components/layout/ChapterIndicator";
import ScrollProgress from "@/components/layout/ScrollProgress";
import RubiksCube from "@/components/ui/RubiksCube";
import { SKILLS, PROJECTS, ACHIEVEMENTS, EDUCATION, CONTACT } from "@/lib/constants";
import { Code2, Mail, ExternalLink } from "lucide-react";
import Atmosphere from "@/components/ui/Atmosphere";

/* ── Chapter accent colors ── */
const A = {
  origin: "#00F0FF",
  stack: "#A855F7",
  projects: "#10B981",
  arena: "#C9A84C",
  signal: "#00F0FF",
};

function hx(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ── Small reusable pieces ── */
const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains)" };

function CyberLine({ color = "#00F0FF", w = 80 }: { color?: string; w?: number }) {
  return <div style={{ width: w, height: 1, background: `linear-gradient(90deg, ${hx(color, 0.4)}, transparent)`, flexShrink: 0 }} />;
}

function ChapterLabel({ num, label, color }: { num: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
      <span style={{ ...mono, fontSize: 11, letterSpacing: "0.4em", color: hx(color, 0.5), fontWeight: 600 }}>{num}</span>
      <CyberLine color={color} />
      <span style={{ ...mono, fontSize: 10, letterSpacing: "0.25em", color: hx(color, 0.3), textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function Badge({ children, color = "#10B981" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "5px 12px",
      ...mono, fontSize: 10, letterSpacing: "0.12em",
      color: hx(color, 0.5), textTransform: "uppercase",
      border: `1px solid ${hx(color, 0.12)}`, background: hx(color, 0.03),
    }}>
      {children}
    </span>
  );
}

export default function Home() {
  const cube = useCubeMotion();
  const { data, flash, setChapterIndex } = useCubeChapter();
  const sentinels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => { return initSmoothScroll(); }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sentinels.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setChapterIndex(i); },
        { threshold: 0.1, rootMargin: "-5% 0px -40% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [setChapterIndex]);

  const pad = "clamp(48px, 8vw, 120px)";

  return (
    <>
      <Navbar />
      <ChapterIndicator />
      <ScrollProgress />
      <Atmosphere />
      <div className="scanlines" />
      <div className="cyber-grid" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ═══ Sticky cube ═══ */}
        <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 1, pointerEvents: "none" }}>
          <div style={{
            position: "absolute",
            left: `${cube.x}%`, top: "50%",
            transform: `translateX(-50%) translateY(calc(-50% + ${cube.y}px))`,
            pointerEvents: "auto", willChange: "left, transform",
          }}>
            <RubiksCube data={data} flash={flash} rotY={cube.rotY} rotX={cube.rotX} rotZ={cube.rotZ} />

            {/* HUD label */}
            <div style={{
              position: "absolute", top: -55, left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", pointerEvents: "none",
            }}>
              <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${hx(A.origin, 0.25)})` }} />
              <span style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", color: hx(A.origin, 0.45), textTransform: "uppercase" }}>
                {`[ CH.0${data.chapter} // ${data.title} ]`}
              </span>
              <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, ${hx(A.origin, 0.25)}, transparent)` }} />
            </div>

            {/* Pulsing dot */}
            <div style={{
              position: "absolute", top: -65, left: "50%", transform: "translateX(-50%)",
              width: 4, height: 4, borderRadius: "50%", background: "#00F0FF",
              boxShadow: "0 0 8px #00F0FF, 0 0 16px rgba(0,240,255,0.3)",
              animation: "cubeGlow 2s ease-in-out infinite", pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* ═══ Sections ═══ */}
        <div style={{ position: "relative", zIndex: 2, marginTop: "-100vh", pointerEvents: "none" }}>

          {/* ────────────────────────────────────────
              CH1: ORIGIN — text LEFT, cube RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[0] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div style={{ width: "58%", paddingLeft: pad, paddingRight: 40, pointerEvents: "auto" }}>
              <ChapterLabel num="01" label="ORIGIN" color={A.origin} />

              <h1 className="glitch" data-text="I BUILD THINGS THAT MATTER" style={{
                ...mono, fontWeight: 700, color: "#fff",
                fontSize: "clamp(38px, 5.5vw, 80px)",
                letterSpacing: "0.05em", lineHeight: 1.1,
                marginBottom: 28, textTransform: "uppercase",
              }}>
                I BUILD THINGS THAT MATTER
              </h1>

              <p style={{
                ...mono, fontSize: 15, color: "rgba(255,255,255,0.35)",
                lineHeight: 1.9, marginBottom: 16, maxWidth: 520,
              }}>
                Full stack developer & founder. Building products that solve
                real problems — from gamified productivity apps to AI-powered
                academic platforms.
              </p>

              <p style={{
                ...mono, fontSize: 12, letterSpacing: "0.12em",
                color: hx(A.origin, 0.3), marginBottom: 40, textTransform: "uppercase",
              }}>
                S ARUN SANJAY · B.TECH CS (CYBER SECURITY) · RVCE BANGALORE
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={() => scrollToProgress(0.35)} className="cyber-btn" style={{
                  ...mono, fontSize: 12, letterSpacing: "0.15em",
                  color: A.origin, background: hx(A.origin, 0.04),
                  border: `1px solid ${hx(A.origin, 0.25)}`,
                  padding: "16px 40px", cursor: "pointer", textTransform: "uppercase",
                }}>
                  VIEW PROJECTS
                </button>
                <a href="https://github.com/Arun-Sanjay" target="_blank" rel="noopener noreferrer" className="cyber-btn" style={{
                  ...mono, fontSize: 12, letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.4)", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "16px 40px", textDecoration: "none", textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center",
                }}>
                  GITHUB &rarr;
                </a>
              </div>
            </div>
          </section>

          <div style={{ height: "50vh" }} />

          {/* ────────────────────────────────────────
              CH2: THE STACK — cube LEFT, text RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[1] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ width: "58%", paddingRight: pad, paddingLeft: 40, pointerEvents: "auto" }}>
              <ChapterLabel num="02" label="THE STACK" color={A.stack} />

              <h2 className="glitch" data-text="THE TOOLS I BUILD WITH" style={{
                ...mono, fontWeight: 700, color: "#fff",
                fontSize: "clamp(30px, 4.5vw, 68px)",
                letterSpacing: "0.05em", lineHeight: 1.1,
                marginBottom: 16, textTransform: "uppercase",
              }}>
                THE TOOLS I BUILD WITH
              </h2>

              <p style={{
                ...mono, fontSize: 14, color: "rgba(255,255,255,0.3)",
                lineHeight: 1.8, marginBottom: 36, maxWidth: 500,
              }}>
                15+ technologies across frontend, backend, mobile, and tooling.
                Always picking the right tool for the job.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {Object.entries(SKILLS).map(([cat, skills]) => (
                  <div key={cat} className="cyber-card">
                    <h3 style={{
                      ...mono, fontSize: 10, textTransform: "uppercase",
                      letterSpacing: "0.2em", color: A.stack,
                      fontWeight: 600, marginBottom: 12,
                      paddingBottom: 8, borderBottom: `1px solid ${hx(A.stack, 0.12)}`,
                    }}>{cat}</h3>
                    {(skills as string[]).map((s: string) => (
                      <p key={s} style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 5 }}>{s}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div style={{ height: "50vh" }} />

          {/* ────────────────────────────────────────
              CH3a: TITAN — text LEFT, cube RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[2] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div style={{ width: "58%", paddingLeft: pad, paddingRight: 40, pointerEvents: "auto" }}>
              <ChapterLabel num="03" label="PROJECTS" color={A.projects} />

              <h2 className="glitch" data-text="PROJECTS THAT SHIP" style={{
                ...mono, fontWeight: 700, color: "#fff",
                fontSize: "clamp(30px, 4.5vw, 68px)",
                letterSpacing: "0.05em", lineHeight: 1.1,
                marginBottom: 36, textTransform: "uppercase",
              }}>
                PROJECTS THAT SHIP
              </h2>

              <div className="cyber-card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, background: A.projects, boxShadow: `0 0 8px ${A.projects}` }} />
                  <h3 style={{ ...mono, fontSize: 17, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em" }}>{PROJECTS[0].title}</h3>
                </div>
                <p style={{ ...mono, fontSize: 12, color: hx(A.projects, 0.5), marginBottom: 14, letterSpacing: "0.08em" }}>{PROJECTS[0].subtitle}</p>
                <p style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: 16 }}>{PROJECTS[0].description}</p>
                {PROJECTS[0].highlights.map((h, i) => (
                  <div key={i} style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.3)", display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: A.projects, flexShrink: 0 }}>&gt;</span>{h}
                  </div>
                ))}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                  {PROJECTS[0].stack.map((t) => <Badge key={t} color={A.projects}>{t}</Badge>)}
                </div>
              </div>
            </div>
          </section>

          <div style={{ height: "50vh" }} />

          {/* ────────────────────────────────────────
              CH3b: CAMPUSIQ — cube LEFT, text RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[3] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ width: "58%", paddingRight: pad, paddingLeft: 40, pointerEvents: "auto" }}>
              <div className="cyber-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, background: A.projects, boxShadow: `0 0 8px ${A.projects}` }} />
                  <h3 style={{ ...mono, fontSize: 17, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em" }}>{PROJECTS[1].title}</h3>
                </div>
                <p style={{ ...mono, fontSize: 12, color: hx(A.projects, 0.5), marginBottom: 14, letterSpacing: "0.08em" }}>{PROJECTS[1].subtitle}</p>
                <p style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: 16 }}>{PROJECTS[1].description}</p>
                {PROJECTS[1].highlights.map((h, i) => (
                  <div key={i} style={{ ...mono, fontSize: 13, color: "rgba(255,255,255,0.3)", display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: A.projects, flexShrink: 0 }}>&gt;</span>{h}
                  </div>
                ))}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                  {PROJECTS[1].stack.map((t) => <Badge key={t} color={A.projects}>{t}</Badge>)}
                </div>
                {PROJECTS[1].team && (
                  <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 16, letterSpacing: "0.05em" }}>{PROJECTS[1].team}</p>
                )}
              </div>
            </div>
          </section>

          <div style={{ height: "50vh" }} />

          {/* ────────────────────────────────────────
              CH4: ARENA — cube LEFT, text RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[4] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ width: "58%", paddingRight: pad, paddingLeft: 40, pointerEvents: "auto" }}>
              <ChapterLabel num="04" label="THE ARENA" color={A.arena} />

              <h2 className="glitch" data-text="TESTED IN COMPETITION" style={{
                ...mono, fontWeight: 700, color: "#fff",
                fontSize: "clamp(30px, 4.5vw, 68px)",
                letterSpacing: "0.05em", lineHeight: 1.1,
                marginBottom: 36, textTransform: "uppercase",
              }}>
                TESTED IN COMPETITION
              </h2>

              <div className="cyber-card-gold" style={{ padding: 28, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, background: A.arena, boxShadow: `0 0 8px ${hx(A.arena, 0.6)}` }} />
                  <h3 style={{ ...mono, fontSize: 16, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em" }}>{ACHIEVEMENTS[0].title}</h3>
                </div>
                <p style={{ ...mono, fontSize: 13, color: hx(A.arena, 0.6), marginBottom: 14, letterSpacing: "0.06em" }}>{ACHIEVEMENTS[0].subtitle}</p>
                <p style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: 14 }}>{ACHIEVEMENTS[0].description}</p>
                <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{ACHIEVEMENTS[0].journey}</p>
                <p style={{ ...mono, fontSize: 11, color: hx(A.arena, 0.4), marginTop: 10 }}>{ACHIEVEMENTS[0].date}</p>
              </div>

              <div className="cyber-card">
                <h3 style={{ ...mono, fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{EDUCATION.institution}</h3>
                <p style={{ ...mono, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{EDUCATION.degree}</p>
                <p style={{ ...mono, fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>{EDUCATION.semester} · {EDUCATION.years}</p>
              </div>
            </div>
          </section>

          <div style={{ height: "50vh" }} />

          {/* ────────────────────────────────────────
              CH5: SIGNAL — text LEFT, cube RIGHT
              ──────────────────────────────────────── */}
          <section ref={(el) => { sentinels.current[5] = el; }} style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div style={{ width: "58%", paddingLeft: pad, paddingRight: 40, pointerEvents: "auto" }}>
              <ChapterLabel num="05" label="SIGNAL" color={A.signal} />

              <h2 className="glitch" data-text="LET'S BUILD SOMETHING" style={{
                ...mono, fontWeight: 700, color: "#fff",
                fontSize: "clamp(30px, 4.5vw, 68px)",
                letterSpacing: "0.05em", lineHeight: 1.1,
                marginBottom: 20, textTransform: "uppercase",
              }}>
                LET&apos;S BUILD SOMETHING
              </h2>

              <p style={{
                ...mono, fontSize: 15, color: "rgba(255,255,255,0.3)",
                lineHeight: 1.9, marginBottom: 40, maxWidth: 500,
              }}>
                Open to interesting projects, collaborations, and conversations
                about building things that matter.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 60 }}>
                {[
                  { label: "GITHUB", href: CONTACT.github, Icon: Code2 },
                  { label: "EMAIL", href: CONTACT.email ? `mailto:${CONTACT.email}` : "#", Icon: Mail },
                  { label: "LINKEDIN", href: CONTACT.linkedin || "#", Icon: ExternalLink },
                ].map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="cyber-btn" style={{
                    ...mono, fontSize: 11, letterSpacing: "0.15em",
                    color: hx(A.signal, 0.5), textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 32px",
                    border: `1px solid ${hx(A.signal, 0.12)}`,
                    background: hx(A.signal, 0.02), textTransform: "uppercase",
                  }}>
                    <l.Icon size={14} style={{ opacity: 0.5 }} />{l.label}
                  </a>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.06)" }} />
                <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}>
                  &copy; 2026 S ARUN SANJAY · BUILT WITH NEXT.JS
                </p>
              </div>
            </div>
          </section>

          <div style={{ height: "20vh" }} />
        </div>
      </div>
    </>
  );
}
