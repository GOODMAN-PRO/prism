#!/usr/bin/env node
/**
 * prism/driver.mjs — the browser-verify harness for any prism web build.
 *
 * Prism's procedure ends with "Preflight: verify in the browser." THIS is
 * that verifier — the button-clicker a markdown file can't be. Point it at
 * a built site and it drives a real headless Chromium through the prism
 * checks and SAVES SCREENSHOTS YOU MUST READ:
 *
 *   1. horizontal-overflow sweep @ 360/768/1024/1440/1920   (prism bans overflow)
 *   2. console / page errors                                 (must be zero)
 *   3. desktop scroll-through      → desktop-NN.png          (look at the page)
 *   4. every GSAP ScrollTrigger pin → pin-N.png at mid-range (the "hold" beats)
 *   5. mobile @ 390                → mobile-*.png
 *   6. prefers-reduced-motion      → reduced-top.png + content-present check
 *
 * A clean console is NOT a good-looking page. The screenshots are the point.
 *
 * Usage:
 *   node driver.mjs <target> [--out <dir>] [--shots N]
 *     <target>  URL (http://127.0.0.1:5173) OR local path (dir w/ index.html
 *               or an .html file → opened via file://)
 *     --out     screenshot dir            (default ./prism-verify)
 *     --shots   desktop scroll depths     (default 5)
 *
 * Playwright is resolved from: cwd → $PRISM_PW → a sibling install. On a clean
 * machine:  npm i -D playwright && npx playwright install chromium
 *
 * Exit 0 = no overflow, no page errors, reduced-motion content present. Else 1.
 */
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { existsSync, statSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';

const argv = process.argv.slice(2);
const target = argv.find(a => !a.startsWith('--'));
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
if (!target) { console.error('usage: node driver.mjs <url-or-path> [--out dir] [--shots N]'); process.exit(2); }
const out = resolve(opt('out', 'prism-verify'));
const nShots = parseInt(opt('shots', '5'), 10);
mkdirSync(out, { recursive: true });

// target → URL
let url = target;
if (!/^https?:\/\//.test(target)) {
  let p = resolve(target);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { console.error('not found:', p); process.exit(2); }
  url = pathToFileURL(p).href;
}

// resolve Playwright
let chromium;
for (const base of [process.cwd() + '/', process.env.PRISM_PW ? process.env.PRISM_PW.replace(/[\\/]?$/, '/') : '']) {
  if (!base) continue;
  let req; try { req = createRequire(base); } catch { continue; }
  for (const mod of ['playwright', 'playwright-core']) {
    try { const m = req(mod); if (m && m.chromium) { chromium = m.chromium; break; } } catch {}
  }
  if (chromium) break;
}
if (!chromium) { console.error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium  (or set PRISM_PW to a dir containing node_modules)'); process.exit(2); }

const WIDTHS = [360, 768, 1024, 1440, 1920];
let fail = false;
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
async function open(w, h, reduced) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await c.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  return { c, page, errs };
}
const scrollTo = (page, y) => page.evaluate(yy => { window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : window.scrollTo(0, yy); if (window.ScrollTrigger) ScrollTrigger.update(); }, y);

console.log(`\n[prism-verify] ${url}\n  shots → ${out}\n`);

console.log('overflow sweep');
for (const w of WIDTHS) {
  const { c, page } = await open(w, 900, false); await page.waitForTimeout(1200);
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  const over = o.sw - o.iw > 1; if (over) fail = true;
  console.log(`  ${String(w).padStart(4)}  ${over ? 'OVERFLOW +' + (o.sw - o.iw) + 'px' : 'ok'}`);
  await c.close();
}

{ // desktop: scroll-through + pins + errors
  const { c, page, errs } = await open(1440, 900, false); await page.waitForTimeout(2600);
  await page.screenshot({ path: join(out, 'desktop-00-top.png') });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 1; i <= nShots; i++) { await scrollTo(page, Math.round(H * i / (nShots + 1))); await page.waitForTimeout(1100); await page.screenshot({ path: join(out, `desktop-${String(i).padStart(2, '0')}.png`) }); }
  const pins = await page.evaluate(() => (window.ScrollTrigger ? ScrollTrigger.getAll().filter(s => s.pin).map(s => ({ start: Math.round(s.start), end: Math.round(s.end) })) : []));
  console.log(`\nGSAP pins (hold beats): ${pins.length}`);
  let k = 1; for (const p of pins) { // scroll in INTO the pin (immediate jumps leave ScrollTrigger mid-transition and falsely stack pinned content)
    const tgt = Math.round(p.start + (p.end - p.start) * 0.6); const cur = await page.evaluate(() => window.__lenis ? window.__lenis.scroll : scrollY);
    for (let s = 1; s <= 7; s++) { await scrollTo(page, Math.round(cur + (tgt - cur) * s / 7)); await page.waitForTimeout(130); }
    await page.waitForTimeout(800); await page.screenshot({ path: join(out, `pin-${k}.png`) }); console.log(`  pin ${k}: held ${p.start}–${p.end}px (${p.end - p.start}px dwell)`); k++; }
  console.log(`\npage errors: ${errs.length ? errs.join(' | ') : 'none'}`); if (errs.length) fail = true;
  await c.close();
}
{ // mobile
  const { c, page, errs } = await open(390, 844, false); await page.waitForTimeout(2400);
  await page.screenshot({ path: join(out, 'mobile-00-top.png') });
  await scrollTo(page, await page.evaluate(() => document.documentElement.scrollHeight * 0.5)); await page.waitForTimeout(900);
  await page.screenshot({ path: join(out, 'mobile-50.png') });
  if (errs.length) { fail = true; console.log('mobile errors:', errs.join(' | ')); }
  await c.close();
}
{ // reduced-motion: content must remain
  const { c, page } = await open(1440, 900, true); await page.waitForTimeout(1600);
  await page.screenshot({ path: join(out, 'reduced-top.png') });
  const chars = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim().length);
  const ok = chars > 200; if (!ok) fail = true;
  console.log(`reduced-motion: ${ok ? 'content present (' + chars + ' chars)' : 'NEAR-EMPTY (' + chars + ' chars) — content gated on animation'}`);
  await c.close();
}
await browser.close();
console.log(`\n[prism-verify] ${fail ? 'FAIL — fix the flagged items' : 'PASS'}  ·  now READ the screenshots in ${out}\n`);
process.exit(fail ? 1 : 0);
