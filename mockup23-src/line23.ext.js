/* 23 — ONE LINE, FOUR SHAPES, THREE ENDINGS (Offers; script in mockup23-src/SCRIPT.md)
   The bridge's sentence collapses into one line, and that line becomes the hero's barbed wire, whole. The wire is
   drawn on as the film plays, and at each service it makes one recognisable shape that hangs from the line:
   Websites a square, Photography a circle around the red subject (a lens), Rebuilds a triangle pulled true, Care an
   infinity loop (launch day is not goodbye). One wire, never cut, never hidden.
   Three endings, one per file (NW_DIR):
     A  THE LINE: the camera comes down to eye level and every shape folds edge-on into one unbroken line — the hero's
        wire, mended — which carries on into Packages.
     B  THREE LINES: the shapes are pulled taut and the wire lays itself into three parallel lines, one per package.
     C  THE FULL STOP: the wire cinches into the red point, and the point opens into the red field Packages begins on.
   The wire is the only 3D object; all type is flat. */
window.NG_EXT = (() => {
  const DIR = '__DIR__';
  const { OFFERS, HEADING } = NGL;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const CREAM = '#e9e1ce', RED = '#c0230b';
  const ST = { swap: 2.55, head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;

  const dom = `<canvas class="ln-gl" id="lnGl" aria-hidden="true"></canvas><div class="ln-grain" aria-hidden="true"></div>
  <div class="ln-field" id="lnField" aria-hidden="true"></div>
  <div class="ln-hud" id="lnHud">
    <h2 class="ln-sr">${HEADING}</h2>
    <div class="ln-head" id="lnHead" aria-hidden="true"><span class="ln-mask ln-mask--up"><span>What you can</span></span><span class="ln-mask ln-mask--down"><span>hire us for.</span></span></div>
    ${OFFERS.map((o, i) => `<section class="ln-blk ln-blk--${SVC[i]}" id="lnB${i}"><h3 class="ln-name">${o.name}</h3><p class="ln-p">${o.body}</p></section>`).join('')}
    <div class="ln-endblk ln-endblk--${DIR}" id="lnE"><a class="ln-end" id="lnEnd" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="ln-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
    <ol class="ln-rail" id="lnRail" aria-hidden="true">${OFFERS.map(o => `<li>${o.name}</li>`).join('')}</ol>
  </div>`;

  /* ---------------- camera: keys in world space; stops ease in and out; a lens shift places the subject ---------------- */
  let KEYS = [], posCurve, tgtCurve;
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a;
    const qv = b === a ? KEYS[a].q : lerp(KEYS[a].q, KEYS[b].q, eio(prog(qq, KEYS[a].q, KEYS[b].q)));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q), u = (i + l) / (n - 1);
    return { p: posCurve.getPoint(u), t: tgtCurve.getPoint(u), f: lerp(k0.f, k1.f, l), sx: lerp(k0.s[0], k1.s[0], l), sy: lerp(k0.s[1], k1.s[1], l) };
  }
  function aim(c, st) {
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); c.near = .5; c.far = 6000; c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); c.updateMatrixWorld(true);
  }

  /* ---------------- the path: one wire on the plane y = 0; the line runs along x, the shapes hang from it ---------------- */
  const V3 = (...a) => new T.Vector3(...a);
  function section(f) {
    const N = 700, tab = new Float32Array(N + 1), a = V3(), b = V3(); f(0, a, null);
    for (let i = 1; i <= N; i++) { f(i / N, b, null); tab[i] = tab[i - 1] + a.distanceTo(b); a.copy(b); }
    return { at: f, tab, len: tab[N], vOf(m) {
      let lo = 0, hi = N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab[mid] < m) lo = mid; else hi = mid; }
      return (lo + clamp((m - tab[lo]) / Math.max(1e-6, tab[hi] - tab[lo]))) / N; } };
  }
  /* a polyline through corner points with small round fillets, so the steel bends instead of folding */
  function poly(pts, r = 2.4) {
    const P = pts.map(p => V3(p[0], 0, p[1])), segs = [];
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1], d = b.clone().sub(a), L = d.length(); d.normalize();
      const ra = i > 0 ? Math.min(r, L * .45) : 0, rb = i < P.length - 2 ? Math.min(r, L * .45) : 0;
      segs.push([a.clone().addScaledVector(d, ra), b.clone().addScaledVector(d, -rb)]);
    }
    const pieces = [];                              /* straight runs and the quadratic corners between them */
    for (let i = 0; i < segs.length; i++) {
      pieces.push({ k: 'l', a: segs[i][0], b: segs[i][1] });
      if (i < segs.length - 1) pieces.push({ k: 'q', a: segs[i][1], c: P[i + 1], b: segs[i + 1][0] });
    }
    const lens = pieces.map(p => p.k === 'l' ? p.a.distanceTo(p.b) : p.a.distanceTo(p.c) + p.c.distanceTo(p.b) * .9), tot = lens.reduce((x, y) => x + y, 0);
    return (v, o) => {
      let m = v * tot, i = 0; while (i < pieces.length - 1 && m > lens[i]) { m -= lens[i]; i++; }
      const p = pieces[i], t = clamp(m / lens[i]);
      if (p.k === 'l') return o.copy(p.a).lerp(p.b, t);
      const u = 1 - t; return o.set(0, 0, 0).addScaledVector(p.a, u * u).addScaledVector(p.c, 2 * u * t).addScaledVector(p.b, t * t);
    };
  }
  const tri = x => 2 * Math.abs(2 * (x - Math.floor(x + .5))) - 1;
  const M = {
    /* Rebuilds: the triangle arrives crooked and is pulled true (with one honest overshoot) */
    crook: qq => qq == null ? 0 : 1 - (eo(prog(qq, 6.28, 6.56)) + .1 * Math.sin(prog(qq, 6.28, 6.56) * 3 * PI) * (1 - prog(qq, 6.28, 6.56))),
    fin: qq => qq == null ? 0 : eio(prog(qq, ST.end - .62, ST.end - .1))
  };
  function build3D() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    /* the wire is drawn on (fragments beyond the drawn length are discarded; aM is each ring's place along the wire),
       and a story light keeps the shape being spoken about lit while the rest waits in the dark */
    X.u = { rev: { value: 1e9 }, fc: { value: V3() }, fr: { value: 1e5 }, dim: { value: 1 } };
    const tooling = studio.silver.onBeforeCompile;
    studio.silver.onBeforeCompile = (sh, r) => {
      tooling(sh, r); Object.assign(sh.uniforms, { uRev: X.u.rev, uFc: X.u.fc, uFr: X.u.fr, uDim: X.u.dim });
      sh.vertexShader = 'attribute float aM;\nvarying float vM;\nvarying vec3 vFp;\n' + sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vM = aM;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFp = worldPosition.xyz;');
      sh.fragmentShader = 'uniform float uRev, uFr, uDim;\nuniform vec3 uFc;\nvarying float vM;\nvarying vec3 vFp;\n' + sh.fragmentShader
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n  if (vM > uRev) discard;')
        .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n  gl_FragColor.rgb *= mix(uDim, 1.0, 1.0 - smoothstep(uFr, uFr * 1.6, distance(vFp, uFc)));');
    };
    studio.silver.customProgramCacheKey = () => 'ln23';
    const camera = new T.PerspectiveCamera(30, 1, .5, 6000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    const dot = new T.Mesh(new T.SphereGeometry(1, 48, 24), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); scene.add(dot);
    G3 = { renderer, scene, camera, studio, key, rim, lamp, dot };
  }

  function build(Kk) {
    const W = Kk.W, H = Kk.H, sc = G3.scene;
    if (X.wire) { sc.remove(X.wire.group); X.wire.dispose(); }
    /* the shapes, in reading order along the line (x right; −z is up the page as the camera looks down) */
    const S = {};
    S.l0 = section(poly([[-420, 0], [0, 0]]));
    S.sq = section(poly([[0, 0], [30, 0], [30, -30], [0, -30], [0, -1.6], [30, -1.6], [30, 0]]));          /* the square, its foot doubled */
    S.l1 = section(poly([[30, 0], [70, 0]]));
    S.ci = section((v, o) => { const a = PI / 2 + v * 2 * PI; return o.set(70 + Math.cos(a) * 17, 0, 17 - Math.sin(a) * 17); });   /* the lens, tangent to the line */
    S.l2 = section(poly([[70, 0], [110, 0]]));
    const triP = [[110, 0], [146, 0], [128, -32], [110, 0], [110, -1.6], [146, -1.6], [146, 0]];
    const triT = poly(triP), triC = poly([[110, 0], [146, 0], [139, -18], [126, -27], [117, -9], [110, 0], [110, -1.6], [146, -1.6], [146, 0]]);
    S.tr = section((v, o, qq) => { const k = M.crook(qq); triT(v, o); if (k > 0) { const c = triC(v, V3()); o.lerp(c, k); } return o; });
    S.l3 = section(poly([[146, 0], [166, 0]]));
    S.in = section((v, o) => { const t = PI + v * 2 * PI, s = Math.sin(t), d = 1 + s * s, a = 26; return o.set(192 + a * Math.cos(t) / d, 0, a * s * Math.cos(t) / d * 1.25); });
    S.l4 = section(poly([[166, 0], [640, 0]]));
    const parts = [S.l0, S.sq, S.l1, S.ci, S.l2, S.tr, S.l3, S.in, S.l4];
    let acc = 0; parts.forEach(s => { s.m0 = acc; acc += s.len; }); X.parts = parts; X.len = acc; X.S = S;
    const end = s => s.m0 + s.len; X.mark = { l0: end(S.l0), sq: end(S.sq), ci: end(S.ci), tr: end(S.tr), in: end(S.in), all: acc };

    /* endings: B lays the wire into three lines; C cinches it into the red point */
    const RAD = 15, Lr = (acc - 2 * PI * RAD) / 3, bx0 = 100 - Lr / 2;
    X.rails = (m, o) => {
      const a = clamp(m, 0, acc);
      if (a < Lr) return o.set(bx0 + a, 0, -2 * RAD);
      if (a < Lr + PI * RAD) { const t = (a - Lr) / RAD; return o.set(bx0 + Lr + Math.sin(t) * RAD, 0, -RAD - Math.cos(t) * RAD); }
      if (a < 2 * Lr + PI * RAD) return o.set(bx0 + Lr - (a - Lr - PI * RAD), 0, 0);
      if (a < 2 * Lr + 2 * PI * RAD) { const t = (a - 2 * Lr - PI * RAD) / RAD; return o.set(bx0 - Math.sin(t) * RAD, 0, RAD - Math.cos(t) * RAD); }
      return o.set(bx0 + (a - 2 * Lr - 2 * PI * RAD), 0, 2 * RAD);
    };
    X.dotP = V3(70, .6, 17);
    X.ball = (m, o) => { const u = m / acc, ph = u * 2 * PI * 38, r = 4.2 + .9 * Math.sin(u * PI * 7); return o.set(X.dotP.x + r * Math.cos(ph), X.dotP.y + .9 * Math.sin(u * PI * 13), X.dotP.z + r * Math.sin(ph)); };   /* a tight ring wound round the red point */

    const segs = Math.min(5200, Math.ceil(acc / .32)), barbs = Math.floor(acc / 4.4);
    const wire = window.NWF.createSteelWire(G3.studio, { segments: segs, barbs });
    wire.setBarbPositions(Array.from({ length: barbs }, (_, i) => (i + .5) / barbs));
    /* each ring of each strand knows its place along the wire (for drawing on) */
    wire.group.children.forEach(ch => { const g = ch.geometry; if (!g || !g.index || ch.isInstancedMesh) return; const n = g.attributes.position.count; if (n !== (segs + 1) * 14) return;
      const am = new Float32Array(n); for (let i = 0; i <= segs; i++) for (let j = 0; j < 14; j++) am[i * 14 + j] = i / segs * acc; g.setAttribute('aM', new T.BufferAttribute(am, 1)); });
    sc.add(wire.group); X.wire = wire; X.key = ''; X.barbM = wire.offsets.map(t => t * acc);
    const tmp = V3(), tb = V3();
    X.sample = (t, out) => {
      const m = clamp(t) * X.len; let k = 0; while (k < parts.length - 1 && m > parts[k].m0 + parts[k].len) k++;
      const s = parts[k]; s.at(s.vOf(m - s.m0), tmp, X.qq);
      const f = X.qq == null ? 0 : M.fin(X.qq);
      if (f > 0 && DIR !== 'A') {
        const front = DIR === 'B' ? clamp((f * 1.4 - m / acc * .4) / 1) : clamp((f * 1.5 - (1 - Math.abs(m / acc - .5) * 2) * .5));
        if (front > 0) { (DIR === 'B' ? X.rails : X.ball)(m, tb); tmp.lerp(tb, eio(front)); }
      }
      return out.copy(tmp);
    };
    G3.dot.position.copy(X.dotP); G3.dot.scale.setScalar(1.7);

    /* ---- camera ---- */
    const k = (q, p, t, f, s, stop) => ({ q, p: V3(...p), t: V3(...t), f, s, stop });
    KEYS = [
      k(ST.swap, [-90, 0, 150], [-90, 0, 0], 30, [0, 0], 1),
      k(3.3, [-80, 3, 112], [-80, 0, 0], 30, [0, 0]),
      k(ST.head, [-64, 26, 128], [-64, 0, 0], 30, [0, 0], 1),
      k(4.35, [-20, 60, 110], [-6, 0, -6], 32, [.16, 0]),
      k(ST.web, [15, 92, 62], [15, 0, -13], 32, [.3, .04], 1),
      k(5.25, [44, 96, 84], [44, 0, 4], 32, [.22, 0]),
      k(ST.photo, [70, 96, 66], [70, 0, 15], 32, [.3, -.02], 1),
      k(6.15, [100, 96, 80], [100, 0, -6], 32, [.22, 0]),
      k(ST.reb, [128, 92, 58], [128, 0, -14], 32, [.3, .04], 1),
      k(7.05, [160, 92, 80], [160, 0, 0], 32, [.22, 0]),
      k(ST.care, [192, 86, 60], [192, 0, 1], 32, [.3, 0], 1),
      k(8.0, [150, 190, 170], [110, 0, 0], 34, [.12, 0]),
      k(ST.whole, [104, 300, 150], [104, 0, -4], 34, [0, -.04], 1)
    ];
    if (DIR === 'A') KEYS.push(k(9.0, [104, 90, 290], [104, 0, 0], 32, [0, -.12]), k(ST.end, [104, 0, 190], [104, 0, 0], 30, [0, -.24], 1));
    if (DIR === 'B') KEYS.push(k(9.0, [104, 330, 140], [104, 0, 0], 32, [0, -.06]), k(ST.end, [104, 250, .5], [104, 0, 0], 30, [0, -.16], 1));
    if (DIR === 'C') KEYS.push(k(9.0, [78, 140, 110], [70, 0, 17], 32, [.2, -.04]), k(ST.end, [70, 60, 54], [70, .6, 17], 30, [.4, 0], 1));
    posCurve = new T.CatmullRomCurve3(KEYS.map(x => x.p), false, 'centripetal');
    tgtCurve = new T.CatmullRomCurve3(KEYS.map(x => x.t), false, 'centripetal');
    X.centres = { web: V3(15, 0, -15), photo: V3(70, 0, 17), reb: V3(128, 0, -14), care: V3(192, 0, 0) };

    X.blocks = [0, 1, 2, 3].map(i => { const b = R.layer.querySelector('#lnB' + i), p = b.querySelector('.ln-p'); if (!p.dataset.w) { BK2.wrap(p); p.dataset.w = 1; } return { b, w: [...p.querySelectorAll('.w')], n: b.querySelector('.ln-name') }; });
    X.built = true;
    X.qq = null; wire.update(X.sample); aim(G3.camera, camState(ST.web)); G3.renderer.compile(sc, G3.camera);
  }

  /* ---------------- render ---------------- */
  function render(qq) {
    if (!ready || !X.built) return;
    X.qq = qq;
    const fin = M.fin(qq);
    const key = M.crook(qq).toFixed(4) + '|' + (DIR === 'A' ? 0 : fin.toFixed(4));
    if (key !== X.key) { X.key = key; X.wire.update(X.sample); X.barbKey = ''; }

    /* how much of the wire is drawn: each shape is drawn as the camera arrives at it */
    const mk = X.mark, D = [[2.9, mk.l0], [4.02, mk.l0], [4.62, mk.sq], [4.95, mk.sq], [5.55, mk.ci], [5.9, mk.ci], [6.3, mk.tr], [6.82, mk.tr], [7.38, mk.in], [7.7, mk.in], [8.3, mk.all]];
    let m = D[0][1]; for (let i = 0; i < D.length - 1; i++) if (qq >= D[i][0]) m = lerp(D[i][1], D[i + 1][1], eio(prog(qq, D[i][0], D[i + 1][0])));
    X.u.rev.value = m + .2;
    /* barbs: grow in behind the drawing; on the entrance line they sprout from the middle outward */
    const bk = m.toFixed(1) + key + (qq < 3.7 ? qq.toFixed(3) : '') + (DIR === 'C' ? fin.toFixed(3) : '');
    if (bk !== X.barbKey) {
      X.barbKey = bk; const kn = X.wire.knots, mt = new T.Matrix4(), sv = V3();
      if (!X.barbBase) X.barbBase = [];
      for (let i = 0; i < X.barbM.length; i++) {
        kn.getMatrixAt(i, mt); if (!X.barbBase[i] || key !== X.barbBaseKey) X.barbBase[i] = mt.clone();
        const bm = X.barbM[i]; let s = clamp((m - bm) / 6) * (DIR === 'C' ? 1 - fin : 1);
        if (bm < mk.l0) { const d = Math.abs(bm - mk.l0 + 90) / 330; s *= eo(prog(qq, 3.04 + d * .45, 3.24 + d * .45)); }
        mt.copy(X.barbBase[i]).scale(sv.setScalar(Math.max(.001, s))); kn.setMatrixAt(i, mt);
      }
      X.barbBaseKey = key; kn.instanceMatrix.needsUpdate = true;
    }

    const cam = G3.camera, st = camState(qq); aim(cam, st);
    G3.scene.environmentRotation.copy(cam.rotation);

    /* the story light: the shape being spoken about is lit; at the whole, everything is */
    const F = [[ST.web, 'web'], [ST.photo, 'photo'], [ST.reb, 'reb'], [ST.care, 'care']];
    let lit = 0, fc = X.centres.web; for (const [S, n] of F) { const w = 1 - ss(Math.abs(qq - S), .3, .46); if (w > lit) { lit = w; fc = X.centres[n]; } }
    X.u.fc.value.copy(fc); X.u.fr.value = 30;
    X.u.dim.value = lerp(1, lerp(.42, .12, lit), ss(qq, 4.1, 4.5) * (1 - ss(qq, ST.whole - .45, ST.whole - .12)));

    /* night for Care: the room goes down; a warm red light finds the loop */
    const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35));
    G3.scene.environmentIntensity = 1 - .7 * night; G3.key.intensity = 2.1 * (1 - .78 * night); G3.rim.intensity = 1.2 * (1 - .7 * night);
    const sw = prog(qq, ST.care - .2, ST.care - .04), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .12 : sw < .75 ? .75 : 1;
    G3.lamp.position.set(192, 16, 6); G3.lamp.intensity = 2600 * on * (1 - ss(qq, ST.care + .25, ST.care + .6));
    /* the red subject; in C it opens into the field the next section stands on */
    G3.dot.visible = m > X.S.ci.m0 + X.S.ci.len * .5 && !(DIR === 'B' && fin > .55);
    G3.renderer.render(G3.scene, cam);
    if (DIR === 'C') {                                     /* the full stop opens into the field the next section stands on */
      const g = eio(prog(qq, ST.end - .22, ST.end - .02)), p = X.dotP.clone().project(cam), x = (p.x + 1) / 2 * K0.W, y = (1 - p.y) / 2 * K0.H;
      const r0 = 1.7 / X.dotP.distanceTo(cam.position) / (2 * Math.tan(cam.fov / 2 * DEG)) * K0.H, r = lerp(r0, Math.hypot(K0.W, K0.H) * 1.05, g * g);
      R.field.style.visibility = g > 0 ? 'visible' : 'hidden'; R.field.style.clipPath = `circle(${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
    }

    /* type */
    const hu = eo(prog(qq, 3.5, 3.84)), hd = eo(prog(qq, 3.56, 3.88)), ho = ss(qq, ST.head + .16, ST.head + .34);
    R.headUp.style.transform = `translate3d(0,${((1 - hu) * 105).toFixed(2)}%,0)`; R.headDown.style.transform = `translate3d(0,${((hd - 1) * 105).toFixed(2)}%,0)`;
    R.head.style.opacity = (1 - ho).toFixed(3); R.head.style.visibility = qq > 3.48 && ho < 1 ? 'visible' : 'hidden';
    const stops = [ST.web, ST.photo, ST.reb, ST.care];
    X.blocks.forEach(({ b, w, n }, i) => {
      const S = stops[i], inn = prog(qq, S - .26, S - .02), out = ss(qq, S + .18, S + .36), vis = inn > 0 && out < 1;
      b.style.visibility = vis ? 'visible' : 'hidden'; if (!vis) return;
      const t = eo(prog(inn, 0, .6)); n.style.opacity = t.toFixed(3); n.style.transform = `translate3d(0,${((1 - t) * .25).toFixed(3)}em,0)`;
      BK2.reveal(w, prog(inn, .25, 1), .9); b.style.opacity = (1 - out).toFixed(3); b.style.transform = `translate3d(0,${(-out * 18).toFixed(1)}px,0)`;
    });
    const ein = eo(prog(qq, ST.end - .22, ST.end - .02)); R.endBlk.style.opacity = ein.toFixed(3); R.endBlk.style.transform = `translate3d(0,${((1 - ein) * 22).toFixed(1)}px,0)`;
    R.endBlk.style.visibility = ein > .002 ? 'visible' : 'hidden';
    const on2 = qq >= ST.end - .05; R.end.tabIndex = on2 ? 0 : -1; R.mailA.tabIndex = on2 ? 0 : -1; R.endBlk.classList.toggle('is-on', on2);
    const railOn = ss(qq, ST.head + .45, ST.web - .2) * (1 - ss(qq, ST.care + .2, ST.care + .45));
    R.rail.style.opacity = railOn.toFixed(3); R.rail.style.visibility = railOn > .002 ? 'visible' : 'hidden';
    const cur = Math.round(clamp((qq - ST.web) / (ST.photo - ST.web), 0, 3));
    if (R.railCur !== cur) { R.railCur = cur; [...R.rail.children].forEach((li, i) => li.classList.toggle('is-on', i === cur)); }
  }

  /* ---------------- the entrance, drawn flat on the bridge's canvas: the sentence becomes one line ---------------- */
  function drawCollapse(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr, yL = H * .5;
    if (qq > 3.16) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    let x0 = W, x1 = 0;
    const fill = ss(qq, 2.84, 2.96), run = eio(prog(qq, 2.9, 3.04)), thick = lerp(2, 10, eio(prog(qq, 2.96, 3.06))), gone = 1 - ss(qq, 3.04, 3.14);
    G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.56 + i * .045, 2.82 + i * .045)), h = L.HH / dpr, yc = lerp(L.y0 + h / 2, yL, t), sy = lerp(1, .014, t);
      x0 = Math.min(x0, L.x); x1 = Math.max(x1, L.x + L.w);
      if (fill < 1) { ctx.globalAlpha = 1 - fill; ctx.drawImage(L.C, Math.round(L.x * dpr - L.pad * dpr), Math.round((yc - h * sy / 2) * dpr), L.C.width, Math.max(1, Math.round(L.HH * sy))); }
    });
    const ts = eio(prog(qq, 2.62, 2.86)); ctx.globalAlpha = (1 - ts) * .92;
    if (ts < 1) { ctx.setTransform(dpr, 0, 0, dpr * lerp(1, .05, ts), 0, 0); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM; G.sub.forEach(o => ctx.fillText(o.w, o.x, lerp(o.y, yL, ts) / lerp(1, .05, ts))); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    if (fill > 0) { ctx.globalAlpha = fill * gone; ctx.fillStyle = CREAM; const a = lerp(x0, 0, run), b = lerp(x1, W, run); ctx.fillRect(a * dpr, (yL - thick / 2) * dpr, (b - a) * dpr, thick * dpr); }
    ctx.restore();
  }

  function init(Kk) {
    K0 = Kk; R.layer = Kk.layer; R.gl = Kk.el('lnGl'); R.end = Kk.el('lnEnd'); R.endBlk = Kk.el('lnE'); R.mailA = R.endBlk.querySelector('.ln-mail a');
    R.rail = Kk.el('lnRail'); R.head = Kk.el('lnHead'); R.field = Kk.el('lnField');
    R.headUp = R.head.querySelector('.ln-mask--up > span'); R.headDown = R.head.querySelector('.ln-mask--down > span');
    const nz = document.createElement('canvas'); nz.width = nz.height = 180; const nx = nz.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); Kk.layer.querySelector('.ln-grain').style.backgroundImage = `url(${nz.toDataURL()})`;
    const go = () => { if (ready || !window.NWF) return; T = window.NWF.THREE; build3D(); ready = true; if (K0.W && A) layout(K0, A); };
    if (window.NWF) setTimeout(go, 0); else addEventListener('nwf-ready', go, { once: true });
  }
  function layout(Kk, a) {
    A = a || A; K0 = Kk; if (!ready || !A || !A.G || !A.G.ok) return;
    G3.renderer.setPixelRatio(Math.min(Kk.dpr, 1.75, Math.sqrt(4e6 / (Kk.W * Kk.H)))); G3.renderer.setSize(Kk.W, Kk.H, false);
    build(Kk); X.dirty = true;
    requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
  }
  function post(ctx, qq) {
    R.gl.style.opacity = X.built ? Math.max(.002, ss(qq, 2.98, 3.1)).toFixed(3) : 0;
    R.layer.querySelector('.ln-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
    if (!X.built) return;
    drawCollapse(ctx, qq);
    render(qq);
  }
  window.__nw = { X: () => X, G3: () => G3, render: qq => render(qq), camState, keys: () => KEYS };
  return { dom, init, layout, post, take: qq => !!X.built && qq > ST.swap, live: () => { const d = X.dirty; X.dirty = false; return !!d; } };
})();
