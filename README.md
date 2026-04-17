# Portfolio — S Arun Sanjay

> A Sadewa-grade dark portfolio with a persistent 3D cube that nanotech-shatters into themed project environments.

Live portfolio for **S Arun Sanjay** — Developer & Builder · B.Tech CS (Cyber Security), RVCE Bangalore.

---

## Preview

![Portfolio preview — loading sequence, hero, and scroll-driven cube choreography](./docs/preview.gif)

---

## Repository layout

Two builds live side-by-side at the repo root:

| Path | Status | Purpose |
|------|--------|---------|
| [`/src`](./src) | **Legacy v1 — frozen** | Early Next.js 14 build. Kept as a reference. |
| [`/portfolio-v2`](./portfolio-v2) | **Active build** | Dark portfolio with Three.js cube + themed project environments. |

All new work happens in `/portfolio-v2`.

---

## The concept

The site is anchored by a **single 3D cube** that persists across the full scroll journey. As you move through the five chapters (Origin → Stack → Work → Arena → Signal), the cube rotates, moves, and projects a live chapter HUD onto its +Z face.

When a project card is opened, the cube performs a **nanotech shatter** — 27 sub-cubes driven by an `InstancedMesh` + GSAP timeline — then reassembles into a themed environment unique to that project:

- **Titan Protocol** — cyberpunk HUD
- **CampusIQ** — editorial cream academic layout
- **Genx Builds** — industrial workshop

Close the environment and the cube reverses the shatter, snapping back to its scroll position.

---

## Featured projects

### `01` Titan Protocol — _Launched Mar 2026_
Cross-platform gamified productivity system. React Native / Expo. 20+ beta testers. Turns discipline into XP.

### `02` CampusIQ — _In Development_
AI-powered academic & placement platform for RVCE, built with a 6-person team under Dr. Krishnappa H K. pgvector RAG pipeline, Whisper API, MediaPipe, Dijkstra's pathfinding.

### `03` Genx Builds — _Operational_
Commission-based custom PC building business on SP Road, Bangalore. Partnered with Smart Gaming Store for end-to-end sourcing, assembly, and delivery.

### Headline achievement
**Meta PyTorch × Hugging Face OpenEnv Hackathon — Finalist** (Apr 25–26, 2026, Scaler SST Bangalore).
Built **DispatchPulse** — a reinforcement learning environment for 911 dispatch coordination using clinical survival curves as the reward function. 1 of 20 finalist teams.

---

## Stack

### Core
- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS 3.4** · **Framer Motion 12** · **Lucide React**

### 3D / animation
- **three** `0.169` · **@react-three/fiber** `8.17` · **@react-three/drei** `9.114`
- **@react-three/postprocessing** `2.16` (Bloom + Vignette + Chromatic Aberration)
- **GSAP 3.15** + **ScrollTrigger** · **@studio-freight/lenis**

### Fonts
- **Space Grotesk** (display) · **JetBrains Mono** (numbers/labels) · **Inter** (body)

---

## Design system

Tokens live in [`portfolio-v2/src/app/globals.css`](./portfolio-v2/src/app/globals.css) and flow into Tailwind via [`tailwind.config.ts`](./portfolio-v2/tailwind.config.ts).

### Palette
```
--color-bg-base        #0A0A0A
--color-bg-surface     #111111
--color-text-primary   #F5F5F5
--color-text-muted     #7A7A7A
--color-accent         #C5F54B   ← electric lime (max 2–3 pops per screen)
--color-border-default rgba(255,255,255,0.10)
```

### Type scale
```
Display XL  clamp(56px, 8vw, 128px)   hero
Display L   clamp(40px, 5vw, 80px)    section titles
Display M   clamp(32px, 4vw, 56px)    subsections
Body 16 · Caption 14 · Label 12 · Micro 10
```

Numbers always mono. Labels uppercased with `0.15em` tracking. Headlines `-0.03em` tracking, `0.95` line-height.

### Iron laws
1. Every section has a numbered label (`/01`, `/02`, …).
2. Every button has an arrow (`↗` external, `→` internal).
3. Sections land ≥ 5 density elements (number label, stat block, meta row, callout, logo strip…).
4. Accent lime used ≤ 3 times per screen.
5. Cards use 1px solid borders — never gradients.
6. Ease-out on enter, ease-in on exit — no bouncy springs.
7. The cube is always present on the main site.
8. Content edits happen in [`lib/constants.ts`](./portfolio-v2/src/lib/constants.ts), never in JSX.

---

## Architecture

### Page composition
```
<main>
  <Scene/>                 ← R3F canvas, SSR off, skipped on mobile
  <ExpandedRouter/>        ← project-themed overlay, portal to body
  <GradientBg/> <GrainOverlay/> <Vignette/> <AmbientParticles/>
  <Navbar/> <ChapterIndicator/> <ScrollProgress/> <CustomCursor/>
  <Hero/> <Stack/> <Work/> <Arena/> <Signal/>
</main>
```

### Scroll system
- `lib/smoothScroll.ts` bootstraps GSAP ScrollTrigger; exposes `getScrollProgress()` and `subscribeScrollProgress(cb)`.
- `lib/scrollConfig.ts` defines 5 chapters with progress ranges and 11 `CAMERA_KEYFRAMES` driving the cube spline.
- `hooks/useChapter` + `hooks/useScrollProgress` are the React-side readers.

### The cube
- `components/three/Scene.tsx` — fixed R3F Canvas with `pointer-events: none` on the wrapper, event source set to `document.documentElement` so raycasting still works through the underlying HTML.
- `components/three/CubeShatter.tsx` — orchestrator with two modes: `solid` (one `MeshPhysicalMaterial` cube with a `CanvasTexture` chapter HUD on the +Z face) and `shatter` (delegates to `CubeInstanced`).
- `components/three/CubeInstanced.tsx` — `InstancedMesh` of 27 sub-cubes. A GSAP timeline drives `shatterProgress`, `arrangeProgress`, `contentOpacity`, and `scale`; `useFrame` reads and writes the instance matrices. Exposes `window.__cubeShatter = { open, close }` and dispatches `cube-open` / `cube-close` events.
- `lib/cubeConfig.ts` — `getGridPositions` (closed), `getExplosionOffsets` (deterministic golden-angle scatter), `getExpandedPositions` (6-col flat panel).

### Project environments
- Themes: `lib/themes.ts` (titan / campus / genx).
- Router: `components/projects/ExpandedRouter.tsx` portals to `body`, listens for `cube-open`, mounts the matching expanded view. ESC + click-outside close.
- Each expanded view is a self-contained, full-viewport themed scene with its own palette, typography, and postprocessing commitment.

### Animation conventions
- Shared Framer variants in `lib/animations.ts`: `fadeUp`, `fadeIn`, `staggerContainer`, `staggerItem`, plus three cubic-bezier curves (`EASE_OUT`, `EASE_IN`, `EASE_INOUT`).
- Scroll-triggered entrances use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`.
- Cube shatter timeline: windup → explode (0.8s `power3.out`) → arrange (1.0s `power2.inOut`) → content fade-in (0.4s `power2.out`). Close reverses.
- Continuous float accents use CSS keyframes (`subtleFloat`, `grain`, `particleDrift`) to stay off the main thread.

---

## File structure (`portfolio-v2/`)

```
src/
├── app/
│   ├── layout.tsx        Root layout + font loading
│   ├── page.tsx          Main page orchestrating all sections
│   └── globals.css       Tokens, keyframes, base styles
│
├── components/
│   ├── atmosphere/       GradientBg · GrainOverlay · Vignette · AmbientParticles
│   ├── layout/           Navbar · ChapterIndicator · ScrollProgress · CustomCursor
│   ├── density/          NumberedLabel · CalloutCard · StatBlock · LogoStrip
│   │                     ProcessIndicator · SectionRule · MetaRow · ArrowButton
│   │                     FloatingTag · ScrollIndicator
│   ├── sections/         Hero · Stack · Work · Arena · Signal
│   ├── projects/         ProjectCard · ExpandedRouter
│   │                     TitanExpanded · CampusExpanded · GenxExpanded
│   └── three/            Scene · CubeShatter · CubeInstanced · PostProcessing
│
├── hooks/                useScrollProgress · useChapter · useIsMobile · useTheme
├── lib/                  constants · scrollConfig · cubeConfig · smoothScroll
│                         animations · themes
└── types/                chapter · project · theme
```

---

## Getting started

```bash
# clone
git clone https://github.com/Arun-Sanjay/Portfolio.git
cd Portfolio/portfolio-v2

# install
npm install

# dev
npm run dev        # http://localhost:3000

# production
npm run build
npm start

# lint
npm run lint
```

Node 20+ recommended. The dev server skips the R3F canvas below 768px via `useIsMobile()`.

---

## Responsive + accessibility

- **Mobile:** `useIsMobile()` (media query `max-width: 767px`) gates the `<Scene/>` — the Canvas is skipped entirely on mobile. Sections stack `flex-col lg:flex-row`; floating tags are `hidden lg:block`.
- **Focus:** visible outlines preserved on all interactive elements; ESC closes all modals.
- **Motion:** `prefers-reduced-motion` respected in CSS keyframes and Framer viewport variants.
- **Semantics:** semantic landmarks (`<nav>`, `<main>`, `<section>`, `<footer>`) + `aria-label` on icon-only controls.

---

## Contact

- **GitHub** · [github.com/Arun-Sanjay](https://github.com/Arun-Sanjay)
- **Location** · Bangalore, India · IST (UTC+5:30)
- **Institution** · Rashtreeya Vidyalaya College of Engineering (RVCE), B.Tech CS (Cyber Security), 2024–2028

---

_Built with Next.js, Three.js, and a lot of respect for density._
