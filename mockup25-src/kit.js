  /* ======== KIT: the plumbing every 24/25 direction shares (wire, camera, film hooks). The film itself is not here. ======== */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const tri = x => 2 * Math.abs(2 * (x - Math.floor(x + .5))) - 1;
  const CREAM = '#e9e1ce', RED = '#c0230b', INK = '#17150f';
  const { OFFERS, HEADING } = NGL;
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;
  const V3 = (...a) => new T.Vector3(...a);

  /* sections: any curve, re-parametrised by its own rest length so barbs keep their place */
  function section(f, N = 700) {
    const tab = new Float32Array(N + 1), a = V3(), b = V3(); f(0, a, null);
    for (let i = 1; i <= N; i++) { f(i / N, b, null); tab[i] = tab[i - 1] + a.distanceTo(b); a.copy(b); }
    return { at: f, tab, len: tab[N], vOf(m) {
      let lo = 0, hi = N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab[mid] < m) lo = mid; else hi = mid; }
      return (lo + clamp((m - tab[lo]) / Math.max(1e-6, tab[hi] - tab[lo]))) / N; } };
  }
  /* a smooth curve through points ([x,y,z] arrays), evenly parametrised */
  function spline(pts, closed = false, type = 'centripetal') {
    const c = new T.CatmullRomCurve3(pts.map(p => V3(...p)), closed, type); c.arcLengthDivisions = 600;
    return (v, o) => o.copy(c.getPointAt(clamp(v)));
  }
  /* a polyline with small round corners ([x,y,z] arrays) */
  function poly(pts, r = 1.6) {
    const P = pts.map(p => V3(...p)), pieces = [];
    const segs = []; for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1], d = b.clone().sub(a), L = d.length(); d.normalize();
      segs.push([a.clone().addScaledVector(d, i > 0 ? Math.min(r, L * .45) : 0), b.clone().addScaledVector(d, -(i < P.length - 2 ? Math.min(r, L * .45) : 0))]); }
    for (let i = 0; i < segs.length; i++) { pieces.push({ k: 'l', a: segs[i][0], b: segs[i][1] }); if (i < segs.length - 1) pieces.push({ k: 'q', a: segs[i][1], c: P[i + 1], b: segs[i + 1][0] }); }
    const lens = pieces.map(p => Math.max(1e-4, p.k === 'l' ? p.a.distanceTo(p.b) : p.a.distanceTo(p.c) + p.c.distanceTo(p.b))), tot = lens.reduce((x, y) => x + y, 0);
    return (v, o) => { let m = clamp(v) * tot, i = 0; while (i < pieces.length - 1 && m > lens[i]) { m -= lens[i]; i++; }
      const p = pieces[i], t = clamp(m / lens[i]); if (p.k === 'l') return o.copy(p.a).lerp(p.b, t);
      const u = 1 - t; return o.set(0, 0, 0).addScaledVector(p.a, u * u).addScaledVector(p.c, 2 * u * t).addScaledVector(p.b, t * t); };
  }

  /* camera keys: {q, p, t, f, s:[shiftX, shiftY], stop}; stops ease in and out, via points pass through */
  let KEYS = [], posCurve, tgtCurve;
  function setKeys(keys) { KEYS = keys.map(k => ({ ...k, p: V3(...k.p), t: V3(...k.t) })); posCurve = new T.CatmullRomCurve3(KEYS.map(k => k.p), false, 'centripetal'); tgtCurve = new T.CatmullRomCurve3(KEYS.map(k => k.t), false, 'centripetal'); }
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a, qv = b === a ? KEYS[a].q : lerp(KEYS[a].q, KEYS[b].q, eio(prog(qq, KEYS[a].q, KEYS[b].q)));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q), u = (i + l) / (n - 1);
    return { p: posCurve.getPoint(u), t: tgtCurve.getPoint(u), f: lerp(k0.f, k1.f, l), sx: lerp(k0.s[0], k1.s[0], l), sy: lerp(k0.s[1], k1.s[1], l) };
  }
  function aim(c, st) {
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); c.near = .5; c.far = 8000; c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); c.updateMatrixWorld(true);
  }

  /* the steel: the hero's material, drawn on as the film plays (aM = each ring's place along the wire), with a story
     light that keeps the subject lit and lets the rest wait in the dark */
  function stage() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    X.u = { rev: { value: 1e9 }, fc: { value: V3() }, fr: { value: 1e5 }, dim: { value: 1 } };
    const tooling = studio.silver.onBeforeCompile;
    studio.silver.onBeforeCompile = (sh, r) => {
      tooling(sh, r); Object.assign(sh.uniforms, { uRev: X.u.rev, uFc: X.u.fc, uFr: X.u.fr, uDim: X.u.dim });
      sh.vertexShader = 'attribute float aM;\nvarying float vM;\nvarying vec3 vFp;\n' + sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vM = aM;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFp = worldPosition.xyz;');
      sh.fragmentShader = 'uniform float uRev, uFr, uDim;\nuniform vec3 uFc;\nvarying float vM;\nvarying vec3 vFp;\n' + sh.fragmentShader
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n  if (vM > uRev) discard;')
        .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n  gl_FragColor.rgb *= mix(uDim, 1.0, 1.0 - smoothstep(uFr, uFr * 1.7, distance(vFp, uFc)));');
    };
    studio.silver.customProgramCacheKey = () => 'nk24';
    const camera = new T.PerspectiveCamera(30, 1, .5, 8000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    G3 = { renderer, scene, camera, studio, key, rim, lamp };
  }
  /* one wire from a list of sections; X.warp(p, m) may move any point (for things that turn, sway or re-form) */
  function wireFrom(parts, { step = .32, barbEvery = 4.4 } = {}) {
    const sc = G3.scene; if (X.wire) { sc.remove(X.wire.group); X.wire.dispose(); }
    let acc = 0; parts.forEach(s => { s.m0 = acc; acc += s.len; }); X.parts = parts; X.len = acc;
    const segs = Math.min(6000, Math.ceil(acc / step)), barbs = Math.max(1, Math.floor(acc / barbEvery));
    const wire = window.NWF.createSteelWire(G3.studio, { segments: segs, barbs });
    wire.setBarbPositions(Array.from({ length: barbs }, (_, i) => (i + .5) / barbs));
    wire.group.children.forEach(ch => { const g = ch.geometry; if (!g || !g.index || ch.isInstancedMesh) return; const n = g.attributes.position.count; if (n !== (segs + 1) * 14) return;
      const am = new Float32Array(n); for (let i = 0; i <= segs; i++) for (let j = 0; j < 14; j++) am[i * 14 + j] = i / segs * acc; g.setAttribute('aM', new T.BufferAttribute(am, 1)); });
    sc.add(wire.group); X.wire = wire; X.barbM = wire.offsets.map(t => t * acc); X.barbBase = []; X.wkey = ''; X.bkey = '';
    const tmp = V3();
    X.sample = (t, out) => { const m = clamp(t) * X.len; let k = 0; while (k < parts.length - 1 && m > parts[k].m0 + parts[k].len) k++;
      const s = parts[k]; s.at(s.vOf(m - s.m0), tmp, X.qq); if (X.warp) X.warp(tmp, m, s); return out.copy(tmp); };
    X.qq = null; wire.update(X.sample);
  }
  const mOf = s => s.m0, mEnd = s => s.m0 + s.len;
  /* re-form the wire only when its shape key changes; then set the barbs: grown in behind the drawing, scaled by bs(m) */
  function refresh(shapeKey, drawn, bs) {
    if (shapeKey !== X.wkey) { X.wkey = shapeKey; X.wire.update(X.sample); X.barbBase = []; X.bkey = ''; }
    X.u.rev.value = drawn + .2;
    const kn = X.wire.knots, mt = new T.Matrix4(), sv = V3(), key = drawn.toFixed(1) + '|' + X.wkey + '|' + (bs ? bs.key : '');
    if (key === X.bkey) return; X.bkey = key;
    for (let i = 0; i < X.barbM.length; i++) {
      if (!X.barbBase[i]) { kn.getMatrixAt(i, mt); X.barbBase[i] = mt.clone(); }
      const m = X.barbM[i]; let s = clamp((drawn - m) / 5); if (bs) s *= bs.f(m);
      mt.copy(X.barbBase[i]).scale(sv.setScalar(Math.max(.001, s))); kn.setMatrixAt(i, mt);
    }
    kn.instanceMatrix.needsUpdate = true;
  }
  /* how much of the wire is drawn at q, from a list of [q, m] keys */
  const drawnAt = (qq, D) => { let m = D[0][1]; for (let i = 0; i < D.length - 1; i++) if (qq >= D[i][0]) m = lerp(D[i][1], D[i + 1][1], eio(prog(qq, D[i][0], D[i + 1][0]))); return m; };
  function lightsFor(night) {
    G3.scene.environmentIntensity = 1 - .7 * night; G3.key.intensity = 2.1 * (1 - .78 * night); G3.rim.intensity = 1.2 * (1 - .7 * night);
  }
  function grain(layer, sel) {
    const nz = document.createElement('canvas'); nz.width = nz.height = 180; const nx = nz.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); layer.querySelector(sel).style.backgroundImage = `url(${nz.toDataURL()})`;
  }
  /* paragraphs arrive word by word once the steel is still, and leave before it moves again */
  function wrapBlocks(sel) { return [...R.layer.querySelectorAll(sel)].map(b => { const p = b.querySelector('p'); if (p && !p.dataset.w) { BK2.wrap(p); p.dataset.w = 1; } return { b, w: p ? [...p.querySelectorAll('.w')] : [], n: b.querySelector('h3,.nm') }; }); }
  function stopBlock(o, S, qq, a0 = .26) {
    const inn = prog(qq, S - a0, S - .02), out = ss(qq, S + .18, S + .36), vis = inn > 0 && out < 1;
    o.b.style.visibility = vis ? 'visible' : 'hidden'; if (!vis) return;
    if (o.n) { const t = eo(prog(inn, 0, .6)); o.n.style.opacity = t.toFixed(3); o.n.style.transform = `translate3d(0,${((1 - t) * .22).toFixed(3)}em,0)`; }
    BK2.reveal(o.w, prog(inn, .25, 1), .9); o.b.style.opacity = (1 - out).toFixed(3); o.b.style.transform = `translate3d(0,${(-out * 18).toFixed(1)}px,0)`;
  }
  /* the film hooks every direction returns */
  function hooks(D) {
    return {
      dom: D.dom,
      init(Kk) {
        K0 = Kk; R.layer = Kk.layer; R.gl = Kk.layer.querySelector('.d-gl'); grain(Kk.layer, '.d-grain'); if (D.init) D.init(Kk);
        const go = () => { if (ready || !window.NWF) return; T = window.NWF.THREE; stage(); ready = true; if (K0.W && A) this.layout(K0, A); };
        if (window.NWF) setTimeout(go, 0); else addEventListener('nwf-ready', go, { once: true });
      },
      layout(Kk, a) {
        A = a || A; K0 = Kk; if (!ready || !A || !A.G || !A.G.ok) return;
        G3.renderer.setPixelRatio(Math.min(Kk.dpr, 1.75, Math.sqrt(4e6 / (Kk.W * Kk.H)))); G3.renderer.setSize(Kk.W, Kk.H, false);
        D.build(Kk); X.built = true; X.dirty = true;
        aim(G3.camera, D.cam ? D.cam(4.8) : camState(4.8)); G3.renderer.compile(G3.scene, G3.camera);
        requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
      },
      post(ctx, qq) {
        R.gl.style.opacity = X.built ? Math.max(.002, D.glIn(qq)).toFixed(3) : 0;
        R.layer.querySelector('.d-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
        if (!X.built) return;
        D.entrance(ctx, qq);
        X.qq = qq; D.render(qq); G3.scene.environmentRotation.copy(G3.camera.rotation); G3.renderer.render(G3.scene, G3.camera); if (D.after) D.after(qq);
      },
      take: qq => !!X.built && qq > 2.55,
      live: () => { const d = X.dirty; X.dirty = false; return !!d; }
    };
  }
  window.__nw = { X: () => X, G3: () => G3, render: qq => { X.qq = qq; }, camState, keys: () => KEYS };
  /* ======== end of kit ======== */
