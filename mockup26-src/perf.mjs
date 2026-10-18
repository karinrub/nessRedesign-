// node mockup26-src/perf.mjs [url] [dpr] — scrolls the whole Offers film in 12 s and reports rAF frame times
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const [url = 'http://localhost:8765/26-NESS-Offers-The-Strand-Works.html', dpr = '2', w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await pg.goto(`${url}?v=7.3`); await pg.waitForTimeout(4000);
const r = await pg.evaluate(async () => {
  const p0 = 7.3, p1 = 15.0, T = 14000, d = [], at = []; let last = performance.now(); const t0 = last;
  await new Promise(res => { const step = now => { const dt = now - last; d.push(dt); at.push([+(p0 + (p1 - p0) * Math.min(1, (now - t0) / T) - 4.8).toFixed(2), dt]); last = now; const k = (now - t0) / T; scrollTo(0, (p0 + (p1 - p0) * Math.min(1, k)) * innerHeight); if (k < 1.02) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  d.shift(); const s = [...d].sort((a, b) => a - b), slow = at.filter(x => x[1] > 20).map(x => x[0] + ':' + x[1].toFixed(0));
  return { n: d.length, median: s[s.length >> 1], p95: s[Math.floor(s.length * .95)], p99: s[Math.floor(s.length * .99)], max: s[s.length - 1], slow: slow.slice(0, 40) };
});
console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'no errors'); await b.close();
