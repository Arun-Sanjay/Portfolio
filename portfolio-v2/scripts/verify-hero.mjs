import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:3000';
const OUT = '/tmp/portfolio-verify';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('[console.err]', m.text()); });

await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(900);

const shots = [
  { name: '01-hero-p00',      p: 0.00 },
  { name: '02-hero-p003',     p: 0.03 },
  { name: '03-hero-p007',     p: 0.07 },
  { name: '04-stack-p022',    p: 0.22 },
  { name: '05-work-titan',    p: 0.345 },
  { name: '06-signal',        p: 0.92 },
];

for (const s of shots) {
  await page.evaluate((progress) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * progress, behavior: 'instant' });
  }, s.p);
  await page.waitForTimeout(700);
  const path = `${OUT}/${s.name}.png`;
  await page.screenshot({ path });
  console.log(`shot ${s.name} @ p=${s.p}`);
}

// Extract computed styles of key hero elements
const heroInfo = await page.evaluate(() => {
  const byText = (t) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null);
    let n, hits = [];
    while ((n = walker.nextNode())) {
      if ((n.textContent || '').trim().toLowerCase().includes(t)) hits.push(n);
    }
    return hits;
  };
  const cs = (el) => el ? (() => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, text: (el.textContent||'').trim().slice(0,80), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, background: s.backgroundColor, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  })() : null;
  const heroH1 = byText('student by day').find(e => e.tagName === 'H1');
  const viewWork = byText('view work').pop();
  const getInTouch = byText('get in touch').pop();
  const bangalore = byText('bangalore').find(e => e.tagName === 'SPAN');
  const arunNav = byText('arun sanjay').pop();
  return { heroH1: cs(heroH1), viewWork: cs(viewWork), getInTouch: cs(getInTouch), bangalore: cs(bangalore), arunNav: cs(arunNav) };
});
console.log('===HERO_INFO===');
console.log(JSON.stringify(heroInfo, null, 2));

await browser.close();
