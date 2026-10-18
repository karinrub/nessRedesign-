// CPU cost of every Offers frame (state, re-forming the wire, type), with the GPU draw stubbed out. Steps q from 2.56 to 12.8.
// node mockup27abc-src/bench.mjs <url> [step=.01]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const [url, step = '.01'] = process.argv.slice(2);
const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await pg.goto(`${url}?v=7.3&still`);
for (let i = 0; i < 240 && !(await pg.evaluate(() => !!(window.__nw && window.__nw.X().built))); i++) await pg.waitForTimeout(500);
const r = await pg.evaluate(st => {
  const G3 = window.__nw.G3(); G3.renderer.render = () => {};
  const ctx = document.createElement('canvas').getContext('2d'), out = [];
  for (let q = 2.56; q <= 12.8; q += st) { const t0 = performance.now(); window.NG_EXT.post(ctx, q); out.push([performance.now() - t0, +q.toFixed(2), window.__nw.X().updMs || 0]); }
  const s = out.map(x => x[0]).sort((a, b) => a - b), p = k => +s[Math.floor(s.length * k)].toFixed(2);
  return { frames: out.length, median: p(.5), p95: p(.95), p99: p(.99), max: +s[s.length - 1].toFixed(1), worst: out.sort((a, b) => b[0] - a[0]).slice(0, 6).map(x => `${x[1]}:${x[0].toFixed(1)}(reform ${x[2].toFixed(1)})`), buildMs: window.__nw.buildMs };
}, +step);
console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'no errors'); await b.close();
