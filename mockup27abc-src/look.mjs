// Try fixed cameras at a film time: node mockup27abc-src/look.mjs <outprefix> <url> <q> '<json [{p,t,f,roll,s}]>'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const [pre, url, q, js] = process.argv.slice(2);
const mac = process.env.GL === 'metal';
const b = await chromium.launch(mac ? { channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] }
  : { headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: +(process.env.VW || 1440), height: +(process.env.VH || 900) }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300)));
await pg.goto(`${url}?v=7.3&still`);
for (let i = 0; i < 240 && !(await pg.evaluate(() => !!(window.__nw && window.__nw.X().built))); i++) await pg.waitForTimeout(500);
const L = (0, eval)("(" + js + ")");
for (let i = 0; i < L.length; i++) {
  await pg.evaluate(async ([c, q, n]) => {
    const nw = window.__nw;
    window.__cam = () => ({ p: nw.V3(...c.p), t: nw.V3(...c.t), f: c.f || 30, sx: (c.s || [0, 0])[0], sy: (c.s || [0, 0])[1], roll: c.roll || 0 });
    scrollTo(0, (q + 4.8 + n * 0.0007) * innerHeight); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, [L[i], +q, i + 1]);
  await pg.waitForTimeout(300); await pg.screenshot({ path: `${pre}${i}.png` });
}
console.log(errs.join('\n') || 'ok'); await b.close();
