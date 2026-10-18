// Try camera framings on a study: node tools/look.mjs <out.jpg-prefix> <study.html> <view> '<json array of aim configs>'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright-core');
const [pre, page, v, js] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300)));
await pg.goto(`http://localhost:8765/wave-studies-25/studies/${page}?view=${v}`);
await pg.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
const L = JSON.parse(js);
for (let i = 0; i < L.length; i++) { await pg.evaluate(c => __study.look(c), L[i]); await pg.screenshot({ path: `${pre}${i}.jpg`, quality: 80 }); }
console.log(errs.join('\n') || 'ok'); await b.close();
