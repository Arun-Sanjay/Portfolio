import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:3000';
const OUT = '/tmp/portfolio-intro';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') console.error('[console.err]', m.text());
});

// Fire-and-forget navigation so we can grab early shots before the
// loader completes. Total boot: 1800ms progress + 200ms hold + 600ms fade.
const navPromise = page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

const earlyShots = [
  { name: '01-loader-start',    delay:   150 },
  { name: '02-loader-mid',      delay:   900 },
  { name: '03-loader-full',     delay:  1900 },
  { name: '04-loader-fading',   delay:  2200 },
  { name: '05-intro-blend',     delay:  2700 },
  { name: '06-intro-settled',   delay:  3400 },
];

const start = Date.now();
for (const s of earlyShots) {
  const wait = s.delay - (Date.now() - start);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(`shot ${s.name} @ ${Date.now() - start}ms`);
}

await navPromise;
await page.waitForTimeout(500);

// Now exercise the scroll-trigger sweep and Stack text entrance.
const scrollShots = [
  { name: '07-p0-settled',      p: 0.00 },
  { name: '08-p0-02',           p: 0.02 },
  { name: '09-p0-06',           p: 0.06 },
  { name: '10-p0-10',           p: 0.10 },
  { name: '11-p0-13-stack-in',  p: 0.13 },
  { name: '12-p0-22-stack',     p: 0.22 },
];

for (const s of scrollShots) {
  await page.evaluate((progress) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * progress, behavior: 'instant' });
  }, s.p);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(`shot ${s.name} @ p=${s.p}`);
}

await browser.close();
