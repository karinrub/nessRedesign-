/* 22 — POINT OF VIEW (Offers; script in mockup22-src/SCRIPT.md)
   One barbed-wire sculpture: four pieces at four depths, joined by straight lines that all run along sight-lines toward
   one point. From anywhere else it is four unrelated forms; from that point it is a single ring around a red point, the
   full stop of "Tell us what you need". The film was designed from that last shot backward: every piece is a quarter of
   the ring, every connecting line aims at the place the camera finally stands.
   The wire is the only 3D object. All type is flat and square to the screen; where it sits in space, the wire can pass
   in front of it or behind it. */
window.NG_EXT = (() => {
  const { OFFERS, HEADING } = NGL;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const CREAM = '#e9e1ce', RED = '#c0230b';
  const ST = { swap: 2.55, head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, pov: 9.4 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  /* the ring as seen from the point of view: radius TA per unit of depth, a band of ±TB for the pieces to work in */
  const TA = .1715, D = [150, 330, 260, 330], DOT = 380, SC = .45;   /* SC: the sculpture is drawn at full size, built at this scale (the steel keeps its own weight) */
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;

  const dom = `<canvas class="pv-gl" id="pvGl" aria-hidden="true"></canvas><div class="pv-grain" aria-hidden="true"></div>
  <div class="pv-hud" id="pvHud">
    <h2 class="pv-sr">${HEADING}</h2>
    ${OFFERS.map((o, i) => `<section class="pv-blk pv-blk--${SVC[i]}" id="pvB${i}"><h3 class="pv-sr">${o.name}</h3><p class="pv-p">${o.body}</p></section>`).join('')}
    ${OFFERS.map((o, i) => `<span class="pv-tag" id="pvT${i}" aria-hidden="true">${o.name}</span>`).join('')}
    <a class="pv-end" id="pvEnd" href="mailto:hello@nessmaui.com" tabindex="-1"><span class="pv-sr">Tell us what you need</span></a>
    <p class="pv-mail" id="pvMail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p>
    <ol class="pv-rail" id="pvRail" aria-hidden="true">${OFFERS.map(o => `<li>${o.name}</li>`).join('')}</ol>
  </div>`;

  /* ---------------- flat type, held square to the screen at a chosen depth so the wire can pass in front or behind ---------------- */
  function textTex(lines, px, color, lh = .9) {
    const S = Math.max(2, K0.dpr), c = document.createElement('canvas'), x = c.getContext('2d');
    const font = `700 ${px * S}px 'Instrument Sans', sans-serif`, ls = -.055 * px * S;
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = ls + 'px';
    const w = Math.ceil(Math.max(...lines.map(l => x.measureText(l).width)) / S + px * .1), h = Math.ceil(px * (lh * (lines.length - 1) + 1.18));
    c.width = Math.ceil(w * S); c.height = Math.ceil(h * S);
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = ls + 'px'; x.fillStyle = color; x.textBaseline = 'alphabetic';
    lines.forEach((l, i) => x.fillText(l, px * .03 * S, (px * .92 + i * px * lh) * S));
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = T.LinearMipmapLinearFilter;
    const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: .03, toneMapped: false, depthWrite: true }));
    m.userData = { w, h, px }; m.visible = false; G3.scene.add(m); X.texts.push(m); return m;
  }
  /* put a text plane with its top-left at screen (sx, sy) px, depth d in front of the camera, facing it square */
  const _v = () => new T.Vector3();
  function hold(m, sx, sy, d, a) {
    const c = G3.camera, W = K0.W, H = K0.H, u = m.userData, k = 2 * d * Math.tan(c.fov / 2 * DEG) / H;
    const cx = sx + u.w / 2, cy = sy + u.h / 2, p = _v().set(cx / W * 2 - 1, 1 - cy / H * 2, .5).unproject(c).sub(c.position).normalize();
    const fwd = c.getWorldDirection(_v());
    m.position.copy(c.position).addScaledVector(p, d / p.dot(fwd)); m.quaternion.copy(c.quaternion); m.scale.set(u.w * k, u.h * k, 1);
    m.material.opacity = a; m.visible = a > .004;
  }

  /* ---------------- the camera: keys in world space; stops ease in and out; lens shift places the subject ---------------- */
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
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); c.near = .5; c.far = 12000; c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); c.updateMatrixWorld(true);
  }

  /* ---------------- the sculpture: points on sight-lines (θ around the ring, t = tan of the angle off axis, s = depth) ---------------- */
  const V3 = (...a) => new T.Vector3(...a);
  const at = (o, th, t, s) => o.set(s * t * Math.cos(th), s * t * Math.sin(th), -s);
  const tri = x => 2 * Math.abs(2 * (x - Math.floor(x + .5))) - 1;
  function section(f) {
    const N = 900, tab = new Float32Array(N + 1), a = V3(), b = V3(); f(0, a, null);
    for (let i = 1; i <= N; i++) { f(i / N, b, null); tab[i] = tab[i - 1] + a.distanceTo(b); a.copy(b); }
    return { at: f, tab, len: tab[N], vOf(m) {
      let lo = 0, hi = N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab[mid] < m) lo = mid; else hi = mid; }
      return (lo + clamp((m - tab[lo]) / Math.max(1e-6, tab[hi] - tab[lo]))) / N; } };
  }
  const env = v => ss(v, 0, .05) * ss(1 - v, 0, .05);
  const M = {
    tangle: qq => qq == null ? 0 : 1 - (eo(prog(qq, 6.3, 6.58)) + .12 * Math.sin(prog(qq, 6.3, 6.58) * 3 * PI) * (1 - prog(qq, 6.3, 6.58))),
    knot: qq => qq == null ? 1 : lerp(1.9, 1, eio(prog(qq, 7.0, 7.42)))
  };
  function sculpture() {
    const S = {};
    /* WEBSITES: an even coil laid along the quarter, each turn standing out into depth — measured, built by hand.
       From the point of view every turn folds onto the arc: the whole coil is one clean quarter of the ring */
    S.web = section((v, o) => { const n = 7, f = v * n * 2 * PI, r = 16 * Math.sin(Math.min(1, v * 14, (1 - v) * 14) * PI / 2);
      return at(o, (lerp(90, 0, v) * DEG) + r * Math.sin(f) / (D[0] * TA), TA, D[0] + r * (1 - Math.cos(f)) * 1.15); });
    /* PHOTOGRAPHY: a quarter arc, and at its middle a lens barrel: a cone of rings around one sight-line, aimed at the eye */
    const LT = 7, lNear = 196, lFar = 470;
    S.photo = section((v, o) => {
      const th0 = -45 * DEG;
      if (v < .16) return at(o, lerp(0, -45, v / .16) * DEG, TA, D[1]);
      if (v > .84) return at(o, lerp(-45, -90, (v - .84) / .16) * DEG, TA, D[1]);
      const u = (v - .16) / .68;
      if (u < .14) return at(o, th0, TA, lerp(D[1], lNear, u / .14));          /* in along the sight-line toward the eye */
      if (u < .86) {                                                          /* then the barrel: rings of one apparent size, out into depth */
        const w = (u - .14) / .72, sd = lerp(lNear, lFar, w), f = w * LT * 2 * PI, rr = sd * .046 * Math.sin(Math.min(1, w * 12, (1 - w) * 12) * PI / 2);
        const base = at(V3(), th0, TA, sd), ax = base.clone().normalize(), e1 = V3(-Math.sin(th0), Math.cos(th0), 0), e2 = ax.clone().cross(e1).normalize();
        return o.copy(base).addScaledVector(e1, Math.cos(f) * rr).addScaledVector(e2, Math.sin(f) * rr);
      }
      return at(o, th0, TA, lerp(lFar, D[1], (u - .86) / .14));                /* and back, inside the barrel */
    });
    /* REBUILDS: a quarter that has wandered all over the depth — a tangle — pulled true into a clean arc */
    S.reb = section((v, o, qq) => {
      const k = M.tangle(qq) * env(v), th = (lerp(-90, -180, v) + k * 5 * Math.sin(v * 29 + 1)) * DEG;
      return at(o, th, TA, Math.max(170, D[2] + k * (120 * tri(v * 3.6 + .2) + 48 * Math.sin(v * 21) + 22 * tri(v * 13.3))));
    });
    /* CARE: the last quarter, with a large knot tied in it beside the light; the knot lies on the sight-lines too */
    S.care = section((v, o, qq) => {
      if (v < .3 || v > .7) return at(o, lerp(180, 90, v) * DEG, TA, D[3]);
      const u = (v - .3) / .4, thb = lerp(180, 90, v) * DEG;
      const t = lerp(-.55, 2 * PI - .55, u), kx = Math.sin(t) + 2 * Math.sin(2 * t), ky = Math.cos(t) - 2 * Math.cos(2 * t), kz = -Math.sin(3 * t);
      const sc = 7.5 * M.knot(qq) * Math.pow(Math.sin(PI * u), .5);
      return at(o, thb + kx * sc / (D[3] * TA), TA * (1 + kz * sc * .012), D[3] + ky * sc * 1.7);
    });
    /* sight-lines between the pieces */
    const ray = (th, s0, s1) => section((v, o) => at(o, th * DEG, TA, lerp(s0, s1, v)));
    S.r1 = ray(0, D[0], D[1]); S.r2 = ray(-90, D[1], D[2]); S.r3 = ray(180, D[2], D[3]);
    return S;
  }

  /* ---------------- three ---------------- */
  function build3D() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    /* a light that follows the story: only the piece being spoken about is lit, the rest of the sculpture waits in the
       dark (each piece owns a quarter of the ring, so the light is chosen by angle around the axis) */
    X.focus = { a: { value: 0 }, w: { value: PI }, dim: { value: 1 } };
    const tooling = studio.silver.onBeforeCompile;
    studio.silver.onBeforeCompile = (sh, r) => {
      tooling(sh, r); sh.uniforms.uFa = X.focus.a; sh.uniforms.uFw = X.focus.w; sh.uniforms.uDim = X.focus.dim;
      sh.vertexShader = 'varying vec3 vFocusPos;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFocusPos = worldPosition.xyz;');
      sh.fragmentShader = 'uniform float uFa, uFw, uDim;\nvarying vec3 vFocusPos;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `#include <opaque_fragment>
  float fa = abs(mod(atan(vFocusPos.y, vFocusPos.x) - uFa + 3.14159265, 6.2831853) - 3.14159265);
  gl_FragColor.rgb *= mix(uDim, 1.0, 1.0 - smoothstep(uFw, uFw + 0.32, fa));`);
    };
    studio.silver.customProgramCacheKey = () => 'pv-focus'; studio.cut.onBeforeCompile = studio.silver.onBeforeCompile; studio.cut.customProgramCacheKey = () => 'pv-focus-cut';
    const camera = new T.PerspectiveCamera(30, 1, .5, 12000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); lamp.position.set(0, 0, -DOT * SC); scene.add(lamp);
    const dot = new T.Mesh(new T.SphereGeometry(1, 40, 20), new T.MeshBasicMaterial({ color: RED, toneMapped: false }));
    dot.position.set(0, 0, -DOT * SC); dot.scale.setScalar(DOT * SC * .0082); scene.add(dot);
    G3 = { renderer, scene, camera, studio, key, rim, lamp, dot };
  }

  function build(Kk) {
    const W = Kk.W, H = Kk.H, sc = G3.scene, vw = W / 100;
    if (X.wire) { sc.remove(X.wire.group); X.wire.dispose(); }
    (X.texts || []).forEach(m => sc.remove(m)); X.texts = [];

    const S = sculpture(); X.S = S;
    const parts = [S.web, S.r1, S.photo, S.r2, S.reb, S.r3, S.care];
    let acc = 0; parts.forEach(s => { s.m0 = acc; acc += s.len; }); X.parts = parts; X.len = acc;
    const segs = Math.min(6400, Math.ceil(acc * SC / .3)), barbs = Math.floor(acc * SC / 4.2);
    const wire = window.NWF.createSteelWire(G3.studio, { segments: segs, barbs });
    /* barbs evenly along the steel, thinned inside the lens so its rings stay clean */
    const pb0 = (S.photo.m0 + S.photo.len * .26) / acc, pb1 = (S.photo.m0 + S.photo.len * .74) / acc;
    wire.setBarbPositions(Array.from({ length: barbs }, (_, i) => { const t = (i + .5) / barbs; return t > pb0 && t < pb1 && i % 3 ? pb0 - .002 : t; }));
    sc.add(wire.group); X.wire = wire; X.key = '';
    const tmp = V3();
    X.sample = (t, out) => { const m = clamp(t) * X.len; let k = 0; while (k < parts.length - 1 && m > parts[k].m0 + parts[k].len) k++; const s = parts[k]; return s.at(s.vOf(m - s.m0), out, X.qq).multiplyScalar(SC); };
    /* where each piece sits, for the camera and for the names at the whole */
    const mid = (th, s) => at(V3(), th * DEG, TA, s).multiplyScalar(SC);
    X.mid = { web: mid(45, D[0] + 16), photo: mid(-45, 330), reb: mid(-135, D[2]), care: mid(135, D[3]) };

    /* ---- the period: where the bridge printed it; the sculpture, seen from far down its axis, is exactly that dot ---- */
    const G = A.G, L3 = G.L[G.L.length - 1], dpr = Kk.dpr;
    const mc = document.createElement('canvas').getContext('2d'); mc.font = `700 100px 'Instrument Sans', sans-serif`; A.lsp(mc, A.LS);
    const mw = s => A.HAS ? mc.measureText(s).width : mc.measureText(s).width + s.length * A.LS;
    const x0d = mw(L3.t.slice(0, -1)), x1d = mw(L3.t) - A.LS;
    X.dot = { x: L3.x + (x0d + x1d) / 2 * L3.s, y: L3.y0 + .72 * L3.fs - .062 * L3.fs, r: .068 * L3.fs };
    const pc = document.createElement('canvas'); pc.width = L3.C.width; pc.height = L3.C.height; const px = pc.getContext('2d'); px.drawImage(L3.C, 0, 0);
    px.clearRect((x0d * L3.s + L3.pad - 2) * dpr, 0, ((x1d - x0d) * L3.s + 30) * dpr, pc.height); L3.Cx = pc;
    const tn = Math.tan(15 * DEG), nx = X.dot.x / W * 2 - 1, ny = 1 - X.dot.y / H * 2;
    const Z0 = ((D[3] * TA * 1.12) / (X.dot.r * 1.25 / H * 2 * tn) - D[3]) * SC;      /* far enough that the whole sculpture is the period's size */

    /* ---- camera keys ---- */
    const k = (q, p, t, f, s, stop) => ({ q, p: V3(...p).multiplyScalar(q === ST.swap ? 1 : SC), t: V3(...t).multiplyScalar(SC), f, s, stop });
    const wm = X.mid.web.clone().divideScalar(SC), pm = X.mid.photo.clone().divideScalar(SC), rm = X.mid.reb.clone().divideScalar(SC), cm = X.mid.care.clone().divideScalar(SC);
    const lensAx = at(V3(), -45 * DEG, TA, 1).normalize();
    const lensCam = lensAx.clone().multiplyScalar(128), lensT = lensAx.clone().multiplyScalar(420);
    KEYS = [
      k(ST.swap, [0, 0, Z0], [0, 0, -100], 30, [nx, ny], 1),
      k(3.2, [0, 0, 1500], [0, 0, -250], 30, [nx * .5, ny * .4]),
      k(3.55, [70, 50, 330], [0, 0, -240], 30, [.16, -.05]),
      k(ST.head, [96, 70, 40], [0, 0, -280], 36, [.42, -.02], 1),
      k(ST.web, [wm.x + 70, wm.y + 58, wm.z + 64], [wm.x - 4, wm.y - 4, wm.z - 6], 34, [.4, .02], 1),
      k(5.25, [pm.x + 90, pm.y + 10, pm.z + 260], [pm.x * .5, pm.y * .5, -260], 34, [.25, 0]),
      k(ST.photo, lensCam.toArray(), lensT.toArray(), 34, [.38, .04], 1),
      k(6.15, [rm.x + 30, rm.y - 140, rm.z + 230], [rm.x, rm.y, rm.z - 20], 34, [.2, .05]),
      k(ST.reb, [rm.x * 2.9, rm.y * 2.2, rm.z + 70], [rm.x, rm.y, rm.z - 10], 32, [.34, .1], 1),
      k(7.05, [cm.x - 160, cm.y + 60, cm.z + 200], [cm.x, cm.y, cm.z], 34, [.2, 0]),
      k(ST.care, [cm.x * 3.1, cm.y * 3.1, cm.z + 30], [cm.x, cm.y, cm.z], 28, [.36, -.02], 1),
      k(8.05, [220, 220, 60], [0, 0, -300], 38, [.1, 0]),
      k(ST.whole, [160, 96, -96], [-8, -4, -280], 40, [.08, .02], 1),
      k(9.0, [150, 40, 120], [0, 0, -300], 32, [.2, 0]),
      k(ST.pov, [0, 0, 0], [0, 0, -1], 30, [.3, 0], 1)
    ];
    posCurve = new T.CatmullRomCurve3(KEYS.map(x => x.p), false, 'centripetal');
    tgtCurve = new T.CatmullRomCurve3(KEYS.map(x => x.t), false, 'centripetal');

    /* ---- the printed type (flat, square to the screen) ---- */
    X.T = {
      head: textTex(['What you can', 'hire us for.'], 9.8 * vw, CREAM),
      web: textTex(['Websites'], 13.5 * vw, CREAM), photo: textTex(['Photography'], 11 * vw, CREAM),
      reb: textTex(['Rebuilds'], 14 * vw, CREAM), care: textTex(['Care'], 20 * vw, RED),
      end: textTex(['Tell us what', 'you need'], 9.2 * vw, CREAM, .92)
    };
    X.blocks = [0, 1, 2, 3].map(i => { const b = R.layer.querySelector('#pvB' + i), p = b.querySelector('.pv-p'); if (!p.dataset.w) { BK2.wrap(p); p.dataset.w = 1; } return { b, w: [...p.querySelectorAll('.w')] }; });
    X.built = true;
    X.qq = null; wire.update(X.sample); aim(G3.camera, camState(ST.web)); G3.renderer.compile(sc, G3.camera);
    X.texts.forEach(m => G3.renderer.initTexture(m.material.map));
  }

  /* ---------------- render ---------------- */
  function render(qq) {
    if (!ready || !X.built) return;
    X.qq = qq;
    const key = M.tangle(qq).toFixed(4) + '|' + M.knot(qq).toFixed(4);
    if (key !== X.key) { X.key = key; X.wire.update(X.sample); }
    const cam = G3.camera, st = camState(qq); aim(cam, st);
    G3.scene.environmentRotation.copy(cam.rotation);
    /* the story light: which quarter is lit at each beat; at the whole, the lights come up on everything */
    const F = [[ST.web, 45], [ST.photo, -45], [ST.reb, -135], [ST.care, 135]];
    let fa = 45, lit = 0;
    for (const [S, a] of F) { const w = 1 - ss(Math.abs(qq - S), .32, .48); if (w > lit) { lit = w; fa = a; } }
    X.focus.a.value = fa * DEG; X.focus.w.value = 46 * DEG;
    X.focus.dim.value = lerp(1, lerp(.32, .07, lit), ss(qq, 3.6, 4.2) * (1 - ss(qq, ST.whole - .45, ST.whole - .1)));
    const W = K0.W, H = K0.H, vw = W / 100;

    /* night for Care: the room goes down, the red point switches on as a lamp (two short steps) */
    const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35));
    G3.scene.environmentIntensity = 1 - .72 * night; G3.key.intensity = 2.1 * (1 - .8 * night); G3.rim.intensity = 1.2 * (1 - .7 * night);
    const sw = prog(qq, ST.care - .2, ST.care - .04), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .12 : sw < .75 ? .75 : 1;
    G3.lamp.intensity = 16000 * SC * SC * on * (1 - ss(qq, ST.care + .25, ST.care + .6));

    /* type: each piece of flat type is held at a depth where the steel can pass in front of it or behind it */
    const inOut = (S, a0 = .28, last) => { const i = eo(prog(qq, S - a0, S - .02)), o = last ? 0 : ss(qq, S + .18, S + .36); return { a: i * (1 - o), y: (1 - i) * 26 - o * 18 }; };
    const t = X.T;
    let s = inOut(ST.head, .32); hold(t.head, .05 * W, .33 * H + s.y, 60 * SC, s.a);
    s = inOut(ST.web); hold(t.web, .05 * W, .12 * H + s.y, 60 * SC, s.a);
    s = inOut(ST.photo); hold(t.photo, .045 * W, .72 * H + s.y, 70 * SC, s.a);
    s = inOut(ST.reb); hold(t.reb, .05 * W, .1 * H + s.y, 60 * SC, s.a);
    s = inOut(ST.care); hold(t.care, .045 * W, .08 * H + s.y, 60 * SC, s.a);
    s = inOut(ST.pov, .34, true); hold(t.end, .05 * W, .36 * H + s.y, 245 * SC, s.a);

    G3.renderer.render(G3.scene, cam);

    /* paragraphs: word by word once the steel has settled, away before it moves again */
    const stops = [ST.web, ST.photo, ST.reb, ST.care];
    X.blocks.forEach(({ b, w }, i) => {
      const S = stops[i], inn = prog(qq, S - .24, S - .02), out = ss(qq, S + .18, S + .36), vis = inn > 0 && out < 1;
      b.style.visibility = vis ? 'visible' : 'hidden'; if (!vis) return;
      BK2.reveal(w, inn, .9); b.style.opacity = (1 - out).toFixed(3); b.style.transform = `translate3d(0,${(-out * 18).toFixed(1)}px,0)`;
    });
    /* the whole: each name set lightly beside its piece */
    const tagA = ss(qq, ST.whole - .28, ST.whole - .04) * (1 - ss(qq, ST.whole + .14, ST.whole + .32));
    ['web', 'photo', 'reb', 'care'].forEach((n, i) => {
      const el = R.tags[i], p = X.mid[n].clone().project(cam), off = [[18, -46], [22, 18], [-120, 26], [-80, -60]][i];
      el.style.opacity = (tagA * (p.z < 1 ? 1 : 0)).toFixed(3); el.style.visibility = tagA > .002 ? 'visible' : 'hidden';
      el.style.transform = `translate3d(${((p.x + 1) / 2 * W + off[0]).toFixed(1)}px,${((1 - p.y) / 2 * H + off[1]).toFixed(1)}px,0)`;
    });
    /* the last frame: the sentence is the link; the ring is its full stop */
    const end = qq >= ST.pov - .05; R.end.tabIndex = end ? 0 : -1; R.end.classList.toggle('is-on', end); R.mailA.tabIndex = end ? 0 : -1;
    R.mail.style.opacity = ss(qq, ST.pov - .12, ST.pov - .02).toFixed(3); R.mail.style.visibility = qq > ST.pov - .12 ? 'visible' : 'hidden';
    const railOn = ss(qq, ST.head + .45, ST.web - .2) * (1 - ss(qq, ST.care + .2, ST.care + .45));
    R.rail.style.opacity = railOn.toFixed(3); R.rail.style.visibility = railOn > .002 ? 'visible' : 'hidden';
    const cur = Math.round(clamp((qq - ST.web) / (ST.photo - ST.web), 0, 3));
    if (R.railCur !== cur) { R.railCur = cur; [...R.rail.children].forEach((li, i) => li.classList.toggle('is-on', i === cur)); }
  }

  /* ---------------- the entrance, drawn flat on the bridge's own canvas: the lines lift away, the period stays ---------------- */
  function drawLift(ctx, qq) {
    const G = A.G, H = K0.H, dpr = K0.dpr;
    if (qq > 3.2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.58 + i * .05, 2.92 + i * .05)); if (t >= 1) return;
      ctx.globalAlpha = 1 - t; ctx.drawImage(L.Cx || L.C, Math.round(L.x * dpr - L.pad * dpr), Math.round(L.Y - t * H * .16 * dpr));
    });
    const ts = eio(prog(qq, 2.6, 2.9));
    if (ts < 1) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM; G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y - ts * H * .16)); }
    /* the period stays where it was printed until the steel takes its place */
    const pd = 1 - ss(qq, 2.66, 2.8);
    if (pd > 0) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = pd; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(X.dot.x, X.dot.y, X.dot.r, 0, PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function init(Kk) {
    K0 = Kk; R.layer = Kk.layer; R.gl = Kk.el('pvGl'); R.end = Kk.el('pvEnd'); R.rail = Kk.el('pvRail'); R.mail = Kk.el('pvMail'); R.mailA = R.mail.querySelector('a');
    R.tags = [0, 1, 2, 3].map(i => Kk.el('pvT' + i));
    const nz = document.createElement('canvas'); nz.width = nz.height = 180; const nx = nz.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); Kk.layer.querySelector('.pv-grain').style.backgroundImage = `url(${nz.toDataURL()})`;
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
    R.gl.style.opacity = X.built ? Math.max(.002, ss(qq, 2.64, 2.78)).toFixed(3) : 0;   /* never quite 0: the layer stays composited */
    R.layer.querySelector('.pv-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
    if (!X.built) return;
    drawLift(ctx, qq);
    render(qq);
  }
  window.__nw = { X: () => X, G3: () => G3, render: qq => render(qq), camState, keys: () => KEYS };
  return { dom, init, layout, post, take: qq => !!X.built && qq > ST.swap, live: () => { const d = X.dirty; X.dirty = false; return !!d; } };
})();
