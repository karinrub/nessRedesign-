// Stills of the whole approved film at chosen playhead positions p (scrollY / innerHeight), real GPU, one session.
// usage: PW=<dir>/node_modules/playwright-core node wave-studies-25/tools/audit-frames.mjs <outdir> 0,0.5,1 [url]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright-core');
const [out, list, url = 'http://localhost:8765/24C-NESS-Offers-The-Wave.html'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await pg.goto(`${url}?still`); await pg.waitForTimeout(4000);
for (const p of list.split(',').map(Number)) {
  await pg.evaluate(async p => { scrollTo(0, p * innerHeight); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, p);
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: `${out}/p_${p.toFixed(2)}.jpg`, quality: 80 });
}
console.log(errs.join('\n') || 'no errors');
await b.close();
