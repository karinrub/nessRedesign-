// node mockup26-src/look.mjs <outprefix> '<json list of {q, k, p, t, f, s, d, r}>' [url]  — try local-frame cameras at a film time
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const [pre, js, url = 'http://localhost:8765/26-NESS-Offers-The-Strand-Works.html'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await pg.goto(`${url}?v=7.3&still`); await pg.waitForTimeout(3500);
const L = JSON.parse(js);
for (let i = 0; i < L.length; i++) {
  await pg.evaluate(async c => {
    const nw = window.__nw, T = nw.V3;
    window.__cam = () => ({ p: T(...nw.LC(c.k, c.p)), t: T(...nw.LC(c.k, c.t)), d: T(...nw.LC(c.dk || c.k, c.d || [0, -999, 0])), r: c.r || 0, f: c.f || 30, sx: (c.s || [0, 0])[0], sy: (c.s || [0, 0])[1] });
    scrollTo(0, (c.q + 4.8 + (window.__n = (window.__n || 0) + 1) * 0.0007) * innerHeight); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); nw.render(c.q);
  }, L[i]);
  await pg.waitForTimeout(300); await pg.screenshot({ path: `${pre}${i}.png` });
}
console.log(errs.join('\n') || 'ok'); await b.close();
