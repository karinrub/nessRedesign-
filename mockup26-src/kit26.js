  /* ======== KIT 26: the plumbing the Offers film shares (many separate strands, the camera, the film hooks). The film itself is not here. ======== */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const CREAM = '#e9e1ce', RED = '#c0230b', INK = '#17150f';
  const { OFFERS, HEADING } = NGL;
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;
  const V3 = (...a) => new T.Vector3(...a);

  /* camera keys: {q, p, t, f, s:[shiftX, shiftY], stop, d:[x,y,z], r}. d and r are the red dot's place and size. */
  let KEYS = [], posCurve, tgtCurve, dotCurve;
  function setKeys(keys) {
    KEYS = keys.map(k => ({ ...k, p: V3(...k.p), t: V3(...k.t), d: V3(...(k.d || [0, 0, 0])) }));
    const cr = a => new T.CatmullRomCurve3(a, false, 'centripetal');
    posCurve = cr(KEYS.map(k => k.p)); tgtCurve = cr(KEYS.map(k => k.t)); dotCurve = cr(KEYS.map(k => k.d));
  }
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a, qv = b === a ? KEYS[a].q : lerp(KEYS[a].q, KEYS[b].q, eio(prog(qq, KEYS[a].q, KEYS[b].q)));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q), u = (i + l) / (n - 1);
    return { p: posCurve.getPoint(u), t: tgtCurve.getPoint(u), d: dotCurve.getPoint(u), r: lerp(k0.r || 0, k1.r || 0, l), f: lerp(k0.f, k1.f, l), sx: lerp(k0.s[0], k1.s[0], l), sy: lerp(k0.s[1], k1.s[1], l) };
  }
  function aim(c, st) {
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); c.near = .5; c.far = 9000; c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); c.updateMatrixWorld(true);
  }

  /* the steel: the hero's material. Each ring carries aM, the film time at which it is drawn (the construction plays as q runs);
     four story lights keep the sculpture being read lit and let the others wait in the dark; uInfl thickens every strand
     as the camera leaves, so the wire never thins to a hair. */
  function stage() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    X.u = { rev: { value: -1e9 }, F: { value: [0, 1, 2, 3].map(() => new T.Vector4(0, 0, 0, 0)) }, fr: { value: [100, 100, 100, 100] }, dim: { value: 1 }, infl: { value: 0 } };
    const tooling = studio.silver.onBeforeCompile;
    studio.silver.onBeforeCompile = (sh, r) => {
      tooling(sh, r); Object.assign(sh.uniforms, { uRev: X.u.rev, uF: X.u.F, uFr: X.u.fr, uDim: X.u.dim, uInfl: X.u.infl });
      sh.vertexShader = 'attribute float aM;\nvarying float vM;\nvarying vec3 vFp;\nuniform float uInfl;\n' + sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vM = aM; transformed += objectNormal * uInfl;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFp = worldPosition.xyz;');
      sh.fragmentShader = 'uniform float uRev, uDim, uInfl;\nuniform float uFr[4];\nuniform vec4 uF[4];\nvarying float vM;\nvarying vec3 vFp;\n' + sh.fragmentShader
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n  if (vM > uRev || distance(vFp, cameraPosition) < 52.0) discard;')
        .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n  float lit = 0.0; for (int i = 0; i < 4; i++) lit = max(lit, uF[i].w * (1.0 - smoothstep(uFr[i], uFr[i] * 1.5, distance(vFp, uF[i].xyz))));\n  gl_FragColor.rgb *= mix(uDim, 1.0, lit);');
    };
    studio.silver.customProgramCacheKey = () => 'nk26';
    const camera = new T.PerspectiveCamera(30, 1, .5, 9000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    const dimSteel = studio.silver.clone(); dimSteel.onBeforeCompile = studio.silver.onBeforeCompile; dimSteel.customProgramCacheKey = studio.silver.customProgramCacheKey;
    dimSteel.color.multiplyScalar(.5); dimSteel.envMapIntensity = .5;
    G3 = { renderer, scene, camera, studio, key, rim, lamp, dimSteel };
  }

  /* the barb, lighter: the hero's two-turn barb with a fifth of the triangles (there are thousands of them here) */
  function lightBarb() {
    const pos = [], nor = [], uv = [], idx = []; let base = 0;
    for (let piece = 0; piece < 2; piece++) {
      const pts = [], start = piece === 0 ? -.53 : .02, roll = piece * PI * .5 + .26, at = (x, r, a) => V3(x, r * Math.cos(a), r * Math.sin(a));
      pts.push(at(start - .31, 1.48, roll - .48), at(start - .20, 1.07, roll - .26), at(start - .08, .66, roll - .07));
      for (let j = 0; j <= 72; j++) pts.push(at(start + j / 72 * .50, .48, roll + j / 72 * PI * 4));
      pts.push(at(start + .58, .65, roll + .09), at(start + .70, 1.02, roll + .32), at(start + .82, 1.43, roll + .54));
      const g = new T.TubeGeometry(new T.CatmullRomCurve3(pts, false, 'centripetal'), 60, .098, 6, false);
      pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); uv.push(...g.attributes.uv.array);
      g.index.array.forEach(i => idx.push(i + base)); base += g.attributes.position.count; g.dispose();
    }
    const m = new T.BufferGeometry(); m.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); m.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); m.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); m.setIndex(idx); return m;
  }
  /* one sculpture: N separate wires, each a strand of a form. place(i, s) is the film time that point is drawn. */
  function sculpture(key, form, world, { step = .6, every = 5.6, radius = .17, place, t0 = 0, dim = false }) {
    const group = new T.Group(); group.position.set(...world.p); group.rotation.y = world.yaw || 0; group.visible = false; G3.scene.add(group);
    const tmp = V3(), strands = [], S = { key, form, group, strands, t: t0, lo: 1e9, hi: -1e9 };
    for (let i = 0; i < form.N; i++) {
      let len = 0; const n = 70; let prev = null;
      for (let k = 0; k <= n; k++) { form.at(i, k / n, t0, tmp); if (prev) len += tmp.distanceTo(prev); prev = (prev || V3()).copy(tmp); }
      const segs = clamp(Math.ceil(len / step), 40, 1100), nb = Math.max(1, Math.round(len / every));
      const wire = window.NWF.createSteelWire(dim ? { ...G3.studio, silver: G3.dimSteel } : G3.studio, { segments: segs, barbs: nb, radius, pitch: 2.65 * radius / .23 });
      wire.knots.geometry = G3.barbGeo || (G3.barbGeo = lightBarb());
      const ph = .12 + .76 * ((i * .618034) % 1);
      wire.setBarbPositions(Array.from({ length: nb }, (_, k) => (k + ph) / nb));
      const caps = []; let tubes = 0;
      wire.group.children.forEach(ch => {
        if (ch.isInstancedMesh) return;
        const g = ch.geometry, n2 = g.attributes.position.count;
        if (n2 === (segs + 1) * 14) {
          const am = new Float32Array(n2); for (let r = 0; r <= segs; r++) { const m = place(i, r / segs); for (let j = 0; j < 14; j++) am[r * 14 + j] = m; }
          g.setAttribute('aM', new T.BufferAttribute(am, 1)); tubes++;
        } else caps.push(ch);
      });
      const st = { i, wire, segs, nb, caps, barbQ: wire.offsets.map(o => place(i, o)), base: null, key: '', q0: place(i, 0), q1: place(i, 1) };
      st.lo = Math.min(st.q0, st.q1); st.hi = Math.max(st.q0, st.q1); S.lo = Math.min(S.lo, st.lo); S.hi = Math.max(S.hi, st.hi);
      st.sample = (u, out) => form.at(i, clamp(u), S.t, out);
      wire.update(st.sample); group.add(wire.group); strands.push(st);
    }
    S.setT = tt => { if (tt === S.t) return; S.t = tt; strands.forEach(st => { st.wire.update(st.sample); st.base = null; st.key = ''; }); };
    /* show what has been drawn at film time q: barbs grow in behind the drawing, end caps appear with the ends */
    S.show = qq => {
      group.visible = qq >= S.lo - .01;
      if (!group.visible) return;
      const mt = new T.Matrix4(), sv = V3();
      strands.forEach(st => {
        const k = qq < st.lo - .02 ? 'n' : qq > st.hi + .3 ? 'd' + (st.base ? 1 : 0) : qq.toFixed(2);
        const vis = qq >= st.lo - .02; st.wire.group.visible = vis; if (!vis) return;
        if (k === st.key) return; st.key = k;
        const kn = st.wire.knots;
        if (!st.base) { st.base = []; for (let b = 0; b < st.nb; b++) { kn.getMatrixAt(b, mt); st.base[b] = mt.clone(); } }
        for (let b = 0; b < st.nb; b++) { const s = ss(qq, st.barbQ[b] - .02, st.barbQ[b] + .16); mt.copy(st.base[b]).scale(sv.setScalar(Math.max(.001, s * .8))); kn.setMatrixAt(b, mt); }
        kn.instanceMatrix.needsUpdate = true;
        st.caps.forEach((c, ci) => { c.visible = qq >= (ci % 2 ? st.q1 : st.q0) + (ci % 2 ? 0 : 0); });
      });
    };
    return S;
  }
  /* a flat red disc that always faces the camera: the film's one recurring point */
  function dot() {
    X.dot = new T.Mesh(new T.CircleGeometry(1, 96), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); G3.scene.add(X.dot);
  }
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
        const tb = performance.now(); D.build(Kk); window.__nw.buildMs = Math.round(performance.now() - tb); X.built = true; X.dirty = true;
        aim(G3.camera, camState(4.8)); G3.renderer.compile(G3.scene, G3.camera);
        requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
      },
      post(ctx, qq) {
        R.gl.style.opacity = X.built ? Math.max(.002, D.glIn(qq)).toFixed(3) : 0;
        R.layer.querySelector('.d-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
        if (!X.built) return;
        D.entrance(ctx, qq);
        X.qq = qq; D.render(qq); G3.scene.environmentRotation.copy(G3.camera.rotation); G3.renderer.render(G3.scene, G3.camera); if (D.after) D.after(ctx, qq);
      },
      take: qq => !!X.built && qq > 2.55,
      live: () => { const d = X.dirty; X.dirty = false; return !!d; }
    };
  }
  window.__nw = { render: qq => { X.qq = qq; }, X: () => X, G3: () => G3, camState, keys: () => KEYS };
  /* ======== end of kit ======== */
