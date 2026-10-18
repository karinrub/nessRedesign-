// Stills of mockup 25 at chosen section times, in one browser session, on the real GPU (system Chrome).
// usage: PW=<dir>/node_modules/playwright-core node mockup23-src/frames.mjs <outdir> 3.9,4.8,5.7 [url]
// Positions are section time q (p = q + 4.8). The page loads with ?still, so there is no smoothing or glide.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright-core');
const [out, list, url = 'http://localhost:8765/25-NESS-Offers-The-Stroke.html'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await pg.goto(`${url}?v=7.3&still`); await pg.waitForTimeout(3500);
for (const q of list.split(',').map(Number)) {
  const t = await pg.evaluate(async q => {
    scrollTo(0, (q + 4.8) * innerHeight);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const t0 = performance.now(); window.__nw.render(q); return performance.now() - t0;
  }, q);
  await pg.waitForTimeout(250);
  await pg.screenshot({ path: `${out}/f_${q.toFixed(2)}.png` });
  console.log(q.toFixed(2), 'render ms', t.toFixed(1));
}
console.log(errs.join('\n') || 'no errors');
await b.close();
