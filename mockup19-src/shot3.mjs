import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node-tools/node_modules/playwright');
const [file, prefix, list, wait = '7000'] = process.argv.slice(2);
const errs = [];
for (const v of list.split(',')) {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on('pageerror', e => errs.push(v + ' ' + e.message.slice(0, 200)));
  await pg.goto(`file://${file}?v=${v}&still`); await pg.waitForTimeout(+wait);
  await pg.screenshot({ path: `${prefix}_${v}.png` }); await pg.waitForTimeout(1500); await pg.screenshot({ path: `${prefix}_${v}.png` }); await b.close();
}
console.log(errs.join('\n') || 'no errors');
