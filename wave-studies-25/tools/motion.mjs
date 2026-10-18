// Frames + timing of the A motion proof: stills at t values, then a timed scroll through the whole thing.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright-core');
const [out] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300)));
await pg.goto('http://localhost:8765/wave-studies-25/studies/A-motion.html');
await pg.waitForFunction(() => document.documentElement.dataset.ready === '1');
const T = [0, .1, .2, .27, .33, .39, .45, .52, .58, .64, .7, .8, .9];
for (const t of T) { await pg.evaluate(t => __motion.set(t), t); await pg.waitForTimeout(150); await pg.screenshot({ path: `${out}/m_${t.toFixed(2)}.jpg`, quality: 80 }); }
const r = await pg.evaluate(async () => {
  const H = document.documentElement.scrollHeight - innerHeight, d = []; let last = performance.now(); const t0 = last;
  await new Promise(res => { const step = now => { d.push(now - last); last = now; const k = (now - t0) / 8000; scrollTo(0, Math.min(1, k) * H); if (k < 1.05) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  d.shift(); d.sort((a, b) => a - b); return { n: d.length, median: d[d.length >> 1], p99: d[Math.floor(d.length * .99)], max: d[d.length - 1] };
});
console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'no errors'); await b.close();
