/* 26 — the four sculptures as pure strand families.
   Each form is { N, at(i, s, t, out) }: strand i of N, s in [0,1] along it, t an optional morph in [0,1]. Local space:
   y up, ground y = 0, the form centred near the origin. No three.js here but Vector3.set on `out`, so the same
   functions drive both the wire and the solid-ribbon legibility test. */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const ss = (v, a, b) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const PI = Math.PI;
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- WEBSITES: the plan that stands up ----------
   A ribbon of strands lies on the ground as a long flat plan, rises through a tapered catenary arch while it makes a
   quarter turn (a wall seen edge-on at the feet, square to the viewer at the crown), and settles back to the ground.
   Every strand is the same line laid at its own offset: authored, load-bearing, planned. */
const WEB = { N: 24, W: 46, H: 66, k: 1.85, Lr: 150, Lt: 18 };
WEB.xa = -(WEB.W + WEB.Lr); WEB.xb = WEB.W + WEB.Lt; WEB.xj = -WEB.W - 12;
function webSpine(x, o) {
  const { W, H, k } = WEB, ch = Math.cosh(k), c = 1 - 1 / ch, e = 5;
  const yr = H * (1 - Math.cosh(k * x / W) / ch) / c, dyr = -H * k * Math.sinh(k * x / W) / (W * ch * c);
  const r = Math.sqrt(yr * yr + e * e), y = .5 * (yr + r), dy = .5 * (1 + yr / r) * dyr, l = Math.hypot(1, dy);
  o.x = x; o.y = y; o.nx = -dy / l; o.ny = 1 / l; o.h = y / H; return o;
}
const _w = {};
function webAt(i, s, t, out) {
  const x = lerp(WEB.xa, WEB.xb, s), sp = webSpine(x, _w), twist = PI / 2 * ss(sp.h, .03, .9);
  const wd = lerp(104, 46, ss(sp.h, 0, 1)), q = (i / (WEB.N - 1) - .5) * wd;
  const wx = Math.sin(twist) * sp.nx, wy = Math.sin(twist) * sp.ny, wz = Math.cos(twist);
  return out.set(sp.x + q * wx, sp.y + .17 + q * wy, q * wz);
}

/* ---------- PHOTOGRAPHY: the barrel ----------
   A plunging wave as a loft of profile strands: the back of the swell, the crest, the lip thrown forward and curling under.
   Profiles stand up, curl and close along x, so the lip is a long diagonal line and the barrel is a tunnel. */
const PH = { N: 44, X0: -90, X1: 58 };
const phKey = x => {
  const g = ss(x, -90, 44);                                                 /* the wave grows toward the mouth */
  const c = ss(x, -64, 30) * (1 - ss(x, 50, 58));                           /* how far the lip has thrown */
  return { H: 8 + 56 * g * (1 - .85 * ss(x, 52, 58)), R: 3 + 23 * c, psi: c * 5.3, c, a: g };
};
function phProfile(x, N = 96) {
  const { H, R, psi, c } = phKey(x), zc = 10 + x * .12, pts = [];
  const back = 11;
  for (let j = 0; j <= back; j++) { const v = j / back, z = lerp(-96, zc - R * .2, v), y = H * Math.pow(ss(v, 0, 1), 1.55) * (1 - .0 * v); pts.push([z, y]); }
  /* the crest rolls over into a curl: a spiral that tightens */
  const m = Math.max(2, Math.round(psi / PI * 16));
  const yc = H - R, zcc = zc;
  for (let j = 1; j <= m; j++) { const f = j / m, ph = f * psi, r = R * (1 - .42 * f);
    pts.push([zcc + r * Math.sin(ph), yc + (r) * Math.cos(ph) - (R - r) * .0]); }
  return pts;
}
const phCache = new Map();
function phStrand(i) {
  if (phCache.has(i)) return phCache.get(i);
  const x = lerp(PH.X0, PH.X1, i / (PH.N - 1)), pts = phProfile(x), L = [0];
  for (let j = 1; j < pts.length; j++) L.push(L[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
  const o = { x, pts, L }; phCache.set(i, o); return o;
}
function phAt(i, s, t, out) {
  const { x, pts, L } = phStrand(i), m = clamp(s) * L[L.length - 1]; let k = 1; while (k < pts.length - 1 && L[k] < m) k++;
  const f = clamp((m - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1])), p0 = pts[Math.max(0, k - 2)], a = pts[k - 1], b = pts[k], p3 = pts[Math.min(pts.length - 1, k + 1)];
  /* catmull-rom through the profile */
  const cr = (j) => .5 * ((2 * a[j]) + (-p0[j] + b[j]) * f + (2 * p0[j] - 5 * a[j] + 4 * b[j] - p3[j]) * f * f + (-p0[j] + 3 * a[j] - 3 * b[j] + p3[j]) * f * f * f);
  return out.set(x, cr(1), cr(0));
}

/* ---------- REBUILDS: the plait ----------
   Three ribbons of strands. On the right they are plaited, over and under, tight and even; on the left they have come apart,
   each strand wandering off on its own. t is how far the plait has been taken back along the wire. */
const RB = { N: 30, L: 170, A: 10.5, B: 8, C: 3.4 };
const rbPlait = (i, s, out) => {
  const per = RB.N / 3, k = Math.floor(i / per), j = i % per, jj = j / (per - 1) - .5;
  const th = 2 * PI * RB.C * s + 2 * PI * k / 3, y0 = RB.A * Math.sin(th), z0 = RB.B * Math.sin(2 * th + .6), q = jj * 9;
  return out.set((s - .5) * RB.L, 20 * (s - .5) + 4 + y0 + q, z0);
};
const _p = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } };
function rbAt(i, s, t, out) {
  const per = RB.N / 3, k = Math.floor(i / per), m = i / (RB.N - 1) - .5, tt = ss(t, 0, 1);
  const h1 = hash(i * 3.1), h2 = hash(i * 7.7 + 1);
  const dk = lerp(.72 + .05 * k, .15 + .08 * k, tt) + (h1 - .5) * .035;       /* where this strand joins the plait */
  const end = .94 + .06 * h1;
  if (s >= dk) { rbPlait(i, s * end, out); out.x = (s * end - .5) * RB.L; return out; }
  /* the free end: leaves the plait heading left and opens into a fan, every strand turning its own way */
  rbPlait(i, dk * end, _p);
  const lam = (dk - s) / dk, Lf = 58 * (.72 + .5 * h1) * lam, beta = m * 1.7 + .2 + (h2 - .5) * .1;
  const psi = beta * Math.pow(lam, .75), L = Lf * (dk > .04 ? 1 : 1);
  return out.set(_p.x - L * Math.cos(psi), _p.y + L * Math.sin(psi) - 12 * lam * lam, _p.z + m * 20 * lam + 6 * Math.sin(lam * 6 + i));
}

/* ---------- CARE: the shelter ----------
   Strands gather at one low root and sweep up and over a small red ember, graduated in length and height like feathers,
   leaning in toward it: a cupped hand, a wing, a hood. The ember is the only thing it is for. */
const CR = { N: 38, root: [-46, 0, -14], ember: [10, 11, 14] };
function crAt(i, s, t, out) {
  const m = i / (CR.N - 1), al = lerp(-34, 86, m) * PI / 180;
  const D = lerp(92, 44, Math.pow(m, 1.15)) * (1 + .035 * Math.sin(i * 2.3)), h = lerp(62, 20, Math.pow(m, .85));
  const v = s, r = D * Math.pow(v, .9), y = h * Math.pow(Math.sin(PI * Math.pow(v, .8)), .9);
  const dx = Math.cos(al), dz = Math.sin(al), px = -dz, pz = dx;
  const lean = lerp(-6, 30, Math.pow(m, 1.2)) * Math.sin(PI * v) * Math.pow(v, .35);   /* the outer strands lean in over the ember */
  return out.set(CR.root[0] + r * dx - lean * px, y, CR.root[2] + r * dz - lean * pz);
}

/* ---------- THE FIELD: the plan, run out to the horizon ----------
   Long straight strands laid side by side along x, from behind the last camera to where the sun stands. */
const FD = { N: 37, x0: -760, x1: 1700, wz: 880 };
const fdAt = (i, s, t, out) => out.set(lerp(FD.x0, FD.x1, s), -.7, (i / (FD.N - 1) - .5) * FD.wz);

export const FORMS = {
  field: { N: FD.N, at: fdAt, meta: FD, name: 'The Plan Run Out' },
  web: { N: WEB.N, at: webAt, meta: WEB, name: 'The Plan That Stands Up' },
  photo: { N: PH.N, at: phAt, meta: PH, name: 'The Barrel' },
  reb: { N: RB.N, at: rbAt, meta: RB, name: 'The Plait' },
  care: { N: CR.N, at: crAt, meta: CR, name: 'The Shelter' }
};
