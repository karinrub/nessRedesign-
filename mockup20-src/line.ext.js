/* 20 — THE LINE (Offers, developed from 19 "The Tower")
   The section has one actor: the hero's barbed wire (same procedural strands, barbs, cut ends and studio reflections),
   the only 3D object. All type stays flat. The wire is never snapped here and never frames anything; at each service it
   does the work the service describes, then holds still while the words are read.

   SCRIPT (section time q; the film rests at each stop, the wire moves only between them)
   2.50  The bridge's last frame, untouched.
   2.55–3.90  ENTRANCE, "the full stop was a wire": the period of "meet them." turns to steel. The camera pushes into it,
         the flat sentence growing past the frame as if printed at the period's depth, until the period is the polished cut
         end of a wire. The camera banks off its axis and the line is seen running on into the dark: the sentence ends,
         the line does not. STOP: "What you can hire us for."
   3.90–4.80  WEBSITES: the wire is wound, far end first, into an even coil, the measured turns of something built by
         hand. STOP: the coil raking away like a colonnade, a red point at its far end.
   4.80–5.70  PHOTOGRAPHY: nothing in the wire moves; the camera swings onto the coil's axis and the same object becomes a
         lens, rings tapering to the red point. Websites and photography are one thing seen two ways. STOP.
   5.70–6.60  REBUILDS: the coil buckles into a tangle ("it stopped doing its job"), then is pulled true and springs taut.
         STOP: one straight wire in deep perspective, aimed at the red point.
   6.60–7.50  CARE: night falls. The wire winds round the red point into a nest; the point becomes a lamp and switches on
         in two steps, and the steel is lit from inside. STOP.
   7.50–8.50  THE END, "the full stop again": the lights come back, the nest unwinds and the wire lays itself into one
         clean ring around the red point; the camera squares up. The section ends on the mark the bridge's sentence ended
         on, drawn in steel. STOP: "Tell us what you need." */
window.NG_EXT = (() => {
  const { OFFERS, HEADING } = NGL;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI;
  const CREAM = '#e9e1ce', RED = '#c0230b';
  const ST = { swap: 2.55, head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, end: 8.5 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;

  const dom = `<canvas class="nw-gl" id="nwGl" aria-hidden="true"></canvas><div class="nw-grain" aria-hidden="true"></div>
  <div class="nw-hud">
    <div class="nw-blk nw-blk--head" id="nwH"><h2 class="nw-h"><span>What you can</span> <span>hire us for.</span></h2></div>
    <ol class="nw-rail" id="nwRail" aria-hidden="true">${OFFERS.map(o => `<li>${o.name}</li>`).join('')}</ol>
    ${OFFERS.map((o, i) => `<section class="nw-blk nw-blk--${SVC[i]}" id="nwS${i}"><h3 class="nw-name">${o.name}</h3><p class="nw-p">${o.body}</p></section>`).join('')}
    <div class="nw-blk nw-blk--end" id="nwE">
      <a class="nw-end" id="nwEnd" href="mailto:hello@nessmaui.com" tabindex="-1"><span>Tell us</span> <span>what you need<i class="nw-stop" id="nwStop" aria-hidden="true"></i></span></a>
      <p class="nw-list">${OFFERS.map(o => o.name).join(', ')}. <a class="nw-mail" href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p>
    </div>
  </div>`;

  /* ---------------- the camera: keys in world space; stops ease in and out, via points pass straight through ---------------- */
  let KEYS = [], posCurve, tgtCurve;
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a, A0 = KEYS[a], B0 = KEYS[b];
    const qv = b === a ? A0.q : lerp(A0.q, B0.q, eio(prog(qq, A0.q + (A0.hold || 0), B0.q - (B0.hold || 0))));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q), u = (i + l) / (n - 1);
    return { p: posCurve.getPoint(u), t: tgtCurve.getPoint(u), f: lerp(k0.f, k1.f, l), sx: lerp(k0.s[0], k1.s[0], l), sy: lerp(k0.s[1], k1.s[1], l) };
  }
  function aim(c, st) {
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert();
    c.updateMatrixWorld(true);
  }

  /* ---------------- shapes: each is the whole wire, a point for every u in 0..1 (u is measured along its length) ---------------- */
  const V3 = (...a) => new T.Vector3(...a);
  function shape(fn, N = 1200) {             /* reparametrise any curve by arc length so a barb keeps its place on the wire */
    const pts = [], len = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) { pts.push(fn(i / N, V3())); if (i) len[i] = len[i - 1] + pts[i].distanceTo(pts[i - 1]); }
    const L = len[N];
    return { L, pts, at(u, o) {
      const m = clamp(u) * L; let lo = 0, hi = N; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (len[mid] < m) lo = mid; else hi = mid; }
      return o.copy(pts[lo]).lerp(pts[hi], clamp((m - len[lo]) / Math.max(1e-6, len[hi] - len[lo])));
    } };
  }
  const tri = x => 2 * Math.abs(2 * (x - Math.floor(x + .5))) - 1;

  /* ---------------- three ---------------- */
  function build3D() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;      /* the hero's grade */
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    const camera = new T.PerspectiveCamera(30, 1, .5, 3000); scene.add(camera);
    /* the hero's two lights, carried with the camera so the steel is always lit the way the hero lit it */
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    const dot = new T.Mesh(new T.SphereGeometry(1, 48, 24), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); scene.add(dot);
    G3 = { renderer, scene, camera, studio, key, rim, lamp, dot };
    X.tmp = new T.PerspectiveCamera(30, 1, .5, 3000);
  }

  function build(K) {
    const W = K.W, H = K.H, G = A.G, dpr = K.dpr, sc = G3.scene;
    if (X.wire) { sc.remove(X.wire.group); X.wire.dispose(); }

    /* the period of "meet them.": where it is printed, and the plates without it (it is drawn on its own so it can turn) */
    const L3 = G.L[G.L.length - 1];
    const mc = document.createElement('canvas').getContext('2d'); mc.font = `700 100px 'Instrument Sans', sans-serif`; A.lsp(mc, A.LS);
    const mw = s => A.HAS ? mc.measureText(s).width : mc.measureText(s).width + s.length * A.LS;
    const x0d = mw(L3.t.slice(0, -1)), x1d = mw(L3.t) - A.LS;
    X.dot = { x: L3.x + (x0d + x1d) / 2 * L3.s, y: L3.y0 + .72 * L3.fs - .062 * L3.fs, r: .068 * L3.fs };
    const c = document.createElement('canvas'); c.width = L3.C.width; c.height = L3.C.height; const cx = c.getContext('2d'); cx.drawImage(L3.C, 0, 0);
    cx.clearRect((x0d * L3.s + L3.pad - 2) * dpr, 0, ((x1d - x0d) * L3.s + 30) * dpr, c.height); L3.Cx = c;

    /* THE OPENING CAMERA is placed so that the ray through the printed period runs through the middle of the stage */
    /* it looks straight down the wire's axis (+x); a lens shift puts that axis exactly on the printed period */
    const nx = X.dot.x / W * 2 - 1, ny = 1 - X.dot.y / H * 2, tn = Math.tan(15 * DEG);
    const r = V3(1, 0, 0);
    const dEnd = .46 / (X.dot.r / H * 2 * tn);                         /* the cut end (two strands, .92 across) is the period's size */
    const LEN = 262, E0 = V3(-LEN * .5, 0, 0), C0 = E0.clone().addScaledVector(r, -dEnd);
    X.C0 = C0; X.E0 = E0; X.r = r; X.dEnd = dEnd;

    /* THE SHAPES (stage centred on the origin) */
    const coilC = V3(-23, 0, 0), coilLen = 46, R0 = 10, R1 = 6.6, TURNS = 4.9;
    X.focus = V3(coilLen / 2 + 7, 0, 0);
    const S = {};
    S.lead = shape((u, o) => o.copy(E0).addScaledVector(r, LEN * u));
    /* the coil is wound starting from its far end, so the cut end finishes nearest the camera */
    S.coil = shape((u, o) => { const v = 1 - u, f = PI * .5 + v * TURNS * 2 * PI, rr = lerp(R0, R1, v); return o.set(coilC.x + coilLen * v, Math.cos(f) * rr, Math.sin(f) * rr); });
    const dS = V3(-.58, .1, .81).normalize(), mS = X.focus.clone().addScaledVector(dS, 2 + LEN * .5 + 6);   /* the true line aims at the red point */
    S.line = shape((u, o) => o.copy(mS).addScaledVector(dS, -LEN * (u - .5)));
    const n1 = V3(0, 1, 0), n2 = dS.clone().cross(n1).normalize();
    S.knot = shape((u, o) => {                                                    /* the same line, buckled: sharp kinks, not waves */
      S.line.at(u, o); const w = Math.pow(Math.sin(PI * u), .5) * 8.5;
      o.addScaledVector(n1, w * (tri(u * 6.3 + .1) + .5 * Math.sin(u * 41 + 1.3) + .35 * tri(u * 17.7)));
      o.addScaledVector(n2, w * (tri(u * 4.7 + .6) + .45 * Math.sin(u * 29 + .2) + .4 * tri(u * 13.1 + .4)));
      return o.addScaledVector(dS, w * 2.2 * Math.sin(u * 23));
    }, 2400);
    /* the nest: wound round the red point like thread on a ball, pole to pole */
    const NR = 8.2, NT = LEN / (4 * NR);
    S.nest = shape((u, o) => { const th = .08 + u * (PI - .16), ph = u * NT * 2 * PI + Math.sin(u * 9) * .4, rr = NR * (1 + .05 * Math.sin(u * 37));
      return o.set(rr * Math.sin(th) * Math.cos(ph), rr * Math.cos(th), rr * Math.sin(th) * Math.sin(ph)); }, 2400);
    /* the ring: two turns, the second a hair inside the first, ends overlapping */
    const RT = 5.06, RR = LEN / (RT * 2 * PI) * 1.02;
    S.ring = shape((u, o) => { const a = -PI * .5 + u * RT * 2 * PI, rr = RR * (1.08 - .16 * u + .03 * Math.sin(u * 23)); return o.set(Math.cos(a) * rr, Math.sin(a) * rr, Math.sin(u * 31) * 1.3); });
    X.S = S;

    /* how the wire moves: [from q, to q, shape A, shape B, sweep direction (1: the far end moves first)] */
    X.moves = [
      [3.98, 4.62, 'lead', 'coil', 1, 'wind'],
      [5.82, 6.08, 'coil', 'knot', 0, 'buckle'],
      [6.3, 6.6, 'knot', 'line', 0, 'true'],
      [6.72, 7.32, 'line', 'nest', 1, 'wind'],
      [7.66, 8.36, 'nest', 'ring', 0, 'wind']
    ];
    const segs = 900, barbs = 74;
    const wire = window.NWF.createSteelWire(G3.studio, { segments: segs, barbs });
    wire.setBarbPositions(Array.from({ length: barbs }, (_, i) => .025 + (i + .5) / barbs * .97));
    sc.add(wire.group); X.wire = wire; X.shapeKey = '';

    /* where the red point is at each beat */
    X.dotKeys = [[ST.web - .5, X.focus, 0], [ST.web - .1, X.focus, 1], [ST.photo + .2, X.focus, 1], [ST.reb - .1, X.focus, 1], [ST.care - .9, X.focus, 1], [ST.care - .3, V3(0, 0, 0), 1], [ST.end, V3(0, 0, 0), 1]];

    /* CAMERA KEYS (world) */
    const at = (v, d) => v.clone().add(V3(...d));
    KEYS = [
      { q: ST.swap, p: C0, t: E0.clone(), f: 30, s: [nx, ny], stop: 1, hold: .04 },
      { q: 3.2, p: at(E0, [-13, .35, .5]), t: at(E0, [8, 0, 0]), f: 30, s: [nx, ny] },
      { q: 3.55, p: at(E0, [-6, 3, 6]), t: at(E0, [40, 0, 0]), f: 30, s: [.2, .05] },
      { q: ST.head, p: at(E0, [-10, 7, 10]), t: at(E0, [70, 0, 0]), f: 30, s: [.32, -.12], stop: 1 },
      { q: ST.web, p: V3(-58, 18, 68), t: V3(4, 0, 0), f: 30, s: [.56, .12], stop: 1 },
      { q: 5.25, p: V3(-66, 6, 26), t: V3(0, 0, 0), f: 30, s: [.32, 0] },
      { q: ST.photo, p: V3(-72, 0, 0), t: V3(0, 0, 0), f: 30, s: [.36, 0], stop: 1 },
      { q: 6.3, p: X.focus.clone().addScaledVector(dS, 104).addScaledVector(n2, -11).addScaledVector(n1, 8), t: X.focus.clone().addScaledVector(dS, 30), f: 30, s: [.3, .2] },
      { q: ST.reb, p: X.focus.clone().addScaledVector(dS, 92).addScaledVector(n2, -9).addScaledVector(n1, 7), t: X.focus.clone(), f: 30, s: [.44, .34], stop: 1 },
      { q: ST.care, p: V3(0, 4, 50), t: V3(0, 0, 0), f: 30, s: [.38, -.02], stop: 1 },
      { q: ST.end, p: V3(0, 0, 96), t: V3(0, 0, 0), f: 30, s: [.4, .04], stop: 1 }
    ];
    /* THE LAST FRAME: the ring lands as the full stop of "you need" — sized and placed from where the type actually is */
    {
      const blk = K.layer.querySelector('#nwE'), tr = blk.style.transform; blk.style.transform = 'none';
      const sr = K.layer.querySelector('#nwStop').getBoundingClientRect(); blk.style.transform = tr;
      const dia = sr.width || .22 * H, cxp = sr.left + dia / 2, cyp = sr.top - dia * .46, ringR = RR * 1.3;
      const dist = ringR * H / (dia / 2 * 2 * tn) * .98;
      Object.assign(KEYS[KEYS.length - 1], { p: V3(0, 0, dist), s: [cxp / W * 2 - 1, 1 - cyp / H * 2] });
    }
    posCurve = new T.CatmullRomCurve3(KEYS.map(k => k.p), false, 'centripetal');
    tgtCurve = new T.CatmullRomCurve3(KEYS.map(k => k.t), false, 'centripetal');

    X.blocks = [...K.layer.querySelectorAll('.nw-blk')].map(b => {
      b.querySelectorAll('.nw-p,.nw-list').forEach(p => { if (!p.dataset.w) { BK2.wrap(p); p.dataset.w = 1; } });
      return { b, words: [...b.querySelectorAll('.nw-p .w,.nw-list .w')], big: b.querySelector('.nw-h,.nw-name,.nw-end') };
    });
    X.built = true;
    /* compile every shader now, not on the first frame the steel is seen */
    X.wire.update(X.S.lead.at.bind(X.S.lead)); aim(G3.camera, camState(ST.web)); G3.renderer.compile(sc, G3.camera);
  }

  /* ---------------- the wire's current form ---------------- */
  const spring = t => t >= 1 ? 1 : 1 - Math.exp(-5.5 * t) * Math.cos(t * 9.5);
  function formAt(qq) {
    let cur = 'lead', mv = null, t = 0;
    for (const m of X.moves) { if (qq >= m[1]) cur = m[3]; else if (qq > m[0]) { mv = m; t = prog(qq, m[0], m[1]); break; } else break; }
    return { cur, mv, t };
  }
  const ta = { a: null, b: null };
  function sampler(F) {
    const S = X.S, A0 = S[F.mv ? F.mv[2] : F.cur], B0 = F.mv ? S[F.mv[3]] : null;
    const a = ta.a || (ta.a = V3()), b = ta.b || (ta.b = V3());
    if (!B0) return (u, o) => A0.at(u, o);
    const kind = F.mv[5], dir = F.mv[4], t = F.t, spread = .35;
    return (u, o) => {
      A0.at(u, a); B0.at(u, b);
      let w;
      if (kind === 'true') w = eo(t) + .16 * Math.sin(t * 3 * PI) * (1 - t);  /* pulled true all at once; it overshoots and settles */
      else if (kind === 'buckle') w = eio(clamp(t * 1.3 - Math.abs(u - .5) * .6));            /* the middle gives first */
      else { const x = dir ? 1 - u : u; w = eio(clamp((t * (1 + spread) - x) / spread)); }   /* a front travels along the wire */
      return o.copy(a).lerp(b, w);
    };
  }

  function render(qq) {
    if (!ready || !X.built) return;
    const F = formAt(qq), key = F.mv ? F.mv[0] + ':' + F.t.toFixed(4) : F.cur;
    if (key !== X.shapeKey) { X.wire.update(sampler(F)); X.shapeKey = key; }
    const cam = G3.camera; aim(cam, camState(qq));

    /* the red point */
    const D = X.dotKeys; let dp = D[0][1], da = 0;
    if (qq >= D[0][0]) for (let i = 0; i < D.length - 1; i++) if (qq >= D[i][0]) { const u = eio(prog(qq, D[i][0], D[i + 1][0])); dp = D[i][1].clone().lerp(D[i + 1][1], u); da = lerp(D[i][2], D[i + 1][2], u); }
    G3.dot.position.copy(dp); G3.dot.scale.setScalar(1.25 * eo(da)); G3.dot.visible = da > .01;

    /* night for Care: the room goes down, the steel keeps what the lamp gives it */
    const night = ss(qq, ST.care - .62, ST.care - .2) * (1 - ss(qq, ST.care + .3, ST.end - .35));
    G3.scene.environmentIntensity = 1 - .7 * night; G3.key.intensity = 2.1 * (1 - .82 * night); G3.rim.intensity = 1.2 * (1 - .7 * night);
    const sw = prog(qq, ST.care - .2, ST.care - .04), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .12 : sw < .75 ? .75 : 1;
    G3.lamp.position.copy(dp); G3.lamp.intensity = 900 * on * (1 - ss(qq, ST.care + .3, ST.care + .62));
    G3.scene.environmentRotation.copy(cam.rotation);
    G3.renderer.render(G3.scene, cam);

    /* type: in once the wire has settled, out before it moves again */
    const stops = [ST.head, ST.web, ST.photo, ST.reb, ST.care, ST.end];
    X.blocks.forEach(({ b, words, big }, i) => {
      const S = stops[i], last = i === stops.length - 1;
      const inn = prog(qq, S - .26, S - .02), out = last ? 0 : ss(qq, S + .2, S + .4);
      const on = inn > 0 && out < 1; b.style.visibility = on ? 'visible' : 'hidden'; if (!on) return;
      const tb = eo(prog(inn, 0, .7));
      big.style.transform = `translate3d(0,${((1 - tb) * .28).toFixed(3)}em,0)`; big.style.opacity = tb.toFixed(3);
      BK2.reveal(words, prog(inn, .25, 1), .9);
      if (last) R.mail.style.opacity = prog(inn, .7, 1).toFixed(3);
      b.style.opacity = (1 - out).toFixed(3); b.style.transform = `translate3d(0,${(-out * 28).toFixed(1)}px,0)`;
    });
    const end = qq >= ST.end - .05; R.end.tabIndex = end ? 0 : -1; R.mail.tabIndex = end ? 0 : -1; R.end.style.pointerEvents = R.mail.style.pointerEvents = end ? 'auto' : 'none';
    /* the chapter rail: which stop the film is resting on */
    const railOn = ss(qq, ST.head + .5, ST.web - .2) * (1 - ss(qq, ST.care + .3, ST.care + .55));
    R.rail.style.opacity = railOn.toFixed(3); R.rail.style.visibility = railOn > .002 ? 'visible' : 'hidden';
    const cur = Math.round(clamp((qq - ST.web) / (ST.photo - ST.web), 0, 3));
    if (R.railCur !== cur) { R.railCur = cur; [...R.rail.children].forEach((li, i) => li.classList.toggle('is-on', i === cur)); }
  }

  /* the sentence stays flat: it is drawn on the bridge's own canvas and scales about the period as the camera pushes in */
  function drawSentence(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr;
    const cam = camState(qq), d = X.E0.clone().sub(cam.p).dot(X.r);          /* camera's distance to the period, along the axis */
    const k = X.dEnd / Math.max(d, 1e-3), fade = 1 - ss(k, 3.4, 4.8);
    if (fade <= 0) return;
    /* the plates are placed in device pixels exactly as the bridge blits them, so at k = 1 the frame is identical */
    ctx.save(); ctx.setTransform(k, 0, 0, k, X.dot.x * dpr * (1 - k), X.dot.y * dpr * (1 - k)); ctx.globalAlpha = fade;
    G.L.forEach(L => ctx.drawImage(L.Cx || L.C, Math.round(L.x * dpr - L.pad * dpr), L.Y));
    ctx.setTransform(dpr * k, 0, 0, dpr * k, X.dot.x * dpr * (1 - k), X.dot.y * dpr * (1 - k));
    ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM; ctx.globalAlpha = .92 * fade;
    G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y));
    /* the period itself: cream until the steel behind it takes over */
    const pd = 1 - ss(qq, 2.62, 2.74);
    if (pd > 0) { ctx.globalAlpha = pd * fade; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(X.dot.x, X.dot.y, X.dot.r, 0, PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function init(K) {
    K0 = K; R.gl = K.el('nwGl'); R.end = K.el('nwEnd'); R.rail = K.el('nwRail'); R.mail = K.layer.querySelector('.nw-mail');
    const n = document.createElement('canvas'); n.width = n.height = 180; const nx = n.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); K.layer.querySelector('.nw-grain').style.backgroundImage = `url(${n.toDataURL()})`;
    const go = () => { if (ready || !window.NWF) return; T = window.NWF.THREE; build3D(); ready = true; if (K0.W && A) layout(K0, A); };
    if (window.NWF) setTimeout(go, 0); else addEventListener('nwf-ready', go, { once: true });
  }
  function layout(K, a) {
    A = a || A; K0 = K; if (!ready || !A || !A.G || !A.G.ok) return;
    const pr = Math.min(K.dpr, 1.75, Math.sqrt(4e6 / (K.W * K.H)));             /* the hero's pixel budget */
    G3.renderer.setPixelRatio(pr); G3.renderer.setSize(K.W, K.H, false);
    build(K); X.dirty = true;
    requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
  }
  function post(ctx, qq) {
    R.gl.style.opacity = X.built ? ss(qq, 2.56, 2.68).toFixed(3) : 0;          /* the steel comes up as the cream period goes */
    if (!X.built) return;
    if (qq > ST.swap) drawSentence(ctx, qq);
    render(qq);
  }
  window.__nw = { X: () => X, G3: () => G3, keys: () => KEYS, render: qq => render(qq), camState, rebuild: () => build(K0) };
  return { dom, init, layout, post, take: qq => !!X.built && qq > ST.swap, live: () => { const d = X.dirty; X.dirty = false; return !!d; } };
})();
