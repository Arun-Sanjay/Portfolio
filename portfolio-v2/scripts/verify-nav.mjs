import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:3000';
const OUT = '/tmp/portfolio-nav';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror]', e.message));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);

// Full round trip — fire every chapter going down, then every chapter going back up.
const sequence = [
  { name: 'A1-origin',       p: 0.00 },
  { name: 'A2-stack',        p: 0.22 },
  { name: 'A3-work-titan',   p: 0.345 },
  { name: 'A4-work-campus',  p: 0.455 },
  { name: 'A5-work-genx',    p: 0.555 },
  { name: 'A6-arena',        p: 0.74 },
  { name: 'A7-signal',       p: 0.92 },
  { name: 'B1-arena-back',   p: 0.74 },
  { name: 'B2-work-back',    p: 0.345 },
  { name: 'B3-stack-back',   p: 0.22 },
  { name: 'B4-origin-back',  p: 0.00 },
];

for (const s of sequence) {
  await page.evaluate((progress) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * progress, behavior: 'instant' });
  }, s.p);
  await page.waitForTimeout(500);
  // Screenshot JUST the nav pill area — top 140px of viewport, full width.
  await page.screenshot({
    path: `${OUT}/${s.name}.png`,
    clip: { x: 0, y: 0, width: 1440, height: 140 },
  });
  console.log(`nav shot ${s.name} @ p=${s.p}`);
}

// Geometry check — is the underline inside the active button's bounds?
const geom = await page.evaluate(() => {
  const active = Array.from(document.querySelectorAll('nav button')).find((b) => {
    // Active button is the one whose span label color is rgba(245, 245, 245, 1) — brighter than the muted 0.55.
    const span = b.querySelector('span');
    if (!span) return false;
    return window.getComputedStyle(b).color === 'rgb(245, 245, 245)';
  });
  if (!active) return { found: false };
  const btnRect = active.getBoundingClientRect();
  // Find the sliding underline — an absolutely positioned child of a button.
  const underline = active.querySelector('span[style*="position: absolute"], span[style*="position:absolute"]');
  const un = underline?.getBoundingClientRect();
  return {
    found: true,
    activeLabel: (active.textContent || '').trim(),
    btn: { x: Math.round(btnRect.x), y: Math.round(btnRect.y), w: Math.round(btnRect.width), h: Math.round(btnRect.height) },
    underline: un ? { x: Math.round(un.x), y: Math.round(un.y), w: Math.round(un.width), h: Math.round(un.height) } : null,
    fitsInsideButton: un
      ? un.x >= btnRect.x - 1 && un.x + un.width <= btnRect.x + btnRect.width + 1
      : null,
  };
});
console.log('===GEOM===');
console.log(JSON.stringify(geom, null, 2));

await browser.close();
