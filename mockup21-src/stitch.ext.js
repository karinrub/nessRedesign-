/* 21 — THE STITCH (Offers; script in mockup21-src/SCRIPT.md)
   The bridge says people meet a business in pieces; Offers answers: we join the pieces. The page is a surface, the
   hero's barbed wire returns whole as a steel thread, and it stitches through the page: each service is the stitch it
   describes, and the section ends by pulling back to show that every frame was one poster sewn by one thread.
   The thread is the only 3D object. The camera always faces the page square, so every word stays flat. */
window.NG_EXT = (() => {
  const { OFFERS, HEADING } = NGL;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const CREAM = '#e9e1ce', RED = '#c0230b';
  const ST = { swap: 2.55, head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, end: 8.5 };
  const K = 22;                                   /* page px per wire unit: the steel is about 20px thick at 1x */
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;

  const dom = `<canvas class="sw-gl" id="swGl" aria-hidden="true"></canvas><div class="sw-grain" aria-hidden="true"></div>
  <div class="sw-hud" id="swHud">
    <h2 class="sw-sr">${HEADING}</h2>
    <div class="sw-page sw-head" id="swHead" aria-hidden="true"><span class="sw-mask sw-mask--up"><span>What you can</span></span><span class="sw-mask sw-mask--down"><span>hire us for.</span></span></div>
    ${OFFERS.map((o, i) => `<section class="sw-page sw-blk" id="swB${i}"><h3 class="sw-sr">${o.name}</h3><p class="sw-p">${o.body}</p></section>`).join('')}
    <a class="sw-page sw-end" id="swEnd" href="mailto:hello@nessmaui.com" tabindex="-1"><span>Tell us what</span> <span>you need<i class="sw-dot" id="swDot"></i></span></a>
    <ol class="sw-rail" id="swRail" aria-hidden="true">${OFFERS.map(o => `<li>${o.name}</li>`).join('')}</ol>
  </div>`;

  /* ---------------- flat type on the page (a texture on a plane that always faces the camera square) ---------------- */
  function textTex(txt, px, color) {
    const S = Math.max(2, K0.dpr), c = document.createElement('canvas'), x = c.getContext('2d');
    const font = `700 ${px * S}px 'Instrument Sans', sans-serif`, ls = -.055 * px * S;
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = ls + 'px';
    const w = Math.ceil(x.measureText(txt).width / S + px * .1), h = Math.ceil(px * 1.18);
    c.width = Math.ceil(w * S); c.height = Math.ceil(h * S);
    x.font = font; if ('letterSpacing' in x) x.letterSpacing = ls + 'px'; x.fillStyle = color; x.textBaseline = 'alphabetic';
    x.fillText(txt, px * .03 * S, px * .92 * S);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = T.LinearMipmapLinearFilter;
    return { tex, w, h, base: px * .92, cap: px * .7 };
  }
  /* a word on the page: left edge x, baseline y (page px, y down) */
  function printed(t, x, base) {
    const m = new T.Mesh(new T.PlaneGeometry(t.w, t.h), new T.MeshBasicMaterial({ map: t.tex, transparent: true, alphaTest: .03, toneMapped: false }));
    m.position.set(x + t.w / 2, -(base - t.base + t.h / 2), .6); G3.scene.add(m); X.prints.push(m); return m;
  }

  /* ---------------- the camera: page centre (cx, cy) and zoom; it never turns ---------------- */
  let KEYS = [];
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a;
    const qv = b === a ? KEYS[a].q : lerp(KEYS[a].q, KEYS[b].q, eio(prog(qq, KEYS[a].q, KEYS[b].q)));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q);
    /* via points shape the path without stopping on it: a quadratic through the middle key */
    const P = KEYS.slice(a, b + 1), u = b === a ? 0 : prog(qv, KEYS[a].q, KEYS[b].q);
    if (P.length === 3) { const [p0, p1, p2] = P, w0 = (1 - u) * (1 - u), w1 = 2 * u * (1 - u), w2 = u * u, c = [0, 1, 2].map(j => p0.c[j] * w0 + (2 * p1.c[j] - .5 * (p0.c[j] + p2.c[j])) * w1 + p2.c[j] * w2); return { x: c[0], y: c[1], z: c[2] }; }
    return { x: lerp(k0.c[0], k1.c[0], l), y: lerp(k0.c[1], k1.c[1], l), z: lerp(k0.c[2], k1.c[2], l) };
  }
  function aim(cam, s) {
    cam.position.set(s.x, -s.y, X.D / s.z); cam.up.set(0, 1, 0); cam.lookAt(s.x, -s.y, 0);
    cam.fov = 30; cam.aspect = K0.W / K0.H; cam.near = 20; cam.far = X.D / s.z + 4000; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  }
  /* page point → screen px (exact for anything at z = 0) */
  const toScreen = (s, px, py) => [K0.W / 2 + (px - s.x) * s.z, K0.H / 2 + (py - s.y) * s.z];

  /* ---------------- the thread: sections in order, each parametrised by its own rest length ---------------- */
  const V3 = (...a) => new T.Vector3(...a);
  function section(at) {
    const N = 600, tab = new Float32Array(N + 1), a = V3(), b = V3(); at(0, a, null);
    for (let i = 1; i <= N; i++) { at(i / N, b, null); tab[i] = tab[i - 1] + a.distanceTo(b); a.copy(b); }
    return { at, tab, len: tab[N], vOf(m) {
      let lo = 0, hi = N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab[mid] < m) lo = mid; else hi = mid; }
      return (lo + clamp((m - tab[lo]) / Math.max(1e-6, tab[hi] - tab[lo]))) / N; } };
  }
  const tan = (s, end, qq) => { const a = V3(), b = V3(); s.at(end ? .998 : 0, a, qq); s.at(end ? 1 : .002, b, qq); return b.sub(a).normalize(); };
  /* a cubic that leaves one section and enters the next along their tangents; it follows them as they move */
  function join(s0, s1, k0 = .4, k1 = .4, bend = null) {
    const p0 = V3(), p1 = V3(), p2 = V3(), p3 = V3(); let key = NaN;
    return section((v, o, qq) => {
      if (qq !== key) { key = qq; s0.at(1, p0, qq); s1.at(0, p3, qq); const d = p0.distanceTo(p3); p1.copy(p0).addScaledVector(tan(s0, 1, qq), d * k0); p2.copy(p3).addScaledVector(tan(s1, 0, qq), -d * k1); if (bend) { p1.add(bend); p2.add(bend); } }
      const u = 1 - v; return o.set(0, 0, 0).addScaledVector(p0, u * u * u).addScaledVector(p1, 3 * u * u * v).addScaledVector(p2, 3 * u * v * v).addScaledVector(p3, v * v * v);
    });
  }

  /* ---------------- morphs, all pure functions of q (qq null = the settled state) ---------------- */
  const M = {
    wind: (qq, v) => qq == null ? 1 : ss((lerp(-.3, 1.3, eio(prog(qq, 4.0, 4.66))) - v) / .3 + .5, 0, 1),
    focus: qq => qq == null ? 1 : lerp(2.7, 1, eio(prog(qq, 5.1, 5.62))) * lerp(1, .12, eio(prog(qq, 5.92, 6.25))),   /* in focus, then pressed flat: the picture is taken */
    gap: qq => qq == null ? 0 : 1 - eio(prog(qq, 6.34, 6.58)),
    knot: qq => qq == null ? 1 : lerp(1.75, 1, eio(prog(qq, 6.92, 7.38)))
  };

  /* ---------------- three ---------------- */
  function build3D() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;      /* the hero's grade */
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    const camera = new T.PerspectiveCamera(30, 1, 20, 9000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    /* the page: invisible, but it hides whatever of the thread is behind it */
    const page = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ colorWrite: false })); page.renderOrder = -1; scene.add(page);
    G3 = { renderer, scene, camera, studio, key, rim, lamp, page };
  }

  function build(Kk) {
    const W = Kk.W, H = Kk.H, sc = G3.scene;
    if (X.wire) { sc.remove(X.wire.group); X.wire.dispose(); }
    (X.prints || []).forEach(m => sc.remove(m)); X.prints = []; (X.dots || []).forEach(m => sc.remove(m)); X.dots = [];
    X.D = H / 2 / Math.tan(15 * DEG);
    G3.page.scale.set(W * 8, H * 6, 1); G3.page.position.set(W * 1.5, -H, 0);
    const P = (x, y, z = 0) => V3(x, y, z);                       /* page coordinates: x right, y down, z toward the viewer */
    const yL = H * .5;

    /* ---- the printed page ---- */
    const vw = W / 100;
    /* Websites: one giant word across the second cell, its cap height centred on the thread's line */
    const tw = textTex('Websites', 15.4 * vw, CREAM);
    const webX = W + (W - tw.w) / 2, webBase = yL + tw.cap / 2; printed(tw, webX, webBase);
    /* Photography: along the foot of the third cell, under the lens */
    const tp = textTex('Photography', 12.2 * vw, CREAM); printed(tp, 2 * W + .045 * W, H * .93);
    /* Rebuilds: one word in two pieces, the lace between them (row two, right) */
    const r1 = textTex('Rebu', 19 * vw, CREAM), r2 = textTex('ilds', 19 * vw, CREAM);
    const rW = r1.w + r2.w - 19 * vw * .1, rC = 2 * W + W * .5, rBase = H + H * .5 + r1.cap / 2;
    X.reb = { a: printed(r1, rC - rW / 2, rBase), b: printed(r2, rC - rW / 2 + r1.w - 19 * vw * .1, rBase), ax: rC - rW / 2 + r1.w / 2, bx: rC - rW / 2 + r1.w - 19 * vw * .1 + r2.w / 2, seam: rC - rW / 2 + r1.w - 19 * vw * .05, open: W * .26 };
    /* Care: red, top left of the middle cell of row two */
    const tc = textTex('Care', 22 * vw, RED); printed(tc, W + .045 * W, H + H * .1 + tc.cap);

    /* ---- the thread ---- */
    /* 1 · the line the sentence becomes, straight across the first cell and on into the second */
    const line = section((v, o) => o.copy(P(lerp(-.4 * W, W + .05 * W, v), yL, 14)));
    /* 2 · whipstitch round "Websites": even arcs over the letters, each diving through the page */
    const wx0 = webX - .03 * W, wx1 = webX + tw.w + .005 * W, wr = tw.cap * .82, wTurns = 5.5;
    /* an overcast stitch: a straight diagonal over the word, then back under the page to start the next */
    const whip = section((v, o, qq) => {
      const w = M.wind(qq, v) * ss(v, 0, .05) * ss(1 - v, 0, .05), p = v * wTurns % 1;
      let y, z; if (p < .5) { const a = p / .5; y = wr * (1 - 2 * a); z = 34 * Math.sin(PI * a); } else { const b = (p - .5) / .5; y = wr * (-1 + 2 * b); z = -70 * Math.sin(PI * b); }
      return o.copy(P(lerp(wx0, wx1, v), yL + y * w, 14 * (1 - w) + z * w));
    });
    /* 3 · the lens: a cone of rings rising off the page toward the viewer, tightening onto a red point */
    const lc = P(2 * W + .64 * W, H * .47), lTurns = 4.6;
    const lens = section((v, o, qq) => { const f = PI - v * lTurns * 2 * PI, r = lerp(H * .41, H * .1, Math.pow(v, .8)), z = 10 + v * 360 * M.focus(qq); return o.copy(P(lc.x + Math.cos(f) * r, lc.y + Math.sin(f) * r, z)); });
    /* … and through its centre, into the page */
    const dive1 = section((v, o, qq) => { const e = V3(); lens.at(1, e, qq); return o.copy(e).setZ(lerp(e.z, -140, v)); });
    /* 4 · the lace across the broken word; pulled tight, it is a seam */
    const lN = 5, ly0 = rBase - r1.cap * 1.02, ly1 = rBase + r1.cap * .04;
    const lace = section((v, o, qq) => {
      const g = M.gap(qq) * X.reb.open, half = 36 + g / 2, t = v * lN, k = Math.min(lN - 1, Math.floor(t)), f = t - k;
      const s0 = k % 2 ? 1 : -1, x = X.reb.seam + lerp(s0, -s0, eio(f)) * half, y = lerp(ly0, ly1, v), z = 44 * Math.sin(PI * f) - 16;
      return o.copy(P(x, y, z));
    });
    /* 5 · the knot, standing off the page with the light inside it */
    const kc = P(W + .64 * W, H + H * .5, 0), kS = H * .085;
    const knot = section((v, o, qq) => {
      const s = kS * M.knot(qq), t = lerp(-.62, 2 * PI - .62, v);
      const x = Math.sin(t) + 2 * Math.sin(2 * t), y = Math.cos(t) - 2 * Math.cos(2 * t), z = -Math.sin(3 * t);
      const ends = Math.pow(Math.max(0, Math.abs(v - .5) * 2 - .82) / .18, 2);   /* the two ends dip back into the page */
      return o.copy(P(kc.x + x * s, kc.y - y * s, 150 + z * s * 1.1 - ends * 190));
    });
    /* 6 · out through the full stop of the last sentence and off the page, downwards */
    X.dot = P(.05 * W + 400, H * 1.5, 0);                         /* refined from the type in measureEnd() */
    const exit = section((v, o) => { const d = X.dot; return o.copy(P(d.x + Math.sin(v * PI) * 30 * (1 - v), lerp(d.y - 2, H * 2.45, Math.pow(v, 1.15)), lerp(12, 40, v))); });
    const into = (s, d = 160) => section((v, o, qq) => { const p = V3(); s.at(1, p, qq); return o.copy(p).setZ(lerp(p.z, -d, v)); });
    const from = (s, d = 160) => section((v, o, qq) => { const p = V3(); s.at(0, p, qq); return o.copy(p).setZ(lerp(-d, p.z, v)); });
    const knotIn = from(knot), whipOut = section((v, o, qq) => { const p = V3(); whip.at(1, p, qq); return o.copy(p).add(V3(v * 60, 0, 0)).setZ(lerp(p.z, -160, v)); }), lensIn = from(lens);
    const laceIn = from(lace), laceOut = into(lace);
    const exitIn = from(exit, 120);
    const parts = [line, whip, whipOut, join(whipOut, lensIn, .5, .5), lensIn, lens, dive1, join(dive1, laceIn, .5, .5), laceIn, lace, laceOut, join(laceOut, knotIn, .5, .5), knotIn, knot, into(knot), null, exitIn, exit];
    const ki = parts.indexOf(null); parts[ki] = join(parts[ki - 1], exitIn, .5, .5);
    let acc = 0; parts.forEach(s => { s.m0 = acc; acc += s.len; }); X.parts = parts; X.len = acc;
    X.sec = { line, whip, lens, lace, knot, exit }; X.barbed = new Set([line, whip, lens, knot, exit]);
    X.lc = lc; X.kc = kc;

    const segs = Math.min(5200, Math.ceil(acc / K / .3)), barbs = Math.floor(acc / K / 3.6);
    const wire = window.NWF.createSteelWire(G3.studio, { segments: segs, barbs });
    wire.group.scale.setScalar(K); sc.add(wire.group); X.wire = wire; X.key = '';
    /* barbs: where each one sits, so it can sprout (the line) or arrive with the winding (the whipstitch) */
    X.barb = wire.offsets.map(t => { const m = t * acc; const s = parts.find(p => m >= p.m0 && m <= p.m0 + p.len) || parts[0]; return { s, v: s.vOf(m - s.m0) }; });
    const tmp = V3();
    X.sample = (t, out) => {
      const m = clamp(t) * X.len; let k = 0; while (k < parts.length - 1 && m > parts[k].m0 + parts[k].len) k++;
      const s = parts[k]; s.at(s.vOf(m - s.m0), tmp, X.qq); return out.set(tmp.x / K, -tmp.y / K, tmp.z / K);
    };

    /* red: the lens's subject, the light in the knot, the last full stop */
    const dot = (p, r) => { const m = new T.Mesh(new T.SphereGeometry(r, 40, 20), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); m.position.set(p.x, -p.y, p.z); sc.add(m); X.dots.push(m); return m; };
    X.lensDot = dot(P(lc.x, lc.y, 6), H * .03); X.knotDot = dot(P(kc.x, kc.y, 150), H * .024); X.endDot = dot(X.dot, H * .02);

    /* ---- camera keys: page centre and zoom ---- */
    const c = (q, x, y, z, stop) => ({ q, c: [x, y, z], stop });
    KEYS = [
      c(ST.swap, W / 2, H / 2, 1, 1), c(3.3, W * .56, H / 2, 1.16), c(ST.head, W / 2, H / 2, 1, 1),
      c(4.35, W, H / 2, .84), c(ST.web, W * 1.5, H / 2, 1, 1),
      c(5.25, W * 2.02, H * .5, .9), c(ST.photo, W * 2.5, H / 2, 1, 1),
      c(6.12, W * 2.55, H * 1.02, .82), c(ST.reb, W * 2.5, H * 1.5, 1, 1),
      c(7.05, W * 2, H * 1.5, .86), c(ST.care, W * 1.5, H * 1.5, 1, 1),
      c(8.02, W * 1.35, H * 1.2, .5), c(ST.end, W * 1.5, H * 1.1, 1 / 3.02, 1)
    ];
    X.anchors = { head: [.05 * W, 0], blk: [[W + .05 * W, H * .745], [2 * W + .045 * W, H * .1], [2 * W + .045 * W, H + H * .69], [W + .045 * W, H + H * .58]], end: [.045 * W, H + H * .16] };
    measureEnd(W, H);
    X.blocks = [0, 1, 2, 3].map(i => { const b = R.layer.querySelector('#swB' + i), p = b.querySelector('.sw-p'); if (!p.dataset.w) { BK2.wrap(p); p.dataset.w = 1; } return { b, w: [...p.querySelectorAll('.w')] }; });
    X.built = true;
    X.qq = null; wire.update(X.sample); G3.renderer.compile(sc, G3.camera);
    X.prints.forEach(m => G3.renderer.initTexture(m.material.map));      /* upload the type now, not on first sight */
  }
  /* the last sentence is DOM (it is the link); its full stop is the thread's way out */
  function measureEnd(W, H) {
    const e = R.end, d = R.layer.querySelector('#swDot'); e.style.transform = 'none';
    const er = e.getBoundingClientRect(), dr = d.getBoundingClientRect();
    const px = X.anchors.end[0] + (dr.left - er.left) + dr.width / 2, py = X.anchors.end[1] + (dr.top - er.top) + dr.height / 2;
    X.dot.set(px, py, 0); if (X.endDot) X.endDot.position.set(px, -py, 4);
  }

  /* ---------------- render ---------------- */
  function render(qq) {
    if (!ready || !X.built) return;
    X.qq = qq;
    const sprout = prog(qq, 3.04, 3.62);
    const key = [M.wind(qq, .5).toFixed(3), prog(qq, 4.0, 4.66).toFixed(4), M.focus(qq).toFixed(4), M.gap(qq).toFixed(4), M.knot(qq).toFixed(4), sprout.toFixed(3)].join('|');
    if (key !== X.key) {
      X.key = key; X.wire.update(X.sample);
      /* barbs grow along the new line from its middle outward, and arrive with each turn of the whipstitch */
      const m4 = new T.Matrix4(), sv = V3(), W = K0.W, kn = X.wire.knots;
      X.barb.forEach((b, i) => {
        let s = 1;
        if (b.s === X.sec.line) { const x = lerp(-.4 * W, W + .05 * W, b.v); const d = Math.abs(x - W * .5) / W; s = eo(prog(sprout, d * .55, d * .55 + .45)); }
        else if (b.s === X.sec.whip) s = M.wind(qq, b.v);
        else if (!X.barbed.has(b.s)) s = 0;                           /* plain twisted wire where it dives, and in the seam */
        if (s < .999) { kn.getMatrixAt(i, m4); m4.scale(sv.setScalar(Math.max(.001, lerp(.15, 1, s)) * (s < .01 ? .001 : 1))); kn.setMatrixAt(i, m4); }
      });
      kn.instanceMatrix.needsUpdate = true;
    }
    const s = camState(qq), cam = G3.camera; aim(cam, s);

    /* the rebuilt word: its halves open, then pulled together by the lace */
    const g = M.gap(qq) * X.reb.open; X.reb.a.position.x = X.reb.ax - g / 2; X.reb.b.position.x = X.reb.bx + g / 2;
    X.lensDot.position.z = 6; X.knotDot.scale.setScalar(M.knot(qq));

    /* night for Care: the room goes down, the knot's light switches on (two short steps) */
    const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.end - .45));
    G3.scene.environmentIntensity = 1 - .72 * night; G3.key.intensity = 2.1 * (1 - .8 * night); G3.rim.intensity = 1.2 * (1 - .7 * night);
    const sw = prog(qq, ST.care - .2, ST.care - .04), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .12 : sw < .75 ? .75 : 1;
    G3.lamp.position.set(X.kc.x, -X.kc.y, 150); G3.lamp.intensity = 2.6e6 * on * (1 - ss(qq, ST.care + .25, ST.care + .6));
    G3.renderer.render(G3.scene, cam);

    /* DOM on the page: placed by the same camera, so it pans and scales with the print */
    const place = (el, ax, ay) => { const [x, y] = toScreen(s, ax, ay); el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.z.toFixed(4)})`; };
    place(R.head, ...X.anchors.head);
    place(R.end, ...X.anchors.end);
    /* the heading comes out of the steel: one line rises from it, the other drops from it */
    const hu = eo(prog(qq, 3.52, 3.86)), hd = eo(prog(qq, 3.58, 3.9));
    R.headUp.style.transform = `translate3d(0,${((1 - hu) * 105).toFixed(2)}%,0)`; R.headDown.style.transform = `translate3d(0,${((hd - 1) * 105).toFixed(2)}%,0)`;
    R.head.style.visibility = qq > 3.5 ? 'visible' : 'hidden';
    const stops = [ST.web, ST.photo, ST.reb, ST.care];
    X.blocks.forEach(({ b, w }, i) => {
      const S = stops[i], inn = prog(qq, S - .24, S - .02), out = ss(qq, S + .18, S + .36), on = inn > 0 && out < 1;
      b.style.visibility = on ? 'visible' : 'hidden'; if (!on) return;
      place(b, ...X.anchors.blk[i]); BK2.reveal(w, inn, .9); b.style.opacity = (1 - out).toFixed(3);
    });
    const end = qq >= ST.end - .06; R.end.tabIndex = end ? 0 : -1; R.end.classList.toggle('is-on', end);
    const railOn = ss(qq, ST.head + .45, ST.web - .2) * (1 - ss(qq, ST.care + .2, ST.care + .45));
    R.rail.style.opacity = railOn.toFixed(3); R.rail.style.visibility = railOn > .002 ? 'visible' : 'hidden';
    const cur = Math.round(clamp((qq - ST.web) / (ST.photo - ST.web), 0, 3));
    if (R.railCur !== cur) { R.railCur = cur; [...R.rail.children].forEach((li, i) => li.classList.toggle('is-on', i === cur)); }
  }

  /* ---------------- the entrance, drawn flat on the bridge's own canvas ----------------
     each line of the sentence flattens into a dash of its own width and slides to the middle, in reading order;
     the dashes close into one cream rule, the rule runs out to both edges and thickens to the steel's weight */
  function drawCollapse(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr, yL = H * .5;
    if (qq > 3.16) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const n = G.L.length; let x0 = W, x1 = 0;
    const fill = ss(qq, 2.84, 2.96), run = eio(prog(qq, 2.9, 3.04)), thick = lerp(2, 18, eio(prog(qq, 2.96, 3.06))), gone = 1 - ss(qq, 3.04, 3.14);
    G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.56 + i * .045, 2.82 + i * .045)), h = L.HH / dpr, yc = lerp(L.y0 + h / 2, yL, t), sy = lerp(1, .014, t);
      const lx = Math.round(L.x * dpr - L.pad * dpr);
      x0 = Math.min(x0, L.x); x1 = Math.max(x1, L.x + L.w);
      if (fill < 1) { ctx.globalAlpha = 1 - fill; ctx.drawImage(L.C, lx, Math.round((yc - h * sy / 2) * dpr), L.C.width, Math.max(1, Math.round(L.HH * sy))); }
    });
    /* the subline: words become small dashes and fall into the same rule */
    const ts = eio(prog(qq, 2.62, 2.86)); ctx.globalAlpha = (1 - ts) * .92;
    if (ts < 1) { ctx.setTransform(dpr, 0, 0, dpr * lerp(1, .05, ts), 0, 0); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; ctx.fillStyle = CREAM; G.sub.forEach(o => ctx.fillText(o.w, o.x, lerp(o.y, yL, ts) / lerp(1, .05, ts))); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    if (fill > 0) {
      ctx.globalAlpha = fill * gone; ctx.fillStyle = CREAM;
      const a = lerp(x0, 0, run), b = lerp(x1, W, run);
      ctx.fillRect(a * dpr, (yL - thick / 2) * dpr, (b - a) * dpr, thick * dpr);
    }
    ctx.restore();
  }

  function init(Kk) {
    K0 = Kk; R.layer = Kk.layer; R.gl = Kk.el('swGl'); R.end = Kk.el('swEnd'); R.rail = Kk.el('swRail'); R.head = Kk.el('swHead');
    R.headUp = R.head.querySelector('.sw-mask--up > span'); R.headDown = R.head.querySelector('.sw-mask--down > span');
    const nz = document.createElement('canvas'); nz.width = nz.height = 180; const nx = nz.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); Kk.layer.querySelector('.sw-grain').style.backgroundImage = `url(${nz.toDataURL()})`;
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
    R.gl.style.opacity = X.built ? Math.max(.002, ss(qq, 2.98, 3.1)).toFixed(3) : 0;   /* never quite 0: the layer stays composited, no hitch on reveal */      /* the steel takes over from the cream rule */
    R.layer.querySelector('.sw-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
    if (!X.built) return;
    drawCollapse(ctx, qq);
    render(qq);
  }
  window.__nw = { X: () => X, G3: () => G3, render: qq => render(qq), camState, keys: () => KEYS };
  return { dom, init, layout, post, take: qq => !!X.built && qq > ST.swap, live: () => { const d = X.dirty; X.dirty = false; return !!d; } };
})();
