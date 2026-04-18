import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const heroSpan = h1?.querySelector('span');
  const stackH2 = Array.from(document.querySelectorAll('h2')).find(h => /tools i build/i.test(h.textContent || ''));
  const heroCtaPrimary = Array.from(document.querySelectorAll('button')).find(b => /view work/i.test(b.textContent || ''));
  const locationSpan = Array.from(document.querySelectorAll('span')).find(s => /^bangalore$/i.test((s.textContent||'').trim()));
  const navItem = Array.from(document.querySelectorAll('button')).find(b => /arun sanjay/i.test(b.textContent || ''));

  const info = (el) => el ? {
    tag: el.tagName,
    text: (el.textContent || '').trim().slice(0, 60),
    fontFamily: getComputedStyle(el).fontFamily,
    fontSize: getComputedStyle(el).fontSize,
    fontWeight: getComputedStyle(el).fontWeight,
    className: el.className,
  } : null;

  const fontFaces = Array.from(document.fonts).map(f => ({ family: f.family, status: f.status, weight: f.weight, style: f.style }));

  return {
    heroH1: info(h1),
    heroHeadlineSpan: info(heroSpan),
    stackH2: info(stackH2),
    locationSpan: info(locationSpan),
    heroCtaPrimary: info(heroCtaPrimary),
    navItem: info(navItem),
    loadedFonts: fontFaces,
    bodyFont: getComputedStyle(document.body).fontFamily,
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
