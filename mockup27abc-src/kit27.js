  /* ======== KIT 27: what the three Offers films share. Strand bundles (each a whole sculpture in two draw calls), the steel
     shader (draw-on, story lights, per-strand gain, a pulse along the strands, a soft near-camera fade), the camera (with roll),
     flat discs, the section clock, the copy split, the type choreography, the Bridge entrance and the film hooks. ======== */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), prog = (v, a, b) => clamp((v - a) / (b - a));
  const ss = (v, a, b) => { const t = prog(v, a, b); return t * t * (3 - 2 * t); };
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3), ei = t => t * t * t;
  const lerp = (a, b, t) => a + (b - a) * t, DEG = Math.PI / 180, PI = Math.PI, TAU = PI * 2;
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const CREAM = '#e9e1ce', RED = '#c0230b', INK = '#17150f';
  const { OFFERS, HEADING } = NGL;
  const SVC = ['web', 'photo', 'reb', 'care'];
  /* the section clock, in section time q (p = q + 4.8): each offer has a hook stop and a reveal stop */
  const ST = { head: 3.9, web: [4.7, 5.5], photo: [6.3, 7.1], reb: [7.9, 8.7], care: [9.5, 10.3], whole: 11.2, end: 12.0, hand: 12.8 };
  /* the copy, verbatim, broken once into hook and reveal */
  const COPY = OFFERS.map((o, i) => {
    const k = o.body.indexOf(['When it’s finished', 'Isabella takes', 'Send it over.', 'Updates, small'][i]);
    if (k < 1) throw new Error('copy split ' + o.name);
    return { name: o.name, hook: o.body.slice(0, k).trim(), reveal: o.body.slice(k).trim() };
  });
  let A = null, K0 = null, T = null, G3 = null, R = {}, X = {}, ready = false;
  const V3 = (...a) => new T.Vector3(...a);

  /* ---------- camera keys: {q, p, t, f, s:[shiftX, shiftY], roll (deg), stop}. Between two stops the camera eases along the
     waypoints; at a stop it is still. ---------- */
  let KEYS = [], posCurve, tgtCurve;
  function setKeys(keys) {
    KEYS = keys.map(k => ({ roll: 0, s: [0, 0], ...k, p: V3(...k.p), t: V3(...k.t) }));
    const cr = a => new T.CatmullRomCurve3(a, false, 'centripetal');
    posCurve = cr(KEYS.map(k => k.p)); tgtCurve = cr(KEYS.map(k => k.t));
  }
  const nextStop = a => { for (let j = a + 1; j < KEYS.length; j++) if (KEYS[j].stop) return j; return null; };
  function camState(qq) {
    const n = KEYS.length; qq = clamp(qq, KEYS[0].q, KEYS[n - 1].q);
    let a = 0; while (a < n - 1 && !(KEYS[a].stop && nextStop(a) !== null && qq <= KEYS[nextStop(a)].q)) a++;
    const b = nextStop(a) ?? a, qv = b === a ? KEYS[a].q : lerp(KEYS[a].q, KEYS[b].q, eio(prog(qq, KEYS[a].q, KEYS[b].q)));
    let i = a; while (i < b - 1 && qv > KEYS[i + 1].q) i++;
    const k0 = KEYS[i], k1 = KEYS[Math.min(i + 1, n - 1)], l = k1 === k0 ? 0 : prog(qv, k0.q, k1.q), u = (i + l) / (n - 1);
    return { p: posCurve.getPoint(u), t: tgtCurve.getPoint(u), f: lerp(k0.f, k1.f, l), sx: lerp(k0.s[0], k1.s[0], l), sy: lerp(k0.s[1], k1.s[1], l), roll: lerp(k0.roll, k1.roll, l), qv };
  }
  function aim(c, st) {
    c.position.copy(st.p); c.up.set(0, 1, 0); c.fov = st.f; c.aspect = K0.W / K0.H; c.lookAt(st.t); if (st.roll) c.rotateZ(st.roll * DEG);
    c.near = .3; c.far = 9000; c.updateProjectionMatrix();
    const e = c.projectionMatrix.elements; e[8] = -st.sx; e[9] = -st.sy; c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); c.updateMatrixWorld(true);
  }
  /* world point to CSS pixels (and the pixel size of a world length there) */
  const _p = { v: null };
  function toScreen(v, r = 0) {
    const c = G3.camera, w = _p.v || (_p.v = V3()); w.copy(v).project(c);
    const d = v.clone().applyMatrix4(c.matrixWorldInverse).z, px = r * K0.H / (2 * Math.tan(c.fov * DEG / 2) * Math.max(.001, -d));
    return { x: (w.x + 1) / 2 * K0.W, y: (1 - w.y) / 2 * K0.H, r: px, front: d < 0 };
  }

  /* ---------- the steel ---------- */
  let tooling = null;
  function stage() {
    const renderer = new T.WebGLRenderer({ canvas: R.gl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    const studio = window.NWF.createSteelStudio(renderer), scene = new T.Scene(); scene.environment = studio.environment;
    tooling = studio.silver.onBeforeCompile;
    const sil = /[?&]sil\b/.test(location.search) ? 1 : 0;      /* ?sil: every strand as a fat flat ribbon, the silhouette test */
    X.u = { F: { value: [0, 1, 2, 3].map(() => new T.Vector4(0, 0, 0, 0)) }, fr: { value: [100, 100, 100, 100] }, dim: { value: 1 }, infl: { value: sil * 1.4 }, near: { value: new T.Vector2(0, 0) }, sil: { value: sil } };
    const camera = new T.PerspectiveCamera(30, 1, .3, 9000); scene.add(camera);
    const key = new T.DirectionalLight('#fff6e7', 2.1), rim = new T.DirectionalLight('#dce7ed', 1.2);
    key.position.set(-4, 7.4, -8); key.target.position.set(0, 0, -24); rim.position.set(5, -3.6, -16); rim.target.position.set(0, 0, -24);
    camera.add(key, key.target, rim, rim.target);
    const lamp = new T.PointLight('#ff3b1a', 0, 0, 2); scene.add(lamp);
    G3 = { renderer, scene, camera, studio, key, rim, lamp, bundles: [], discs: [] };
  }
  function steel(u, tone = 1) {
    const m = G3.studio.silver.clone(); m.color.multiplyScalar(tone);
    m.onBeforeCompile = (sh, r) => {
      tooling(sh, r);
      Object.assign(sh.uniforms, { uRev: u.rev, uF: X.u.F, uFr: X.u.fr, uDim: X.u.dim, uInfl: X.u.infl, uNear: X.u.near, uSil: X.u.sil, uFade: u.fade, uK: u.k, uPulse: u.pulse, uGlow: u.glow, uBarb: u.barb });
      sh.vertexShader = 'attribute float aM;\nattribute float aS;\nvarying float vM;\nvarying float vS;\nvarying vec3 vFp;\nuniform float uInfl, uRev, uBarb;\n' + sh.vertexShader
        .replace('#include <begin_vertex>', `#include <begin_vertex>
  vM = aM; vS = aS;
  #ifdef USE_INSTANCING
    transformed *= max(.001, smoothstep(aM - .02, aM + .16, uRev) * uBarb);
  #else
    transformed += objectNormal * uInfl;
  #endif`)
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFp = (modelMatrix * vec4(transformed, 1.0)).xyz;\n  #ifdef USE_INSTANCING\n  vFp = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n  #endif');
      sh.fragmentShader = `uniform float uRev, uDim, uFade, uSil;\nuniform float uFr[4];\nuniform vec4 uF[4];\nuniform vec2 uNear;\nuniform float uK[128];\nuniform vec4 uPulse;\nuniform vec3 uGlow;
varying float vM;\nvarying float vS;\nvarying vec3 vFp;
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(.06711056, .00583715)))); }\n` + sh.fragmentShader
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
  float kk = uK[int(clamp(vS, 0.0, 127.0))] * uFade;
  if (vM > uRev || kk < .012) discard;
  if (uNear.y > 0.0 && smoothstep(uNear.x, uNear.y, distance(vFp, cameraPosition)) < ign(gl_FragCoord.xy)) discard;`)
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>
  float lit = 0.0; for (int i = 0; i < 4; i++) lit = max(lit, uF[i].w * (1.0 - smoothstep(uFr[i], uFr[i] * 1.5, distance(vFp, uF[i].xyz))));
  float sid = floor(vS), pz = (vS - sid - (uPulse.x - sid * uPulse.w)) / max(.001, uPulse.y);
  gl_FragColor.rgb = gl_FragColor.rgb * mix(uDim, 1.0, lit) * kk + uGlow * uPulse.z * exp(-pz * pz) * min(kk, 1.0);
  if (uSil > 0.5) gl_FragColor = vec4(.82, .78, .70, 1.0);`);
    };
    m.customProgramCacheKey = () => 'nk27';
    return m;
  }

  /* the barb, lighter: the hero's two-turn barb with a fifth of the triangles */
  let BARB = null;
  function lightBarb() {
    if (BARB) return BARB;
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
    const m = new T.BufferGeometry(); m.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); m.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); m.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); m.setIndex(idx);
    return (BARB = m);
  }

  /* ---------- a bundle: N separate barbed wires (each a twisted pair of steel strands), one sculpture, two draw calls.
     form = { N, at(i, s, t, out) }: strand i, s in [0,1] along it, t any state the direction morphs by.
     place(i, s) is the film time at which that point is drawn (the construction plays as q runs).
     update(t) re-forms every strand; the caller decides when (only when t changes). ---------- */
  const ZA = [0, 0, 1], YA = [0, 1, 0];
  function bundle(form, o = {}) {
    const N = form.N, sides = o.sides || 10, rad = o.radius || .17, pitch = o.pitch || 2.65 * rad / .23, step = o.step || .8;
    const place = o.place || (() => -1e9), tmp = V3(), t0 = o.t ?? 0;
    const u = { rev: { value: 1e9 }, fade: { value: 1 }, k: { value: new Float32Array(128).fill(1) }, pulse: { value: new T.Vector4(-9, .1, 0, 0) }, glow: { value: new T.Vector3(1.6, 1.5, 1.35) }, barb: { value: o.barbScale ?? .8 } };
    const segs = [], nbs = [], vOff = [];
    let nv = 0, ni = 0, nb = 0;
    for (let i = 0; i < N; i++) {
      let len = 0; const a = V3(), b = V3(); form.at(i, 0, t0, a);
      for (let k = 1; k <= 64; k++) { form.at(i, k / 64, t0, b); len += a.distanceTo(b); a.copy(b); }
      const sg = clamp(Math.ceil(len / step), o.minSegs || 12, o.maxSegs || 700) | 0, n = o.every ? Math.max(1, Math.round(len / o.every)) : 0;
      segs.push(sg); nbs.push(n); vOff.push(nv); nv += 2 * ((sg + 1) * sides + 2); ni += 2 * (sg * sides * 6 + sides * 6); nb += n;
    }
    const P = new Float32Array(nv * 3), Nn = new Float32Array(nv * 3), UV = new Float32Array(nv * 2), AM = new Float32Array(nv), AS = new Float32Array(nv);
    const I = new Uint32Array(ni); let ii = 0;
    for (let i = 0; i < N; i++) {
      const sg = segs[i];
      for (let h = 0; h < 2; h++) {
        const v0 = vOff[i] + h * ((sg + 1) * sides + 2), c0 = v0 + (sg + 1) * sides;
        for (let r = 0; r < sg; r++) for (let j = 0; j < sides; j++) {
          const a = v0 + r * sides + j, b = v0 + r * sides + (j + 1) % sides, c = a + sides, d = b + sides; I[ii++] = a; I[ii++] = b; I[ii++] = c; I[ii++] = b; I[ii++] = d; I[ii++] = c;
        }
        for (let j = 0; j < sides; j++) { I[ii++] = c0; I[ii++] = v0 + (j + 1) % sides; I[ii++] = v0 + j; }
        for (let j = 0; j < sides; j++) { const e = v0 + sg * sides; I[ii++] = c0 + 1; I[ii++] = e + j; I[ii++] = e + (j + 1) % sides; }
        for (let r = 0; r <= sg; r++) {
          const s = r / sg, m = place(i, s);
          for (let j = 0; j < sides; j++) { const k = v0 + r * sides + j; AM[k] = m; AS[k] = i + Math.min(s, .999); UV[k * 2] = r * .4; UV[k * 2 + 1] = j / sides; }
        }
        AM[c0] = place(i, 0); AM[c0 + 1] = place(i, 1); AS[c0] = i; AS[c0 + 1] = i + .999;
      }
    }
    const geo = new T.BufferGeometry();
    const pa = new T.BufferAttribute(P, 3).setUsage(T.DynamicDrawUsage), na = new T.BufferAttribute(Nn, 3).setUsage(T.DynamicDrawUsage);
    geo.setAttribute('position', pa); geo.setAttribute('normal', na); geo.setAttribute('uv', new T.BufferAttribute(UV, 2));
    const ama = new T.BufferAttribute(AM, 1); geo.setAttribute('aM', ama); geo.setAttribute('aS', new T.BufferAttribute(AS, 1)); geo.setIndex(new T.BufferAttribute(I, 1));
    const mat = steel(u, o.tone ?? 1), mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false;
    const group = new T.Group(); group.add(mesh);
    if (o.p) group.position.set(...o.p); if (o.yaw) group.rotation.y = o.yaw; if (o.rot) group.rotation.set(...o.rot);
    /* barbs */
    let knots = null; const bOff = [], bS = [];
    if (nb) {
      const bg = lightBarb().clone(), bm = new Float32Array(nb), bsa = new Float32Array(nb); let n = 0;
      for (let i = 0; i < N; i++) {
        const ph = .12 + .76 * ((i * .618034 + (o.seed || 0)) % 1);
        for (let k = 0; k < nbs[i]; k++) { const s = (k + ph) / nbs[i]; bOff.push(i, s); bm[n] = place(i, s); bsa[n] = i + Math.min(s, .999); n++; }
      }
      bg.setAttribute('aM', new T.InstancedBufferAttribute(bm, 1)); bg.setAttribute('aS', new T.InstancedBufferAttribute(bsa, 1));
      knots = new T.InstancedMesh(bg, mat, nb); knots.frustumCulled = false; knots.instanceMatrix.setUsage(T.DynamicDrawUsage); group.add(knots);
    }
    G3.scene.add(group);
    /* scratch */
    const maxS = Math.max(...segs) + 1, core = new Float32Array(maxS * 3), L = new Float32Array(maxS), tw = [new Float32Array(maxS * 3), new Float32Array(maxS * 3)];
    const cf = new Float32Array(maxS * 6);       /* core frame: normal, binormal per ring */
    const B = { N, group, mesh, knots, u, mat, segs, t: undefined, form, hi: -1e9, lo: 1e9, core: [] };
    for (let i = 0; i < N; i++) { const a = place(i, 0), b = place(i, 1); B.lo = Math.min(B.lo, a, b); B.hi = Math.max(B.hi, a, b); }
    const frame0 = (tx, ty, tz, out, o2) => {           /* a normal perpendicular to the tangent, from a fixed reference */
      const r = Math.abs(tz) < .94 ? ZA : YA;
      let nx = r[1] * tz - r[2] * ty, ny = r[2] * tx - r[0] * tz, nz = r[0] * ty - r[1] * tx; const l = Math.hypot(nx, ny, nz) || 1;
      out[o2] = nx / l; out[o2 + 1] = ny / l; out[o2 + 2] = nz / l;
    };
    const nb3 = [0, 0, 0];
    /* write one tube along pts (count rings), parallel-transported frames */
    function tube(pts, count, v0) {
      let px = 0, py = 0, pz = 0, nx = 0, ny = 0, nz = 0;
      for (let r = 0; r < count; r++) {
        const a = Math.max(0, r - 1) * 3, b = Math.min(count - 1, r + 1) * 3;
        let tx = pts[b] - pts[a], ty = pts[b + 1] - pts[a + 1], tz = pts[b + 2] - pts[a + 2]; const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
        if (r === 0) { frame0(tx, ty, tz, nb3, 0); nx = nb3[0]; ny = nb3[1]; nz = nb3[2]; }
        else { const d = nx * tx + ny * ty + nz * tz; nx -= d * tx; ny -= d * ty; nz -= d * tz; const l = Math.hypot(nx, ny, nz); if (l < 1e-4) { frame0(tx, ty, tz, nb3, 0); nx = nb3[0]; ny = nb3[1]; nz = nb3[2]; } else { nx /= l; ny /= l; nz /= l; } }
        const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx, cx = pts[r * 3], cy = pts[r * 3 + 1], cz = pts[r * 3 + 2];
        for (let j = 0; j < sides; j++) {
          const th = j / sides * TAU, c = Math.cos(th), s = Math.sin(th), k = (v0 + r * sides + j) * 3;
          const ox = nx * c + bx * s, oy = ny * c + by * s, oz = nz * c + bz * s;
          P[k] = cx + ox * rad; P[k + 1] = cy + oy * rad; P[k + 2] = cz + oz * rad; Nn[k] = ox; Nn[k + 1] = oy; Nn[k + 2] = oz;
        }
        if (r === 0) { const k = (v0 + count * sides) * 3; P[k] = cx; P[k + 1] = cy; P[k + 2] = cz; Nn[k] = -tx; Nn[k + 1] = -ty; Nn[k + 2] = -tz; }
        if (r === count - 1) { const k = (v0 + count * sides + 1) * 3; P[k] = cx; P[k + 1] = cy; P[k + 2] = cz; Nn[k] = tx; Nn[k + 1] = ty; Nn[k + 2] = tz; }
      }
    }
    const M4 = new T.Matrix4(), RX = new T.Matrix4(), SC = new T.Matrix4(), vt = V3(), vn = V3(), vb = V3(), vp = V3();
    B.update = (t, only) => {
      B.t = t; const t0 = performance.now();
      for (let i = 0; i < N; i++) {
        if (only && !only(i)) continue;
        const sg = segs[i], n = sg + 1;
        for (let r = 0; r < n; r++) { form.at(i, r / sg, t, tmp); core[r * 3] = tmp.x; core[r * 3 + 1] = tmp.y; core[r * 3 + 2] = tmp.z; L[r] = r ? L[r - 1] + Math.hypot(tmp.x - core[r * 3 - 3], tmp.y - core[r * 3 - 2], tmp.z - core[r * 3 - 1]) : 0; }
        /* the core's own transported frame, for the twist and the barbs */
        let nx = 0, ny = 0, nz = 0; const anchor = L[n >> 1];
        for (let r = 0; r < n; r++) {
          const a = Math.max(0, r - 1) * 3, b = Math.min(n - 1, r + 1) * 3;
          let tx = core[b] - core[a], ty = core[b + 1] - core[a + 1], tz = core[b + 2] - core[a + 2]; const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
          if (r === 0) { frame0(tx, ty, tz, nb3, 0); nx = nb3[0]; ny = nb3[1]; nz = nb3[2]; }
          else { const d = nx * tx + ny * ty + nz * tz; nx -= d * tx; ny -= d * ty; nz -= d * tz; const l = Math.hypot(nx, ny, nz); if (l < 1e-4) { frame0(tx, ty, tz, nb3, 0); nx = nb3[0]; ny = nb3[1]; nz = nb3[2]; } else { nx /= l; ny /= l; nz /= l; } }
          const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
          cf[r * 6] = nx; cf[r * 6 + 1] = ny; cf[r * 6 + 2] = nz; cf[r * 6 + 3] = bx; cf[r * 6 + 4] = by; cf[r * 6 + 5] = bz;
          const th = (L[r] - anchor) / pitch * TAU;
          for (let h = 0; h < 2; h++) {
            const c = Math.cos(th + h * PI) * rad * 1.01, s = Math.sin(th + h * PI) * rad * 1.01, w = tw[h];
            w[r * 3] = core[r * 3] + nx * c + bx * s; w[r * 3 + 1] = core[r * 3 + 1] + ny * c + by * s; w[r * 3 + 2] = core[r * 3 + 2] + nz * c + bz * s;
          }
        }
        for (let h = 0; h < 2; h++) tube(tw[h], n, vOff[i] + h * (n * sides + 2));
        if (o.keepCore) B.core[i] = core.slice(0, n * 3);
        /* barbs on this strand */
        if (knots) {
          let bi = 0; for (let k = 0; k < bOff.length; k += 2) {
            if (bOff[k] !== i) { if (bOff[k] < i) bi++; continue; }
            const f = bOff[k + 1] * sg, r = Math.min(sg - 1, Math.floor(f)), l = f - r, a = r * 3, b = a + 3;
            vp.set(lerp(core[a], core[b], l), lerp(core[a + 1], core[b + 1], l), lerp(core[a + 2], core[b + 2], l));
            vt.set(core[b] - core[a], core[b + 1] - core[a + 1], core[b + 2] - core[a + 2]).normalize();
            vn.set(cf[r * 6], cf[r * 6 + 1], cf[r * 6 + 2]); vb.crossVectors(vt, vn);
            M4.makeBasis(vt, vn, vb); M4.setPosition(vp); RX.makeRotationX(bi * PI * .63 + .18); M4.multiply(RX); knots.setMatrixAt(bi, M4); bi++;
          }
        }
      }
      pa.needsUpdate = true; na.needsUpdate = true; if (knots) knots.instanceMatrix.needsUpdate = true;
      X.updMs = (X.updMs || 0) + performance.now() - t0;          /* re-forming cost this frame (read by the perf probe) */
    };
    /* re-time the construction */
    B.retime = pl => {
      for (let i = 0; i < N; i++) { const sg = segs[i]; for (let h = 0; h < 2; h++) { const v0 = vOff[i] + h * ((sg + 1) * sides + 2); for (let r = 0; r <= sg; r++) { const m = pl(i, r / sg); for (let j = 0; j < sides; j++) AM[v0 + r * sides + j] = m; } AM[v0 + (sg + 1) * sides] = pl(i, 0); AM[v0 + (sg + 1) * sides + 1] = pl(i, 1); } }
      ama.needsUpdate = true;
      if (knots) { const a = knots.geometry.attributes.aM; for (let k = 0, n = 0; k < bOff.length; k += 2, n++) a.array[n] = pl(bOff[k], bOff[k + 1]); a.needsUpdate = true; }
    };
    B.rev = qq => qq;                             /* the film time this bundle is drawn up to (a direction may override) */
    B.show = qq => { u.rev.value = B.rev(qq) + .001; group.visible = u.fade.value > .012 && u.rev.value >= B.lo - .02; };
    B.update(t0);
    G3.bundles.push(B);
    return B;
  }

  /* ---------- flat discs that always face the camera (the dot, and anything else that must stay flat) ---------- */
  function disc(color = RED, seg = 96) {
    const m = new T.Mesh(new T.CircleGeometry(1, seg), new T.MeshBasicMaterial({ color, toneMapped: false, transparent: true }));
    m.renderOrder = 2; G3.scene.add(m); G3.discs.push(m); return m;
  }
  function placeDisc(m, p, r, op = 1) { m.position.copy(p); m.scale.setScalar(Math.max(.0001, r)); m.material.opacity = op; m.visible = r > .001 && op > .003; }
  function lightsFor(night) { G3.scene.environmentIntensity = 1 - .7 * night; G3.key.intensity = 2.1 * (1 - .78 * night); G3.rim.intensity = 1.2 * (1 - .7 * night); }
  function grain(layer, sel) {
    const nz = document.createElement('canvas'); nz.width = nz.height = 180; const nx = nz.getContext('2d'), id = nx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    nx.putImageData(id, 0, 0); layer.querySelector(sel).style.backgroundImage = `url(${nz.toDataURL()})`;
  }

  /* ---------- type: the hook (centred, first), the reveal (second), the heading, "made for you", the end ---------- */
  const SIZE = ['long', 'short', 'mid', 'short'];
  const hookHTML = i => i === 0 ? COPY[0].hook.replace('made for you', '<span class="k-mf">made for you</span>') : COPY[i].hook;
  const typeDOM = cls => `<canvas class="d-gl" aria-hidden="true"></canvas><div class="d-grain" aria-hidden="true"></div><div class="k-red" aria-hidden="true"></div>
  <div class="d-hud k-hud ${cls}">
    <h2 class="k-head" id="kHead">${HEADING}</h2>
    ${COPY.map((c, i) => `<p class="k-hook k-hook--${SIZE[i]} k-hook--${SVC[i]}">${hookHTML(i)}</p>
    <section class="k-rev k-rev--${SVC[i]}"><h3 class="k-nm">${c.name}</h3><p>${c.reveal}</p></section>`).join('')}
    <div class="k-mfy" id="kMfy" aria-hidden="true">made for you</div>
    <div class="k-end" id="kEnd"><a class="k-cta" href="mailto:hello@nessmaui.com" tabindex="-1">Tell us what you need</a><p class="k-mail"><a href="mailto:hello@nessmaui.com" tabindex="-1">hello@nessmaui.com</a></p></div>
  </div>`;
  function wrapType() {
    const w = el => { if (!el.dataset.w) { BK2.wrap(el); el.dataset.w = 1; } return [...el.querySelectorAll('.w')]; };
    X.hooks = [...R.layer.querySelectorAll('.k-hook')].map(el => ({ el, w: w(el) }));
    X.revs = [...R.layer.querySelectorAll('.k-rev')].map(el => ({ el, n: el.querySelector('.k-nm'), w: w(el.querySelector('p')) }));
    X.mf = R.layer.querySelector('.k-mf'); X.mfw = X.mf ? [...X.mf.querySelectorAll('.w')] : []; X.mfRect = null;
    R.head = R.layer.querySelector('#kHead'); R.end = R.layer.querySelector('#kEnd'); R.mfy = R.layer.querySelector('#kMfy'); R.red = R.layer.querySelector('.k-red');
  }
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  /* a block arrives word by word as the film settles on stop S, and leaves once the film moves on */
  function arrive(o, S, qq, { a0 = .28, o0 = .1, o1 = .26, rise = .9 } = {}) {
    const inn = prog(qq, S - a0, S - .02), out = ss(qq, S + o0, S + o1), on = inn > 0 && out < 1; vis(o.el, on); if (!on) return 0;
    if (o.n) { const t = eo(prog(inn, 0, .55)); o.n.style.opacity = t.toFixed(3); o.n.style.transform = `translate3d(0,${((1 - t) * .18).toFixed(3)}em,0)`; }
    BK2.reveal(o.w, prog(inn, o.n ? .2 : 0, 1), rise); o.el.style.opacity = (1 - out).toFixed(3); o.el.style.transform = `translate3d(0,${(-out * 14).toFixed(1)}px,0)`;
    return inn * (1 - out);
  }
  function heading(qq, a = 3.5, b = ST.head - .02, o0 = ST.head + .12, o1 = ST.head + .3) {
    const h = eo(prog(qq, a, b)), o = ss(qq, o0, o1);
    R.head.style.opacity = (h * (1 - o)).toFixed(3); R.head.style.transform = `translate3d(0,${((1 - h) * 30).toFixed(1)}px,0)`; vis(R.head, h > 0 && o < 1);
  }
  /* Karin's brief: "made for you" leaves the paragraph and is held in the red circle; the camera then goes into the circle.
     at = the circle on screen {x, y, r}; fly = 0..1 from the words' place to the circle; fill = how far the red has taken the frame. */
  function madeForYou(at, fly, gone) {
    if (fly <= 0 || gone >= 1 || !at) { vis(R.mfy, false); X.mfw.forEach(w => w.style.visibility = ''); return; }
    if (!X.mfRect) { const r = X.mf.getBoundingClientRect(), fs = parseFloat(getComputedStyle(X.mf).fontSize); X.mfRect = { x: r.left + r.width / 2, y: r.top + r.height / 2, fs }; }
    X.mfw.forEach(w => w.style.visibility = 'hidden');
    const t = eio(fly), fs = lerp(X.mfRect.fs, Math.max(X.mfRect.fs, at.r * .27), t), x = lerp(X.mfRect.x, at.x, t), y = lerp(X.mfRect.y, at.y, t);
    vis(R.mfy, true); R.mfy.style.fontSize = fs.toFixed(2) + 'px'; R.mfy.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-52%)`;
    R.mfy.style.opacity = (1 - gone).toFixed(3);
  }
  /* the red has taken the whole frame once the circle covers every corner: swap to a flat field, invisibly */
  function redField(at, extra = 0) {
    const cover = at && at.front && [[0, 0], [K0.W, 0], [0, K0.H], [K0.W, K0.H]].every(([x, y]) => Math.hypot(x - at.x, y - at.y) < at.r * .995);
    R.red.style.opacity = cover || extra >= 1 ? 1 : Math.max(0, extra).toFixed(3); vis(R.red, cover || extra > 0); return cover;
  }
  function endBlock(qq, S = ST.end, out = ST.hand - .35) {
    const e = eo(prog(qq, S - .26, S - .02)) * (1 - ss(qq, out, out + .2));
    R.end.style.opacity = e.toFixed(3); R.end.style.transform = `translate3d(0,${((1 - e) * 22).toFixed(1)}px,0)`; vis(R.end, e > .002);
    R.end.classList.toggle('is-on', qq > S - .05 && qq < out);
  }

  /* ---------- the entrance shared by all three: the Bridge's lines are pressed flat into bars and converge on one cream line
     (identical to the Bridge until q 2.552). From q 3.04 the direction takes the line. ---------- */
  function bars(ctx, qq) {
    const G = A.G, W = K0.W, dpr = K0.dpr, yl = K0.H / 2, th = 26;
    if (qq <= 2.55 || qq > 3.06) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    G.L.forEach((L, i) => {
      const t = eio(prog(qq, 2.58 + i * .03, 2.73 + i * .03)), t2 = eio(prog(qq, 2.76 + i * .015, 2.92)), fade = 1 - ss(qq, 2.94, 3.04);
      const hgt = lerp(L.HH, th * dpr, t), cy = lerp(L.Y + L.HH / 2, yl * dpr, t2);
      ctx.globalAlpha = fade; ctx.drawImage(L.C, 0, 0, L.C.width, L.HH, Math.round(L.x * dpr - L.pad * dpr), Math.round(cy - hgt / 2), L.C.width, Math.max(1, Math.round(hgt)));
    });
    const ts = eio(prog(qq, 2.56, 2.66));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = .92 * (1 - ts); ctx.font = `500 ${G.sf}px 'Instrument Sans', sans-serif`; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'; ctx.fillStyle = CREAM;
    G.sub.forEach(o => ctx.fillText(o.w, o.x, o.y + ts * G.sf * .6));
    const run = eio(prog(qq, 2.9, 3.04));
    if (run > 0) {
      const x0 = lerp(G.L[0].x, 0, run), x1 = lerp(Math.max(...G.L.map(L => L.x + L.w)), W, run);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = ss(qq, 2.9, 2.98); ctx.fillStyle = CREAM;
      ctx.fillRect(Math.round(x0 * dpr), Math.round((yl - th / 2) * dpr), Math.round((x1 - x0) * dpr), Math.round(th * dpr));
    }
    ctx.restore();
  }

  /* ---------- the film hooks every direction returns ---------- */
  function hooks(D) {
    return {
      dom: D.dom,
      init(Kk) {
        K0 = Kk; R.layer = Kk.layer; R.gl = Kk.layer.querySelector('.d-gl'); grain(Kk.layer, '.d-grain'); wrapType();
        const go = () => { if (ready || !window.NWF) return; T = window.NWF.THREE; stage(); ready = true; if (K0.W && A) this.layout(K0, A); };
        if (window.NWF) setTimeout(go, 0); else addEventListener('nwf-ready', go, { once: true });
      },
      layout(Kk, a) {
        A = a || A; K0 = Kk; if (!ready || !A || !A.G || !A.G.ok) return;
        G3.renderer.setPixelRatio(Math.min(Kk.dpr, 1.75, Math.sqrt(4e6 / (Kk.W * Kk.H)))); G3.renderer.setSize(Kk.W, Kk.H, false);
        const tb = performance.now(); D.build(Kk); window.__nw.buildMs = Math.round(performance.now() - tb); X.built = true; X.dirty = true; X.mfRect = null;
        X.cs = camState(2.56); aim(G3.camera, X.cs); D.render(2.56, X.cs);   /* warm every bundle's first form now, not on the first frame */
        aim(G3.camera, camState(4.8)); G3.renderer.compile(G3.scene, G3.camera);
        requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
      },
      post(ctx, qq) {
        R.gl.style.opacity = X.built ? Math.max(.002, D.glIn(qq)).toFixed(3) : 0;
        R.layer.querySelector('.d-hud').style.visibility = qq > 2.6 ? 'visible' : 'hidden';
        if (!X.built) return;
        bars(ctx, qq); if (D.entrance) D.entrance(ctx, qq);
        X.updMs = 0; X.qq = qq; const cs = window.__cam ? window.__cam(qq) : camState(qq); X.cs = cs; aim(G3.camera, cs);
        D.render(qq, cs);
        G3.bundles.forEach(B => B.show(qq)); G3.discs.forEach(m => m.quaternion.copy(G3.camera.quaternion));
        G3.scene.environmentRotation.copy(G3.camera.rotation); G3.renderer.render(G3.scene, G3.camera); if (D.after) D.after(ctx, qq);
      },
      take: qq => !!X.built && qq > 2.55,
      live: () => { const d = X.dirty; X.dirty = false; return !!d; }
    };
  }
  window.__nw = { render: qq => { X.qq = qq; }, X: () => X, G3: () => G3, camState, keys: () => KEYS, V3: (...a) => V3(...a), ST, COPY };
  /* ======== end of kit ======== */
