/* 19 — THE TOWER (Elevation, second development)
   One building, six elevations. A dark hexagonal tower stands at the centre of the section; each of its faces is one elevation:
   the bridge's sentence, the heading, and the four services. The camera makes one continuous turntable orbit, 60° per face, lit
   like a model on a stand: the lights travel with the camera, so every face is shown square, in true colour, with real shadow.
   Arriving at a face, its construction slides out of the tower toward you like drawers; leaving, it slides back in.

   SCRIPT (section time q; stops are where the film rests)
   2.55  The bridge's last frame is handed to identical plates standing in front of the dark tower (invisible swap).
   2.55–3.90  SIGNATURE I, "the sentence was a building": the camera eases back and climbs; the four lines turn out to stand at four
         depths, cast in cream with the red plate as their body, in front of a tower that was always there in the dark. As the turn
         begins the lines slide into the tower one after another, and the heading's face comes round: red slab, cream square, type.
   → WEBSITES 4.80  The cream slab slides out first, then the word: its front half cream on the dark, its back half ink on the
         slab; it is one word only from square-on, and the front half's shadow falls across the slab.
   → PHOTOGRAPHY 5.70  SIGNATURE II, "the lens": the camera dips close; five discs travel out of the tower along one optical
         axis, deepest first, and lock as concentric rings exactly as the camera comes square; each ring throws a crescent shadow
         on the one behind it, so the flat target still reads as depth.
   → REBUILDS 6.60  The camera climbs over the top; six bars come out crooked and spring true into one solid block.
   → CARE 7.50  The lights go down. A cream column rises from below; a small red light switches on in front of it and washes the
         column red.
   → PLAN 8.50  SIGNATURE III, "the full stop": the camera rises over the tower and looks straight down. The red hexagonal cap —
         a full stop seen from above — sits in the middle; the four services lie on the ground around it, each on its own side,
         the heading above. The section ends where the bridge's sentence ended: on a full stop. */
window.NG_EXT = (() => {
  const { OFFERS, HEADING } = NGL;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static/.test(location.search);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const INK = '#17150f', CREAM = '#e9e1ce', RED = '#c0230b', CREAM_S = '#a89d85', RED_S = '#6e1406', INK_S = '#0b0a07';
  const FOV = 26, R0 = 2900, APO = 420, TH = 1500;              /* camera distance at the stops; tower apothem and height */
  const ST = { head: 3.9, svc: [4.8, 5.7, 6.6, 7.5], plan: 8.5 };
  const SIDE = { thesis: 0, head: 1, web: 2, photo: 3, reb: 4, care: 5 };
  const STOP = { thesis: 2.55, head: ST.head, web: ST.svc[0], photo: ST.svc[1], reb: ST.svc[2], care: ST.svc[3] };
  /* the orbit: one key per face; between faces the camera eases back and climbs or dips (ph: degrees, rb: pull-back) */
  const KEYS = [
    { q: 2.55, th: 0, ph: 0, r: R0, ty: 0 },
    { q: ST.head, th: 60, ph: 0, r: R0, ty: 0, bump: 17, rb: .34 },
    { q: ST.svc[0], th: 120, ph: 0, r: R0, ty: 0, bump: -8, rb: .16 },
    { q: ST.svc[1], th: 180, ph: 0, r: R0, ty: 0, bump: 6, rb: -.1 },
    { q: ST.svc[2], th: 240, ph: 0, r: R0, ty: 0, bump: 24, rb: .2 },
    { q: ST.svc[3], th: 300, ph: 0, r: R0, ty: 0, bump: -10, rb: .1 },
    { q: ST.plan, th: 360, ph: 89.4, r: 3200, ty: TH / 2, bump: 0, rb: .12 }
  ];
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = { els: [] }, q = 0, ready = false;

  const dom = `<canvas class="tw-gl" id="twGl" aria-hidden="true"></canvas><div class="tw-grain" aria-hidden="true"></div>
  <div class="tw-hud">
    <h2 class="tw-sr">${HEADING}</h2>
    ${OFFERS.map(o => `<section class="tw-sr"><h3>${o.name}</h3><p>${o.body}</p></section>`).join('')}
    <a class="tw-end" id="twEnd" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need <span aria-hidden="true">↗</span></a>
  </div>`;

  /* ---------------- type as texture: white glyphs, tinted by the material, drawn at 2.5× for crisp edges ---------------- */
  function textTex(lines, px, weight, ls, lh, maxW) {
    const S = 2.5, c = document.createElement('canvas'), x = c.getContext('2d');
    const font = `${weight} ${px * S}px 'Instrument Sans', sans-serif`;
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = (ls * px * S) + 'px';
    if (maxW) {                                                           /* wrap by whole words; a word never breaks */
      const out = []; let cur = '';
      lines[0].split(' ').forEach(w => { const t = cur ? cur + ' ' + w : w; if (cur && x.measureText(t).width > maxW * S) { out.push(cur); cur = w; } else cur = t; });
      if (cur) out.push(cur); lines = out;
    }
    const w = Math.ceil(Math.max(...lines.map(l => x.measureText(l).width)) / S + px * .12), h = Math.ceil(px * lh * (lines.length - 1) + px * 1.12);
    c.width = Math.ceil(w * S); c.height = Math.ceil(h * S);
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = (ls * px * S) + 'px';
    x.fillStyle = '#fff'; x.textBaseline = 'alphabetic';
    lines.forEach((l, i) => x.fillText(l, px * .04 * S, (px * .9 + i * px * lh) * S));
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = T.LinearMipmapLinearFilter;
    return { tex, w, h };
  }

  /* ---------------- construction kit (all sizes in screen px at the element's stop; the group is scaled to world) ---------------- */
  const lam = col => new T.MeshLambertMaterial({ color: col });
  function box(w, h, d, col) {
    const g = new T.Group(), geo = new T.BoxGeometry(w, h, d); geo.translate(0, 0, -d / 2);
    const m = new T.Mesh(geo, lam(col)); m.castShadow = m.receiveShadow = true; g.add(m); g.userData.mats = [m.material]; return g;
  }
  function disc(dia, d, col) {
    const g = new T.Group(), geo = new T.CylinderGeometry(dia / 2, dia / 2, d, 128); geo.rotateX(PI / 2); geo.translate(0, 0, -d / 2);
    const m = new T.Mesh(geo, lam(col)); m.castShadow = m.receiveShadow = true; g.add(m); g.userData.mats = [m.material]; return g;
  }
  /* a solid word: an exact-colour face and a tinted body of layers behind it; region crops the texture (for the split word) */
  function word(t, col, side, depth, region = [0, 1]) {
    const g = new T.Group(), n = depth ? 7 : 0, w = t.w * (region[1] - region[0]), mats = [];
    const tex = region[0] === 0 && region[1] === 1 ? t.tex : (() => { const c = t.tex.clone(); c.needsUpdate = true; c.repeat.set(region[1] - region[0], 1); c.offset.set(region[0], 0); return c; })();
    const geo = new T.PlaneGeometry(w, t.h);
    const depthMat = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: tex, alphaTest: .5 });
    for (let j = n; j >= 0; j--) {
      const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex, color: j ? side : col, transparent: true, depthWrite: true }));
      m.position.z = -j * depth / Math.max(n, 1); m.castShadow = !j; m.customDepthMaterial = depthMat; g.add(m); mats.push(m.material);
    }
    g.userData.mats = mats; g.userData.w = w; g.userData.h = t.h; return g;
  }

  /* where an element sits: its centre at a screen point (NDC) and a depth from that face's stop camera; it faces that camera */
  function stopCam(side) {
    const th = side * 60 * DEG, V = T.Vector3;
    return { pos: new V(Math.sin(th) * R0, 0, Math.cos(th) * R0), fwd: new V(-Math.sin(th), 0, -Math.cos(th)), right: new V(Math.cos(th), 0, -Math.sin(th)), up: new V(0, 1, 0) };
  }
  function pose(side, fx, fy, depth) {
    const c = stopCam(side), t = Math.tan(FOV / 2 * DEG), asp = K0.W / K0.H, nx = fx * 2 - 1, ny = 1 - fy * 2;
    const p = c.pos.clone().addScaledVector(c.fwd, depth).addScaledVector(c.right, nx * depth * t * asp).addScaledVector(c.up, ny * depth * t);
    const qt = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(c.right, c.up, c.fwd.clone().negate()));
    return { p, qt, s: 2 * depth * t / K0.H, side };
  }
  function add(scene, obj, P, opt = {}) {
    obj.position.copy(P.p); obj.quaternion.copy(P.qt); obj.scale.setScalar(P.s); G3.scene.add(obj);
    const e = { scene, obj, home: P, i: X.els.filter(x => x.scene === scene).length, ...opt }; X.els.push(e); return e;
  }

  function build3D() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.NoToneMapping;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(FOV, 1, 50, 30000);
    /* turntable lighting: ambient + a key fixed to the camera (upper left). Facing surfaces resolve to exact brand colour
       (ambient + key·cos = π), sides fall into tonal steps, anything in shadow keeps 55% */
    const amb = new T.AmbientLight('#ffffff', .55 * PI); scene.add(amb);
    const key = new T.DirectionalLight('#ffffff', .45 * PI / (1 / Math.hypot(.36, .48, 1))); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -2600; key.shadow.camera.right = 2600; key.shadow.camera.top = 2600; key.shadow.camera.bottom = -2600;
    key.shadow.camera.near = 100; key.shadow.camera.far = 12000; key.shadow.bias = -.0004; key.shadow.normalBias = 1.5; key.shadow.radius = 6;
    scene.add(key, key.target);
    const lamp = new T.PointLight(RED, 0, 1250, 1.8); scene.add(lamp);
    G3 = { renderer, scene, camera, amb, key, lamp };
  }

  function build(K) {
    const W = K.W, H = K.H, vw = W / 100, G = A.G, dpr = K.dpr, sc = G3.scene;
    X.els.forEach(e => sc.remove(e.obj)); X.els = []; if (X.tower) sc.remove(X.tower); (X.labels || []).forEach(l => sc.remove(l.m));

    /* THE TOWER: six flat faces, an ink body, a red cap */
    const tower = new T.Group(), rc = APO / Math.cos(PI / 6);
    const body = new T.Mesh(new T.CylinderGeometry(rc, rc, TH, 6, 1), new T.MeshLambertMaterial({ color: '#25211a', flatShading: true }));
    body.rotation.y = PI / 6; body.castShadow = body.receiveShadow = true; tower.add(body);
    const cap = new T.Mesh(new T.CircleGeometry(rc * .999, 6), new T.MeshBasicMaterial({ color: RED }));
    cap.rotation.x = -PI / 2; cap.rotation.z = PI / 6 - PI / 2; cap.position.y = TH / 2 + 1; tower.add(cap);
    sc.add(tower); X.tower = tower; X.cap = cap;

    /* THESIS: the bridge's own plates, pixel for pixel, each line at its own depth in front of the tower */
    G.L.forEach((L, i) => {
      const w = L.C.width / dpr, h = L.HH / dpr, cx = (L.x - L.pad + w / 2) / W, cy = (L.y0 + h / 2) / H;
      const t = { tex: new T.CanvasTexture(L.C), w, h }; t.tex.colorSpace = T.SRGBColorSpace;
      const r = new T.CanvasTexture(L.R); r.colorSpace = T.SRGBColorSpace;
      const g = word(t, '#ffffff', '#ffffff', 0); const body = word({ tex: r, w, h }, '#ffffff', '#ffffff', 0);
      const grp = new T.Group(); grp.add(g);
      for (let j = 1; j <= 7; j++) { const b = body.clone(); b.position.z = -j * 6; grp.add(b); }
      grp.userData.mats = []; grp.traverse(o => { if (o.material) grp.userData.mats.push(o.material); });
      add('thesis', grp, pose(0, cx, cy, 1650 + i * 150), { line: i });
    });
    {
      const xs = G.sub.map(o => o.x), ys = G.sub.map(o => o.y), x0 = Math.min(...xs) - 4, x1 = Math.max(...G.sub.map(o => o.x + o.ww)) + 4, y0 = Math.min(...ys) - G.sf * 1.1, y1 = Math.max(...ys) + G.sf * .45;
      const c = document.createElement('canvas'); c.width = Math.ceil((x1 - x0) * dpr); c.height = Math.ceil((y1 - y0) * dpr);
      const x = c.getContext('2d'); x.scale(dpr, dpr); x.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; x.fillStyle = CREAM; x.globalAlpha = .92;
      G.sub.forEach(o => x.fillText(o.w, o.x - x0, o.y - y0));
      const t = { tex: new T.CanvasTexture(c), w: x1 - x0, h: y1 - y0 }; t.tex.colorSpace = T.SRGBColorSpace;
      add('thesis', word(t, '#ffffff', '#ffffff', 0), pose(0, (x0 + x1) / 2 / W, (y0 + y1) / 2 / H, 1550), { line: 4 });
    }

    /* HEADING (face 1): a tall red slab well back, a cream block floating in front of it, the line in cream */
    add('head', box(.17 * W, .78 * H, 70, RED), pose(1, .74, .5, 2180));
    add('head', box(.075 * W, .075 * W, 60, CREAM), pose(1, .655, .69, 1700));
    const ht = textTex(['What you can', 'hire us for.'], 10.6 * vw, 700, -.06, .9);
    add('head', word(ht, CREAM, CREAM_S, 40), pose(1, .05 + ht.w / W / 2, .5, 1500), { name: 'head' });

    /* WEBSITES (face 2): one word, two depths; it is whole only from square on */
    const edge = .5, wt = textTex(['Websites'], 14.6 * vw, 700, -.06, 1), wl = .05, cut = (edge - wl) * W / wt.w;
    add('web', box(.44 * W, .8 * H, 50, CREAM), pose(2, .72, .5, 2160), { lead: 1 });
    const wf = word(wt, CREAM, CREAM_S, 34, [0, cut]), wb = word(wt, INK, INK, 0, [cut, 1]);
    add('web', wf, pose(2, wl + (wf.userData.w / W) / 2, .37, 1820), { name: 0, split: 1 });
    add('web', wb, pose(2, edge + (wb.userData.w / W) / 2, .37, 2140), { back: 1 });
    const wp = textTex([OFFERS[0].body], 17, 400, -.005, 1.5, .31 * W);
    add('web', word(wp, INK, INK, 0), pose(2, .57 + wp.w / W / 2, .69, 2140), { para: 1 });
    add('web', box(.045 * W, .045 * W, 40, RED), pose(2, .455, .8, 1450));

    /* PHOTOGRAPHY (face 3): five discs on one optical axis; square on they are concentric rings */
    [[.88, RED, 2290], [.66, INK, 2100], [.46, RED, 1910], [.25, CREAM, 1720], [.085, INK, 1530]].forEach(([d, col, z], i) =>
      add('photo', disc(d * H, 46, col), pose(3, .69, .5, z), { ring: i }));
    const pt = textTex(['Photography'], 10.4 * vw, 700, -.06, 1);
    add('photo', word(pt, CREAM, CREAM_S, 34), pose(3, .05 + pt.w / W / 2, .78, 1400), { name: 1 });
    const pp = textTex([OFFERS[1].body], 17, 400, -.005, 1.5, .3 * W);
    add('photo', word(pp, CREAM, CREAM, 0), pose(3, .05 + pp.w / W / 2, .27, 1500), { para: 1 });

    /* REBUILDS (face 4): six bars, crooked on arrival, trued into one block */
    const top = .16, bot = .84, n = 6, gap = .02, bh = (bot - top - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const y = top + bh / 2 + i * (bh + gap), col = i === 3 ? RED : CREAM;
      add('reb', box(.36 * W, bh * H, 80, col), pose(4, .74, y, 1750 + (i % 3) * 150), { bar: i, rz0: [-11, 8, -6, 13, -9, 6][i], dx0: [-.09, .07, -.05, .1, -.08, .05][i] });
    }
    const rt = textTex(['Rebuilds'], 12 * vw, 700, -.06, 1);
    add('reb', word(rt, CREAM, CREAM_S, 34), pose(4, .05 + rt.w / W / 2, .35, 1450), { name: 2 });
    const rp = textTex([OFFERS[2].body], 17, 400, -.005, 1.5, .32 * W);
    add('reb', word(rp, CREAM, CREAM, 0), pose(4, .05 + rp.w / W / 2, .66, 1500), { para: 1 });

    /* CARE (face 5): night; a cream column rising from below, a small red light in front of it */
    add('care', box(.16 * W, 1.05 * H, 70, CREAM), pose(5, .72, .6, 2150), { rise: 1 });
    add('care', box(.042 * W, .042 * W, 40, RED), pose(5, .72, .27, 1500), { light: 1 });
    const ct = textTex(['Care'], 21 * vw, 700, -.06, 1);
    add('care', word(ct, RED, RED_S, 40), pose(5, .05 + ct.w / W / 2, .37, 1450), { name: 3 });
    const cp = textTex([OFFERS[3].body], 17, 400, -.005, 1.5, .32 * W);
    add('care', word(cp, CREAM, CREAM, 0), pose(5, .05 + cp.w / W / 2, .69, 1500), { para: 1 });

    /* THE PLAN: six labels lie along the six edges of the cap, read from straight above; the sentence's side carries the link */
    const thf = 0, rpl = KEYS[KEYS.length - 1].r, upp = 2 * rpl * Math.tan(FOV / 2 * DEG) / H, gy = TH / 2 + 3;
    const screenUp = new T.Vector3(-Math.sin(thf), 0, -Math.cos(thf));
    X.labels = [['What you can hire us for.', 1, 30], ['Websites', 2, 38], ['Photography', 3, 38], ['Rebuilds', 4, 38], ['Care', 5, 38]].map(([txt, side, px], i) => {
      const t = textTex([txt], px, 700, -.045, 1), m = word(t, side === 5 ? RED : CREAM, side === 5 ? RED_S : CREAM_S, 0);
      const th = side * 60 * DEG, out = new T.Vector3(Math.sin(th), 0, Math.cos(th)), tan = new T.Vector3(Math.cos(th), 0, -Math.sin(th));
      let up = out.clone(), x = tan.clone().negate();                       /* right-handed: x × up = world up, so the face looks at the sky */
      if (up.dot(screenUp) < -.01) { up.negate(); x.negate(); }               /* never upside down from above */
      const qt = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x, up, new T.Vector3(0, 1, 0)));
      const wpx = t.h * upp, p = new T.Vector3(0, gy, 0).addScaledVector(out, APO + 26 * upp + wpx / 2);
      m.quaternion.copy(qt); m.position.copy(p); m.scale.setScalar(upp); m.visible = false; sc.add(m);
      return { m, p, s: upp, i };
    });
    X.linkAt = new T.Vector3(0, gy, APO + 60 * upp);
    X.els.forEach(e => { e.side = SIDE[e.scene]; e.core = new T.Vector3(0, e.obj.position.y * .2, 0); });
    X.built = true;
  }

  /* ---------------- choreography ---------------- */
  function rig(qq) {
    let i = 0; while (i < KEYS.length - 2 && qq >= KEYS[i + 1].q) i++;
    const a = KEYS[i], b = KEYS[i + 1], u = eio(prog(qq, a.q, b.q)), arc = Math.sin(PI * u);
    return { th: lerp(a.th, b.th, u), ph: lerp(a.ph, b.ph, u) + (b.bump || 0) * arc, r: lerp(a.r, b.r, u) * (1 + (b.rb || 0) * arc), ty: lerp(a.ty, b.ty, u) };
  }
  function placeCam(r) {
    const th = r.th * DEG, ph = r.ph * DEG, c = G3.camera, tgt = new T.Vector3(0, r.ty, 0);
    c.position.set(Math.sin(th) * Math.cos(ph) * r.r, Math.sin(ph) * r.r + r.ty, Math.cos(th) * Math.cos(ph) * r.r);
    c.up.set(r.ph > 80 ? -Math.sin(th) : 0, r.ph > 80 ? 0 : 1, r.ph > 80 ? -Math.cos(th) : 0);
    c.lookAt(tgt); c.updateMatrixWorld();
    /* the key light rides with the camera, upper left of it */
    const dir = new T.Vector3(-.36, .48, 1).normalize().transformDirection(c.matrixWorld);
    G3.key.position.copy(tgt).addScaledVector(dir, 6000); G3.key.target.position.copy(tgt); G3.key.target.updateMatrixWorld();
  }

  const spring = t => t >= 1 ? 1 : 1 - Math.exp(-7 * t) * Math.cos(t * 11);
  function stateOf(e, qq) {
    const S = STOP[e.scene], h = e.home, V = T.Vector3;
    let a, p = h.p.clone(), s = h.s, qt = h.qt.clone(), rz = 0;
    if (e.scene === 'thesis') a = 1 - eio(prog(qq, 2.95 + e.line * .07, 3.42 + e.line * .06));
    else {
      /* out of the tower: staggered, the lead element first; back in after the stop */
      const st = e.lead ? -.05 : e.ring !== undefined ? e.ring * .07 : e.bar !== undefined ? e.bar * .035 : e.name !== undefined ? .1 : e.para ? .16 : e.back ? .02 : .05;
      const ain = eo(prog(qq, S - .8 + st, S - .14 + st * .4)), aout = eio(prog(qq, S + .44 + st * .3, S + .86 + st * .3));
      a = Math.min(ain, 1 - aout);
      if (e.bar !== undefined) { const u = prog(qq, S - .5 + e.bar * .035, S - .02); rz = e.rz0 * (1 - spring(u)); p.addScaledVector(stopCam(e.side).right, e.dx0 * K0.W * h.s * (1 - eo(u))); }
      if (e.rise && qq < S + .1) { p.y -= 1700 * (1 - eo(prog(qq, S - .7, S - .08))); a = Math.max(a, prog(qq, S - .7, S - .6)); }
    }
    /* retracted = inside the tower: slide along the line to the core and shrink */
    const k = e.rise && qq < S + .1 ? 1 : a;
    p.lerp(e.core, 1 - k); s *= lerp(.04, 1, k);
    if (rz) qt.multiply(new T.Quaternion().setFromAxisAngle(new V(0, 0, 1), rz * DEG));
    return { p, s, qt, vis: s > h.s * .045 };
  }

  function render(qq) {
    if (!ready || !X.built) return;
    const r = rig(qq); placeCam(r);
    for (const e of X.els) {
      const st = stateOf(e, qq); e.obj.visible = st.vis && (e.scene !== 'thesis' || qq >= 2.55);
      if (!e.obj.visible) continue;
      e.obj.position.copy(st.p); e.obj.scale.setScalar(st.s); e.obj.quaternion.copy(st.qt);
    }
    /* night for Care: the room dims, the red light comes on (two short steps, like a switch), and holds into the plan */
    const night = ss(qq, ST.svc[3] - .5, ST.svc[3] - .1) * (1 - ss(qq, ST.svc[3] + .4, ST.plan - .1));
    G3.amb.intensity = .55 * PI * (1 - .55 * night); G3.key.intensity = .45 * PI * Math.hypot(.36, .48, 1) * (1 - .62 * night);
    const sw = prog(qq, ST.svc[3] - .16, ST.svc[3] - .02), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .15 : sw < .75 ? .7 : 1;
    const le = X.els.find(e => e.light);
    if (le) { G3.lamp.position.copy(le.obj.position).add(new T.Vector3(0, 0, 0)); G3.lamp.intensity = 3e5 * on * (1 - ss(qq, ST.svc[3] + .3, ST.svc[3] + .6)); }
    /* plan labels: they slide out from under the cap's edges as the camera reaches the top */
    X.labels.forEach(l => {
      const u = eo(prog(qq, ST.plan - .42 + l.i * .05, ST.plan - .08 + l.i * .02));
      l.m.visible = u > .01; if (!l.m.visible) return;
      l.m.position.copy(l.p).multiplyScalar(lerp(.55, 1, u)).setY(l.p.y); l.m.scale.setScalar(l.s * lerp(.7, 1, u));
      l.m.children.forEach(c => { c.material.opacity = u; });
    });
    G3.renderer.render(G3.scene, G3.camera);
    const lp = X.linkAt.clone().project(G3.camera);
    R.end.style.left = ((lp.x + 1) / 2 * K0.W).toFixed(1) + 'px'; R.end.style.top = ((1 - lp.y) / 2 * K0.H).toFixed(1) + 'px';
    const end = qq >= ST.plan - .08; R.end.classList.toggle('is-on', end); R.end.tabIndex = end ? 0 : -1;
  }

  function init(K) {
    K0 = K; R.gl = K.el('twGl'); R.end = K.el('twEnd');
    /* film grain, the same fine speck as the bridge's dust, laid over the whole scene */
    const n = document.createElement('canvas'); n.width = n.height = 180; const nx = n.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); K.layer.querySelector('.tw-grain').style.backgroundImage = `url(${n.toDataURL()})`;
    const go = () => { if (ready || !window.NWF) return; T = window.NWF.THREE; build3D(); ready = true; if (K0.W && A) layout(K0, A); };
    if (window.NWF) setTimeout(go, 0); else addEventListener('nwf-ready', go, { once: true });
  }
  function layout(K, a) {
    A = a || A; K0 = K; if (!ready || !A || !A.G || !A.G.ok) return;
    G3.renderer.setPixelRatio(K.dpr); G3.renderer.setSize(K.W, K.H, false); G3.camera.aspect = K.W / K.H; G3.camera.updateProjectionMatrix();
    build(K); X.dirty = true;
    /* ask the film for one fresh frame so the bridge hands over even if the page is not scrolling */
    requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
  }
  function post(ctx, qq) {
    q = qq;
    R.gl.style.opacity = qq > 2.545 && X.built ? 1 : 0;
    render(qq);
  }
  window.__tw = () => ({ X, G3, q });
  return { dom, init, layout, post, take: qq => !!X.built && qq > 2.55, live: () => { const d = X.dirty; X.dirty = false; return !!d; } };
})();
