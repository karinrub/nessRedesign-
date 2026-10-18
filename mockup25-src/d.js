/* 25 — THE STROKE (Offers, direction A of wave-studies-25)
   The Bridge reduces everything to one line; Offers lets that line become a wave, at the hero's scale, and break.
   One barbed wire, one open gesture: the sea comes in from the left edge, rises up a long back, throws the lip forward,
   folds it back under itself, drops down the face and runs out to sea again. The camera mostly holds; the scroll breaks
   the wave. Its states are the four things we do:
     WEBSITES     the Bridge's line lifts into a swell — planned before it breaks
     PHOTOGRAPHY  the lip throws; the sun is held in the barrel — the shot everyone remembers
     REBUILDS     the lip lands and rolls into whitewater, which is then pulled straight — an honest fix
     CARE         the sea again, and the next swell already rising behind — launch day is not goodbye
   Then the whole gesture with the sun in the curl ("Tell us what you need"), and on the way out the line is pulled
   taut across a red field, the rail Packages will hang from.
   Construction: every state is one polyline in (z along the sea, y up, p = depth) in units of the wave height, cut into
   the same eight segments (far sea, near sea, back, lip, underside, face, sea, far sea). Each segment is resampled by
   arc length to a fixed number of rings, so states morph point for point and the barbs stay on their part of the
   wave. Type is flat: paragraphs are DOM; the service names are Canvas 2D planes set at a depth among the wire. */
window.NG_EXT = (() => {
/*KIT*/
  const ST = { head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4, red: 10.2 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  const HU = 14;                                                       /* the wave height in world units (hero scale) */
  const NR = [20, 70, 110, 110, 110, 90, 80, 20], M = NR.reduce((a, b) => a + b, 0) + 1;
  const OFF = NR.map((_, k) => NR.slice(0, k).reduce((a, b) => a + b, 0));

  const dom = `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div>
  <div class="d-hud s-hud">
    <h2 class="s-head" id="sHead">What you can hire us for.</h2>
    ${OFFERS.map((o, i) => `<section class="s-blk s-blk--${SVC[i]}"><h3 class="nm">${o.name}</h3><p>${o.body}</p></section>`).join('')}
    <div class="s-end" id="sEnd"><a class="s-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="s-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;

  /* ---- the states: eight segments each, [z, y, p] in wave heights ---- */
  const SEA_L = p => [[[-14, 0, p], [-6, 0, p]], [[-6, 0, p], [-4, 0, p], [-2.6, .02, p]]];
  const SEA_R = (p, z = 1.4) => [[[z, 0, p], [4, 0, p]], [[4, 0, p], [14, 0, p]]];
  const line = zs => zs.slice(0, -1).map((z, k) => [[z, 0, 0], [zs[k + 1], 0, 0]]);
  const FLAT = line([-14, -6, -2.6, 0, .6, 1.0, 1.4, 4, 14]);
  const SWELL = [...SEA_L(0),
    [[-2.6, .02, 0], [-2.0, .07, 0], [-1.5, .16, 0], [-1.0, .34, 0], [-.55, .58, 0], [-.22, .74, .02], [0, .8, .05]],
    [[0, .8, .05], [.16, .77, .08], [.32, .66, .12]],
    [[.32, .66, .12], [.45, .5, .16], [.58, .32, .2]],
    [[.58, .32, .2], [.75, .14, .24], [.95, .04, .27], [1.4, 0, .3]], ...SEA_R(.3)];
  const PITCH = [...SEA_L(0),
    [[-2.6, .03, 0], [-2.0, .1, 0], [-1.4, .24, 0], [-.9, .46, 0], [-.45, .76, 0], [-.15, .95, .03], [.08, 1.02, .08]],
    [[.08, 1.02, .08], [.3, 1.0, .18], [.5, .9, .32], [.64, .74, .48], [.7, .58, .62]],
    [[.7, .58, .62], [.63, .5, .72], [.52, .58, .82], [.38, .64, .92], [.25, .58, 1.02]],
    [[.25, .58, 1.02], [.18, .42, 1.1], [.2, .22, 1.16], [.32, .08, 1.2], [.6, .01, 1.22], [1.4, 0, 1.24]], ...SEA_R(1.26)];
  /* the full gesture. The fold at the tip is a hairpin two wire-widths open, so the lip never piles onto itself */
  const BARREL = [...SEA_L(0),
    [[-2.6, .03, 0], [-2.0, .16, 0], [-1.2, .38, 0], [-.55, .72, 0], [-.2, .93, .04], [.12, 1.03, .14]],
    [[.12, 1.03, .14], [.42, 1.0, .3], [.66, .87, .5], [.84, .66, .72], [.94, .44, .9], [.97, .28, 1.02]],
    [[.97, .28, 1.02], [.93, .17, 1.1], [.85, .2, 1.17], [.8, .34, 1.22], [.7, .54, 1.3], [.54, .68, 1.38], [.36, .72, 1.46], [.22, .64, 1.54], [.14, .54, 1.6]],
    [[.14, .54, 1.6], [.08, .38, 1.66], [.1, .18, 1.72], [.26, .05, 1.77], [.55, 0, 1.8], [1.4, 0, 1.82]], ...SEA_R(1.84)];
  /* the lip has landed on the flat water in front of the wave */
  const LANDED = [...SEA_L(0),
    [[-2.6, .03, 0], [-1.8, .16, 0], [-1.0, .38, .02], [-.45, .66, .06], [-.1, .78, .1], [.2, .8, .16]],
    [[.2, .8, .16], [.5, .74, .3], [.76, .56, .5], [.94, .32, .72], [1.04, .1, .9], [1.08, .03, 1.0]],
    [[1.08, .03, 1.0], [1.0, .08, 1.08], [.88, .24, 1.16], [.7, .4, 1.24], [.5, .46, 1.32], [.32, .4, 1.4]],
    [[.32, .4, 1.4], [.2, .28, 1.46], [.2, .12, 1.5], [.36, .02, 1.54], [.7, 0, 1.58], [1.4, 0, 1.6]], ...SEA_R(1.62)];
  /* whitewater: the broken lip rolls shoreward as a run of loops (a trochoid, the path of a point on a rolling wheel),
     largest where it landed and smaller toward the shore, until the line runs out clean */
  const WRECK = (() => {
    const Th = 3 * 2 * PI + PI, n = 150, z0 = .04, z1 = 1.86, a = (z1 - z0 - .02) / Th, pts = [];
    for (let i = 0; i <= n; i++) {
      const th = Th * i / n, k = Math.pow(Math.max(0, 1 - th / Th), 1.3), b = .27 * k + .006;
      pts.push([z0 + a * th + b * Math.sin(th), b + b * Math.cos(th) + .004, .12 + 1.5 * th / Th]);
    }
    const cut = f => Math.round(n * f);
    return [...SEA_L(0),
      [[-2.6, .02, 0], [-2.0, .07, 0], [-1.3, .18, 0], [-.75, .3, .02], [-.32, .38, .06], [z0, pts[0][1], pts[0][2]]],
      pts.slice(0, cut(.42) + 1), pts.slice(cut(.42), cut(.76) + 1), [...pts.slice(cut(.76)), [2.0, 0, 1.63], [2.2, 0, 1.64]],
      ...SEA_R(1.64, 2.2)];
  })();
  /* the next set: a small swell far out (deep, so it sits higher and thinner in the picture), and a nearer one rising */
  const CARE = [
    [[-14, 0, 2.6], [-6, 0, 2.2]],
    [[-6, 0, 2.2], [-3.2, 0, 1.95], [-2.3, .03, 1.82], [-1.9, .12, 1.74]],
    [[-1.9, .12, 1.74], [-1.52, .25, 1.64], [-1.14, .17, 1.48], [-.8, .05, 1.24], [-.48, .07, .92], [-.18, .2, .62], [.1, .38, .36], [.3, .46, .22]],
    [[.3, .46, .22], [.5, .42, .16], [.7, .29, .12]],
    [[.7, .29, .12], [.9, .14, .1], [1.1, .05, .1]],
    [[1.1, .05, .1], [1.3, .01, .1], [1.6, 0, .1], [2.0, 0, .1]], ...SEA_R(.1, 2.0)];

  /* resample one state: a centripetal spline through all its points, each segment cut into NR[k] equal steps */
  function keyPts(segs) {
    const ctrl = [], anchor = [0];
    segs.forEach((s, k) => { s.forEach((pt, j) => { if (k > 0 && j === 0) return; ctrl.push(pt); }); anchor.push(ctrl.length - 1); });
    const c = new T.CatmullRomCurve3(ctrl.map(([z, y, p]) => V3(p * HU, y * HU, z * HU)), false, 'centripetal');
    const n = ctrl.length - 1, out = new Float32Array(M * 3), v = V3(), lens = []; let o = 0;
    for (let k = 0; k < 8; k++) {
      const u0 = anchor[k] / n, u1 = anchor[k + 1] / n, F = 48 * (anchor[k + 1] - anchor[k]), P = [], L = [0];
      for (let j = 0; j <= F; j++) { c.getPoint(lerp(u0, u1, j / F), v); P.push(v.clone()); if (j) L.push(L[j - 1] + P[j].distanceTo(P[j - 1])); }
      const tot = L[F], cnt = NR[k] + (k === 7 ? 1 : 0); let jj = 0; lens.push(tot);
      for (let r = 0; r < cnt; r++) {
        const m = tot * r / NR[k]; while (jj < F - 1 && L[jj + 1] < m) jj++;
        const f = clamp((m - L[jj]) / Math.max(1e-6, L[jj + 1] - L[jj]));
        out[o++] = lerp(P[jj].x, P[jj + 1].x, f); out[o++] = lerp(P[jj].y, P[jj + 1].y, f); out[o++] = lerp(P[jj].z, P[jj + 1].z, f);
      }
    }
    out.lens = lens; return out;
  }
  /* the line pulled taut: dead straight, every segment keeping the length it had in the full gesture, so the slack
     of the curl is drawn out along the line (pulled from the shore end) rather than vanishing */
  const tautFrom = lens => { let z = -14; const zs = [z]; lens.forEach(l => { z += l / HU; zs.push(z); }); return line(zs); };

  /* the film: stops and the states between them (vias sit halfway through a move) */
  let K = {}, PLAN = [];
  const pts = new Float32Array(M * 3);
  function buildStates() {
    K.flat = keyPts(FLAT); K.swell = keyPts(SWELL); K.pitch = keyPts(PITCH); K.barrel = keyPts(BARREL);
    K.landed = keyPts(LANDED); K.wreck = keyPts(WRECK); K.care = keyPts(CARE); K.taut = keyPts(tautFrom(K.barrel.lens));
    const C = { flat: 0, swell: .3, pitch: 1, barrel: 1, landed: 1, wreck: 1, care: 0, taut: 0 };
    PLAN = [[ST.head, 'flat'], [ST.web, 'swell', 'pitch'], [ST.photo, 'barrel', 'landed'], [ST.reb, 'wreck'], [ST.care, 'care', 'pitch'],
      [ST.whole, 'barrel'], [ST.end, 'barrel'], [ST.red, 'taut']].map(([q, s, via]) => ({ q, s, via, c: C[s], cv: via ? C[via] : 0 }));
  }
  /* where the playhead is: between stops a and b, the move runs from a + .28 to b − .2 (eased) so the wire is still at
     every stop while the words arrive and leave */
  function phase(qq) {
    let a = 0; while (a < PLAN.length - 2 && qq > PLAN[a + 1].q) a++;
    const A0 = PLAN[a], B0 = PLAN[a + 1];
    const lead = a === 0 ? .3 : .28, tail = B0.s === 'taut' ? .26 : .2;
    return { a, A0, B0, u: eio(prog(qq, A0.q + lead, B0.q - tail)) };
  }
  const cr = (p0, p1, p2, p3, t) => .5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
  function shapeAt(ph) {
    const { A0, B0, u } = ph, a = K[A0.s], b = K[B0.s];
    if (!B0.via) { for (let i = 0; i < pts.length; i++) pts[i] = lerp(a[i], b[i], u); return lerp(A0.c, B0.c, u); }
    const v = K[B0.via];
    if (u < .5) { const t = u * 2; for (let i = 0; i < pts.length; i++) pts[i] = cr(a[i], a[i], v[i], b[i], t); return lerp(A0.c, B0.cv, t); }
    const t = u * 2 - 1; for (let i = 0; i < pts.length; i++) pts[i] = cr(a[i], v[i], b[i], b[i], t); return lerp(B0.cv, B0.c, t);
  }
  const sample = (t, o) => {
    const f = clamp(t) * (M - 1), i = Math.min(M - 2, Math.floor(f)), r = f - i, j = i * 3;
    return o.set(lerp(pts[j], pts[j + 3], r), lerp(pts[j + 1], pts[j + 4], r), lerp(pts[j + 2], pts[j + 5], r));
  };

  /* barbs: sparse like fence wire everywhere; gathered along the lip and under it, none at the fold itself */
  const BARBS = (() => {
    const at = (k, fs, curl) => fs.map(f => ({ t: (OFF[k] + f * NR[k]) / (M - 1), curl }));
    return [...at(0, [.5]), ...at(1, [.25, .6, .92]), ...at(2, [.2, .45, .7]), ...at(2, [.9], 1), ...at(3, [.1, .22, .34, .46, .58, .7], 1),
      ...at(4, [.32, .47, .62, .77, .92], 1), ...at(5, [.4, .85]), ...at(6, [.15, .4, .65, .9]), ...at(7, [.3, .7])].sort((x, y) => x.t - y.t);
  })();

  /* cameras at the stops: [position, target, fov, lens shift]. The base framing holds within ±35° of the profile */
  const CAM = {
    head: { p: [-60, 0, 0], t: [0, 0, 0], f: 26, s: [0, -.24] },
    web: { p: [-58, 3.5, 20], t: [10, 7, 2], f: 26, s: [0, -.2] },
    photo: { p: [-16, 1.4, 12], t: [18, 6.4, 8], f: 58, s: [-.05, -.14] },
    reb: { p: [-48, 3, 22], t: [10, 4, 9], f: 26, s: [0, -.25] },
    care: { p: [-62, 9, 14], t: [10, 3, 2], f: 28, s: [0, -.15] },
    whole: { p: [-44, 2.6, 16], t: [12, 6.5, 3], f: 30, s: [-.2, -.34] },
    end: { p: [-46, 2.8, 15], t: [12, 6.6, 3], f: 30, s: [-.2, -.34] },
    red: { p: [-60, 0, 0], t: [0, 0, 0], f: 26, s: [0, 0] }
  };
  const NAMEOF = { [ST.head]: 'head', [ST.web]: 'web', [ST.photo]: 'photo', [ST.reb]: 'reb', [ST.care]: 'care', [ST.whole]: 'whole', [ST.end]: 'end', [ST.red]: 'red' };
  const lv = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
  function cam(qq) {
    const O = window.__camO; if (O) return { p: V3(...O.p), t: V3(...O.t), f: O.f, sx: O.s[0], sy: O.s[1] };
    const ph = phase(qq), A0 = CAM[NAMEOF[ph.A0.q]], B0 = CAM[NAMEOF[ph.B0.q]], u = ph.u;
    return { p: V3(...lv(A0.p, B0.p, u)), t: V3(...lv(A0.t, B0.t, u)), f: lerp(A0.f, B0.f, u), sx: lerp(A0.s[0], B0.s[0], u), sy: lerp(A0.s[1], B0.s[1], u) };
  }

  /* the sun: a flat red disc on the line of sight through the middle of the curl, far behind it */
  const VOID = () => V3(1.18 * HU, .44 * HU, .56 * HU);
  const SUN = { [ST.photo]: .05, [ST.whole]: .036, [ST.end]: .036 };

  /* the names: flat type on screen-facing planes `d` units in front of the camera, so the wire nearer than d passes in
     front of a letter and the wire farther than d behind it. [x, baseline] in viewport fractions */
  const NAME = { web: { x: .042, y: .44, d: 63 }, photo: { x: .042, y: .925, d: 80 }, reb: { x: .042, y: .33, d: 64 }, care: { x: .042, y: .33, d: 64 } };
  function namePlanes(Kk) {
    (X.names || []).forEach(n => { G3.camera.remove(n.m); n.m.geometry.dispose(); n.m.material.map.dispose(); n.m.material.dispose(); });
    const dpr = G3.renderer.getPixelRatio(), px = Kk.W * .14;
    X.names = OFFERS.map((o, i) => {
      const c = document.createElement('canvas'), x = c.getContext('2d'); NGL.font(x, 700, px, -.06);
      const w = Math.ceil(NGL.tw(x, o.name, px, -.06) + px * .2), h = Math.ceil(px * 1.12);
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      const g = c.getContext('2d'); g.scale(dpr, dpr); NGL.font(g, 700, px, -.06); g.fillStyle = CREAM; g.textBaseline = 'alphabetic'; NGL.put(g, o.name, px * .04, px * .9, px, -.06);
      const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = T.LinearFilter;
      const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, depthTest: true, opacity: 0 }));
      m.renderOrder = 2; m.visible = false; G3.camera.add(m);
      return { m, w, h, px, k: SVC[i] };
    });
  }
  /* place a name: its box's top-left at screen (x, baseline − .9 px), at depth d, given the camera's current fov/shift */
  function placeName(n, st, a, rise) {
    const c = G3.camera, P = NAME[n.k], W = K0.W, H = K0.H, d = P.d, hh = d * Math.tan(c.fov * DEG / 2), hw = hh * c.aspect;
    const sx = (2 * hh) / H, x0 = P.x * W - n.px * .04, y0 = P.y * H - n.px * .9 + rise * n.px;
    const cx = x0 + n.w / 2, cy = y0 + n.h / 2, nx = cx / W * 2 - 1, ny = 1 - cy / H * 2;
    n.m.scale.set(n.w * sx, n.h * sx, 1); n.m.position.set((nx - st.sx) * hw, (ny - st.sy) * hh, -d);
    n.m.material.opacity = a; n.m.visible = a > .002;
  }

  let wireObj = null, lastKey = '';
  function build(Kk) {
    if (!K.flat) buildStates();
    G3.key.position.set(-4, 8, 16); G3.rim.position.set(5, -3, 8);                 /* the hero's lights, riding on the camera */
    if (!wireObj) {
      wireObj = window.NWF.createSteelWire(G3.studio, { segments: M - 1, barbs: BARBS.length, radius: .3 });
      wireObj.setBarbPositions(BARBS.map(b => b.t)); G3.scene.add(wireObj.group);
    }
    if (!X.sun) { X.sun = new T.Mesh(new T.CircleGeometry(1, 96), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); G3.scene.add(X.sun); }
    namePlanes(Kk); lastKey = '';
    X.blocks = wrapBlocks('.s-blk');
  }
  const mt = () => X._m || (X._m = new T.Matrix4()), sv = () => X._s || (X._s = V3());
  function render(qq) {
    const ph = phase(qq), st = cam(qq), key = ph.a + ':' + ph.u.toFixed(5);
    if (key !== lastKey) {
      lastKey = key; const curl = shapeAt(ph); wireObj.update(sample);
      const m4 = mt(), s3 = sv();
      BARBS.forEach((b, i) => { if (!b.curl) return; const s = Math.max(.001, ss(curl, .15, .9)); if (s >= .999) return; wireObj.knots.getMatrixAt(i, m4); m4.scale(s3.setScalar(s)); wireObj.knots.setMatrixAt(i, m4); });
      wireObj.knots.instanceMatrix.needsUpdate = true;
    }
    aim(G3.camera, st);
    /* the wire is hidden until the steel takes the line over (keeps the Bridge's last frame untouched) */
    wireObj.group.visible = qq > 2.9;
    /* the sun, held in the curl */
    let sa = 0, sr = .036; for (const q in SUN) { const w = 1 - ss(Math.abs(qq - q), .26, .42); if (w > sa) { sa = w; sr = SUN[q]; } }
    if (qq > ST.end) sa = 1 - ss(qq, ST.end + .26, ST.end + .44);
    X.sun.visible = sa > .002;
    if (X.sun.visible) {
      const c = G3.camera.position, dir = VOID().sub(c).normalize(), D = 900;
      X.sun.position.copy(c).addScaledVector(dir, D); X.sun.quaternion.copy(G3.camera.quaternion); X.sun.scale.setScalar(D * sr * eo(sa));
    }
    /* the heading lands in the sky over the flat line, and leaves before the line lifts */
    const hh = eo(prog(qq, 3.42, 3.86)), ho = ss(qq, ST.head + .16, ST.head + .32);
    R.head.style.opacity = (hh * (1 - ho)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - hh) * 28).toFixed(1)}px,0)`; R.head.style.visibility = hh > 0 && ho < 1 ? 'visible' : 'hidden';
    /* names (planes) and paragraphs (DOM, word by word) */
    X.blocks.forEach((o, i) => {
      const S = ST[SVC[i]]; stopBlock(o, S, qq);
      const inn = prog(qq, S - .26, S - .02), out = ss(qq, S + .18, S + .36), t = eo(prog(inn, 0, .6));
      placeName(X.names[i], st, inn > 0 ? t * (1 - out) : 0, (1 - t) * .12);
    });
    const e = eo(prog(qq, ST.end - .24, ST.end - .02)), eOut = ss(qq, ST.end + .14, ST.end + .3);
    R.end.style.opacity = (e * (1 - eOut)).toFixed(3); R.end.style.transform = `translate3d(0,${((1 - e) * 22 - eOut * 18).toFixed(1)}px,0)`;
    R.end.style.visibility = e > .002 && eOut < 1 ? 'visible' : 'hidden';
    R.end.classList.toggle('is-on', qq > ST.end - .05 && qq < ST.end + .14);
  }

  /* where the flat line sits on screen at the heading (the camera is level with the sea, so it is dead horizontal) */
  const lineY = () => (1 - CAM.head.s[1]) / 2 * K0.H;
  /* the entrance: once the subline has sunk away, each line of the Bridge's sentence is pressed flat in place into a
     bar, top line first, and the bars converge on the height of the sea line; they meet as one line, which runs out to
     both edges; then the steel takes it over from left to right at the same height and thickness.
     At the end the red field opens out of the taut line. */
  function entrance(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr, yl = lineY(), th = 26;
    if (qq <= 2.55) { if (R.gl.style.clipPath) R.gl.style.clipPath = ''; return; }   /* the Bridge is still drawing its own frame: add nothing */
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (qq < 3.24) {
      G.L.forEach((L, i) => {
        const t = eio(prog(qq, 2.58 + i * .03, 2.73 + i * .03)), t2 = eio(prog(qq, 2.76 + i * .015, 2.92)), fade = 1 - ss(qq, 2.98, 3.08);
        const hgt = lerp(L.HH, th * dpr, t), cy = lerp(L.Y + L.HH / 2, yl * dpr, t2);
        ctx.globalAlpha = fade; ctx.drawImage(L.C, 0, 0, L.C.width, L.HH, Math.round(L.x * dpr - L.pad * dpr), Math.round(cy - hgt / 2), L.C.width, Math.max(1, Math.round(hgt)));
      });
      const ts = eio(prog(qq, 2.56, 2.66));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM;
      G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y + ts * G.sf * .6));
      /* the one line: from the text's own width out to both edges, then handed to the steel */
      const run = eio(prog(qq, 2.9, 3.04)), hand = eio(prog(qq, 3.02, 3.2));
      if (run > 0 && hand < 1) {
        const L0 = G.L[0], x0 = lerp(L0.x, 0, run), x1 = lerp(Math.max(...G.L.map(L => L.x + L.w)), W, run), xs = Math.max(x0, hand * W);
        ctx.globalAlpha = ss(qq, 2.9, 2.98); ctx.fillStyle = CREAM; ctx.fillRect(xs, yl - th / 2, Math.max(0, x1 - xs), th);
      }
      R.gl.style.clipPath = hand < 1 ? `inset(0 ${(100 - hand * 100).toFixed(2)}% 0 0)` : '';
    } else if (R.gl.style.clipPath) R.gl.style.clipPath = '';
    const rf = eio(prog(qq, ST.red - .3, ST.red - .08));
    if (rf > 0) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = RED; const ym = H / 2; ctx.fillRect(0, ym * (1 - rf), W, H * rf); }
    ctx.restore();
  }

  window.__st = () => ({ K, pts, M });
  return hooks({
    dom, build, render, entrance, cam,
    init(Kk) { R.head = Kk.layer.querySelector('#sHead'); R.end = Kk.layer.querySelector('#sEnd'); },
    glIn: qq => qq > 2.9 ? 1 : 0
  });
})();
