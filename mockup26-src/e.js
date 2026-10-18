/* 26 — THE STRAND WORKS (Offers)
   Four sculptures stand in the dark, each made of many separate barbed-wire strands, each earning its service:
     WEBSITES     a flat plan lies on the ground, then stands up as one torqued span: authored, load-bearing, planned
     PHOTOGRAPHY  a breaking wave seen end-on from inside its barrel, the sun at the far mouth: framing, looking, the one shot
     REBUILDS     a plait coming apart into three ribbons on one side and plaited true on the other: put back in order
     CARE         strands gathered at one low root spring over a small red ember, like a hand cupped round a flame
   The one red dot is the Bridge's full stop. It sits at the heart of each piece, travels between them, and at the end
   rises over the four pieces standing round it, and fills the frame for Packages. The camera is the only thing that moves
   between stops; the construction (each strand drawn from its own start) plays as the camera travels. */
window.NG_EXT = (() => {
/*KIT*/
/*FORMS*/
  const ST = { head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4, red: 10.2 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  /* the four stand in a row, each turned to show the face the stops show; the film's camera tracks along them */
  const POS = { web: [-40, 0, -115], photo: [170, 0, -25], reb: [-50, 0, 80], care: [215, 0, 175], field: [0, 0, 0] }, YAW = { web: 0, photo: PI, reb: PI / 2, care: -.855, field: 0 };
  const YAX = () => V3(0, 1, 0);
  const PHI = k => YAW[k], WP = k => POS[k];
  /* local (sculpture) coordinates to world */
  const L2W = (k, a) => V3(...a).applyAxisAngle(YAX(), PHI(k)).add(V3(...WP(k)));
  const W2A = v => [v.x, v.y, v.z];
  const LC = (k, a) => W2A(L2W(k, a));

  const dom = `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div>
  <div class="d-hud e-hud">
    <h2 class="e-head" id="eHead">What you can hire us for.</h2>
    ${OFFERS.map((o, i) => `<section class="e-blk e-blk--${SVC[i]}"><h3 class="nm">${o.name}</h3><p>${o.body}</p></section>`).join('')}
    <div class="e-end" id="eEnd"><a class="e-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="e-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;

  /* when each point of each strand is drawn */
  const PLACE = {
    web: (i, s) => {
      const M = FORMS.web.meta, x = lerp(M.xa, M.xb, s), c = i / (M.N - 1);
      if (x < M.xj) return 4.0 + .2 * c + .3 * (x - M.xa) / (M.xj - M.xa);                  /* the plan comes in from the left edge ... */
      return 4.14 + .22 * c + .36 * (x - M.xj) / (M.xb - M.xj);                             /* ... and stands up, strand after strand */
    },
    photo: (i, s) => 4.9 + .36 * (i / (FORMS.photo.N - 1)) + .26 * s,
    reb: (i, s) => 5.82 + .26 * ((i * .37) % 1) + .26 * s,
    care: (i, s) => 6.86 + .3 * Math.abs(2 * i / (FORMS.care.N - 1) - 1) + .3 * s,
    field: (i, s) => 3.0 + .1 * Math.abs(2 * i / (FORMS.field.N - 1) - 1) + .75 * (1 - s)
  };
  const S = {};
  const HEAD_Y = 5;
  function build(K) {
    if (!S.web) {
      const o = { web: {}, photo: {}, reb: {}, care: {} };
      SVC.forEach(k => { S[k] = sculpture(k, FORMS[k], { p: WP(k), yaw: PHI(k) }, { place: PLACE[k], step: { web: .9, photo: .6, reb: .75, care: .8 }[k], every: { web: 13, photo: 8.5, reb: 7.5, care: 8.5 }[k] }); });
      S.field = sculpture('field', FORMS.field, { p: WP('field'), yaw: 0 }, { place: PLACE.field, step: 7, every: 90, radius: .1, dim: true });
      dot();
    }
    X.focus = { web: LC('web', [0, 30, 0]), photo: LC('photo', [0, 26, 0]), reb: LC('reb', [0, 18, 0]), care: LC('care', [0, 18, 0]) };
    const key = (q, k, p, t, f, s, d, r, stop) => ({ q, p: LC(k, p), t: LC(k, t), f, s, d: LC(k, d), r, stop });
    const way = (q, p, t, f, d, r, stop) => ({ q, p, t, f, s: [0, 0], d, r, stop });
    const mid = (q, a, b) => ({ q, p: V3(...a.p).lerp(V3(...b.p), .5).add(V3(0, 120, 0)), t: V3(...a.t).lerp(V3(...b.t), .5), f: 34, s: [0, 0], d: V3(...a.d).lerp(V3(...b.d), .5).add(V3(0, 25, 0)), r: (a.r + b.r) / 2 + 4 });
    const kh = key(ST.head, 'web', [-330, 30, 0], [0, 30, 0], 28, [0, 0], [820, 30, 0], 5, 1),
      kw = key(ST.web, 'web', [40, 64, 250], [-40, 26, 0], 36, [.12, 0], [0, 22, -30], 9, 1),
      kp = key(ST.photo, 'photo', [190, 12, 40], [0, 40, 10], 30, [.3, -.05], [-180, 86, -23], 30, 1),
      kr = key(ST.reb, 'reb', [-30, 26, 235], [-8, 16, 0], 32, [.2, -.1], [-26, 8, -14], 7, 1),
      kc = key(ST.care, 'care', [-110, 40, 130], [0, 22, 0], 30, [0, 0], [10, 11, 14], 5, 1);
    const fin = (q, p, t, d, r, stop, sx = .24) => ({ q, p: V3(...p), t: V3(...t), f: 34, s: [sx, -.04], d: V3(...d), r, stop });
    const SUN = [1500, 70, 0];
    setKeys([
      { ...kh, q: 2.55, r: 0 }, { ...kh, q: 3.3 }, kh,
      key(4.35, 'web', [-200, 30, 130], [-10, 24, 0], 30, [0, 0], [380, 30, -20], 6),
      kw, mid(5.25, kw, kp), kp, mid(6.15, kp, kr), kr, mid(7.05, kr, kc), kc,
      fin(8.0, [-300, 200, 120], [60, 20, 30], [400, 80, 0], 60, 0, .2),
      fin(ST.whole, [-470, 110, 0], [90, 22, 0], SUN, 230, 1),
      fin(9.0, [-405, 96, 0], [90, 22, 0], SUN, 250),
      fin(ST.end, [-390, 92, 0], [90, 22, 0], SUN, 270, 1),
      fin(9.85, [-370, 86, 0], [90, 22, 0], [300, 80, 0], 150),
      fin(ST.red, [-350, 80, 0], [90, 22, 0], [-200, 82, 0], 900, 1)
    ]);
    X.blocks = wrapBlocks('.e-blk');
  }

  function render(qq) {
    const cs = window.__cam ? window.__cam(qq) : camState(qq); aim(G3.camera, cs);
    SVC.forEach(k => S[k].show(qq)); S.field.show(qq);
    S.reb.setT(.62 * ss(qq, 6.05, 6.55));
    X.u.rev.value = qq + .001;
    const all = ss(qq, 7.7, 8.3);
    SVC.forEach((k, j) => { const w = 1 - ss(Math.abs(qq - ST[k]), .3, .5); X.u.F.value[j].set(...X.focus[k], Math.max(w, all)); });
    X.u.fr.value = [140, 110, 110, 72]; X.u.dim.value = lerp(1, .05, ss(qq, 4.1, 4.5)) * (1 - all) + all;
    const night = ss(qq, ST.care - .5, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35)); lightsFor(night);
    X.u.infl.value = .0006 * Math.max(0, cs.p.distanceTo(cs.t) - 270);
    const D = X.dot; D.position.copy(cs.d); D.scale.setScalar(Math.max(.001, cs.r)); D.quaternion.copy(G3.camera.quaternion); D.visible = cs.r > .02;
    D.material.color.set(RED).multiplyScalar(1 - .35 * night);
    const em = LC('care', [4, 12, 0]); G3.lamp.position.set(em[0], em[1] + 2, em[2]); G3.lamp.intensity = 5200 * ss(qq, ST.care - .4, ST.care - .1) * (1 - ss(qq, ST.care + .3, ST.care + .6));
    const hh = eo(prog(qq, 3.46, 3.86)), ho = ss(qq, ST.head + .16, ST.head + .34);
    R.head.style.opacity = (hh * (1 - ho)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - hh) * 36).toFixed(1)}px,0)`; R.head.style.visibility = hh > 0 && ho < 1 ? 'visible' : 'hidden';
    X.blocks.forEach((o, i) => stopBlock(o, ST[SVC[i]], qq));
    const e = eo(prog(qq, ST.end - .24, ST.end - .02)) * (1 - ss(qq, ST.red - .5, ST.red - .25)); R.end.style.opacity = e.toFixed(3); R.end.style.transform = `translate3d(0,${((1 - e) * 22).toFixed(1)}px,0)`; R.end.style.visibility = e > .002 ? 'visible' : 'hidden';
    R.end.classList.toggle('is-on', qq > ST.end - .05 && qq < ST.red - .4);
  }

  /* the entrance (from 25): the Bridge's lines are pressed flat into bars, which converge on the horizon and run out to both
     edges as one line; the line thins as the plan draws itself in from the vanishing point beneath it */
  const lineY = () => K0.H / 2;
  function entrance(ctx, qq) {
    const G = A.G, W = K0.W, H = K0.H, dpr = K0.dpr, yl = lineY(), th = 26;
    if (qq <= 2.55 || qq > 3.8) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (qq < 3.24) G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.58 + i * .03, 2.73 + i * .03)), t2 = eio(prog(qq, 2.76 + i * .015, 2.92)), fade = 1 - ss(qq, 3.02, 3.14);
      const hgt = lerp(L.HH, th * dpr, t), cy = lerp(L.Y + L.HH / 2, yl * dpr, t2);
      ctx.globalAlpha = fade; ctx.drawImage(L.C, 0, 0, L.C.width, L.HH, Math.round(L.x * dpr - L.pad * dpr), Math.round(cy - hgt / 2), L.C.width, Math.max(1, Math.round(hgt)));
    });
    if (qq < 3.24) {
      const ts = eio(prog(qq, 2.56, 2.66));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM;
      G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y + ts * G.sf * .6));
    }
    const run = eio(prog(qq, 2.9, 3.04)), thin = eio(prog(qq, 3.08, 3.5)), fade = 1 - ss(qq, 3.45, 3.78);
    if (run > 0 && fade > 0) {
      const L0 = G.L[0], x0 = lerp(L0.x, 0, run), x1 = lerp(Math.max(...G.L.map(L => L.x + L.w)), W, run), h = lerp(th, 2.5, thin);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = ss(qq, 2.9, 2.98) * fade; ctx.fillStyle = CREAM;
      ctx.fillRect(Math.round(x0 * dpr), Math.round((yl - h / 2) * dpr), Math.round((x1 - x0) * dpr), Math.max(1, Math.round(h * dpr)));
    }
    ctx.restore();
  }

  window.__nw.LC = LC; window.__nw.V3 = V3;
  return hooks({
    dom, build, render, entrance,
    init(Kk) { R.head = Kk.layer.querySelector('#eHead'); R.end = Kk.layer.querySelector('#eEnd'); },
    glIn: qq => qq > 2.9 ? 1 : 0
  });
})();
