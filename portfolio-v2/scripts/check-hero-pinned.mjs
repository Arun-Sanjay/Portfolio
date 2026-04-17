import { chromium } from 'playwright';
const URL = 'http://localhost:3001';
const OUT = '/tmp/portfolio-shots';
const POINTS = [
  { name: 'P1-paint-0',     p: 0.00 },   // initial paint — cube should be at centre
  { name: 'P2-scroll-015',  p: 0.015 },  // tiny scroll — hero copy rising, cube STILL at centre
  { name: 'P3-scroll-03',   p: 0.03 },   // half-viewport scroll — hero copy half gone, cube centre
  { name: 'P4-scroll-05',   p: 0.05 },   // hero copy mostly gone, cube centre
  { name: 'P5-scroll-07',   p: 0.07 },   // cube about to start sweep
  { name: 'P6-scroll-09',   p: 0.09 },   // mid-sweep, stack entering
  { name: 'P7-scroll-11',   p: 0.11 },   // cube near left, stack text appearing
  { name: 'P8-scroll-13',   p: 0.13 },   // cube arrived at left, stack text in
  { name: 'P9-scroll-16',   p: 0.16 },   // full stack frame
];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);
for (const s of POINTS) {
  await page.evaluate((p) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * p, behavior: 'instant' });
  }, s.p);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: false });
  console.log(`${s.name} @ p=${s.p}`);
}
await browser.close();
