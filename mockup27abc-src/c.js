/* 27C — THE KEEPER'S LIGHT (Offers)
   A lighthouse has one job, and someone keeps it every night. No tower: only the lens and the beam, and one night from dusk
   to dawn. The red dot is the flame.
     WEBSITES     RING        rings are drawn round the flame one by one, each a little different; a few cinch in to fit it
     PHOTOGRAPHY  FOCUS       a wide, even fan of light lands on nothing; the rings re-space and the fan closes on one place
     REBUILDS     RE-AIM      the flame gutters and the beam splays; one slow survey of the horizon, then a small nudge
     CARE         KEEP WATCH  the beam turns like a clock; a ping from the dark water, and the beam turns to it and holds
   Then the camera leaves the lantern: the lens and its cone sweep the dark, find a small red light on the water, and it comes
   to us. */
window.NG_EXT = (() => {
/*KIT*/
  /* ---------- the lantern: lens rings in the lens plane (x, y), the beam along -z, the whole turned by the keeper (yaw) ---------- */
  const NR = 14, NB = 70, RIM = 116, FAR = 820;
  const Z = { cinch: 0, space: 0, focus: 0, splay: 0, drift: 0, yaw: 0, near: 0, pull: 0 };
  const ringR = k => {                                 /* even at first; then ground to the flame (closer towards the rim) */
    const even = 9 + k * (RIM - 9) / (NR - 1), fres = 9 + (RIM - 9) * Math.pow(k / (NR - 1), .72);
    return lerp(even, fres, eio(Z.space)) * (CINCH.includes(k) ? 1 - .1 * eio(Z.cinch) : 1);
  };
  const CINCH = [2, 5, 9];
  const RINGS = { N: NR, at(k, s, t, out) {
    const gap = .16, a0 = k * 2.39 + .4, a = a0 + s * (TAU - gap), r = ringR(k) * (1 + .028 * Math.sin(3 * a + k) + .016 * Math.sin(5 * a + 2.1 * k));
    return out.set(Math.cos(a) * r, Math.sin(a) * r, -.0011 * r * r + (s - .5) * .6);
  } };
  /* the beam: one strand from each point of the rim out into the dark */
  const rimAt = i => { const a = i / NB * TAU + .03 * Math.sin(i * 1.7); return [Math.cos(a) * RIM, Math.sin(a) * RIM, -.0011 * RIM * RIM]; };
  const APEX = [0, -110, -FAR];                         /* the one place the light is for: a point on the water */
  const beamEnd = i => {
    const r = rimAt(i), wide = [r[0] * 4.4, r[1] * 2.8 - 90, -FAR], j = Z.splay;
    const f = eio(Z.focus), e = [lerp(wide[0], APEX[0], f), lerp(wide[1], APEX[1], f), -FAR];
    return [e[0] + j * 220 * (hash(i * 3.1) - .5), e[1] + j * 160 * (hash(i * 5.7) - .5) + j * 60, e[2] + j * 200 * (hash(i * 7.3) - .5)];
  };
  const BEAM = { N: NB, at(i, s, t, out) {
    const a = rimAt(i), b = Z.near > 0 ? L3(beamEnd(i), NEAR_P, Z.near) : beamEnd(i), sag = 18 * Z.splay * Math.sin(PI * s);
    return out.set(lerp(a[0], b[0], s), lerp(a[1], b[1], s) - sag, lerp(a[2], b[2], s));
  } };
  const L3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  let NEAR_P = [0, 0, 0];
  /* the clockwork: long drive cords into the dark below the lantern, wound each evening */
  const DRIVE = { N: 3, at(i, s, t, out) {
    const x = (i - 1) * 16, y = lerp(-RIM - 16, -1000, s), w = Z.pull * 3 * Math.sin(s * PI * 6 + i + Z.pull * 9) * Math.sin(PI * s);
    return out.set(x + w, y, 34 + (i % 2) * 10);
  } };
  /* the ghost of a new light: a whole new lens offered out of the dark, and declined */
  const GHOSTR = { N: 8, at(k, s, t, out) { const a = s * (TAU - .2) + k, r = 12 + k * 14; return out.set(Math.cos(a) * r, Math.sin(a) * r, 0); } };

  const PLACE = {
    rings: (k, s) => k < 3 ? 3.3 + .14 * k + .26 * s : 4.8 + .028 * k + .06 * s,      /* the lamp is lit at dusk with its first rings */
    beam: (i, s) => 5.86 + .2 * ((i * .618) % 1) + .26 * s,
    drive: (i, s) => 3.4 + .08 * i + .3 * s
  };

  const B = {}, D = {};
  let lantern;
  function build() {
    if (B.R) return;
    lantern = new T.Group(); G3.scene.add(lantern);
    B.R = bundle(RINGS, { place: PLACE.rings, step: 1.4, every: 9, seed: .3, minSegs: 40, sides: 8 });
    B.B = bundle(BEAM, { place: PLACE.beam, step: 8, every: 44, seed: .5, pitch: 26, maxSegs: 200, sides: 8 });
    B.D = bundle(DRIVE, { place: PLACE.drive, step: 4, every: 26, pitch: 18 });
    B.G = bundle(GHOSTR, { step: 1.4, every: 0, tone: .8 }); B.G.u.fade.value = 0;
    [B.R, B.B, B.D].forEach(b => lantern.add(b.group));
    X.dot = disc(RED); X.dot.material.depthTest = false;
    D.ping = disc(RED, 48); D.light = disc(RED, 64);
    keys();
  }

  /* ---------- the camera ---------- */
  function keys() {
    const k = (q, p, t, f = 30, stop = 0, s = [0, 0]) => ({ q, p, t, f, stop, s });
    /* cameras are written in lantern coordinates and turned with the lantern at their own moment */
    const rot = (v, a) => [v[0] * Math.cos(a) + v[2] * Math.sin(a), v[1], -v[0] * Math.sin(a) + v[2] * Math.cos(a)];
    const L = (q, p, t, f = 30, stop = 0, s = [0, 0]) => { const a = yawAt(q); return k(q, rot(p, a), rot(t, a), f, stop, s); };
    setKeys([
      k(2.55, [0, 0, 330], [0, 0, 0], 30, 0, [.22, .42]),
      k(ST.head, [0, 0, 330], [0, 0, 0], 30, 1, [.22, .42]),
      k(ST.web[0], [0, 0, 440], [0, 0, 0], 30, 1, [0, -.42]),
      k(4.95, [0, 0, 470], [0, 0, 0], 30),
      k(5.16, [-60, 30, 430], [0, 0, 0], 30),
      k(5.36, [0, 0, 60], [0, 0, 0], 30),
      k(ST.web[1], [0, 0, 11], [0, 0, 0], 30, 1),
      k(5.66, [0, 0, 110], [0, 0, 0], 30),
      k(5.98, [520, 140, 260], [0, -40, -300], 32),
      k(ST.photo[0], [1120, 110, -400], [0, -40, -400], 30, 1),
      k(ST.photo[1], [1060, 120, -420], [0, -70, -430], 30, 1, [.14, -.42]),
      k(7.5, [700, 600, 300], [0, -60, -300], 30),
      L(ST.reb[0], [0, 1000, 450], [0, -40, -170], 30, 1),
      L(ST.reb[1], [-80, 980, 420], [0, -40, -170], 30, 1, [-.16, 0]),
      L(9.1, [-300, 860, 420], [40, -60, -240], 30),
      L(ST.care[0], [-560, 700, 340], [60, -60, -300], 30, 1),
      L(ST.care[1], [-600, 690, 300], [60, -60, -300], 30, 1, [-.12, -.16]),
      L(10.75, [1000, 520, 420], [0, -80, -420], 30),
      L(ST.whole, [1500, 420, 160], [0, -80, -420], 30, 1, [.08, -.08]),
      L(ST.end, [1420, 400, 120], [0, -80, -420], 30, 1, [.14, -.1]),
      L(12.45, [900, 120, -380], [-60, -100, -700], 30),
      L(ST.hand, [700, 40, -620], [-100, -110, -800], 30, 1)
    ]);
  }

  /* ---------- the film ---------- */
  const keyOf = (...v) => v.map(x => x.toFixed(4)).join(',');
  function morph(b, key) { if (b._k !== key) { b._k = key; b.update(key); } }
  /* the keeper's hand: drift off target as the flame gutters, one survey of the horizon, a nudge back; then the clock, and the ping */
  const PING = [-520, -110, -560];                     /* where on the water the question comes from (lantern coordinates) */
  const yawTo = P => Math.atan2(-P[0], -P[2]);         /* the yaw that sends the beam (-z) towards P */
  function yawAt(qq) {
    const drift = .3 * ss(qq, 7.45, 7.85), survey = TAU * eio(prog(qq, 8.0, 8.4)), nudge = .3 * eio(prog(qq, 8.46, 8.6));
    const clock = .55 * eio(prog(qq, 8.9, 9.45)) + .3 * eio(prog(qq, 10.4, 11.0)), hold = eio(prog(qq, 9.72, 9.92)) * (1 - eio(prog(qq, 10.4, 10.7)));
    return drift + survey - nudge + clock + hold * (yawTo(PING) - .55);
  }
  function render(qq, cs) {
    Z.cinch = prog(qq, 5.02, 5.2); Z.space = prog(qq, 6.42, 6.7); Z.focus = prog(qq, 6.55, 6.98);
    Z.splay = ss(qq, 7.45, 7.85) * (1 - ss(qq, 8.48, 8.62));
    /* the keeper's hand: drift off target as the flame gutters, one survey of the horizon, a nudge; then the clock, the ping */
    Z.yaw = yawAt(qq);
    Z.pull = Math.sin(PI * prog(qq, 9.0, 9.45));
    /* the end: the beam finds a small red light on the water, and it comes to us along the beam */
    const come = prog(qq, ST.end + .08, ST.hand - .05);
    lantern.rotation.y = Z.yaw;
    morph(B.R, keyOf(Z.cinch, Z.space)); morph(B.B, keyOf(Z.focus, Z.splay, Z.near)); morph(B.D, keyOf(Z.pull));

    const night = 1 - .4 * ss(qq, 10.5, 11.2);
    lightsFor(night * .8);
    X.u.infl.value = (X.u.sil.value ? 1.4 : 0) + .0005 * Math.max(0, cs.p.distanceTo(cs.t) - 500);
    X.u.near.value.set(qq > 5.2 && qq < 5.75 ? 3 : 8, qq > 5.2 && qq < 5.75 ? 22 : 60);
    const hookQ = Math.max(...SVC.map(s => 1 - ss(Math.abs(qq - ST[s][0]), .12, .3)));
    /* the beam is lit by the flame: it gutters with it */
    const gut = ss(qq, 7.5, 7.7) * (1 - ss(qq, 8.46, 8.6));
    for (let i = 0; i < NB; i++) B.B.u.k.value[i] = 1 - gut * .6 * hash(i * 1.3 + Math.floor(qq * 60) * .37);
    B.R.u.fade.value = 1 - .7 * hookQ; B.B.u.fade.value = (1 - .75 * hookQ) * .92; B.D.u.fade.value = .85 - .6 * hookQ;
    /* the drive cord is wound: a pulse climbs it */
    B.D.u.pulse.value.set(1 - prog(qq, 9.0, 9.45), .08, 1.8 * Z.pull, 0);
    /* the honest read: the light travels the whole horizon; the ghost of a new light rises and is declined */
    B.G.group.position.set(-420, lerp(-260, -40, eo(prog(qq, 8.16, 8.3))), -520); B.G.group.rotation.y = .7;
    B.G.u.fade.value = .32 * ss(qq, 8.16, 8.22) * (1 - ss(qq, 8.3, 8.38));
    /* Websites: the rings draw round the flame one by one */
    B.R.u.pulse.value.set(prog(qq, 5.02, 5.2) * 1.1, .12, 1.4 * Math.sin(PI * prog(qq, 5.02, 5.2)), 0);
    for (let k = 0; k < NR; k++) B.R.u.k.value[k] = CINCH.includes(k) ? 1 + .25 * Math.sin(PI * prog(qq, 5.02, 5.24)) : 1;

    dot(qq, cs, come);
    type(qq);
  }
  /* the flame (the dot), the ping, the light on the water that comes to us */
  function dot(qq, cs, come) {
    const O = V3(0, 0, 0);
    let r;
    if (qq < ST.web[0] + .02) r = lerp(0, 2.2, ss(qq, 3.12, 3.3));
    else if (qq < 5.62) r = lerp(2.2, 15, eo(prog(qq, ST.web[0] + .02, ST.web[0] + .16)));
    else r = lerp(15, 4.2, eio(prog(qq, 5.55, 5.92))) * lerp(1, 1.7, ss(qq, 7.3, 7.7));
    const gut = ss(qq, 7.5, 7.7) * (1 - ss(qq, 8.46, 8.6));
    r *= 1 - gut * (.3 + .25 * Math.sin(qq * 190));
    placeDisc(X.dot, O, r * (1 - .6 * ss(qq, 11.2, 11.6)));
    X.at = toScreen(O, r);
    /* the ping on the water, and the beam glow where it lands */
    const pw = V3(...PING);
    const pg = Math.sin(PI * prog(qq, 9.62, 9.78)) + (qq > 9.78 && qq < 10.25 ? .5 : 0);
    placeDisc(D.ping, pw, 5 + 8 * Math.sin(PI * prog(qq, 9.62, 9.78)), clamp(pg) * (1 - ss(qq, 10.2, 10.35)));
    /* the end: a red light on the water at the apex of the cone; it comes along the beam towards the camera */
    const apexW = lantern.localToWorld(V3(...APEX)), lt = V3().copy(apexW).lerp(cs.p.clone().add(cs.t.clone().sub(cs.p).normalize().multiplyScalar(30)), ei(come));
    const lr = lerp(7, 40, ss(qq, ST.whole - .5, ST.whole));
    placeDisc(D.light, lt, lr, ss(qq, 10.9, 11.2)); D.light.material.depthTest = come < .3;
    redField(come > .5 ? toScreen(lt, lr) : X.at);
  }

  /* ---------- type ---------- */
  function type(qq) {
    heading(qq, 3.42, ST.head - .02, ST.head + .1, ST.head + .28);
    X.hooks.forEach((o, i) => arrive(o, ST[SVC[i]][0], qq, i === 0 ? { a0: .3, o0: .06, o1: .16 } : { a0: .3, o0: .1, o1: .26 }));
    madeForYou(X.at, prog(qq, ST.web[0] + .05, ST.web[0] + .2), ss(qq, 5.2, 5.3));
    X.revs.forEach((o, i) => arrive(o, ST[SVC[i]][1], qq, { a0: i ? .26 : .18, o0: i ? .1 : .03, o1: i ? .26 : .13 }));
    endBlock(qq, ST.end, 12.3);
  }

  /* ---------- the entrance: the Bridge's line draws in to the centre and lights the lamp ---------- */
  function entrance(ctx, qq) {
    if (qq < 3.04 || qq > 3.32) return;
    const W = K0.W, H = K0.H, dpr = K0.dpr, a = eio(prog(qq, 3.04, 3.26)), th = lerp(26, 4, eio(prog(qq, 3.04, 3.2)));
    const len = lerp(W, 0, a);
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = CREAM; ctx.globalAlpha = 1 - ss(qq, 3.22, 3.3);
    const cx = X.at ? lerp(W / 2, X.at.x, a) : W / 2, cy = X.at ? lerp(H / 2, X.at.y, a) : H / 2;
    ctx.fillRect(cx - len / 2, cy - th / 2, len, th); ctx.restore();
  }

  return hooks({ dom: typeDOM('c-hud'), build, render, entrance, glIn: qq => ss(qq, 3.1, 3.2) });
})();
