// Scroll the whole Offers film and report rAF frame times plus the CPU cost of re-forming the wire (X.updMs) per frame.
// node mockup27abc-src/perf.mjs <url> [dpr=2] [w=1440] [h=900] [seconds=14]   (GL=metal on a Mac for real GPU numbers)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const [url, dpr = '2', w = '1440', h = '900', sec = '14'] = process.argv.slice(2);
const mac = process.env.GL === 'metal';
const b = await chromium.launch(mac ? { channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] }
  : { headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await pg.goto(`${url}?v=7.3`);
for (let i = 0; i < 240 && !(await pg.evaluate(() => !!(window.__nw && window.__nw.X().built))); i++) await pg.waitForTimeout(500);
await pg.waitForTimeout(1500);
const r = await pg.evaluate(async T => {
  const p0 = 7.3, p1 = 17.6, d = [], u = []; let last = performance.now(); const t0 = last;
  await new Promise(res => { const step = now => { d.push([now - last, +(p0 + (p1 - p0) * Math.min(1, (now - t0) / T) - 4.8).toFixed(2)]); u.push(window.__nw.X().updMs || 0); last = now; const k = (now - t0) / T; scrollTo(0, (p0 + (p1 - p0) * Math.min(1, k)) * innerHeight); if (k < 1.02) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  d.shift(); u.shift();
  const pct = (a, q) => { const s = [...a].sort((x, y) => x - y); return +s[Math.floor(s.length * q)].toFixed(1); };
  const ft = d.map(x => x[0]), worstU = u.map((v, i) => [v, d[i][1]]).sort((a, b) => b[0] - a[0]).slice(0, 6).map(x => x[1] + ':' + x[0].toFixed(1));
  return { frames: ft.length, frame: { median: pct(ft, .5), p95: pct(ft, .95), p99: pct(ft, .99), max: pct(ft, .999) }, reform: { median: pct(u, .5), p95: pct(u, .95), max: pct(u, .999), worstAtQ: worstU }, buildMs: window.__nw.buildMs };
}, +sec * 1000);
console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'no errors'); await b.close();
