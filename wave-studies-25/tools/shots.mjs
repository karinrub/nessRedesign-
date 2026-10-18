// Stills of the wave studies on the real GPU (system Chrome, Metal).
// usage: PW=<dir>/node_modules/playwright-core node tools/shots.mjs <outdir> <study.html> [views=1,2,3,4] [WxH=1440x900]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright-core');
const [out, page, list = '1,2,3,4', size = '1440x900'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 300))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
const name = page.split('/').pop().replace('.html', '');
for (const v of list.split(',')) {
  const t0 = Date.now();
  await pg.goto(`http://localhost:8765/wave-studies-25/studies/${page}?view=${v}`);
  await pg.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 }).catch(() => errs.push('timeout view ' + v));
  await pg.waitForTimeout(300);
  const file = `${out}/${name}-v${v}${size === '1440x900' ? '' : '-' + size}.jpg`;
  await pg.screenshot({ path: file, quality: 88 });
  console.log(file, Date.now() - t0, 'ms');
}
console.log(errs.join('\n') || 'no errors');
await b.close();
