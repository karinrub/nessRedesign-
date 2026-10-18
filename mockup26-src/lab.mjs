// node mockup26-src/lab.mjs <outprefix> <form> '<json cams>' [ribbon=0] [t=.7]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const [pre, form, js, ribbon = '0', tt = '.7'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await pg.goto(`http://localhost:8765/mockup26-src/lab/lab.html?form=${form}&ribbon=${ribbon}&t=${tt}`);
await pg.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
const L = JSON.parse(js);
for (let i = 0; i < L.length; i++) { await pg.evaluate(c => __lab.look(c), L[i]); await pg.screenshot({ path: `${pre}${i}.jpg`, quality: 82 }); }
console.log(errs.join('\n') || 'ok'); await b.close();
