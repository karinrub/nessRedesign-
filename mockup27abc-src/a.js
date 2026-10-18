/* 27A — THE HANGING MODEL (Offers)
   Gaudí never drew his vaults: he hung cords with small weights, let gravity find the form, then turned the photograph upside
   down. Here the strands hang from beyond the top of the frame and each offer is a load that finds its own form in them:
     WEBSITES     HANG      "made for you" is held in the red weight; it lowers into the curtain and a bell hangs around it
     PHOTOGRAPHY  WEIGH-IN  twelve identical weights in a perfect festoon slide and swell into an irregular, specific surface
     REBUILDS     TIE       a sagged span; a pulse reads its tension; one new strand ties it, and the sag rises
     CARE         SWAY      a tug on one far strand runs straight to the weight, and the weight answers
   Then the world turns over (the type stays upright): the four loads stand as four peaks of a ridge, the dot a low sun in the
   saddle, and the camera climbs over the ridge into the sun, which is Packages. */
window.NG_EXT = (() => {
/*KIT*/
  const TOP = 150, FOOT = -12;
  const XW = 0, XP = 236, XR = 450, XC = 666;
  const ZP = -170, ZR = -50, ZC = -250;            /* the net curves in plan, so its four loads overlap when the world turns over */
  const Z = { bell: 0, wlow: 0, plP: 0, plC: 0, irr: 0, tie: 0, lift: 0, wave: 1, tug: 0, wind: 0 };

  /* ---------- the catenary: a strand of length L hanging between two points ---------- */
  function catPrep(P1, P2, L, c = {}) {
    const dx = P2[0] - P1[0], dz = P2[2] - P1[2], h = Math.hypot(dx, dz), v = P2[1] - P1[1], ch = Math.hypot(h, v);
    c.P1 = P1; c.P2 = P2; c.ux = h > 1e-6 ? dx / h : 0; c.uz = h > 1e-6 ? dz / h : 0; c.h = h; c.v = v;
    if (h < .05 || L <= ch * 1.0004) { c.line = true; return c; }
    c.line = false; L = Math.max(L, ch * 1.0004);
    const r = Math.sqrt(L * L - v * v) / h; let x = r < 3 ? Math.sqrt(6 * (r - 1)) : Math.log(2 * r) + Math.log(Math.log(2 * r));
    for (let k = 0; k < 30; k++) { const g = Math.sinh(x) - r * x, d = Math.cosh(x) - r; x -= g / d; if (Math.abs(g) < 1e-9) break; }
    const a = h / (2 * x), x0 = (h - a * Math.log((L + v) / (L - v))) / 2;
    c.a = a; c.x0 = x0; c.L = L; c.s0 = Math.sinh(-x0 / a); c.c0 = Math.cosh(-x0 / a); return c;
  }
  function catAt(c, s, out) {
    if (c.line) return out.set(lerp(c.P1[0], c.P2[0], s), lerp(c.P1[1], c.P2[1], s), lerp(c.P1[2], c.P2[2], s));
    const x = c.x0 + c.a * Math.asinh(s * c.L / c.a + c.s0), y = c.a * (Math.cosh((x - c.x0) / c.a) - c.c0);
    return out.set(c.P1[0] + c.ux * x, c.P1[1] + y, c.P1[2] + c.uz * x);
  }
  const L3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const D3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  /* a form of hanging strands: anchor(i), end(i) and slack(i) are read from the current state Z when s = 0 */
  function hanging(N, spec) {
    const C = []; for (let i = 0; i < N; i++) C.push({});
    return { N, at(i, s, t, out) {
      const c = C[i];
      if (s === 0 || !c.P1) { const P1 = spec.anchor(i), P2 = spec.end(i); catPrep(P1, P2, Math.max(D3(P1, P2), spec.len(i, P1, P2)), c); }
      catAt(c, s, out); if (spec.bend) spec.bend(i, s, out); return out;
    } };
  }
  const zw = (x, k = 1) => 16 * Math.sin(x * .061 * k + 1.3) + 6 * Math.sin(x * .17 + .4);

  /* ---------- WEBSITES: the bell. 17 strands from a wavy row of anchors; the weight lowers and they converge on it ---------- */
  const AW = Array.from({ length: 17 }, (_, i) => { const x = XW - 84 + i * 10.5; return [x, TOP, zw(x)]; });
  const W0 = [XW, 2, 6], WB = [XW, -70, 6];
  const wPos = () => L3(W0, WB, eio(Z.wlow));
  const plumb = A => [A[0], FOOT, A[2]];
  const FW = hanging(17, {
    anchor: i => AW[i],
    end: i => L3(plumb(AW[i]), wPos(), ss(Z.bell, 0, .8)),
    len: (i, P1, P2) => D3(P1, P2) * lerp(1, 1.02 + .045 * Math.abs(i - 8) / 8, ss(Z.bell, 0, 1))
  });
  /* the ghosts: other bells that could have hung here (narrow and tall, wide and shallow, lopsided) */
  const ghost = (cx, cz, span, n, wx, wy) => {
    const An = Array.from({ length: n }, (_, i) => { const x = cx - span + i * 2 * span / (n - 1); return [x, TOP, cz + 12 * Math.sin(i * 1.7)]; });
    return hanging(n, { anchor: i => An[i], end: () => [cx + wx, wy, cz], len: (i, P1, P2) => D3(P1, P2) * 1.04 });
  };
  const GH = [ghost(XW - 160, -140, 30, 10, 0, -96), ghost(XW + 60, -330, 120, 13, 0, 46), ghost(XW - 60, -480, 70, 11, 52, -4)];

  /* ---------- PHOTOGRAPHY: twelve weights, each on its own plumb strand, and a necklace strand festooned through them ---------- */
  const AP = Array.from({ length: 12 }, (_, i) => { const x = XP - 126 + i * 23; return [x, TOP, ZP + zw(x)]; });
  /* the irregular, specific hang: depth, a small slide along the row, and size (people and places, not a pattern) */
  const IRR = [[34, -4, 1.3], [8, 3, 2.6], [-12, 2, 1.6], [24, -3, 1.0], [-26, 4, 3.3], [-52, 0, 4.6], [-10, -5, 2.0], [44, 3, 1.1], [14, -2, 1.7], [-20, 4, 2.8], [30, 0, 1.2], [56, -3, 2.2]];
  const PRED = 5, PY = 6;
  const pW = j => { const g = IRR[j], k = eio(Z.irr); return [AP[j][0] + g[1] * k, PY + g[0] * k, AP[j][2]]; };
  const pR = j => lerp(2.2, IRR[j][2], eio(Z.irr));
  const FP = hanging(12, { anchor: j => AP[j], end: j => L3(plumb(AP[j]), pW(j), ss(Z.plP, 0, 1)), len: (j, P1, P2) => D3(P1, P2) });
  const _c = {};
  const NECK = { N: 1, at(i, s, t, out) {
    const f = clamp(s) * 11, j = Math.min(10, Math.floor(f)), P1 = pW(j), P2 = pW(j + 1);
    catPrep(P1, P2, D3(P1, P2) * lerp(1.05, 1.03, Z.irr), _c); return catAt(_c, f - j, out);
  } };

  /* ---------- REBUILDS: a span of seven strands between two posts, sagged, slack and wavy; one new strand ties it ---------- */
  const RW = 104, RY = k => 74 - 9 * k, TIE_LOW = 0;
  const sagL = k => 2 * RW * (1.09 + .05 * hash(k * 3.7));
  const tautL = k => 2 * RW * 1.028;
  const vtx = (k, L) => { const c = catPrep([XR - RW, RY(k), ZR], [XR + RW, RY(k), ZR], L, {}), v = catAt(c, .5, V3()); return v.y; };
  const rM = k => [XR, lerp(vtx(k, sagL(k)), vtx(k, tautL(k)), eio(Z.lift)), ZR];
  const _r = {};
  const FR = { N: 9, at(i, s, t, out) {
    if (i < 2) { const x = XR + (i ? RW : -RW); return out.set(x, lerp(TOP, RY(6), s), ZR); }
    const k = i - 2, h = s < .5, P1 = h ? [XR - RW, RY(k), ZR] : rM(k), P2 = h ? rM(k) : [XR + RW, RY(k), ZR];
    catPrep(P1, P2, lerp(sagL(k), tautL(k), eio(Z.lift)) / 2, _r); catAt(_r, h ? s * 2 : s * 2 - 1, out);
    const a = (1 - eio(Z.lift)) * Math.sin(PI * s); if (a > 0) { out.y += a * 2.4 * Math.sin(s * PI * (5 + k % 3) + k); out.z += a * 3 * Math.sin(s * PI * 4 + k * 1.3); }
    return out;
  } };
  const TIE = { N: 1, at(i, s, t, out) { return out.set(XR + 7 * (1 - eio(Z.tie)) * Math.sin(PI * s), lerp(TOP, TIE_LOW, s), ZR); } };
  /* the ghost of a whole rebuild: the entire span hung again, new and taut, offered and declined */
  const FRG = { N: 7, at(k, s, t, out) { return out.set(lerp(XR - RW, XR + RW, s), RY(k) + 34 - 14 * Math.sin(PI * s), ZR - 24); } };

  /* ---------- CARE: a tent on the weight, one far strand, three grey weights that never move ---------- */
  const AC = Array.from({ length: 14 }, (_, i) => { const x = XC - 70 + i * 140 / 13; return [x, TOP, ZC + zw(x, 1.3)]; });
  const CW = [XC, -12, ZC + 4], CFAR = [XC + 190, TOP, ZC - 50];
  const cPos = () => { const n = Math.sin(PI * ss(Z.tug, .55, .85)); return [CW[0] + 2.4 * n, CW[1] + 1.2 * n, CW[2] - .6 * n]; };
  const FC = hanging(15, {
    anchor: i => i < 14 ? AC[i] : CFAR,
    end: i => i < 14 ? L3(plumb(AC[i]), cPos(), ss(Z.plC, 0, 1)) : L3([CFAR[0], FOOT, CFAR[2]], cPos(), ss(Z.plC, 0, 1)),
    len: (i, P1, P2) => D3(P1, P2) * lerp(1, i < 14 ? 1.03 + .03 * Math.abs(i - 6.5) / 6.5 : 1.012, ss(Z.plC, 0, 1)),
    bend: (i, s, out) => {
      const w = Z.wind; if (w) { out.x += w * 1.8 * Math.sin(PI * s) * Math.sin(i * .9 + s * 2); out.z += w * 2.4 * Math.sin(PI * s) * Math.cos(i * .7); }
      if (i === 14 && Z.tug > 0 && Z.tug < 1) { const hd = ss(Z.tug, .05, .62), d = s - hd; out.y += 5.5 * Math.exp(-d * d / .0035) * (1 - ss(Z.tug, .62, .8)); }
    }
  });
  const GREY = [[XC - 130, ZC - 120, 40], [XC - 118, ZC - 146, 18], [XC - 106, ZC - 110, 54]];
  const FG = hanging(3, { anchor: i => [GREY[i][0], TOP, GREY[i][1]], end: i => [GREY[i][0], GREY[i][2], GREY[i][1]], len: () => 0 });
  /* the cord everything hangs from (seen only once the world turns over) */
  const CP = [[-320, 60], [XW, 0], [XP, ZP], [XR, ZR], [XC, ZC], [XC + 300, ZC - 60]];
  const CORD = { N: 1, at(i, s, t, out) { const f = clamp(s) * (CP.length - 1), j = Math.min(CP.length - 2, Math.floor(f)), u = ss(f - j, 0, 1); return out.set(lerp(CP[j][0], CP[j + 1][0], f - j), TOP + .4, lerp(CP[j][1], CP[j + 1][1], u)); } };

  /* ---------- when each strand is drawn ---------- */
  const DROP = 3.12;                                       /* the curtain drops in from the Bridge's line, strand after strand */
  const order = x => (x - (XW - 84)) / (XC + 236 - (XW - 84));
  const dropAt = (x, s) => x === AW[0][0] ? 2.9 + s * .001 : DROP + .1 + .5 * order(x) + .16 * s;
  const PLACE = {
    W: (i, s) => dropAt(AW[i][0], s), P: (j, s) => dropAt(AP[j][0], s), neck: (i, s) => 5.86 + .36 * s,
    R: (i, s) => i < 2 ? dropAt(XR + (i ? RW : -RW), s) : 7.36 + .045 * (i - 2) + .3 * s,
    C: (i, s) => i < 14 ? dropAt(AC[i][0], s) : dropAt(CFAR[0], s), G: (i, s) => dropAt(GREY[i][0], s),
    tie: (i, s) => 8.1 + .2 * s
  };

  const B = {}, D = {};
  function build() {
    if (B.W) return;
    B.W = bundle(FW, { place: PLACE.W, step: .9, every: 11, seed: .1 });
    B.gh = GH.map((f, n) => { const b = bundle(f, { step: 1.4, every: 14, seed: n * .3, tone: .8 }); b.u.fade.value = 0; return b; });
    B.P = bundle(FP, { place: PLACE.P, step: .9, every: 12, seed: .4 });
    B.neck = bundle(NECK, { place: PLACE.neck, step: .6, every: 10, seed: .9, maxSegs: 900 });
    B.R = bundle(FR, { place: PLACE.R, step: 1.1, every: 10, seed: .2 });
    B.tie = bundle(TIE, { place: PLACE.tie, step: .6, every: 9, seed: .7 });
    B.RG = bundle(FRG, { step: 1.2, every: 13, tone: .8 }); B.RG.u.fade.value = 0;
    B.C = bundle(FC, { place: PLACE.C, step: .9, every: 11, seed: .5 });
    B.G = bundle(FG, { place: PLACE.G, step: 1.2, every: 12, tone: .7 });
    B.cord = bundle(CORD, { step: 2, every: 0, radius: .3 });
    X.dot = disc(RED); X.dot.material.depthTest = false;
    D.p = Array.from({ length: 12 }, () => disc(CREAM, 48)); D.g = GREY.map(() => disc('#7d776b', 48)); D.w = disc(CREAM, 48);
    keys();
  }

  /* ---------- the camera. The finale is written in "ridge" coordinates (the world turned over) and rolled 180°. ---------- */
  const flip = a => [-a[0], -a[1], a[2]];
  function keys() {
    const k = (q, p, t, f = 30, stop = 0, s = [0, 0], roll = 0) => ({ q, p, t, f, stop, s, roll });
    const fl = (q, p, t, f = 30, stop = 0, s = [0, 0]) => k(q, flip(p), flip(t), f, stop, s, 180);
    setKeys([
      k(2.55, [-300, 56, 190], [AW[0][0], 56, AW[0][2]], 30),
      k(ST.head, [-300, 56, 190], [AW[0][0], 56, AW[0][2]], 30, 1),
      k(4.3, [-120, 60, 300], [XW - 20, 60, 0], 30),
      k(ST.web[0], [XW, 60, 330], [XW, 60, 0], 30, 1),
      k(4.95, [XW, 44, 400], [XW, 40, 0], 30),
      k(5.14, [XW - 50, 40, 500], [XW + 10, 34, -60], 32),
      k(5.32, [XW, -60, 80], [XW, -69, 6], 30),
      k(ST.web[1], [XW, -69.4, 12], [XW, -70, 6], 30, 1),
      k(5.62, [XW, -66, 100], [XW, -68, 6], 30),
      k(5.95, [XW + 120, 20, 250], [XP - 20, 30, ZP / 2], 30),
      k(ST.photo[0], [XP, 50, ZP + 330], [XP, 50, ZP], 30, 1),
      k(6.7, [XP + 20, 30, ZP + 290], [XP + 10, 30, ZP], 30, 0, [.1, 0]),
      k(ST.photo[1], [XP + 30, 2, ZP + 262], [XP + 16, 4, ZP], 30, 1, [.27, 0]),
      k(7.5, [XP + 120, 60, ZP + 330], [XR - 60, 70, (ZP + ZR) / 2], 30),
      k(ST.reb[0], [XR, 82, ZR + 330], [XR, 80, ZR], 30, 1),
      k(8.3, [XR, 64, ZR + 320], [XR, 58, ZR], 30),
      k(ST.reb[1], [XR - 26, 60, ZR + 300], [XR - 10, 52, ZR], 30, 1, [-.16, 0]),
      k(9.1, [XR + 120, 70, ZR + 300], [XC - 70, 60, (ZR + ZC) / 2], 30),
      k(ST.care[0], [XC, 52, ZC + 330], [XC, 52, ZC], 30, 1),
      k(ST.care[1], [XC - 14, 30, ZC + 290], [XC - 6, 30, ZC], 30, 1, [.16, 0]),
      { ...fl(10.75, [-560, -40, 540], [-480, -40, -150], 32), roll: 90 },
      fl(ST.whole, [-300, -95, 780], [-312, -25, -120], 34, 1),
      fl(ST.end, [-300, -100, 660], [-312, -16, -120], 34, 1),
      fl(12.45, [-345, -10, 300], [-345, 0, -400], 34),
      fl(ST.hand, [-345, 24, -190], [-345, 26, -500], 34, 1)
    ]);
  }

  /* ---------- the film ---------- */
  const SUN = [-345, -86, -500];                   /* ridge coordinates: low in the saddle between the two middle peaks */
  function state(qq) {
    Z.plP = prog(qq, 5.66, 6.2); Z.plC = prog(qq, 8.9, 9.42);
    Z.bell = prog(qq, 4.9, 5.16); Z.wlow = prog(qq, 4.9, 5.16);
    Z.irr = prog(qq, 6.42, 6.95);
    Z.tie = prog(qq, 8.3, 8.42); Z.lift = prog(qq, 8.36, 8.62); Z.wave = 1;
    Z.tug = prog(qq, 9.62, 10.12); Z.wind = .6 * Math.sin(PI * prog(qq, 8.8, 9.45)) + .5 * Math.sin(PI * prog(qq, 10.36, 11.0));
  }
  /* how lit each chapter is at film time q */
  const chapterLight = qq => [[3.0, 4.2, 5.75, 6.05], [5.75, 6.05, 7.35, 7.65], [7.35, 7.65, 8.95, 9.25], [8.95, 9.25, 10.9, 11.2]].map(([a, b, c, d]) => ss(qq, a, b) * (1 - ss(qq, c, d)));
  const keyOf = (...v) => v.map(x => x.toFixed(4)).join(',');
  function morph(b, key) { if (b._k !== key) { b._k = key; b.update(key); } }
  function render(qq, cs) {
    state(qq);
    morph(B.W, keyOf(Z.bell, Z.wlow));
    morph(B.P, keyOf(Z.plP, Z.irr)); morph(B.neck, keyOf(Z.irr)); morph(B.R, keyOf(Z.lift)); morph(B.tie, keyOf(Z.tie));
    morph(B.C, keyOf(Z.plC, Z.tug, Z.wind)); morph(B.RG, keyOf(Z.lift));

    /* quiet: strands step back behind the type at each hook stop */
    const hookQ = Math.max(...SVC.map(s => 1 - ss(Math.abs(qq - ST[s][0]), .12, .3)));
    const night = ss(qq, 9.0, 9.4) * (1 - ss(qq, 10.4, 10.9)); lightsFor(night);
    /* story lights: the chapter being read stays lit, its neighbours wait in the dark; the turn of the world lights them all */
    const all = 1 - ss(qq, 4.2, 4.5) * (1 - ss(qq, 10.45, 10.95));
    const W = chapterLight(qq); X.u.dim.value = lerp(.1, 1, all);
    const rack = ss(qq, 6.5, 6.95) * (1 - ss(qq, 7.3, 7.6)), pr = pW(PRED);
    X.u.F.value[0].set(XW, 30, 0, W[0]); X.u.F.value[1].set(lerp(XP, pr[0], rack), lerp(30, pr[1], rack), ZP, W[1]);
    X.u.F.value[2].set(XR, 50, ZR, W[2]); X.u.F.value[3].set(XC + 40, 40, ZC, W[3]);
    X.u.fr.value = [170, lerp(170, 64, rack), 170, 210];
    X.lit = W.map(w => Math.max(w, all));
    [B.W, B.P, B.neck, B.R, B.C, B.G, B.tie].forEach(b => b.u.fade.value = 1 - .74 * hookQ);
    B.cord.u.fade.value = ss(qq, 10.5, 11.0);
    X.u.infl.value = (X.u.sil.value ? 1.4 : 0) + .00055 * Math.max(0, cs.p.distanceTo(cs.t) - 380);
    X.u.near.value.set(qq > 5.2 && qq < 5.7 ? 4 : 0, qq > 5.2 && qq < 5.7 ? 26 : 0);

    /* the ghost bells flicker beside ours and go */
    B.gh.forEach((b, n) => { const a = ss(qq, 5.0 + n * .03, 5.08 + n * .03) * (1 - ss(qq, 5.16 + n * .02, 5.26 + n * .02)); b.u.fade.value = a * (.32 + .12 * Math.sin(qq * 260 + n * 2)); });
    /* Rebuilds: the honest read (a pulse along the top, then down each strand), the ghost rebuild, the tie */
    const rd = prog(qq, 7.98, 8.24);
    B.R.u.pulse.value.set(rd * 2.4, .09, 2.2 * Math.sin(PI * rd), .1);
    for (let k = 0; k < 9; k++) B.R.u.k.value[k] = lerp(1, k < 2 ? 1.2 : [1.15, .5][hash(k * 5.3) > .4 ? 1 : 0], ss(qq, 7.98 + k * .03, 8.08 + k * .03) * (1 - ss(qq, 8.38, 8.62)));
    B.RG.u.fade.value = .3 * ss(qq, 8.18, 8.24) * (1 - ss(qq, 8.27, 8.33));
    B.tie.u.k.value[0] = 1.35;
    /* Care: the tug runs along the far strand (id 14) to the weight: head - id*w with w = -1 puts the pulse on that strand only */
    B.C.u.pulse.value.set(ss(Z.tug, .05, .62) - 14, .05, 2.6 * Math.sin(PI * prog(Z.tug, .02, .7)), -1);
    G3.lamp.position.set(...cPos()); G3.lamp.position.z += 14; G3.lamp.intensity = 3800 * night * (1 + 1.4 * Math.sin(PI * prog(Z.tug, .7, 1)));

    /* the weights */
    for (let j = 0; j < 12; j++) { const w = pW(j), m = D.p[j], f = Math.abs(j - PRED) < 3 ? 1 : 1 - .7 * rack; placeDisc(m, V3(...w), j === PRED ? 0 : pR(j), ss(Z.plP, .7, 1) * X.lit[1] * f); }
    GREY.forEach((g, i) => placeDisc(D.g[i], V3(g[0], g[2], g[1]), 2.4, ss(qq, 9.0, 9.4) * X.lit[3] * (1 - ss(qq, 10.4, 10.7))));
    B.G.u.fade.value *= 1 - ss(qq, 10.4, 10.7);
    placeDisc(D.w, V3(...WB), 2.6, ss(qq, 5.86, 6.0) * X.lit[0]);
    dot(qq, cs);
    type(qq);
  }

  /* the dot: a pinprick at the foot of the first strand; the weight that holds "made for you"; the red weight of Photography; the
     load at the seam of Rebuilds; the weight that answers in Care; the low sun of the ridge */
  function dotState(qq) {
    const foot = V3(AW[0][0], FOOT - 3, AW[0][2]);
    if (qq < 4.45) return { p: foot, r: 1.1 * ss(qq, 3.6, 3.85) };
    if (qq < ST.web[0] + .02) return { p: foot.clone().lerp(V3(...W0), eio(prog(qq, 4.45, 4.68))), r: lerp(1.1, 0, ss(qq, 4.45, 4.55)) };
    if (qq < 5.62) { const g = eo(prog(qq, ST.web[0] + .02, ST.web[0] + .16)); return { p: V3(...wPos()), r: 15 * g }; }
    const pw = pW(PRED), P = V3(...pw);
    if (qq < ST.photo[0]) { const t = eio(prog(qq, 5.62, 6.22)); return { p: V3(...wPos()).lerp(P, t), r: lerp(9, pR(PRED) * 1.1, eio(prog(qq, 5.5, 5.9))) }; }
    if (qq < 7.3) return { p: P, r: pR(PRED) * 1.1 };
    const rp = V3(...rM(3));
    if (qq < ST.reb[0]) return { p: P.clone().lerp(rp, eio(prog(qq, 7.3, 7.86))), r: lerp(pR(PRED) * 1.1, 2.6, prog(qq, 7.3, 7.86)) };
    if (qq < 8.9) return { p: rp, r: 2.6 };
    const cp = V3(...cPos());
    if (qq < ST.care[0]) return { p: rp.clone().lerp(cp, eio(prog(qq, 8.9, 9.44))), r: lerp(2.6, 3.2, prog(qq, 8.9, 9.44)) };
    if (qq < 10.4) return { p: cp, r: 3.2 * (1 + .25 * Math.sin(PI * prog(Z.tug, .7, 1))) };
    const sun = V3(...flip(SUN));
    if (qq < ST.whole) { const t = eio(prog(qq, 10.4, 11.1)); return { p: cp.clone().lerp(sun, t), r: lerp(3.2, 60, t) }; }
    if (qq < ST.end + .1) return { p: sun, r: 60 };
    const t = eio(prog(qq, ST.end + .1, ST.hand)); return { p: sun.clone().lerp(V3(...flip([-345, 26, -500])), t), r: lerp(60, 300, ei(t)) };
  }
  function dot(qq, cs) {
    const d = dotState(qq); placeDisc(X.dot, d.p, d.r);
    X.dot.material.depthTest = qq > 10.6; X.dot.material.color.set(RED);
    X.at = toScreen(d.p, d.r);
  }

  /* ---------- type ---------- */
  function type(qq) {
    heading(qq, 3.42, ST.head - .02, ST.head + .1, ST.head + .28);
    X.hooks.forEach((o, i) => {
      const S = ST[SVC[i]][0];
      if (i === 0) {        /* Websites: the words stay while "made for you" leaves for the red circle, then the rest goes */
        arrive(o, S, qq, { a0: .3, o0: .06, o1: .16 });
      } else arrive(o, S, qq, { a0: .3, o0: .1, o1: .26 });
    });
    madeForYou(X.at, prog(qq, ST.web[0] + .05, ST.web[0] + .2), ss(qq, 5.2, 5.3));
    X.revs.forEach((o, i) => arrive(o, ST[SVC[i]][1], qq, { a0: i ? .26 : .18, o0: i ? .1 : .03, o1: i ? .26 : .13 }));
    redField(X.at);
    endBlock(qq, ST.end, 12.22);
  }

  /* ---------- the entrance: the Bridge's line pivots about its centre to plumb and becomes the first strand ---------- */
  function entrance(ctx, qq) {
    if (qq < 3.04 || qq > 3.5) return;
    const W = K0.W, H = K0.H, dpr = K0.dpr, th = lerp(26, 2.2, eio(prog(qq, 3.04, 3.14))), a = eio(prog(qq, 3.1, 3.32)), f = 1 - ss(qq, 3.3, 3.44);
    const len = lerp(W, H * 1.15, a);
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(W / 2, H / 2); ctx.rotate(a * PI / 2);
    ctx.globalAlpha = f; ctx.fillStyle = CREAM; ctx.fillRect(-len / 2, -th / 2, len, th); ctx.restore();
  }

  return hooks({ dom: typeDOM('a-hud'), build, render, entrance, glIn: qq => ss(qq, 3.24, 3.4) });
})();
