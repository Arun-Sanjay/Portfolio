import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL || 'http://localhost:3001';
const OUT = '/tmp/portfolio-shots';
mkdirSync(OUT, { recursive: true });

// Scroll positions covering each chapter's "single-frame dwell" + transitions.
// Progress values mirror useCubeMotion.ts SPLINE control points.
const SHOTS = [
  { name: '01-hero-bottom',    progress: 0.00 },  // cube at viewport bottom
  { name: '02-hero-rising',    progress: 0.06 },  // cube rising up, hero text fading
  { name: '03-hero-stack-mid', progress: 0.11 },  // cube migrating left, stack text appearing
  { name: '04-stack-arrived',  progress: 0.16 },  // cube on left, stack revealed
  { name: '05-stack-dwell',    progress: 0.22 },  // stack single-frame dwell
  { name: '06-stack-work-mid', progress: 0.31 },  // cube swinging right toward work
  { name: '07-work-titan',     progress: 0.345 }, // work-titan dwell
  { name: '08-work-campus',    progress: 0.455 }, // work-campusiq dwell
  { name: '09-work-genx',      progress: 0.555 }, // work-genx dwell
  { name: '10-work-arena-mid', progress: 0.65 },  // cube migrating to arena, growing
  { name: '11-arena-dwell',    progress: 0.74 },  // arena single-frame, big cube centred
  { name: '12-arena-signal',   progress: 0.83 },  // arena → signal transition
  { name: '13-signal-dwell',   progress: 0.92 },  // signal single-frame, BIG cube right
  { name: '14-end',            progress: 1.00 },  // very bottom of page
];

async function takeShots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.error('[pageerror]', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('[console.error]', msg.text());
  });

  console.log(`opening ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  // Let the cube + atmosphere settle one frame
  await page.waitForTimeout(800);

  for (const shot of SHOTS) {
    // Scroll to the targeted scroll-progress (0..1)
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * p, behavior: 'instant' });
    }, shot.progress);
    // Allow GSAP ScrollTrigger + cube spline to catch up
    await page.waitForTimeout(700);
    const path = `${OUT}/${shot.name}.png`;
    await page.screenshot({ path, fullPage: false });
    console.log(`  ${shot.name} @ p=${shot.progress.toFixed(2)} → ${path}`);
  }

  await browser.close();
}

takeShots().catch((err) => {
  console.error(err);
  process.exit(1);
});
