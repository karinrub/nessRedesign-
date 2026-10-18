/* A — THE STROKE
   One wire, one gesture, the way the hero has one wire. It comes in as the Bridge's horizon, rises up the long back,
   pitches over as the lip (out along the top, folding at the tip, back along the underside: two lines, so the lip has
   weight), drops down the face and runs out to sea again under the curl. Nothing else. The curl is the only place
   with barbs, gathered like Hokusai's claws. In depth, the lip peels toward the camera as it throws, so the curl opens
   into a tube from three quarters and closes into the classic profile from the side.
   Construction: strategy A + G in research/B-sculpture.md (one gesture, one depth cue). */
import { V3, run, wire, aim, typePlane, disc, discThrough, curve, font, para, OFFERS, CTA, MAIL, HEADING, CREAM, RED, ss, lerp } from './kit.js';

const H = 14;
/* z forward, y up (H = 1), and p = how far the point has peeled along x (in H) */
const P = [
  [-14, 0, 0], [-7, 0, 0], [-3.2, .06, 0], [-2.0, .16, 0], [-1.2, .38, 0], [-.55, .72, 0], [-.2, .93, .04], [.12, 1.03, .14],
  [.42, 1.0, .3], [.66, .86, .5], [.84, .64, .72], [.93, .42, .92], [.95, .26, 1.06],                  /* lip outer → tip */
  [.88, .30, 1.16], [.80, .50, 1.26], [.64, .70, 1.36], [.44, .80, 1.46], [.26, .76, 1.54],             /* lip underside */
  [.12, .60, 1.62], [.06, .38, 1.68], [.10, .17, 1.73], [.26, .05, 1.77], [.55, .0, 1.8],              /* face → trough */
  [1.4, 0, 1.82], [4, 0, 1.84], [14, 0, 1.84]                                                           /* out to sea */
];
let built = false, F;
function build(S) {
  if (built) return; built = true;
  F = curve(P.map(([z, y, p]) => [p * H, y * H, z * H]), 'centripetal');
  /* barbs only along the curl: from the crest to the bottom of the underside */
  const L = F.len, tOf = i => { let a = 0; for (let k = 1; k <= i; k++) a += Math.hypot(...[0, 1, 2].map(j => (P[k][j] - P[k - 1][j]) * H)); return a; };
  const tot = tOf(P.length - 1), t0 = tOf(7) / tot, t1 = tOf(17) / tot;
  const curl = Array.from({ length: 9 }, (_, j) => t0 + (t1 - t0) * Math.pow((j + .5) / 9, .9));
  /* elsewhere a barb every ~13 units, like fence wire, so it is barbed wire end to end and never rope */
  const sparse = []; for (let m = 6; m < L; m += 13) { const t = m / L; if (t < t0 - .015 || t > t1 + .02) sparse.push(t); }
  const at = [...sparse, ...curl].sort((a, b) => a - b);
  wire(S, F, { at, radius: .3, step: .22 });
}
const VOID = [1.15 * H, .48 * H, .52 * H];          /* the middle of the curl's empty space */
const views = [
  /* 1 — the silhouette at the hero's scale: the line comes in from the left edge, stands up, throws, runs out right */
  S => { build(S); aim(S, { p: [-58, 3.5, 20], t: [10, 7, 2], f: 26, s: [0, -.2] }); },
  /* 2 — the barrel: low on the water, close under the lip, the sun held in the curl */
  S => { build(S); aim(S, { p: [-16, 1.4, 12], t: [18, 6.4, 8], f: 58, s: [-.05, 0] }); discThrough(S, VOID, 8, 12); },
  /* 3 — Photography: the curl as the lens; the name sits behind the back of the wave, the lip passes in front of it */
  S => { build(S); aim(S, { p: [-62, 4, 26], t: [6, 7, 2], f: 28, s: [-.2, -.12] });
    typePlane(S, 70, (c, W, H) => { font(c, 700, W * .14, -.06); c.fillStyle = CREAM; c.fillText(OFFERS.photo.name, W * .035, H * .3); });
    typePlane(S, 30, (c, W, H) => { para(c, OFFERS.photo.body, W * .045, H * .7, Math.min(W * .3, 440), { px: Math.max(17, W * .0128) }); });
  },
  /* 4 — the final reveal: the line edge to edge, the wave standing over the lower third, the sun set inside the barrel */
  S => { build(S); aim(S, { p: [-44, 2.6, 16], t: [12, 6.5, 3], f: 30, s: [-.2, -.34] }); discThrough(S, VOID, 9, 14);
    typePlane(S, 30, (c, W, H) => {
      font(c, 700, W * .074, -.055); c.fillStyle = CREAM; c.fillText(CTA, W * .045, H * .2);
      font(c, 500, Math.max(17, W * .0128), 0); c.fillText(MAIL, W * .045, H * .2 + W * .04);
      c.fillStyle = RED; c.fillRect(W * .045, H * .2 + W * .04 + 7, c.measureText(MAIL).width, 2);
    });
  }
];
run(views);
