/* A — THE STROKE, motion proof (not the Offers film).
   The camera never moves. Scroll drives one wire through the stages of a plunging breaker (research/A-waves.md §3):
   the Bridge's flat line → swell (Websites) → barrel (Photography) → collapse (Rebuilds) → the next swell rising (Care).
   Each stage is resampled to the same number of points by arc length and the wire is re-formed between them.
   Purpose: check that the gesture stays beautiful in between the stops, not only at them. */
import { V3, stage, aim, curve, font, CREAM, clamp, lerp } from './kit.js';
import { createSteelWire } from 'ness-wire-model';
import { STAGE } from './profiles.js';

const H = 14, N = 140;
const LEFT = [[-14, 0], [-7, 0], [-3.2, .03]], RIGHT = [[4, 0], [14, 0]];
const flat = Array.from({ length: 24 }, (_, i) => [lerp(-3, 1.5, i / 23), 0]);
const withSea = P => { const Q = [...LEFT, ...P]; const last = Q[Q.length - 1]; if (last[0] < 1.4) Q.push([1.4, 0]); return [...Q, ...RIGHT]; };
function resample(P) {
  const c = curve(P.map(([z, y]) => [0, y, z]));
  return Array.from({ length: N }, (_, i) => { const o = V3(); c(i / (N - 1), o); return [o.z, o.y]; });
}
/* the lip lands and the wave lies down as whitewater: low, long, a few short kinks where it broke */
const SPENT = [[-2.0, .04], [-1.3, .2], [-.6, .34], [-.1, .4], [.3, .36], [.48, .26], [.56, .33], [.66, .22], [.76, .27], [.9, .12], [1.1, .04], [1.5, 0]];
const LANDED = [[-2.0, .05], [-1.0, .42], [-.4, .78], [-.1, .9], [.25, .9], [.55, .8], [.8, .58], [.95, .3], [1.05, .04], [1.0, .14], [.86, .32], [.66, .48], [.45, .52], [.25, .44], [.12, .28], [.15, .1], [.35, .02], [.6, 0]];
const KEYS = [
  [0, resample(withSea(flat))], [.2, resample(withSea(STAGE.swell))], [.33, resample(withSea(STAGE.pitch))],
  [.45, resample(withSea(STAGE.barrel))], [.56, resample(withSea(LANDED))], [.7, resample(withSea(SPENT))], [.9, resample(withSea(STAGE.swell))]
];
const NAMES = [[.2, 'Websites'], [.45, 'Photography'], [.7, 'Rebuilds'], [.9, 'Care']];
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function shape(t) {
  let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const [t0, a] = KEYS[i], [t1, b] = KEYS[i + 1], u = eio(clamp((t - t0) / (t1 - t0)));
  return a.map((p, k) => [lerp(p[0], b[k][0], u), lerp(p[1], b[k][1], u)]);
}

await document.fonts.load("700 100px 'Instrument Sans'");
const S = stage(document.querySelector('canvas.gl'));
const w = createSteelWire(S.studio, { segments: 900, barbs: 22, radius: .3 });
w.setBarbPositions(Array.from({ length: 22 }, (_, i) => .06 + .88 * (i + .5) / 22)); S.scene.add(w.group);
const label = document.querySelector('.label');
let cur = 0, target = 0, cache = null;
const sampler = P => { const c = curve(P.map(([z, y]) => [0, y * H, z * H])); return (t, o) => c(t, o); };
function frame() {
  cur += (target - cur) * .12; if (Math.abs(target - cur) < 1e-4) cur = target;
  const key = cur.toFixed(4);
  if (key !== cache) {
    cache = key; w.update(sampler(shape(cur)));
    aim(S, { p: [-58, 3.5, 20].map((v, i) => i === 0 ? v : v), t: [0, 7, 2], f: 26, s: [0, -.2] });
    S.renderer.render(S.scene, S.camera);
    const at = NAMES.find(([q]) => Math.abs(cur - q) < .035);
    label.textContent = at ? at[1] : ''; label.style.opacity = at ? 1 - Math.abs(cur - at[0]) / .035 : 0;
  }
  requestAnimationFrame(frame);
}
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const onScroll = () => {
  const t = clamp(scrollY / (document.documentElement.scrollHeight - innerHeight));
  target = reduced ? NAMES.reduce((b, [q]) => Math.abs(q - t) < Math.abs(b - t) ? q : b, 0) : t;
};
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { S.resize(); cache = null; });
window.__motion = { set: t => { target = cur = t; cache = null; } };
onScroll(); frame(); document.documentElement.dataset.ready = '1';
