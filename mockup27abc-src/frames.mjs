// Stills at section times q (p = q + 4.8), one browser session, ?still (no smoothing, no glide).
// usage: node mockup27abc-src/frames.mjs <outdir> 3.9,4.7 <url>     env: VW, VH (viewport), PW (playwright path), GL=metal for a Mac GPU
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const [out, list, url] = process.argv.slice(2);
const mac = process.env.GL === 'metal';
const b = await chromium.launch(mac ? { channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] }
  : { headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: +(process.env.VW || 1440), height: +(process.env.VH || 900) }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
await pg.goto(`${url}?v=7.3&still`); for (let i = 0; i < 240 && !(await pg.evaluate(() => !!(window.__nw && window.__nw.X().built))); i++) await pg.waitForTimeout(500);
await pg.waitForTimeout(800);
for (const q of list.split(',').map(Number)) {
  const t = await pg.evaluate(async q => {
    scrollTo(0, (q + 4.8) * innerHeight);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const t0 = performance.now(); window.__nw.render(q); return performance.now() - t0;
  }, q);
  await pg.waitForTimeout(+(process.env.WAIT || 400));
  await pg.screenshot({ path: `${out}/f${process.env.VW ? '_' + process.env.VW : ''}_${q.toFixed(2)}.png` });
  console.log(q.toFixed(2), 'ms', t.toFixed(1));
}
console.log(errs.join('\n') || 'no errors');
await b.close();
