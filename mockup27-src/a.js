/* 24A — BALANCE (Offers, direction A)
   The last shot first: one barbed-wire mobile, after Calder, hanging in the dark and turning slowly, everything we do held
   in balance from a single line. The film builds it from the top down. A plumb line drops in where the bridge's sentence
   fell away; it grows an arm, and from each arm hangs the thing each service is:
     WEBSITES     a key — when it's finished, the whole thing belongs to you
     PHOTOGRAPHY  a red disc held in a ring — the subject, in the light (Calder's red disc)
     REBUILDS     a splice — two broken ends, wrapped together; a fix is what you'll get
     CARE         a bell — call, and one of us picks up; it rings at nine at night
   The camera reads down the mobile like a page, one pendant at a time. At the end it pulls back and around: four
   objects, one wire, balanced. */
window.NG_EXT = (() => {
/*KIT*/
  const ST = { head: 3.9, web: 4.8, photo: 5.7, reb: 6.6, care: 7.5, whole: 8.5, end: 9.4 };
  const SVC = ['web', 'photo', 'reb', 'care'];
  const P1 = [0, 70, 0], P2 = [58, 44, 0], P3 = [100, 16, 0];
  const H = { key: [-62, 63], ring: [22, 38], spl: [80, 11], bell: [124, 19] };   /* the arm ends things hang from */

  const dom = `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div>
  <div class="d-hud a-hud">
    <h2 class="a-head" id="aHead"><span>What you</span> <span>can hire</span> <span>us for.</span></h2>
    ${OFFERS.map((o, i) => `<section class="a-blk a-blk--${SVC[i]}"><h3 class="nm">${o.name}</h3><p>${o.body}</p></section>`).join('')}
    <div class="a-end" id="aEnd"><a class="a-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="a-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;

  /* ---------------- the mobile ---------------- */
  const S = {};
  const M = {
    broken: qq => qq == null ? 0 : 1 - eio(prog(qq, 6.22, 6.54)),                     /* the splice: apart, then joined */
    ring: qq => qq == null ? 0 : Math.sin(prog(qq, 7.24, 7.62) * PI * 4) * (1 - prog(qq, 7.24, 7.62)) * 9,   /* the bell swings once, and settles */
    turn: qq => qq == null ? [0, 0, 0] : (() => { const a = eio(prog(qq, 7.9, ST.end - .02)); return [a * 24, -a * 40, a * 58]; })()
  };
  /* pendants are drawn in their own plane, hanging from (hx, hy); z = small offsets so a returning wire lies beside itself */
  /* a hook: a small loop at an arm's end, the way Calder finished every arm */
  const hook = (x, y, z = 0) => Array.from({ length: 9 }, (_, i) => { const a = -PI / 2 + i / 8 * 2 * PI; return [x + Math.cos(a) * 1.8, y + 1.8 + Math.sin(a) * 1.8, z]; });
  function build(K) {
    const [kx, ky] = H.key, [rx, ry] = H.ring, [sx, sy] = H.spl, [bx, by] = H.bell;
    S.plumb = section(poly([[0, 300, 0], P1]));
    S.arm1a = section(spline([P1, [-20, 71.5, 0], [-44, 68.5, 0], H.key.concat(0)]));
    /* the key: bow, shaft, bit — the shaft is doubled, the way a bent-wire key is */
    S.key = section(poly([[kx, ky, 0], [kx, ky - 7, 0]].concat(
      Array.from({ length: 13 }, (_, i) => { const a = PI / 2 + i / 12 * PI; return [kx + Math.cos(a) * 7, ky - 14 + Math.sin(a) * 7, 0]; }),
      [[kx, ky - 46, 0], [kx + 10, ky - 46, 0], [kx + 10, ky - 41.5, 0], [kx + 5.5, ky - 41.5, 0], [kx + 5.5, ky - 38.5, 0], [kx + 10, ky - 38.5, 0], [kx + 10, ky - 34, 0], [kx + .3, ky - 34, .9], [kx + .3, ky - 21, .9]],
      Array.from({ length: 13 }, (_, i) => { const a = -PI / 2 + i / 12 * PI; return [kx + Math.cos(a) * 7, ky - 14 + Math.sin(a) * 7, .9]; }),
      [[kx + .3, ky - 7, .9], [kx + .3, ky, .9]]), 1.1));
    S.arm1b = section(spline([H.key.concat(.9), [-44, 69.2, .9], [-20, 72, .9], P1, [26, 75, 0], [48, 77.5, 0], [58, 76, 0]]));
    S.drop1 = section(poly(hook(58, 76).concat([[58, 74, .4], P2]), .7));
    S.arm2a = section(spline([P2, [46, 46, 0], [32, 41.5, 0], H.ring.concat(0)]));
    /* the ring that holds the red disc */
    S.ring = section((v, o) => { if (v < .06) return o.set(rx, lerp(ry, ry - 6, v / .06), 0); if (v > .94) return o.set(rx + .2, lerp(ry - 6, ry, (v - .94) / .06), .9);
      const a = PI / 2 + (v - .06) / .88 * 2 * PI; return o.set(rx + Math.cos(a) * 15, ry - 21 + Math.sin(a) * 15, (v - .06) / .88 * .9); });
    S.arm2b = section(spline([H.ring.concat(.9), [32, 42.1, .9], [46, 46.6, .9], P2, [74, 48.5, 0], [92, 50.5, 0], [100, 50, 0]]));
    S.drop2 = section(poly(hook(100, 50).concat([[100, 48, .4], P3]), .7));
    S.arm3a = section(spline([P3, [92, 16.5, 0], [86, 12.5, 0], H.spl.concat(0)]));
    /* the splice: two bars, each end wrapped round the other */
    const wrap = (x0, x1, y, turns, r) => Array.from({ length: 40 }, (_, i) => { const t = i / 39, a = t * turns * 2 * PI; return [lerp(x0, x1, t), y + Math.cos(a) * r, Math.sin(a) * r]; });
    S.spl = section((v, o, qq) => {
      const k = M.broken(qq);
      const pts = [[sx, sy, 0], [sx, sy - 9, 0], [sx + 26, sy - 9, 0], [sx + 26, sy - 9, .9], [sx - 4, sy - 9, .9]].concat(
        wrap(sx - 4, sx - 12, sy - 9, 4.5, 1.5 + 4 * k), [[sx - 26, sy - 9, 0], [sx - 26, sy - 9, -.9], [sx + 4, sy - 9, -.9]], wrap(sx + 4, sx + 12, sy - 9, 4.5, 1.5 + 4 * k), [[sx, sy - 9, .5], [sx + .3, sy, .9]]);
      S._splF = S._splF || {}; const key = k.toFixed(4); if (!S._splF[key]) { S._splF = {}; S._splF[key] = poly(pts, .6); }
      S._splF[key](v, o);
      if (k > 0 && o.y < sy - 4) { const side = Math.sign(o.x - sx) || 1; o.x += side * 9 * k; o.y += side * 2.5 * k * Math.abs(o.x - sx) / 26; }
      return o;
    }, 900);
    S.arm3b = section(spline([H.spl.concat(.9), [86, 13.1, .9], [92, 17.1, .9], P3, [110, 18.5, 0], [119, 19.6, 0], H.bell.concat(0)]));
    /* the bell: crown, two sides and a flared lip in the round, and the clapper the wire ends in */
    const prof = [[0, 3.2], [-4, 5.2], [-10, 6.4], [-16, 7.8], [-21, 10.2], [-24, 12.6]];
    S.bell = section(poly([[bx, by, 0], [bx, by - 5, 0]].concat(
      prof.map(([h, r]) => [bx - r, by - 5 + h, 0]),
      Array.from({ length: 41 }, (_, i) => { const a = PI + i / 40 * 3 * PI; return [bx + Math.cos(a) * 12.6, by - 29, Math.sin(a) * 12.6]; }),
      prof.slice().reverse().map(([h, r]) => [bx + r, by - 5 + h, 0]),
      [[bx, by - 5, .6], [bx, by - 25, 0], [bx - 1.8, by - 27, 0], [bx, by - 29, 0], [bx + 1.8, by - 27, 0], [bx, by - 25.4, 0]]), .9), 1000);
    const parts = [S.plumb, S.arm1a, S.key, S.arm1b, S.drop1, S.arm2a, S.ring, S.arm2b, S.drop2, S.arm3a, S.spl, S.arm3b, S.bell];
    const level = new Map([[S.plumb, 0], [S.arm1a, 1], [S.key, 1], [S.arm1b, 1], [S.drop1, 1], [S.arm2a, 2], [S.ring, 2], [S.arm2b, 2], [S.drop2, 2], [S.arm3a, 3], [S.spl, 3], [S.arm3b, 3], [S.bell, 3]]);
    /* everything below a pivot turns with it (innermost first); the bell swings from its hook */
    const rotY = (p, c, a) => { if (!a) return; const s = Math.sin(a * DEG), co = Math.cos(a * DEG), x = p.x - c[0], z = p.z - c[2]; p.x = c[0] + x * co + z * s; p.z = c[2] - x * s + z * co; };
    X.warp = (p, m, s) => {
      const qq = X.qq, L = level.get(s), [t1, t2, t3] = M.turn(qq);
      if (s === S.bell) { const a = M.ring(qq) * DEG, x = p.x - bx, y = p.y - by; p.x = bx + x * Math.cos(a) - y * Math.sin(a); p.y = by + x * Math.sin(a) + y * Math.cos(a); }
      if (L >= 3) rotY(p, P3, t3); if (L >= 2) rotY(p, P2, t2); if (L >= 1) rotY(p, P1, t1);
    };
    wireFrom(parts, { step: .3, barbEvery: 5.2 });
    /* the red disc, Calder's, held in the ring and turning with it */
    if (!X.disc) { X.disc = new T.Mesh(new T.CylinderGeometry(9.5, 9.5, .9, 64), new T.MeshBasicMaterial({ color: RED, toneMapped: false })); X.disc.rotation.x = PI / 2; G3.scene.add(X.disc); }
    X.discP = V3(rx, ry - 21, .45);
    X.focus = { web: V3(kx, ky - 20, 0), photo: V3(rx, ry - 21, 0), reb: V3(sx, sy - 9, 0), care: V3(bx, by - 16, 0) };
    setKeys([
      { q: 2.55, p: [0, 150, 240], t: [0, 150, 0], f: 30, s: [.26, 0], stop: 1 },
      { q: ST.head, p: [0, 128, 236], t: [0, 128, 0], f: 30, s: [.26, -.04], stop: 1 },
      { q: 4.35, p: [-30, 90, 220], t: [-30, 70, 0], f: 30, s: [.2, 0] },
      { q: ST.web, p: [-62, 46, 132], t: [-62, 44, 0], f: 30, s: [.3, 0], stop: 1 },
      { q: 5.25, p: [-10, 40, 190], t: [-6, 34, 0], f: 30, s: [.2, 0] },
      { q: ST.photo, p: [22, 18, 128], t: [22, 17, 0], f: 30, s: [.3, 0], stop: 1 },
      { q: 6.15, p: [50, 14, 180], t: [52, 10, 0], f: 30, s: [.2, 0] },
      { q: ST.reb, p: [86, 0, 88], t: [84, 1, 0], f: 30, s: [.34, .04], stop: 1 },
      { q: 7.05, p: [104, 0, 170], t: [106, -2, 0], f: 30, s: [.2, 0] },
      { q: ST.care, p: [124, 3, 122], t: [124, 3, 0], f: 30, s: [.3, 0], stop: 1 },
      { q: 8.05, p: [90, 40, 330], t: [40, 30, 0], f: 30, s: [.06, 0] },
      { q: ST.whole, p: [40, 38, 400], t: [36, 30, 0], f: 30, s: [.04, 0], stop: 1 },
      { q: 9.0, p: [-60, 56, 380], t: [40, 28, 0], f: 30, s: [.2, .03] },
      { q: ST.end, p: [-120, 64, 330], t: [44, 24, 0], f: 30, s: [.34, .06], stop: 1 }
    ]);
    X.blocks = wrapBlocks('.a-blk');
  }

  function render(qq) {
    const m = drawnAt(qq, [[2.96, mOf(S.plumb) + 150], [3.5, mOf(S.plumb) + 196], [4.0, mOf(S.plumb) + 196], [4.62, mEnd(S.key)], [4.95, mEnd(S.key)], [5.55, mEnd(S.ring)], [5.88, mEnd(S.ring)], [6.42, mEnd(S.spl)], [6.82, mEnd(S.spl)], [7.32, X.len + 1]]);
    const key = [M.broken(qq), M.ring(qq), ...M.turn(qq)].map(x => x.toFixed(3)).join('|');
    refresh(key, m);
    const st = camState(qq); aim(G3.camera, st);
    /* the story light: the pendant being spoken about is lit */
    const F = [[ST.web, 'web'], [ST.photo, 'photo'], [ST.reb, 'reb'], [ST.care, 'care']];
    let lit = 0, fc = X.focus.web; for (const [Sq, n] of F) { const w = 1 - ss(Math.abs(qq - Sq), .3, .46); if (w > lit) { lit = w; fc = X.focus[n]; } }
    X.u.fc.value.copy(fc); X.u.fr.value = 26; X.u.dim.value = lerp(1, lerp(.4, .12, lit), ss(qq, 4.1, 4.5) * (1 - ss(qq, ST.whole - .45, ST.whole - .12)));
    /* night for Care; the bell catches a warm light when it rings */
    const night = ss(qq, ST.care - .55, ST.care - .15) * (1 - ss(qq, ST.care + .25, ST.whole - .35)); lightsFor(night);
    const sw = prog(qq, ST.care - .2, ST.care - .04), on = sw < .3 ? sw / .3 * .5 : sw < .5 ? .12 : sw < .75 ? .75 : 1;
    G3.lamp.position.set(H.bell[0] + 10, H.bell[1] - 6, 26); G3.lamp.intensity = 2800 * on * (1 - ss(qq, ST.care + .25, ST.care + .6));
    /* the disc turns with its ring */
    const p = X.discP.clone(); X.warp(p, 0, S.ring); X.disc.position.copy(p);
    const [t1, t2] = M.turn(qq); X.disc.rotation.set(PI / 2, 0, 0); X.disc.rotateZ(0); X.disc.rotation.y = 0; X.disc.quaternion.setFromEuler(new T.Euler(PI / 2, (t1 + t2) * DEG, 0, 'YXZ'));
    X.disc.visible = m > mOf(S.ring) + S.ring.len * .8;
    { const d = X.u.dim.value, f = 1 - ss(X.u.fc.value.distanceTo(X.focus.photo), 26, 44); X.disc.material.color.set(RED).multiplyScalar(lerp(d, 1, f)); }
    X.disc.scale.setScalar(lerp(.6, 1, eo(prog(m, mOf(S.ring) + S.ring.len * .8, mEnd(S.ring)))));
    /* type */
    const hh = eo(prog(qq, 3.44, 3.86)), ho = ss(qq, ST.head + .16, ST.head + .34);
    R.head.style.opacity = (hh * (1 - ho)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - hh) * 30 - ho * 20).toFixed(1)}px,0)`; R.head.style.visibility = hh > 0 && ho < 1 ? 'visible' : 'hidden';
    X.blocks.forEach((o, i) => stopBlock(o, ST[SVC[i]], qq));
    const e = eo(prog(qq, ST.end - .24, ST.end - .02)); R.end.style.opacity = e.toFixed(3); R.end.style.transform = `translate3d(0,${((1 - e) * 22).toFixed(1)}px,0)`; R.end.style.visibility = e > .002 ? 'visible' : 'hidden';
    R.end.classList.toggle('is-on', qq > ST.end - .05);
  }

  /* the entrance, flat on the bridge's canvas: the sentence lets go, line by line, and falls out of the frame */
  function entrance(ctx, qq) {
    const G = A.G, H2 = K0.H, dpr = K0.dpr; if (qq > 3.2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const n = G.L.length;
    G.L.forEach((L, i) => {
      const t = prog(qq, 2.58 + (n - 1 - i) * .06, 2.98 + (n - 1 - i) * .06); if (t >= 1) return;
      const fall = t * t * H2 * 1.15, tilt = (i % 2 ? 1 : -1) * t * t * .05;           /* gravity: it starts slow and drops */
      ctx.globalAlpha = 1 - ss(t, .6, 1);
      ctx.translate(L.x * dpr, (L.y0 + fall) * dpr); ctx.rotate(tilt); ctx.drawImage(L.C, Math.round(-L.pad * dpr), 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
    const ts = prog(qq, 2.58, 2.9);
    if (ts < 1) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM; G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y + ts * ts * H2)); }
    ctx.restore();
  }

  return hooks({
    dom, build, render, entrance,
    init(Kk) { R.head = Kk.layer.querySelector('#aHead'); R.end = Kk.layer.querySelector('#aEnd'); },
    glIn: qq => ss(qq, 2.92, 3.04)
  });
})();
