// Frame timing + errors: loads from the top (whole film), then scrolls p 7.3 → 15.2 over 9 s logging rAF deltas.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const [dpr = '1'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: +dpr });
const errs = []; pg.on('pageerror', e => errs.push('pageerror ' + e.message.slice(0, 200))); pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ' ' + m.text().slice(0, 200)); });
await pg.goto('http://localhost:8765/25-NESS-Offers-The-Stroke.html'); await pg.waitForTimeout(4000);
await pg.evaluate(async () => { for (let p = 0; p < 7.3; p += .05) { scrollTo(0, p * innerHeight); await new Promise(r => requestAnimationFrame(r)); } });
await pg.waitForTimeout(1500);
const r = await pg.evaluate(async () => {
  const w = [], orig = window.BRIDGE_RENDER; window.BRIDGE_RENDER = (...a) => { const t = performance.now(); orig(...a); w.push(performance.now() - t); };
  const d = [], at = []; let last = performance.now(); const t0 = last, P0 = 7.3, P1 = 15.2;
  await new Promise(res => { const step = now => { const dt = now - last; last = now; const k = (now - t0) / 9000, p = P0 + Math.min(1, k) * (P1 - P0); d.push(dt); at.push(p - 4.8); scrollTo(0, p * innerHeight); if (k < 1.03) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  d.shift(); at.shift(); const s = [...d].sort((a, b) => a - b);
  const over = d.map((v, i) => [v, at[i]]).filter(([v]) => v > 20).map(([v, q]) => `${v.toFixed(1)}ms@q${q.toFixed(2)}`);
  const ws = w.sort((a, b) => a - b);
  return { work: { n: ws.length, median: +ws[ws.length >> 1].toFixed(2), p99: +ws[Math.floor(ws.length * .99)].toFixed(2), max: +ws[ws.length - 1].toFixed(2) }, n: d.length, median: +s[s.length >> 1].toFixed(2), p99: +s[Math.floor(s.length * .99)].toFixed(2), max: +s[s.length - 1].toFixed(2), over };
});
console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'no console errors or warnings'); await b.close();
