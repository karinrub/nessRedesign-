/* C — TENSION
   Barbed wire is fence wire: it is made to be strung taut between two points. Here it is strung between two rails,
   the waterline and the lip, and the strands, every one dead straight, tilt as you go down the line: leaning back on
   the shoulder, standing upright where the face steepens, leaning out past vertical where the lip throws. A ruled
   surface (Gabo, Serra's torque, Dawe): the eye completes a twisting face from fifteen straight lines, and the void
   behind the leaning strands is the barrel. The lip rail is the hero line; the strands are quieter steel.
   Construction: strategy B in research/B-sculpture.md. */
import { V3, run, wire, aim, typePlane, disc, discThrough, curve, segment, steel, font, para, OFFERS, CTA, MAIL, CREAM, RED, lerp } from './kit.js';

const H = 15;
/* the lip rail, as [s, y (H), z (H)]: it climbs out of the waterline on the shoulder leaning back, stands up, throws
   forward past vertical and lands back on the waterline where the section closes out */
const LIPK = [[0, 0, -.05], [.12, .3, -.32], [.28, .72, -.5], [.42, 1.0, -.3], [.53, 1.14, .05], [.63, 1.1, .5], [.72, .96, .9], [.8, .76, 1.2], [.86, .52, 1.42], [.91, .28, 1.42], [.945, .14, 1.2], [.965, .16, .94], [.98, .32, .78], [.99, .5, .84], [1, .58, 1.0]];
const X0 = -46, X1 = 46, xOf = s => X0 + (X1 - X0) * s;
let lipCurve;
const lipAt = s => { const p = lipCurve.getPointAt(Math.max(0, Math.min(1, s))); return [p.x, p.y, p.z]; };
/* strands: generous on the shoulder, gathering into the throw; each foot sits a little behind its head (the torque) */
const ST = [.06, .16, .26, .36, .45, .53, .6, .67, .73, .79, .84, .885];
let built = false;
const BACK = -2.3;                               /* the back rail, where the strands are anchored: 2.3 H behind the face */
function build(S) {
  if (built) return; built = true;
  const quiet = steel(S, .6);
  const lip = curve(LIPK.map(([s, y, z]) => [xOf(s), y * H, z * H]));
  lipCurve = lip.curve;
  /* the waterline in front (the Bridge's line, the datum the lip falls toward) and the back rail behind */
  wire(S, segment([-400, 0, 0], [400, 0, 0]), { barbs: 0, radius: .22, material: steel(S, .7) });
  wire(S, segment([-400, 0, BACK * H], [400, 0, BACK * H]), { barbs: 0, radius: .2, material: quiet });
  wire(S, lip, { at: [.12, .3, .45, .55, .62, .68, .73, .78, .82, .86, .9, .93, .96], radius: .3 });
  /* the strands: dead straight from the back rail up to the lip, so the long back of the wave is a taut sheet and its
     front, the barrel, stays empty */
  ST.forEach((u, i) => {
    let lo = 0, hi = 1; const xs = xOf(u); for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (lipAt(m)[0] < xs) lo = m; else hi = m; }
    const b = lipAt(lo), a = [b[0] - 10 * u, 0, BACK * H];
    wire(S, segment(a, b), { at: [.5 + (i % 2 ? .12 : -.12)], material: quiet, radius: .19 });
  });
}
const views = [
  /* 1 — from the shoulder side, low on the water: the taut back of the wave, the lip throwing over its empty front */
  S => { build(S); aim(S, { p: [-95, 2.5, 26], t: [6, 9, 2], f: 25, s: [-.12, -.18] }); },
  /* 2 — the barrel: under the lip at the closeout, looking back up the line; the sun at the end of the tube */
  S => { build(S); aim(S, { p: [40, 2, 16], t: [-20, 8, 0], f: 50 }); discThrough(S, [-30, 2.2, 0], 5, 13); },
  /* 3 — Websites: the shoulder taking shape out of the waterline, seen from the channel */
  S => { build(S); aim(S, { p: [-120, 3, 50], t: [-6, 7, 0], f: 26, s: [.1, -.32] });
    typePlane(S, 60, (c, W, H) => {
      font(c, 700, W * .148, -.06); c.fillStyle = CREAM; c.fillText(OFFERS.web.name, W * .035, H * .27);
      para(c, OFFERS.web.body, W * .045, H * .33, Math.min(W * .3, 440), { px: Math.max(17, W * .0128) });
    });
  },
  /* 4 — the final reveal on a red field: the whole wave from the channel, broadside, the waterline out both edges */
  S => { build(S); aim(S, { p: [-80, 1.5, 24], t: [10, 9, 4], f: 28, s: [-.12, -.3] });
    typePlane(S, 40, (c, W, H) => {
      font(c, 700, W * .074, -.055); c.fillStyle = CREAM; c.fillText(CTA, W * .045, H * .17);
      font(c, 500, Math.max(17, W * .0128), 0); c.fillText(MAIL, W * .045, H * .17 + W * .04);
      c.fillStyle = '#17150f'; c.fillRect(W * .045, H * .17 + W * .04 + 7, c.measureText(MAIL).width, 2);
    });
  }
];
run(views, { bg: n => n === 4 ? RED : '#17150f' });
