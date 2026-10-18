/* 24B — A DAY ON MAUI (Offers, direction B)
   The last shot first: one wire has drawn a single sky over one horizon, the whole of a day in one line, like a long
   exposure of the sun crossing it. Read left to right it is the day, and it is the four things we do:
     WEBSITES     sunrise — the day's work begins; planned, then built
     PHOTOGRAPHY  the sun, a red disc held in its ring — photography is writing with light
     REBUILDS     rain, pulled into a rainbow — something stopped working; it is put right
     CARE         the crescent moon — a question at nine at night, and someone picks up
   The bridge's sentence sets below the horizon; the horizon is the wire; the camera walks the day from left to right
   while the light moves from dawn to night. The type lives under the horizon, on the ground. */
window.NG_EXT = (() => {
/*KIT*/
  const ST = { head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  const SUNRISE = [-130, 0, 0], SUN = [-40, 52, -20], BOW = [60, 0, 8], MOON = [152, 46, -36];

  const dom = `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div>
  <div class="d-hud b-hud">
    <h2 class="b-head" id="bHead">What you can hire us for.</h2>
    ${OFFERS.map((o, i) => `<section class="b-blk"><h3 class="nm">${o.name}</h3><p>${o.body}</p></section>`).join('')}
    ${OFFERS.map((o, i) => `<span class="b-tag" aria-hidden="true">${o.name}</span>`).join('')}
    <div class="b-end" id="bEnd"><a class="b-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="b-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;

  const S = {};
  const M = { rain: qq => qq == null ? 0 : 1 - (eo(prog(qq, 6.26, 6.56)) + .08 * Math.sin(prog(qq, 6.26, 6.56) * 3 * PI) * (1 - prog(qq, 6.26, 6.56))) };
  const arcPts = (c, r, a0, a1, n, z = c[2]) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * DEG; return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, z]; });
  function build(K) {
    /* the horizon, drawn from the right edge of the world to the sunrise */
    S.horizon = section(poly([[-460, 0, 0], [SUNRISE[0] - 18, 0, 0]]));
    /* sunrise: a half disc standing on the horizon */
    S.sunrise = section(spline(arcPts(SUNRISE, 18, 180, 0, 30), false, 'chordal'));
    /* from its foot the line climbs the sky: the sun's path, a long exposure */
    S.rise = section(spline([[SUNRISE[0] + 18, 0, 0], [-100, 6, -4], [-80, 26, -10], [-58, 44, -16], [SUN[0], SUN[1] - 18, SUN[2]]]));
    /* the sun: a ring, and the red disc inside it */
    S.sun = section(spline(arcPts(SUN, 18, -90, 270, 48), false, 'chordal'));
    S.set = section(spline([[SUN[0], SUN[1] - 18, SUN[2] + .8], [-10, 30, -10], [14, 12, 2], [BOW[0] - 34, 0, BOW[2]]]));
    /* rain becomes a rainbow: three bands over the horizon (they were falling streaks a moment ago) */
    const bowPts = [].concat(arcPts(BOW, 34, 180, 0, 40), [[BOW[0] + 28, 0, BOW[2]]], arcPts(BOW, 28, 0, 180, 34), [[BOW[0] - 22, 0, BOW[2]]], arcPts(BOW, 22, 180, 0, 28));
    const bowF = spline(bowPts, false, 'chordal');
    /* broken, the bands have slumped and kinked; pulled true, they stand as three clean arcs */
    S.bow = section((v, o, qq) => { bowF(v, o); const k = M.rain(qq); if (k > 0) {
      const dx = o.x - BOW[0]; o.y = o.y * (1 - .62 * k) + k * (3.5 * tri(v * 9.3 + .2) + 2 * Math.sin(v * 31)) * Math.min(1, o.y / 6);
      o.x += k * (dx * -.12 + 2.5 * Math.sin(v * 17)); o.z += k * 6 * Math.sin(v * 11); } return o; });
    S.night = section(spline([[BOW[0] + 22, 0, BOW[2] + .8], [BOW[0] + 40, 6, 0], [118, 30, -20], [MOON[0] - 20 * Math.cos(50 * DEG), MOON[1] + 20 * Math.sin(50 * DEG), MOON[2]]]));
    /* the crescent: an outer arc, and the inner arc of the night eating into it */
    S.moon = section(spline(arcPts(MOON, 20, 130, 410, 44).concat(arcPts([MOON[0] - 9, MOON[1] + 4, MOON[2] - .6], 15.5, 395, 145, 36)), false, 'chordal'));
    /* and at night the line comes home: down to the ground, and back along the horizon to where the day began */
    const me = V3(); S.moon.at(1, me, null);
    S.home = section(spline([[me.x, me.y, me.z], [142, 76, -32], [192, 66, -22], [228, 12, -6], [212, 0, 0], [120, 0, 0], [0, 0, 0], [SUNRISE[0] + 18.6, 0, .6]]));
    wireFrom([S.horizon, S.sunrise, S.rise, S.sun, S.set, S.bow, S.night, S.moon, S.home], { step: .32, barbEvery: 5.4 });
    if (!X.disc) { X.disc = new T.Mesh(new T.CircleGeometry(11.5, 64), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); G3.scene.add(X.disc); }
    X.disc.position.set(SUN[0], SUN[1], SUN[2] - .4);
    X.focus = { web: V3(SUNRISE[0], 9, 0), photo: V3(...SUN), reb: V3(BOW[0], 20, BOW[2]), care: V3(...MOON) };
    /* the horizon sits at the same height on screen all day: 62% down; the camera walks along it */
    const horizonAt = (y, d) => -.24 + y / (d * Math.tan(15 * DEG));        /* lens shift that keeps y = 0 at 62% down */
    setKeys([
      { q: 2.55, p: [-290, 0, 240], t: [-290, 0, 0], f: 30, s: [0, -.76], stop: 1 },
      { q: ST.head, p: [-270, 30, 240], t: [-270, 30, 0], f: 30, s: [0, horizonAt(30, 240)], stop: 1 },
      { q: ST.web, p: [-122, 15, 150], t: [-122, 15, 0], f: 30, s: [.2, horizonAt(15, 150)], stop: 1 },
      { q: ST.photo, p: [-40, 30, 200], t: [-40, 30, -20], f: 30, s: [.24, horizonAt(30, 200)], stop: 1 },
      { q: ST.reb, p: [64, 20, 170], t: [64, 20, 0], f: 30, s: [.22, horizonAt(20, 170)], stop: 1 },
      { q: ST.care, p: [148, 30, 196], t: [148, 30, -36], f: 30, s: [.24, horizonAt(30, 196)], stop: 1 },
      { q: ST.whole, p: [6, 34, 430], t: [6, 34, 0], f: 30, s: [0, horizonAt(34, 430)], stop: 1 },
      { q: ST.end, p: [6, 30, 470], t: [6, 30, 0], f: 30, s: [0, horizonAt(30, 470) + .08], stop: 1 }
    ]);
    X.blocks = wrapBlocks('.b-blk'); R.tags = [...R.layer.querySelectorAll('.b-tag')];
  }

  /* the light of the day: dawn, noon, after rain, night */
  const DAY = [[3.9, '#ffd2a6', .9], [ST.web, '#ffcf9e', 1], [ST.photo, '#fff6e7', 1.1], [ST.reb, '#dfe9f2', .9], [ST.care, '#b9c6df', .5], [ST.whole, '#fff2e0', 1]];
  function render(qq) {
    const m = drawnAt(qq, [[2.98, mEnd(S.horizon)], [4.02, mEnd(S.horizon)], [4.62, mEnd(S.sunrise)], [4.95, mEnd(S.sunrise)], [5.55, mEnd(S.sun)], [5.88, mEnd(S.sun)], [6.3, mEnd(S.bow)], [6.82, mEnd(S.bow)], [7.16, mEnd(S.moon)], [7.46, X.len + 1]]);
    refresh(M.rain(qq).toFixed(4), m);
    aim(G3.camera, camState(qq));
    let i = 0; while (i < DAY.length - 2 && qq > DAY[i + 1][0]) i++;
    const u = ss(qq, DAY[i][0], DAY[i + 1][0]), c = new T.Color(DAY[i][1]).lerp(new T.Color(DAY[i + 1][1]), u);
    G3.key.color.copy(c); const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35)); lightsFor(night);
    G3.key.intensity *= lerp(DAY[i][2], DAY[i + 1][2], u) / 1;
    let lit = 0, fc = X.focus.web; [[ST.web, 'web'], [ST.photo, 'photo'], [ST.reb, 'reb'], [ST.care, 'care']].forEach(([Sq, n]) => { const w = 1 - ss(Math.abs(qq - Sq), .3, .46); if (w > lit) { lit = w; fc = X.focus[n]; } });
    X.u.fc.value.copy(fc); X.u.fr.value = 34; X.u.dim.value = lerp(1, lerp(.45, .16, lit), ss(qq, 4.1, 4.5) * (1 - ss(qq, ST.whole - .45, ST.whole - .12)));
    /* the red sun appears as its ring closes; it dims with the rest when it is not the subject */
    X.disc.visible = m > mOf(S.sun) + S.sun.len * .85; X.disc.scale.setScalar(lerp(.5, 1, eo(prog(m, mOf(S.sun) + S.sun.len * .85, mEnd(S.sun)))));
    { const f = 1 - ss(fc.distanceTo(X.focus.photo), 30, 50); X.disc.material.color.set(RED).multiplyScalar(lerp(X.u.dim.value, 1, f) * (1 - .45 * night)); }
    /* type: the heading in the sky; each service under the horizon, name left, paragraph right */
    const hh = eo(prog(qq, 3.46, 3.86)), ho = ss(qq, ST.head + .16, ST.head + .34);
    R.head.style.opacity = (hh * (1 - ho)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - hh) * 40).toFixed(1)}px,0)`; R.head.style.visibility = hh > 0 && ho < 1 ? 'visible' : 'hidden';
    X.blocks.forEach((o, i) => stopBlock(o, ST[SVC[i]], qq));
    const tagA = ss(qq, ST.whole - .28, ST.whole - .04) * (1 - ss(qq, ST.whole + .14, ST.whole + .32)), cam = G3.camera;
    [[SUNRISE[0], -6, 0], [SUN[0], -6, SUN[2]], [BOW[0], -6, BOW[2]], [MOON[0], -6, MOON[2]]].forEach((p, i) => {
      const el = R.tags[i], v = V3(...p).project(cam); el.style.opacity = tagA.toFixed(3); el.style.visibility = tagA > .002 ? 'visible' : 'hidden';
      el.style.transform = `translate3d(${((v.x + 1) / 2 * K0.W).toFixed(1)}px,${((1 - v.y) / 2 * K0.H).toFixed(1)}px,0) translateX(-50%)`; });
    const e = eo(prog(qq, ST.end - .24, ST.end - .02)); R.end.style.opacity = e.toFixed(3); R.end.style.transform = `translate3d(-50%,${((1 - e) * 22).toFixed(1)}px,0)`; R.end.style.visibility = e > .002 ? 'visible' : 'hidden';
    R.end.classList.toggle('is-on', qq > ST.end - .05);
  }

  /* the entrance: the sentence sets. Each line sinks below a horizon drawn under the paragraph, last line first */
  function entrance(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr; if (qq > 3.2) return;
    const yh = H * .88, grow = eio(prog(qq, 2.56, 2.76));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath(); ctx.rect(0, 0, W * dpr, yh * dpr - 1); ctx.clip();
    const n = G.L.length;
    G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.62 + (n - 1 - i) * .05, 2.98 + (n - 1 - i) * .05)); const dy = t * (yh - L.y0 + 6);
      ctx.drawImage(L.C, Math.round(L.x * dpr - L.pad * dpr), Math.round((L.y0 + dy) * dpr));
    });
    const ts = eio(prog(qq, 2.6, 2.86)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92; ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM;
    G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y + ts * (yh - o.y + 30)));
    ctx.restore();
    /* the horizon line itself, cream until the steel takes it */
    const gone = 1 - ss(qq, 3.0, 3.1); if (gone <= 0) return;
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = gone; ctx.fillStyle = CREAM; ctx.fillRect(W * (1 - grow), yh - 1.5, W * grow, 3); ctx.restore();
  }

  return hooks({
    dom, build, render, entrance,
    init(Kk) { R.head = Kk.layer.querySelector('#bHead'); R.end = Kk.layer.querySelector('#bEnd'); },
    glIn: qq => ss(qq, 2.96, 3.08)
  });
})();
