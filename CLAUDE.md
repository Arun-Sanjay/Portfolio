# CLAUDE.md — Arun Sanjay Portfolio

## 0. What this repo is

Two builds live side-by-side at the repo root:

| Path | Status | Purpose |
|------|--------|---------|
| `/src` | **Legacy v1** — frozen reference | Early Next.js 14 build. Do not modify unless the user explicitly says "update v1". |
| `/portfolio-v2` | **Active build** | Sadewa-grade dark portfolio with a persistent 3D cube that nanotech-shatters into themed project environments. All new work goes here. |

When the user says "the portfolio" or "the site," assume `/portfolio-v2`.

> There is no `/reference/` directory — design references (Sadewa screenshots, DeSo scroll) live outside this repo. If you need them, ask.

---

## 1. Identity & content (source of truth)

Content data is centralised in `portfolio-v2/src/lib/constants.ts`. Edit there, not in component JSX.

**Person:** S Arun Sanjay — Developer & Builder
**Education:** B.Tech CS (Cyber Security), RVCE Bangalore · 4th semester · 2024–2028
**Location:** Bangalore, India · IST (UTC+5:30)
**GitHub:** github.com/Arun-Sanjay  · **Phone:** 6360363095

**Positioning tone:** student who ships real products using AI-assisted development. Confident, grounded, no buzzwords, scale speaks for itself.

**Projects:**
1. **Titan Protocol** — gamified productivity system · React Native/Expo · 20+ beta testers · Android launched Mar 2026
2. **CampusIQ** — AI academic & placement platform · Next.js + Python · 6-person RVCE team under Dr. Krishnappa H K · pgvector RAG + Whisper + MediaPipe
3. **Genx Builds** — commission-based custom PC building · SP Road Bangalore · partnered with Smart Gaming Store

**Headline achievement:** Meta PyTorch × Hugging Face OpenEnv Hackathon **Finalist** (Apr 25–26 2026, Scaler SST Bangalore). Built **DispatchPulse** — RL environment for 911 dispatch coordination using clinical survival curves as the reward. Journey: rejected → 2-day extension → accepted → finals (1 of 20, ~10% acceptance).

---

## 2. Stack (actual, installed)

```
Next.js 14.2 (App Router) · React 18 · TypeScript
Tailwind 3.4 · Framer Motion 12 · Lucide React
three 0.169 · @react-three/fiber 8.17 · @react-three/drei 9.114
@react-three/postprocessing 2.16
GSAP 3.15 + ScrollTrigger · @studio-freight/lenis 1.0
```

Node scripts (`portfolio-v2/`): `npm run dev | build | start | lint`.

---

## 3. Design system

Tokens live in `portfolio-v2/src/app/globals.css` as CSS vars and are exposed to Tailwind via `tailwind.config.ts`.

### Colors
```
--color-bg-base:        #0A0A0A
--color-bg-surface:     #111111
--color-bg-surface-2:   #161616
--color-bg-surface-3:   #1C1C1C
--color-border-subtle:  rgba(255,255,255,0.06)
--color-border-default: rgba(255,255,255,0.10)
--color-border-hover:   rgba(255,255,255,0.18)
--color-text-primary:   #F5F5F5
--color-text-default:   #C5C5C5
--color-text-muted:     #7A7A7A
--color-text-subtle:    #4A4A4A
--color-accent:         #C5F54B    ← electric lime, used sparingly
--color-accent-dim:     rgba(197,245,75,0.15)
--color-highlight:      #FFFFFF
```

**Accent rule:** max 2–3 lime pops per screen (one button arrow, one LIVE dot, one numbered label accent). Overusing it kills its power.

### Fonts (next/font from `app/layout.tsx`)
- **Display:** `Space Grotesk` (CSS var `--font-space-grotesk`, Tailwind `font-display`)
- **Mono:** `JetBrains Mono` (`--font-jetbrains`, `font-mono`)
- **Body:** `Inter` (`--font-inter`, `font-sans`)

Numbers (stats, dates) → always mono. Labels → mono, uppercase, `letter-spacing: 0.15em`. Headlines → `font-weight: 500`, `letter-spacing: -0.03em`, `line-height: 0.95`.

### Scale
```
Display XL  clamp(56px, 8vw, 128px)   hero title
Display L   clamp(40px, 5vw, 80px)    section titles
Display M   clamp(32px, 4vw, 56px)    subsection
Heading 28px · Subheading 20px · Body L 18px · Body 16px
Caption 14px · Label 12px · Micro 10px
```

### Spacing / layout
- 8-pt grid (Tailwind defaults + `gap-6`/`gap-8` on desktop grids).
- Section padding: `py-24 md:py-32 lg:py-40`.
- Max content width: `maxWidth: 1440; px-6 md:px-10 lg:px-16`.

### Radius
`sm 4px · md 8px · lg 12px · xl 20px` — modern sophisticated, not childish.

---

## 4. Architecture

### Page composition (`app/page.tsx`)
```
<main>
  <Scene/>                 ← dynamic import, SSR off, skipped on mobile
  <ExpandedRouter/>        ← project-themed overlay, portal to body
  <GradientBg/> <GrainOverlay/> <Vignette/> <AmbientParticles/>
  <Navbar/> <ChapterIndicator/> <ScrollProgress/> <CustomCursor/>
  <Hero/> <Stack/> <Work/> <Arena/> <Signal/>
</main>
```

### Scroll / chapter system
- `lib/smoothScroll.ts` bootstraps GSAP ScrollTrigger against `document.body`; exposes `getScrollProgress()` + `subscribeScrollProgress(cb)`.
- `lib/scrollConfig.ts` defines 5 chapters (origin/stack/work/arena/signal) with progress ranges and 11 `CAMERA_KEYFRAMES` used by the cube spline.
- `hooks/useChapter` + `hooks/useScrollProgress` are the React-side readers.
- **Lenis** is imported in `package.json` but `initSmoothScroll` currently only uses GSAP ScrollTrigger — Lenis is not wired. If you add it, gate via reduced-motion.

### The cube
- `components/three/Scene.tsx` — fixed Canvas, `pointer-events: none` on the wrapper, event source set to `document.documentElement` so raycasting still works through underlying HTML.
- `components/three/CubeShatter.tsx` — orchestrator. Holds two rendering modes: `solid` (one `MeshPhysicalMaterial` cube with a `CanvasTexture` chapter HUD on the +Z face) and `shatter` (delegates to `CubeInstanced`). Listens for `cube-close` to return to `solid`.
- `components/three/CubeInstanced.tsx` — `InstancedMesh` of 27 sub-cubes. GSAP timeline drives `shatterProgress`, `arrangeProgress`, `contentOpacity`, `scale`; `useFrame` reads and writes instance matrices. Exposes `window.__cubeShatter = { open, close }` and dispatches `cube-open`/`cube-close` events.
- `components/three/PostProcessing.tsx` — Bloom + Vignette + subtle ChromaticAberration.
- Position tables in `lib/cubeConfig.ts`: `getGridPositions` (closed), `getExplosionOffsets` (deterministic golden-angle scatter), `getExpandedPositions` (6-col flat panel).

### Project environments
- Theme palettes: `lib/themes.ts` (titan / campus / genx).
- Router: `components/projects/ExpandedRouter.tsx` — portal overlay that listens for `cube-open` (reads `detail.project`) and mounts `TitanExpanded` / `CampusExpanded` / `GenxExpanded` / `DefaultExpanded`. Handles ESC + click-outside.
- Each expanded view is a self-contained full-viewport themed scene (cyberpunk HUD / editorial cream / industrial workshop).

---

## 5. File structure (actual)

```
portfolio-v2/src/
  app/{layout,page,globals.css}
  components/
    atmosphere/   GradientBg · GrainOverlay · Vignette · AmbientParticles
    layout/       Navbar · ChapterIndicator · ScrollProgress · CustomCursor
    density/      NumberedLabel · CalloutCard · StatBlock · LogoStrip
                  ProcessIndicator · SectionRule · MetaRow · ArrowButton
                  FloatingTag · ScrollIndicator
    sections/     Hero · Stack · Work · Arena · Signal
    projects/     ProjectCard · ExpandedRouter
                  TitanExpanded · CampusExpanded · GenxExpanded
    three/        Scene · CubeShatter · CubeInstanced · PostProcessing
                  Cube.tsx (unused)  · ExpandedOverlay.tsx (superseded)
  hooks/          useScrollProgress · useChapter · useIsMobile
                  useCubeState (unused) · useTheme
  lib/            constants · scrollConfig · cubeConfig · smoothScroll
                  animations · themes
  types/          chapter · project · theme
```

---

## 6. Status — what's done, what's left

| Phase | Area | Status |
|-------|------|--------|
| 1 | Scaffold, tokens, fonts, hooks, smooth scroll | ✅ |
| 2 | Atmosphere + chrome (navbar, indicator, progress, cursor) | ✅ |
| 3 | 10 density components | ✅ |
| 4 | Cube (solid mode, spline, chapter HUD, postprocessing) | ✅ |
| 5 | Hero | ✅ |
| 6 | Stack + Work | ✅ |
| 7 | Arena + Signal | ✅ |
| 8 | Nanotech shatter (InstancedMesh + GSAP open/close) | ✅ |
| 9 | Themed environments (Titan/Campus/Genx expanded views) | 🟡 partial — see §7 |
| 10 | Polish, accessibility audit, deploy | ⬜ |

---

## 7. Known gaps & bugs (prioritised)

These are the blockers between "shipped" and "not shipped":

1. **Cube → project wiring is broken.** `CubeInstanced.open()` dispatches `cube-open` with no payload; `ExpandedRouter` reads `e.detail.project` and always falls back to `DefaultExpanded`. Need a global store (the existing `useCubeState` hook is a good fit, currently unused) so `open(projectId)` flows from ProjectCard → cube shatter → router with the project id.
2. **Two overlay systems compete.** `components/three/ExpandedOverlay.tsx` renders a placeholder portal AND `components/projects/ExpandedRouter.tsx` renders the real themed portal. Both listen to the same events. Delete `ExpandedOverlay` (or repurpose), keep `ExpandedRouter`.
3. **`ProjectCard`'s "EXPLORE PROJECT" button has no handler.** Wire it to `open(project.id)`.
4. **Dead files:** `components/three/Cube.tsx` (duplicate of `SingleCube` inside `CubeShatter`), `hooks/useCubeState.ts` (never imported). Either adopt (#1) or delete.
5. **Missing env R3F components.** Original spec called for `components/three/environments/{TitanEnv,CampusEnv,GenxEnv}.tsx` to cross-fade lighting/particles/postprocessing during shatter. Currently the expanded views are pure HTML over a dimmed canvas. Decide: keep HTML-only (simpler, already good) or add R3F env layers.
6. **Lenis is installed but not initialised.** Either wire it into `smoothScroll.ts` or remove the dep.
7. **No SEO beyond base metadata, no OG image, no `/og-image.png`.**
8. **No mobile shatter fallback.** Below 768px the Canvas is skipped; clicking a project card currently does nothing. Needs a plain HTML modal.
9. **No real test of `prefers-reduced-motion`** across GSAP timelines + Framer `whileInView`.

---

## 8. Design iron laws

1. Every section has a numbered label (`/01`, `/02`, …).
2. Every button has an arrow (`↗` external, `→` internal).
3. Every major section lands at least 5 density elements — numbered label, stat block, meta row, callout, logo strip, etc. Sadewa density is the bar.
4. Accent lime (`#C5F54B`) used ≤ 3 times per screen.
5. Numbers always mono.
6. Cards have 1px solid borders, not gradients.
7. Animations ease-out on enter, ease-in on exit. No bouncy springs.
8. Cube is always present on the main site — it's the anchor.
9. Project environments must feel alien from the main site — full theme commit (palette, typography, postprocessing).
10. Edit content in `lib/constants.ts`, not in component JSX.

---

## 9. Animation conventions

- Shared Framer variants in `lib/animations.ts`: `fadeUp`, `fadeIn`, `staggerContainer`, `staggerItem`, and three cubic-bezier curves (`EASE_OUT`, `EASE_IN`, `EASE_INOUT`).
- Scroll-triggered entrances use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`.
- Cube shatter is a GSAP timeline (windup → explode 0.8s power3.out → arrange 1.0s power2.inOut → content 0.4s power2.out). Close reverses.
- Continuous float accents use CSS keyframes (`subtleFloat`, `grain`, `particleDrift` in `globals.css`) to keep them off the main thread.

---

## 10. Mobile strategy

- `useIsMobile()` (mql `max-width: 767px`) gates `<Scene/>` in `page.tsx` — Canvas is skipped entirely on mobile.
- Sections stack (`flex-col lg:flex-row`). Floating callouts/tags are `hidden lg:block`.
- Density reduces to essentials on narrow viewports.
- **TODO:** clicking a project card on mobile needs to open the themed view as a full-screen modal (not a shatter). Not yet implemented.

---

## 11. When editing

- **Don't touch `/src` (v1)** unless told to.
- **Content changes** → `portfolio-v2/src/lib/constants.ts`.
- **Design tokens** → `globals.css` + `tailwind.config.ts`.
- **New section** → create in `components/sections/`, add to `app/page.tsx`, register a chapter in `lib/scrollConfig.ts`, add camera keyframe.
- **New project** → add to `PROJECTS` in `constants.ts`, add theme entry in `lib/themes.ts`, add `{Name}Expanded.tsx` under `components/projects/`, register in `ExpandedRouter`'s switch.
- **Performance:** InstancedMesh is used for the 27 sub-cubes — don't swap for 27 separate meshes. Heavy below-fold work must use `next/dynamic`.
- **Accessibility:** keep focus-visible outlines, `aria-label` on icon-only buttons, ESC closes all modals, respect `prefers-reduced-motion` for any new motion.

---

## End

Build it. Ship it.
