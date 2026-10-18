/* B — FRAMES
   One wave, photographed five times as it breaks, like a chronophotograph (Marey), or like the film this site already
   is: swell, steepening, pitching lip, barrel, collapse. Each frame is one open barbed-wire stroke of the real
   plunging-breaker profile (research/A-waves.md §3), barbs gathered at the lip only. All five stand on one horizon
   wire: the line the Bridge collapses into. From the channel they read as a sequence; from inside the barrel they
   nest into a tunnel of profiles with the light at the end. Construction: strategy C/F in research/B-sculpture.md,
   ordered in time instead of in space. */
import { V3, run, wire, aim, typePlane, disc, discThrough, curve, steel, font, para, OFFERS, CTA, MAIL, CREAM, RED } from './kit.js';
import { STAGE } from './profiles.js';

const H = 12, GAP = 30, ZS = 1.0;                       /* wave height; distance between frames; horizon at z = 1.0 H */
const ORDER = ['swell', 'steep', 'pitch', 'barrel', 'collapse'];
const XF = ORDER.map((_, i) => (i - 2) * GAP);           /* frame i stands at x = XF[i] */
/* barbs: [first point index, last point index, count] of the lip run in each stage */
const LIP = { swell: [4, 7, 3], steep: [4, 9, 4], pitch: [5, 11, 6], barrel: [4, 11, 7], collapse: [2, 6, 3] };
const tAt = (pts, idx) => { let L = 0, A = 0; const d = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(l); L += l; } for (let i = 0; i < idx; i++) A += d[i]; return A / L; };

let built = false;
function build(S) {
  if (built) return; built = true;
  ORDER.forEach((k, i) => {
    const P = STAGE[k], [a, b, n] = LIP[k], ta = tAt(P, a), tb = tAt(P, b);
    const at = Array.from({ length: n }, (_, j) => ta + (tb - ta) * (j + .5) / n);
    /* every frame stands on the horizon: its front is cut where it reaches the line */
    const Q = k === 'barrel' ? P : [...P.filter(([z]) => z < ZS - .04), [ZS, 0]];
    wire(S, curve(Q.map(([z, y]) => [XF[i], y * H, z * H])), { at: at.map(t => t * tAt(P, P.length - 1) / tAt(Q, Q.length - 1) || t), step: .25 });
  });
  /* the horizon: the Bridge's line, the sea every frame stands on */
  wire(S, curve([[-600, 0, ZS * H], [600, 0, ZS * H]]), { barbs: 0, material: steel(S, .7), radius: .2 });
}

const views = [
  /* 1 — the five frames seen down the line, through a long lens: they stack into one wave, each an exposure later
     than the last, the way the Bridge doubled its sentence out of register */
  S => { build(S); aim(S, { p: [-250, 8, 52], t: [-4, 6, 4], f: 10, s: [.04, -.12] }); },
  /* 2 — inside the barrel, looking back up the line: the earlier frames nest into a tunnel, the light at its end */
  S => { build(S); aim(S, { p: [XF[3] + 24, .38 * H, .5 * H], t: [XF[0] - 40, .46 * H, .5 * H], f: 42 }); disc(S, [-420, .48 * H, .52 * H], 10); },
  /* 3 — Rebuilds: from beyond the collapse, looking back: the broken frame in front, the clean ones standing behind */
  S => { build(S); aim(S, { p: [100, 4, 75], t: [30, 5, 4], f: 26, s: [.32, -.3] });
    typePlane(S, 70, (c, W, H) => {
      font(c, 700, W * .15, -.06); c.fillStyle = CREAM; c.fillText(OFFERS.reb.name, W * .035, H * .28);
      para(c, OFFERS.reb.body, W * .045, H * .34, Math.min(W * .3, 440), { px: Math.max(17, W * .0128) });
    });
  },
  /* 4 — the final reveal: the whole sequence from the channel, the sun low on the horizon beyond the last frame */
  S => { build(S); aim(S, { p: [-170, 3, 90], t: [10, 6, 2], f: 21, s: [-.06, -.34] }); discThrough(S, [XF[3], .42 * H, .52 * H], 6, 10);
    typePlane(S, 40, (c, W, H) => {
      font(c, 700, W * .074, -.055); c.fillStyle = CREAM; c.fillText(CTA, W * .045, H * .18);
      font(c, 500, Math.max(17, W * .0128), 0); c.fillText(MAIL, W * .045, H * .18 + W * .04);
      c.fillStyle = RED; c.fillRect(W * .045, H * .18 + W * .04 + 7, c.measureText(MAIL).width, 2);
    });
  }
];
run(views);
