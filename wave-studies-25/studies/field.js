/* A peeling right-hander as a field: profile(s, u) gives the point at station s along the wave (0 = the far shoulder,
   1 = the whitewater) and u across its front (0 = the trough, 1 = the tip of the lip). Profiles are hand-built from
   the plunging-breaker stages in research/A-waves.md §3 (swell → steep → pitching → barrel → collapse), H = 1,
   z forward toward the shore, y up. Each keyframe is the FRONT of the wave only: trough → face → crest → lip → tip. */
import { T, V3, clamp, lerp, ss } from './kit.js';

export const K = {
  swell:   [[1.20, 0], [.80, .05], [.45, .16], [.20, .26], [.02, .32], [-.12, .34], [-.22, .33], [-.30, .31]],
  steep:   [[.95, 0], [.58, .09], [.34, .28], [.24, .52], [.22, .70], [.27, .79], [.35, .78], [.40, .72]],
  pitch:   [[.85, 0], [.42, .07], [.20, .29], [.14, .58], [.24, .90], [.45, 1.02], [.64, .93], [.73, .74]],
  barrel:  [[.70, 0], [.24, .05], [.04, .28], [.01, .60], [.18, .95], [.50, 1.05], [.86, .84], [1.00, .40]],
  collapse:[[.95, 0], [.55, .04], [.34, .14], [.28, .30], [.40, .47], [.62, .53], [.86, .41], [1.04, .12]]
};
/* which keyframes along the wave; ends flatten to a single line (the Bridge's line in, one line out) */
export function makeField({ stations = [[0, 'swell'], [.3, 'steep'], [.5, 'pitch'], [.68, 'barrel'], [.82, 'barrel'], [1, 'collapse']], flat0 = [-.25, .02], flat1 = [1.0, 1.2], keys = K } = {}) {
  const st = stations.map(([s, k]) => [s, keys[k]]);
  const raw = s => {
    let i = 0; while (i < st.length - 2 && s > st[i + 1][0]) i++;
    const [s0, a] = st[i], [s1, b] = st[i + 1], u = ss(s, s0, s1);
    return a.map((p, k) => [lerp(p[0], b[k][0], u), lerp(p[1], b[k][1], u)]);
  };
  /* flatten toward a point on the sea at either end */
  const height = s => ss(s, flat0[0], flat0[1]) * (1 - ss(s, flat1[0], flat1[1]));
  const cache = new Map();
  const prof = s => {
    const key = s.toFixed(4); if (cache.has(key)) return cache.get(key);
    const h = height(s), P = raw(clamp(s)).map(([z, y]) => [lerp(.6, z, h), y * h]);
    const c = new T.CatmullRomCurve3(P.map(([z, y]) => V3(0, y, z)), false, 'centripetal'); c.arcLengthDivisions = 200;
    cache.set(key, c); return c;
  };
  return { prof, height, point(s, u, o) { const p = prof(s).getPointAt(clamp(u)); return o.set(0, p.y, p.z); } };
}
