/* 24C — THE WAVE (Offers, direction C)
   The last shot first: one wave, a right-hander peeling down the point the way Honolua does, built by a single wire as a
   run of cross-sections, rib after rib, with a red sun seen through the barrel. Its sections are the four things we do:
     WEBSITES     the swell taking shape — the wave is planned before it breaks
     PHOTOGRAPHY  inside the barrel, looking out at the light — the shot everyone remembers
     REBUILDS     the closeout — the section that falls apart, and stands back up clean
     CARE         the next set lining up behind it — launch day is not goodbye
   The bridge's sentence ripples and washes out; what is left is the waterline. The camera paddles along the wave,
   goes inside it, and finally sits in the channel where the photograph is taken. */
window.NG_EXT = (() => {
/*KIT*/
  const ST = { head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  const X0 = -150, X1 = 150, NS = 46;                                   /* the wave runs along x; it breaks toward +z */

  const dom = `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div>
  <div class="d-hud c-hud">
    <h2 class="c-head" id="cHead">What you can hire us for.</h2>
    ${OFFERS.map((o, i) => `<section class="c-blk c-blk--${SVC[i]}"><h3 class="nm">${o.name}</h3><p>${o.body}</p></section>`).join('')}
    <div class="c-end" id="cEnd"><a class="c-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="c-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;

  /* the wave's cross-section at each point along it: [z, y] from the back of the swell to the front, seven points */
  const STAGES = [
    [0, [[-40, 0], [-28, 2], [-14, 5], [-2, 7.5], [8, 6.5], [18, 3], [28, 0]]],                  /* the shoulder: a swell */
    [.3, [[-40, 0], [-26, 6], [-12, 16], [-2, 25], [8, 23], [14, 12], [17, 0]]],                   /* the face stands up */
    [.56, [[-40, 0], [-24, 11], [-10, 28], [6, 36], [22, 31], [28, 17], [22, 4]]],             /* the barrel */
    [.8, [[-40, 0], [-24, 8], [-10, 17], [2, 20], [12, 16], [20, 9], [26, 2]]],                   /* the lip comes down */
    [1, [[-40, 0], [-24, 3], [-8, 6], [6, 7], [18, 5], [28, 3], [36, 0]]]                         /* whitewater */
  ];
  const profile = s => {
    let i = 0; while (i < STAGES.length - 2 && s > STAGES[i + 1][0]) i++;
    const [s0, a] = STAGES[i], [s1, b] = STAGES[i + 1], u = ss(s, s0, s1);
    return a.map((p, k) => [lerp(p[0], b[k][0], u), lerp(p[1], b[k][1], u)]);
  };
  const M = { mess: qq => qq == null ? 0 : 1 - (eo(prog(qq, 6.24, 6.56)) + .08 * Math.sin(prog(qq, 6.24, 6.56) * 3 * PI) * (1 - prog(qq, 6.24, 6.56))) };
  /* a run of slices from i0 to i1 (exclusive), alternating direction so the wire never doubles back on itself;
     the slices' ends make two long lines: the back of the swell and the lip */
  function slices(i0, i1, noise) {
    const cache = {};
    const ptsFor = k => {
      const pts = [];
      for (let i = i0; i < i1; i++) {
        const x = lerp(X0, X1, i / (NS - 1)), s = (x - X0) / (X1 - X0), P = profile(s);
        const curve = new T.CatmullRomCurve3(P.map(([z, y]) => V3(x, y, z)), false, 'centripetal'), N = 22;
        const row = Array.from({ length: N + 1 }, (_, j) => curve.getPoint(j / N));
        if (noise && k > 0) row.forEach((p, j) => { const w = Math.sin(PI * j / N) * k; p.y += w * (3.2 * Math.sin(i * 2.3 + j * 1.7) + 2 * tri(j * .37 + i * .21)); p.z += w * 4 * Math.sin(i * 1.3 + j * 2.9); p.x += w * 2.5 * Math.sin(i * 3.1 + j); });
        if (i % 2 === 0) row.reverse();                                   /* even slices run front to back, odd back to front: the wire zigzags along the base and the lip */
        row.forEach(p => pts.push([p.x, p.y, p.z]));
      }
      return pts;
    };
    return (v, o, qq) => { const k = noise ? M.mess(qq) : 0, key = k.toFixed(4); if (!cache[key]) { for (const c in cache) delete cache[c]; cache[key] = spline(ptsFor(k), false, 'centripetal'); } return cache[key](v, o); };
  }
  const S = {};
  const iOf = x => Math.round((x - X0) / (X1 - X0) * (NS - 1));
  function build(K) {
    /* the waterline: the calm sea leading into the point, at the foot of the wave's face */
    S.sea = section(poly([[-430, 0, 28], [X0, 0, 28]]));
    S.shoulder = section(slices(0, iOf(-48)), 1400);
    S.barrel = section(slices(iOf(-48), iOf(46)), 1600);
    S.close = section(slices(iOf(46), iOf(110), true), 1400);
    S.white = section(slices(iOf(110), NS), 900);
    /* …and back out to sea behind it: the next set, two long lines of swell lining up */
    const e = V3(); S.white.at(1, e, null);
    S.set = section(spline([[e.x, e.y, e.z], [170, 3, -50], [120, 4.5, -72], [0, 6, -76], [-140, 4.5, -72], [-260, 3, -70], [-300, 2, -96], [-200, 4, -112], [-40, 5.5, -116], [120, 4, -112], [260, 2, -108]]));
    wireFrom([S.sea, S.shoulder, S.barrel, S.close, S.white, S.set], { step: .42, barbEvery: 6.2 });
    /* the sun at the end of the barrel */
    if (!X.sun) { X.sun = new T.Mesh(new T.CircleGeometry(16, 64), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); X.sun.rotation.y = -PI / 2; G3.scene.add(X.sun); }
    X.sun.position.set(420, 24, 4); X.sun.rotation.y = -PI / 2 + .3;
    X.focus = { web: V3(-100, 8, 0), photo: V3(0, 14, 4), reb: V3(78, 10, 4), care: V3(0, 5, -90) };
    setKeys([
      { q: 2.55, p: [-300, 0, 260], t: [-300, 0, 28], f: 30, s: [0, 0], stop: 1 },
      { q: ST.head, p: [-280, 14, 240], t: [-280, 4, 28], f: 30, s: [0, -.1], stop: 1 },
      { q: 4.35, p: [-170, 30, 210], t: [-120, 8, 0], f: 30, s: [.12, 0] },
      { q: ST.web, p: [10, 12, 120], t: [-110, 5, 0], f: 30, s: [.3, -.1], stop: 1 },
      { q: 5.25, p: [-40, 14, 70], t: [10, 14, 0], f: 40, s: [.1, 0] },
      { q: ST.photo, p: [-30, 11, 6], t: [80, 14, 6], f: 54, s: [.12, 0], stop: 1 },
      { q: 6.15, p: [30, 30, 130], t: [70, 8, 0], f: 32, s: [.16, 0] },
      { q: ST.reb, p: [200, 14, 110], t: [78, 8, 0], f: 30, s: [.3, -.1], stop: 1 },
      { q: 7.05, p: [190, 40, 40], t: [40, 4, -90], f: 32, s: [.1, 0] },
      { q: ST.care, p: [60, 60, 120], t: [-20, 0, -90], f: 30, s: [.2, -.06], stop: 1 },
      { q: 8.05, p: [-60, 70, 220], t: [10, 10, 0], f: 30, s: [.06, 0] },
      { q: ST.whole, p: [-300, 30, 230], t: [20, 12, 0], f: 30, s: [.04, -.04], stop: 1 },
      { q: 9.0, p: [-270, 16, 170], t: [30, 14, 0], f: 30, s: [.14, -.04] },
      { q: ST.end, p: [-240, 9, 130], t: [40, 16, 0], f: 30, s: [.3, -.12], stop: 1 }
    ]);
    X.blocks = wrapBlocks('.c-blk');
  }

  function render(qq) {
    const m = drawnAt(qq, [[2.98, mEnd(S.sea)], [4.0, mEnd(S.sea)], [4.66, mEnd(S.shoulder)], [4.92, mEnd(S.shoulder)], [5.56, mEnd(S.barrel)], [5.86, mEnd(S.barrel)], [6.3, mEnd(S.close)], [6.82, mEnd(S.close)], [7.4, X.len + 1]]);
    refresh(M.mess(qq).toFixed(3), m);
    aim(G3.camera, camState(qq));
    let lit = 0, fc = X.focus.web; [[ST.web, 'web'], [ST.photo, 'photo'], [ST.reb, 'reb'], [ST.care, 'care']].forEach(([Sq, n]) => { const w = 1 - ss(Math.abs(qq - Sq), .3, .46); if (w > lit) { lit = w; fc = X.focus[n]; } });
    X.u.fc.value.copy(fc); X.u.fr.value = 46; X.u.dim.value = lerp(1, lerp(.5, .2, lit), ss(qq, 4.1, 4.5) * (1 - ss(qq, ST.whole - .45, ST.whole - .12)));
    const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35)); lightsFor(night);
    G3.key.color.set(qq < 7 ? '#fff6e7' : '#e6ecf5');
    X.sun.visible = m > mOf(S.barrel) + S.barrel.len * .5; X.sun.material.color.set(RED).multiplyScalar(1 - .5 * night);
    const hh = eo(prog(qq, 3.46, 3.86)), ho = ss(qq, ST.head + .16, ST.head + .34);
    R.head.style.opacity = (hh * (1 - ho)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - hh) * 36).toFixed(1)}px,0)`; R.head.style.visibility = hh > 0 && ho < 1 ? 'visible' : 'hidden';
    X.blocks.forEach((o, i) => stopBlock(o, ST[SVC[i]], qq));
    const e = eo(prog(qq, ST.end - .24, ST.end - .02)); R.end.style.opacity = e.toFixed(3); R.end.style.transform = `translate3d(0,${((1 - e) * 22).toFixed(1)}px,0)`; R.end.style.visibility = e > .002 ? 'visible' : 'hidden';
    R.end.classList.toggle('is-on', qq > ST.end - .05);
  }

  /* the entrance: the sentence ripples like a reflection and washes out; a waterline is what's left */
  function entrance(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr; if (qq > 3.2) return;
    const yw = H * .5;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    G.L.forEach((L, i) => {
      const t = prog(qq, 2.58 + i * .05, 2.96 + i * .05); if (t >= 1) return;
      const strips = 14, sh = Math.ceil(L.HH / strips), x0 = Math.round(L.x * dpr - L.pad * dpr), ty = lerp(L.y0, yw - L.HH / dpr / 2, eio(t));
      ctx.globalAlpha = 1 - ss(t, .45, .95);
      for (let k = 0; k < strips; k++) {
        const amp = t * 26 * dpr, dx = Math.sin(k * .9 + t * 9 + i) * amp, sy = k * sh, hgt = Math.min(sh, L.HH - sy);
        ctx.drawImage(L.C, 0, sy, L.C.width, hgt, x0 + dx, Math.round(ty * dpr + sy * (1 - .85 * eio(t))), L.C.width, Math.max(1, hgt * (1 - .85 * eio(t))));
      }
    });
    const ts = prog(qq, 2.6, 2.86); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM;
    G.sub.forEach((o, k) => ctx.fillText(o.w, o.x + Math.sin(k + qq * 30) * ts * 18, lerp(o.y, yw, ts)));
    const line = ss(qq, 2.8, 2.94) * (1 - ss(qq, 3.0, 3.1));
    if (line > 0) { ctx.globalAlpha = line; ctx.fillStyle = CREAM; ctx.fillRect(0, yw - 2, W, 4); }
    ctx.restore();
  }

  return hooks({
    dom, build, render, entrance,
    init(Kk) { R.head = Kk.layer.querySelector('#cHead'); R.end = Kk.layer.querySelector('#cEnd'); },
    glIn: qq => ss(qq, 2.96, 3.08)
  });
})();
