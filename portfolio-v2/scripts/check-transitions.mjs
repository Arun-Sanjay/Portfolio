import { chromium } from 'playwright';
const URL = 'http://localhost:3001';
const OUT = '/tmp/portfolio-shots';
const POINTS = [
  { name: 'T07-hero-very-start',  p: 0.01 },
  { name: 'T08-hero-rise-mid',    p: 0.025 },
  { name: 'T09-hero-at-middle',   p: 0.04 },
  { name: 'T10-hero-moving-left', p: 0.08 },
  { name: 'T01-titan-exit-start', p: 0.38 },
  { name: 'T02-titan-campus-mid', p: 0.40 },
  { name: 'T03-campus-enter-end', p: 0.42 },
  { name: 'T04-campus-exit-start', p: 0.49 },
  { name: 'T05-campus-genx-mid',  p: 0.51 },
  { name: 'T06-genx-enter-end',   p: 0.53 },
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
