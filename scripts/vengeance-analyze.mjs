import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));

await page.goto('https://vengeance.framer.website/', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/vengeance-hero.png', fullPage: false });

// Grab computed styles of obvious hero items by visible text
const info = await page.evaluate(() => {
  function walk(root, matcher) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    let n;
    while ((n = w.nextNode())) {
      try { if (matcher(n)) out.push(n); } catch {}
    }
    return out;
  }
  const hasText = (t) => (el) => (el.textContent || '').trim().toLowerCase().includes(t);

  const headlineEl = walk(document.body, hasText('product designer by day')).pop();
  const cityEl = walk(document.body, hasText('los angeles')).pop();
  const saveBtn = walk(document.body, hasText('save gotham')).pop();
  const getBtn = walk(document.body, hasText('get in touch')).pop();
  const navAbout = walk(document.body, hasText('about')).filter(el => el.children.length < 3).pop();

  const cs = (el) => el ? (() => {
    const s = getComputedStyle(el);
    return {
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 80),
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      fontFamily: s.fontFamily,
      letterSpacing: s.letterSpacing,
      lineHeight: s.lineHeight,
      color: s.color,
      background: s.backgroundColor || s.background,
      padding: s.padding,
      borderRadius: s.borderRadius,
      borderColor: s.borderColor,
      borderStyle: s.borderStyle,
    };
  })() : null;

  return {
    headline: cs(headlineEl),
    city: cs(cityEl),
    saveBtn: cs(saveBtn),
    getBtn: cs(getBtn),
    navAbout: cs(navAbout),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };
});

console.log('===STYLE_DUMP===');
console.log(JSON.stringify(info, null, 2));

await browser.close();
