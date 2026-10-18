/* 27B — THE ORB (Offers)
   A web is built around one point, anchored to whatever happens to be there, and would fit nowhere else. At first light
   every drop on it holds a tiny upside-down sun. The red circle is the hub, and the sun.
     WEBSITES     SPIN         radii run out from the words to this place's own frame; a point lays the spiral, faster and faster
     PHOTOGRAPHY  CATCH LIGHT  a clip-art web is shown and goes; the real one returns and beads with light, each drop a photograph
     REBUILDS     TRUE         after a night of wind a pulse reads each radius; the slack ones are trued, one tick at a time
     CARE         LISTEN       one far thread trembles; the kink runs to the hub, and the hub answers through every radius
   Then the camera pulls back through a meadow of webs at dawn, each made for its own place, and flies into ours. */
window.NG_EXT = (() => {
/*KIT*/
  /* ---------- the geometry of an orb web, in its own plane (x, y), hub at the origin ---------- */
  const rayPoly = (F, th) => {                               /* distance from the hub to the frame polygon along angle th */
    const dx = Math.cos(th), dy = Math.sin(th); let best = 1e9;
    for (let k = 0; k < F.length; k++) {
      const a = F[k], b = F[(k + 1) % F.length], ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) continue;
      const t = (a[0] * ey - a[1] * ex) / den, u = (a[0] * dy - a[1] * dx) / den;
      if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
    }
    return best;
  };
  /* def: {F: frame polygon, N radii, T turns, th0, seed, rin, ext: anchor extension, bridge: true}; st: live state */
  function web(def) {
    const N = def.N, T = def.T, F = def.F, rh = def.rh || 5, rin = def.rin || 22;
    const th = Array.from({ length: N }, (_, i) => def.th0 - i * TAU / N + (hash(i * 9.1 + def.seed) - .5) * .9 * TAU / N);
    const Rr = th.map(a => rayPoly(F, a));
    const st = { slack: 0, sl: new Float32Array(N), tremble: 0, trem: -1, kink: 0, kinkI: -1 };
    const kk = Array.from({ length: N }, (_, i) => .35 + .65 * hash(i * 3.3 + def.seed));        /* how slack each radius goes */
    /* a point on radius i, s from hub (0) to frame (1) */
    const rp = (i, s, o) => {
      const r = lerp(rh, Rr[i], s), c = Math.cos(th[i]), sn = Math.sin(th[i]); let x = c * r, y = sn * r, z = 0;
      const a = st.slack * st.sl[i] * kk[i] * Math.sin(PI * s);
      if (a > 0) { const w = 5.5 * a * Math.sin(s * PI * (2 + (i % 3)) + i), v = 4 * a * Math.sin(s * PI * 3 + i * 1.7); x += -sn * w; y += c * w; z += v; y -= 9 * a; }
      if (st.kinkI === i && st.kink > 0) { const d = s - (1 - st.kink); const g = 3.2 * Math.exp(-d * d / .004) * Math.sin(PI * clamp(st.kink * 1.2)); x += -sn * g; y += c * g; }
      return o.set(x, y, z);
    };
    /* the capture spiral: crossings with the radii, from rin out to 0.9 of the frame */
    const K = T * N, cross = new Float32Array(K * 3), jit = Array.from({ length: K }, (_, k) => hash(k * 1.37 + def.seed) - .5);
    const _v = { set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } };
    const crossings = () => {
      for (let k = 0; k < K; k++) {
        const i = k % N, f = Math.pow(k / (K - 1), .9), rr = lerp(rin, Rr[i] * .92, f) + st.slack * jit[k] * 7;
        rp(i, clamp((rr - rh) / (Rr[i] - rh)), _v); cross[k * 3] = _v.x; cross[k * 3 + 1] = _v.y; cross[k * 3 + 2] = _v.z;
      }
    };
    const NS = def.NS || 3, per = Math.ceil((K - 1) / NS);
    const radii = { N, at(i, s, t, out) { return rp(i, s, out); } };
    const spiral = { N: NS, at(j, s, t, out) {
      if (j === 0 && s === 0) crossings();
      const k0 = j * per, k1 = Math.min(K - 1, (j + 1) * per), f = lerp(k0, k1, s), k = Math.min(k1 - 1, Math.floor(f)), u = f - k;
      const ax = cross[k * 3], ay = cross[k * 3 + 1], az = cross[k * 3 + 2], bx = cross[k * 3 + 3], by = cross[k * 3 + 4], bz = cross[k * 3 + 5];
      const mx = lerp(ax, bx, u), my = lerp(ay, by, u), l = Math.hypot(mx, my) || 1, bow = .05 * Math.hypot(bx - ax, by - ay) * Math.sin(PI * u);
      return out.set(mx - mx / l * bow, my - my / l * bow, lerp(az, bz, u));
    } };
    const hub = { N: 1, at(i, s, t, out) { const a = def.th0 + s * TAU * 3.2, r = lerp(2.5, rin * .62, s) * (1 + .12 * Math.sin(a * 3 + def.seed)); return out.set(Math.cos(a) * r, Math.sin(a) * r, 0); } };
    /* the frame: each side runs on past its corners to anchors out of sight */
    const frame = { N: F.length, at(k, s, t, out) {
      const a = F[k], b = F[(k + 1) % F.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), e = def.ext || 260;
      const x = lerp(a[0] - dx / l * e, b[0] + dx / l * e, s), y = lerp(a[1] - dy / l * e, b[1] + dy / l * e, s), sag = (k === 0 ? 6 : 2) * Math.sin(PI * s);
      const tr = k === def.farK ? st.tremble * 2.2 * Math.sin(s * PI * 9 + st.tremble * 40) * Math.sin(PI * s) : 0;
      return out.set(x, y - sag + tr, tr * .6);
    } };
    /* where along each radius (0..1) a centred box of half-size (bx, by) is left behind */
    const edge = (i, bx, by) => { const c = Math.abs(Math.cos(th[i])), sn = Math.abs(Math.sin(th[i])), r = Math.min(c > 1e-6 ? bx / c : 1e9, sn > 1e-6 ? by / sn : 1e9); return clamp((r - rh) / (Rr[i] - rh)); };
    const crossAt = (k, o) => { const i = k % N, f = Math.pow(k / (K - 1), .9), rr = lerp(rin, Rr[i] * .92, f); return rp(i, clamp((rr - rh) / (Rr[i] - rh)), o); };
    crossings();
    return { def, N, K, NS, per, th, Rr, st, rp, radii, spiral, hub, frame, edge, crossAt, cross };
  }

  /* ours: anchored to what is there (a branch at the top, a stem at the right, a leaf below...) */
  const OURS = web({ F: [[-150, 128], [176, 142], [222, -26], [118, -176], [-112, -150], [-214, 8]], N: 28, T: 13, th0: PI / 2, seed: 1.7, farK: 2, ext: 300 });
  /* the clip-art web: regular, symmetric, anchored to nothing */
  const CLIP = web({ F: Array.from({ length: 16 }, (_, k) => [Math.cos(k * TAU / 16) * 80, Math.sin(k * TAU / 16) * 80]), N: 16, T: 8, th0: PI / 2, seed: 0, rin: 12, rh: 3, ext: 0, NS: 2 });
  CLIP.th.forEach((_, i) => { CLIP.th[i] = PI / 2 - i * TAU / 16; CLIP.Rr[i] = 80; });
  /* the ghost of a whole new web, offered over the old one and declined */
  const GHOST = web({ F: OURS.def.F.map(p => [p[0] * 1.02, p[1] * 1.02]), N: 28, T: 9, th0: PI / 2 + .06, seed: 4.2, ext: 0, NS: 2 });
  /* the others in the meadow: each made for a different place */
  const poly = (seed, r, n) => Array.from({ length: n }, (_, k) => { const a = k * TAU / n + (hash(seed + k) - .5) * .7; const rr = r * (.75 + .5 * hash(seed * 3 + k)); return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  const OTHERS = [
    { w: web({ F: poly(3, 130, 5), N: 20, T: 8, th0: 1.2, seed: 3, NS: 2, ext: 50 }), p: [-420, -40, -560], rot: [.05, .35, .4] },
    { w: web({ F: poly(7, 150, 6), N: 22, T: 9, th0: .4, seed: 7, NS: 2, ext: 60 }), p: [420, -60, -700], rot: [-.08, -.4, -.2] },
    { w: web({ F: poly(11, 110, 4), N: 18, T: 7, th0: 2, seed: 11, NS: 2, ext: 40 }), p: [180, 170, -1050], rot: [.1, .2, .9] },
    { w: web({ F: poly(13, 170, 7), N: 22, T: 9, th0: 1, seed: 13, NS: 2, ext: 60 }), p: [660, 120, -1500], rot: [0, -.25, -.6] }
  ];

  /* ---------- when each part is drawn ---------- */
  const BX = 104, BY = 44;                                     /* the hook paragraph, in world units at the hook camera */
  const SP0 = 4.97, SP1 = 5.3;                                 /* the spiral is laid between these, slow, then fast */
  const spiralQ = u => SP0 + (SP1 - SP0) * Math.sqrt(clamp(u));
  const spiralU = qq => Math.pow(prog(qq, SP0, SP1), 2);
  const PLACE = {
    frame: (k, s) => k === 0 ? 2.9 : 4.08 + .05 * k + .2 * Math.abs(s - .5),    /* the rest of the frame comes with Websites: at the heading only the bridge, the Y and the dot */
    radii: (i, s) => {
      if (i === 1 || i === 27) return 3.2 + .1 * (1 - s);                      /* the Y: two arms from the bridge to the junction ... */
      if (i === 14) return 3.3 + .1 * s;                                       /* ... and the leg pulled down from it */
      const e = OURS.edge(i, BX, BY);
      return s >= e ? 4.4 + .009 * i + .16 * (s - e) / Math.max(.01, 1 - e) : 4.86 + .006 * i + .08 * (e - s) / Math.max(.01, e);
    },
    spiral: (j, s) => spiralQ((j * OURS.per + s * (Math.min(OURS.K - 1, (j + 1) * OURS.per) - j * OURS.per)) / (OURS.K - 1)),
    hub: (i, s) => 4.9 + .07 * s
  };

  const B = {}, D = {};
  let glints = null;
  function build() {
    if (B.R) return;
    B.F = bundle(OURS.frame, { place: PLACE.frame, step: 2, every: 14, seed: .3, maxSegs: 600 });
    B.R = bundle(OURS.radii, { place: PLACE.radii, step: 1.2, every: 12, seed: .1, sides: 8 });
    B.S = bundle(OURS.spiral, { place: PLACE.spiral, step: 1.5, every: 10, seed: .6, maxSegs: 2000, sides: 8 });
    B.H = bundle(OURS.hub, { place: PLACE.hub, step: .5, every: 8 });
    B.clip = [CLIP.radii, CLIP.spiral].map(f => { const b = bundle(f, { step: 1.2, every: 0, tone: .7 }); b.u.fade.value = 0; return b; });
    B.ghost = [GHOST.radii, GHOST.spiral].map(f => { const b = bundle(f, { step: 1.5, every: 0, tone: .8 }); b.u.fade.value = 0; return b; });
    B.oth = OTHERS.map(o => [o.w.frame, o.w.radii, o.w.spiral, o.w.hub].map((f, n) => bundle(f, { p: o.p, rot: o.rot, step: n === 2 ? 1.6 : 2, every: n === 2 ? 14 : 16, maxSegs: 1600 })));
    X.dot = disc(RED); X.dot.material.depthTest = false;
    D.sun = disc(RED); D.head = disc(CREAM, 32); D.head.material.depthTest = false;
    D.hubs = OTHERS.map(() => disc('#4a463e', 48));
    glints = dew();
    keys();
  }

  /* ---------- dew: not geometry, light. Bright points on the spiral; each holds a tiny upside-down sun that slides as we move ---------- */
  function dew() {
    const n = OURS.K, pos = new Float32Array(n * 3), at = new Float32Array(n), sz = new Float32Array(n), v = V3();
    for (let k = 0; k < n; k++) { OURS.crossAt(k, v); pos.set([v.x, v.y, v.z + .4], k * 3); at[k] = 6.4 + .5 * k / n + .03 * hash(k); sz[k] = .7 + .9 * hash(k * 7.7); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aT', new T.BufferAttribute(at, 1)); g.setAttribute('aSz', new T.BufferAttribute(sz, 1));
    const u = { uQ: { value: 0 }, uSun: { value: V3() }, uPx: { value: 1 }, uRes: { value: new T.Vector2(1, 1) }, uFlare: { value: 0 }, uOut: { value: 0 } };
    const m = new T.ShaderMaterial({ uniforms: u, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
      vertexShader: `attribute float aT, aSz; uniform float uQ, uPx, uFlare, uOut; uniform vec3 uSun; uniform vec2 uRes; varying float vA; varying vec2 vO;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
          float a = smoothstep(aT, aT + .05, uQ) * (1.0 - uOut); vA = a;
          gl_PointSize = clamp(aSz * (1.0 + 1.2 * uFlare) * uPx * 2.3 / -mv.z, 0.0, 40.0) * step(.001, a);
          vec4 sc = projectionMatrix * viewMatrix * vec4(uSun, 1.0); vec2 d = (sc.xy / sc.w - gl_Position.xy / gl_Position.w) * uRes * .5;
          vO = -normalize(d + 1e-4) * .24 * clamp(length(d) / 500.0, .25, 1.0); vO.y = -vO.y; }`,
      fragmentShader: `uniform float uFlare; varying float vA; varying vec2 vO;
        void main() { vec2 c = gl_PointCoord - .5; float d = length(c) * 2.0; if (d > 1.0) discard;
          vec3 col = mix(vec3(.914, .882, .808), vec3(1.0, .98, .94), .5 + .5 * uFlare);
          float sun = 1.0 - smoothstep(.09, .13, length(c - vO));
          col = mix(col, vec3(.753, .137, .043), sun * (1.0 - .7 * uFlare));
          gl_FragColor = vec4(col, vA * (1.0 - smoothstep(.62, 1.0, d))); }` });
    const P = new T.Points(g, m); P.frustumCulled = false; P.renderOrder = 3; G3.scene.add(P); return { P, u };
  }

  /* ---------- the camera ---------- */
  function keys() {
    const k = (q, p, t, f = 30, stop = 0, s = [0, 0]) => ({ q, p, t, f, stop, s });
    setKeys([
      k(2.55, [0, 72, 600], [0, 72, 0], 30, 0, [.3, -.22]),
      k(ST.head, [0, 72, 600], [0, 72, 0], 30, 1, [.3, -.22]),
      k(4.3, [0, 30, 470], [0, 18, 0], 30),
      k(ST.web[0], [0, 0, 380], [0, 0, 0], 30, 1),
      k(4.95, [20, -8, 400], [0, 0, 0], 30),
      k(5.18, [110, -60, 400], [0, 0, 0], 30),
      k(5.37, [12, -6, 70], [0, 0, 0], 30),
      k(ST.web[1], [0, 0, 13], [0, 0, 0], 30, 1),
      k(5.66, [0, 0, 90], [0, 0, 0], 30),
      k(5.98, [100, 40, 230], [70, 24, 0], 30),
      k(ST.photo[0], [150, 60, 210], [112, 32, 0], 30, 1),
      k(6.7, [240, 60, 130], [104, 8, 0], 32, 0, [.1, 0]),
      k(ST.photo[1], [300, 60, 60], [100, 0, 0], 34, 1, [.32, 0]),
      k(7.5, [80, 20, 340], [0, 0, 0], 30),
      k(ST.reb[0], [0, 0, 430], [0, 0, 0], 30, 1),
      k(ST.reb[1], [-70, 16, 410], [-14, 0, 0], 30, 1, [-.16, 0]),
      k(9.1, [0, 40, 520], [0, 10, -40], 30),
      k(ST.care[0], [0, 30, 600], [0, 6, -60], 30, 1),
      k(ST.care[1], [-50, 24, 520], [0, 0, -60], 30, 1, [.15, 0]),
      k(10.75, [120, 70, 820], [-40, 0, -300], 30),
      k(ST.whole, [260, 110, 1150], [-60, 0, -420], 30, 1, [.06, -.05]),
      k(ST.end, [250, 104, 1080], [-60, 0, -420], 30, 1, [.1, -.08]),
      k(12.45, [30, 10, 260], [0, 0, 0], 30),
      k(ST.hand, [0, 0, 12], [0, 0, 0], 30, 1)
    ]);
  }

  /* ---------- the film ---------- */
  const keyOf = (...v) => v.map(x => x.toFixed(4)).join(',');
  function morph(b, key) { if (b._k !== key) { b._k = key; b.update(key); } }
  const ORDER = Array.from({ length: OURS.N }, (_, i) => i);   /* radii are numbered clockwise from the top */
  const NEW = [7, 19];                                         /* new silk: trued radii that stay a hair brighter */
  function render(qq, cs) {
    const st = OURS.st;
    /* Rebuilds: a night of wind slackens the web; each radius is trued in turn */
    st.slack = ss(qq, 7.35, 7.8);
    for (let i = 0; i < OURS.N; i++) st.sl[i] = 1 - eo(prog(qq, 8.3 + i * .011, 8.33 + i * .011));
    /* Care: one far thread trembles; a kink runs along radius 12 to the hub */
    st.tremble = Math.sin(PI * prog(qq, 9.58, 9.8)) * (1 - prog(qq, 9.58, 9.8));
    st.kinkI = 12; st.kink = prog(qq, 9.74, 9.98);
    const kOn = st.kink > 0 && st.kink < 1;
    const shape = keyOf(st.slack, ...st.sl.filter((_, i) => i % 4 === 0), qq > 8.29 && qq < 8.7 ? qq : 0);
    morph(B.R, shape + (kOn ? keyOf(st.kink) : ''));
    OURS.def.ext = lerp(300, 70, ss(qq, 10.4, 10.9));             /* at dawn the anchors are short: only what this place needs */
    morph(B.S, shape);                                     /* the spiral follows the radii's shape (not the brief kink) */ morph(B.F, keyOf(st.tremble, OURS.def.ext));

    /* light: pre-dawn, first light, a night of wind, night, dawn */
    const night = Math.max(ss(qq, 7.6, 7.9) * .45 * (1 - ss(qq, 8.6, 8.9)), ss(qq, 9.0, 9.4) * (1 - ss(qq, 10.4, 10.9)));
    lightsFor(night);
    X.u.infl.value = (X.u.sil.value ? 1.4 : 0) + .0006 * Math.max(0, cs.p.distanceTo(cs.t) - 420);
    X.u.near.value.set(qq > 5.25 && qq < 5.75 || qq > 12.4 ? 3 : 0, qq > 5.25 && qq < 5.75 || qq > 12.4 ? 22 : 0);
    const hookQ = Math.max(...SVC.map(s => 1 - ss(Math.abs(qq - ST[s][0]), .12, .3)));
    /* Photography: the real web waits in the dark while the clip-art one is shown; then first light returns it, near strands sharp */
    const dark = ss(qq, 5.95, 6.15) * (1 - ss(qq, 6.42, 6.6));
    const rack = ss(qq, 6.45, 6.8) * (1 - ss(qq, 7.3, 7.6));
    /* a clear field round each paragraph: at the reveals of Rebuilds and Care only the heart of the web stays lit */
    const heart = Math.max(ss(qq, 8.45, 8.62) * (1 - ss(qq, 8.8, 8.95)), ss(qq, 10.05, 10.22) * (1 - ss(qq, 10.4, 10.6)));
    X.u.F.value[0].set(230, 20, 0, rack); X.u.F.value[1].set(0, 0, 0, heart); X.u.fr.value[0] = 120; X.u.fr.value[1] = 95;
    X.u.dim.value = lerp(1, .2, Math.max(rack, heart));
    [B.F, B.R, B.S, B.H].forEach(b => b.u.fade.value = (1 - .7 * hookQ) * (1 - dark) * (b === B.F ? 1 - .3 * ss(qq, 10.4, 10.9) : 1) * (qq > 7.6 && qq < 8.95 ? .62 + .38 * ss(qq, 8.5, 8.9) : 1));
    const clipA = ss(qq, 6.05, 6.2) * (1 - ss(qq, 6.36, 6.5));
    if (clipA > 0) placeClip(cs);
    B.clip.forEach(b => b.u.fade.value = .55 * clipA);

    /* Rebuilds: the read, the ghost, the new silk */
    const rd = prog(qq, 7.98, 8.22);
    B.R.u.pulse.value.set(rd * 2.2, .1, 1.9 * Math.sin(PI * rd), 1 / OURS.N);
    for (let i = 0; i < OURS.N; i++) {
      const read = ss(qq, 7.98 + i * .008, 8.04 + i * .008) * (1 - ss(qq, 8.3 + i * .011, 8.34 + i * .011)), taut = hash(i * 3.3 + 1.7) < .45;
      B.R.u.k.value[i] = lerp(1, taut ? 1.25 : .45, read) * (NEW.includes(i) ? lerp(1, 1.22, ss(qq, 8.4, 8.6)) : 1);
    }
    B.ghost.forEach(b => b.u.fade.value = .32 * ss(qq, 8.12, 8.18) * (1 - ss(qq, 8.24, 8.3)));
    /* Websites: the bright point that lays the spiral */
    const u = spiralU(qq), sp = V3(); const j = Math.min(OURS.NS - 1, Math.floor(u * (OURS.K - 1) / OURS.per));
    OURS.spiral.at(j, clamp((u * (OURS.K - 1) - j * OURS.per) / OURS.per), 0, sp);
    placeDisc(D.head, sp, 1.4, qq > SP0 && qq < SP1 + .02 ? 1 : 0);
    B.S.u.pulse.value.set(u * (OURS.K - 1) / OURS.per, .006, qq > SP0 && qq < SP1 ? 2.4 : 0, 1);
    /* Care: the kink's light along radius 12, then the hub answers outward through every radius */
    const ans = prog(qq, 9.98, 10.2);
    if (kOn) B.R.u.pulse.value.set(1 - st.kink - 12, .05, 2.2, -1);
    else if (ans > 0 && ans < 1) B.R.u.pulse.value.set(ans * 1.1, .08, 1.6 * Math.sin(PI * ans), 0);

    /* the other webs: far off at night (their hubs dark), a meadow at dawn */
    const meadow = ss(qq, 10.4, 11.0);
    B.oth.forEach((bs, n) => bs.forEach(b => b.u.fade.value = (n < 2 ? ss(qq, 9.1, 9.4) * .5 : 0) * (1 - meadow) + meadow * (.55 + .1 * n)));
    OTHERS.forEach((o, n) => { const p = V3(...o.p); placeDisc(D.hubs[n], p, lerp(4.2, 9, meadow), n < 2 ? ss(qq, 9.1, 9.4) : meadow); D.hubs[n].material.color.set(meadow > .5 ? RED : '#4a463e'); });

    /* the glints */
    const gu = glints.u; gu.uQ.value = qq; gu.uSun.value.copy(D.sun.position); gu.uRes.value.set(K0.W, K0.H);
    gu.uPx.value = K0.H / (2 * Math.tan(cs.f * DEG / 2)) * G3.renderer.getPixelRatio();
    gu.uFlare.value = Math.sin(PI * prog(qq, 7.28, 7.6)); gu.uOut.value = ss(qq, 7.5, 7.75);
    glints.P.visible = qq > 6.3 && qq < 7.8;
    dot(qq, cs);
    type(qq);
  }
  function placeClip(cs) {
    const g = B.clip[0].group, f = cs.t.clone().sub(cs.p).normalize(), c = cs.p.clone().addScaledVector(f, 220);
    B.clip.forEach(b => { b.group.position.copy(c); b.group.quaternion.copy(G3.camera.quaternion); });
    return g;
  }

  /* the dot: the junction of the Y; the hub that holds "made for you" and, with the sun behind it, fills the frame; a hub again */
  function dot(qq, cs) {
    const O = V3(0, 0, 0);
    let r = 0;
    if (qq < ST.web[0] + .02) r = 1.1 * ss(qq, 3.3, 3.6);
    else if (qq < 5.62) r = lerp(1.1, 16, eo(prog(qq, ST.web[0] + .02, ST.web[0] + .16)));
    else if (qq < 12.25) r = lerp(16, 3.4, eio(prog(qq, 5.55, 5.9))) * (1 + .3 * Math.sin(PI * prog(qq, 10.0, 10.3))) * lerp(1, 2.2, ss(qq, 10.5, 11.0));
    else r = lerp(7.5, 16, eio(prog(qq, 12.25, 12.7)));
    placeDisc(X.dot, O, r); X.at = toScreen(O, r);
    /* the sun: rises behind the hub as the spiral is finished, so hub and sun are one circle; low behind the web at first light */
    let sp, sr, so;
    if (qq < 5.9) {                     /* kept exactly behind the hub along the line of sight, so the two read as one circle */
      const t = eio(prog(qq, 5.02, 5.3)), D0 = cs.p.distanceTo(O), k = (D0 + 600) / D0, al = cs.p.clone().lerp(O, k);
      sp = al.clone().add(V3(0, -340 * (1 - t), 0)); sr = 16 * k * lerp(1.6, 1.22, t); so = ss(qq, 5.0, 5.06) * (1 - ss(qq, 5.55, 5.7));
    }
    else { sp = V3(160, -520, -500); sr = 70; so = 0; }           /* at first light the sun is below the frame: only the drops show it */
    placeDisc(D.sun, sp, sr, so); D.sun.renderOrder = 1;
    G3.lamp.position.set(0, 0, 20); G3.lamp.intensity = 2600 * ss(qq, 9.2, 9.5) * (1 - ss(qq, 10.4, 10.8)) * (1 + 1.2 * Math.sin(PI * prog(qq, 10.0, 10.3)));
  }

  /* ---------- type ---------- */
  function type(qq) {
    heading(qq, 3.42, ST.head - .02, ST.head + .1, ST.head + .28);
    X.hooks.forEach((o, i) => arrive(o, ST[SVC[i]][0], qq, i === 0 ? { a0: .3, o0: .06, o1: .16 } : { a0: .3, o0: .1, o1: .26 }));
    madeForYou(X.at, prog(qq, ST.web[0] + .05, ST.web[0] + .2), ss(qq, 5.2, 5.3));
    X.revs.forEach((o, i) => arrive(o, ST[SVC[i]][1], qq, { a0: i ? .26 : .18, o0: i ? .1 : .03, o1: i ? .26 : .13 }));
    redField(X.at);
    endBlock(qq, ST.end, 12.2);
  }

  /* ---------- the entrance: the Bridge's line hangs between two unseen anchors and relaxes into the bridge thread ---------- */
  function entrance(ctx, qq) {
    if (qq < 3.04 || qq > 3.4) return;
    const W = K0.W, H = K0.H, dpr = K0.dpr, a = eio(prog(qq, 3.04, 3.26)), th = lerp(26, 2, eio(prog(qq, 3.04, 3.18))), f = 1 - ss(qq, 3.24, 3.36);
    const v = V3(), pts = [];
    for (let n = 0; n <= 24; n++) { OURS.frame.at(0, lerp(.02, .98, n / 24), 0, v); const s = toScreen(v); pts.push([s.x, s.y]); }
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = f; ctx.strokeStyle = CREAM; ctx.lineWidth = th; ctx.beginPath();
    for (let n = 0; n <= 48; n++) {
      const x = n / 48 * W, m = n / 48 * 24, i = Math.min(23, Math.floor(m)), l = m - i;
      const y = lerp(H / 2, lerp(pts[i][1], pts[i + 1][1], l), a), xx = lerp(x, lerp(pts[i][0], pts[i + 1][0], l), a);
      n ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y);
    }
    ctx.stroke(); ctx.restore();
  }

  return hooks({ dom: typeDOM('b-hud'), build, render, entrance, glIn: qq => ss(qq, 3.18, 3.32) });
})();
