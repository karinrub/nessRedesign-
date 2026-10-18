// usage: node cams.mjs outdir q '[{"p":..,"t":..,"f":..,"s":[..]}, ...]'  — renders the film at q with each camera (type hidden)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const [out, q, list] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await pg.goto('http://localhost:8765/25-NESS-Offers-The-Stroke.html?v=7.3&still'); await pg.waitForTimeout(3500);
const C = JSON.parse(list);
for (let i = 0; i < C.length; i++) {
  await pg.evaluate(async ([c, q]) => { window.__camO = c; for (const d of [.01, 0]) { scrollTo(0, (+q + d + 4.8) * innerHeight); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); } }, [C[i], q]);
  await pg.waitForTimeout(200); await pg.screenshot({ path: `${out}/cam_${q}_${i}.jpg`, quality: 80 });
}
await b.close();
