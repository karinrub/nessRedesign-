/* wave-studies-25 — shared kit for the three Wave studies.
   The hero's own steel (ness-wire-model: two twisted strands, instanced barbs, cut ends, the PMREM studio, ACES),
   lit exactly like the hero (key + rim ride with the camera, environment turns with it), so every study is the same
   object the visitor met in the first frame. Type is flat: it is drawn with Canvas 2D into screen-facing planes that sit
   at a chosen depth, so the wire can pass in front of a word and behind the next one, as it does in the hero. */
import * as THREE from 'three';
import { createSteelStudio, createSteelWire } from 'ness-wire-model';

export const T = THREE;
export const INK = '#17150f', CREAM = '#e9e1ce', RED = '#c0230b';
export const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ss = (v, a, b) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/* the stage: renderer, studio, camera with the hero's two lights riding on it */
export function stage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  const studio = createSteelStudio(renderer), scene = new THREE.Scene(); scene.environment = studio.environment;
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 4000); scene.add(camera);
  const key = new THREE.DirectionalLight('#fff6e7', 2.1), rim = new THREE.DirectionalLight('#dce7ed', 1.2);
  key.position.set(-4, 8, 16); rim.position.set(5, -3, 8);          /* the hero's positions, relative to its camera */
  key.target.position.set(0, 0, -24); rim.target.position.set(0, 0, -24);
  camera.add(key, key.target, rim, rim.target);
  const S = { renderer, studio, scene, camera, key, rim, wires: [], planes: [], shift: [0, 0], W: 1, H: 1 };
  S.resize = () => {
    S.W = innerWidth; S.H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(S.W, S.H, false);
  };
  S.resize();
  return S;
}

/* a smooth curve through points, sampled by arc length: f(t, out) */
export function curve(pts, type = 'centripetal', tension = .5) {
  const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p), false, type, tension); c.arcLengthDivisions = 2000;
  const f = (t, o) => o.copy(c.getPointAt(clamp(t)));
  f.len = c.getLength(); f.curve = c; return f;
}
/* a straight segment */
export function segment(a, b) {
  const A = V3(...a), B = V3(...b); const f = (t, o) => o.copy(A).lerp(B, clamp(t)); f.len = A.distanceTo(B); return f;
}

/* one barbed wire along f; barbs every `every` units (the hero has one every ~4.4) */
export function wire(S, f, { every = 4.4, step = .3, radius, pitch, barbs, offset = .5, at, material } = {}) {
  const L = f.len, segments = Math.min(6000, Math.max(24, Math.ceil(L / step)));
  const n = at ? at.length : (barbs ?? Math.max(1, Math.round(L / every)));
  const opts = { segments, barbs: Math.max(1, n) }; if (radius) opts.radius = radius; if (pitch) opts.pitch = pitch;
  const studio = material ? { ...S.studio, silver: material } : S.studio;
  const w = createSteelWire(studio, opts);
  w.setBarbPositions(at ? at : Array.from({ length: n }, (_, i) => (i + offset) / n));
  if (n === 0) w.knots.visible = false;
  w.update((t, o) => f(t, o)); S.scene.add(w.group); S.wires.push(w); return w;
}
export function clearWires(S) { S.wires.forEach(w => { S.scene.remove(w.group); w.dispose(); }); S.wires = []; }

/* a dimmer steel for supporting lines: same metal, less light (hierarchy of weight without changing the material) */
export function steel(S, k = .55) {
  const m = S.studio.silver.clone(); m.onBeforeCompile = S.studio.silver.onBeforeCompile; m.color.multiplyScalar(k); m.envMapIntensity = 1.05 * k; return m;
}

/* the camera: position, target, fov, and a lens shift (moves the picture without turning the camera, so verticals stay true) */
export function aim(S, { p, t, f = 30, s = [0, 0], roll = 0 }) {
  const c = S.camera; c.position.set(...p); c.up.set(Math.sin(roll), Math.cos(roll), 0); c.fov = f; c.aspect = S.W / S.H;
  c.lookAt(...t); c.near = .1; c.far = 4000; c.updateProjectionMatrix();
  const e = c.projectionMatrix.elements; e[8] = -s[0]; e[9] = -s[1]; c.projectionMatrixInverse.copy(c.projectionMatrix).invert();
  c.updateMatrixWorld(true); S.shift = s;
  S.scene.environmentRotation.copy(c.rotation);
}

/* flat type: a screen-sized plane `d` units in front of the camera, painted with Canvas 2D in CSS pixels.
   draw(ctx, W, H) paints it. Wire nearer than d passes in front of it; wire farther away passes behind. */
export function typePlane(S, d, draw, { opacity = 1 } = {}) {
  const dpr = S.renderer.getPixelRatio(), cv = document.createElement('canvas');
  cv.width = Math.round(S.W * dpr); cv.height = Math.round(S.H * dpr);
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); draw(ctx, S.W, S.H);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;
  const hh = d * Math.tan(S.camera.fov * Math.PI / 360), hw = hh * S.camera.aspect;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(hw * 2, hh * 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, opacity }));
  m.position.set(-S.shift[0] * hw, -S.shift[1] * hh, -d); m.renderOrder = 1; m.material.depthTest = true;
  S.camera.add(m); S.planes.push(m); return m;
}
export function clearPlanes(S) { S.planes.forEach(m => { S.camera.remove(m); m.geometry.dispose(); m.material.map.dispose(); m.material.dispose(); }); S.planes = []; }

/* a flat red disc that always faces the camera (graphic, not an object) */
export function disc(S, at, r, color = RED) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 96), new THREE.MeshBasicMaterial({ color, toneMapped: false }));
  m.position.set(...at); m.quaternion.copy(S.camera.quaternion); S.scene.add(m); S.discs = (S.discs || []).concat(m); return m;
}
/* a disc on the line of sight through a world point, k times as far (so it sits exactly behind that point on screen) */
export function discThrough(S, at, k, r, color = RED) {
  const c = S.camera.position, P = [0, 1, 2].map(i => c.getComponent(i) + (at[i] - c.getComponent(i)) * k); return disc(S, P, r, color);
}
export function clearDiscs(S) { (S.discs || []).forEach(m => { S.scene.remove(m); m.geometry.dispose(); m.material.dispose(); }); S.discs = []; }

/* type helpers (Instrument Sans only; display tracked tight like the Bridge sentence) */
export function font(ctx, wt, px, ls = 0) { ctx.font = `${wt} ${px}px 'Instrument Sans', sans-serif`; ctx.letterSpacing = (ls * px).toFixed(2) + 'px'; }
export function wrap(ctx, text, maxW) {
  const ws = text.split(' '), out = []; let cur = '';
  for (const w of ws) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur); return out;
}
/* a paragraph block: returns its height */
export function para(ctx, text, x, y, w, { px = 18, lh = 1.5, color = CREAM, wt = 400, align = 'left' } = {}) {
  font(ctx, wt, px, -.005); ctx.fillStyle = color; ctx.textBaseline = 'alphabetic'; ctx.textAlign = align;
  const lines = wrap(ctx, text, w); lines.forEach((l, i) => ctx.fillText(l, align === 'right' ? x + w : x, y + px + i * px * lh)); ctx.textAlign = 'left';
  return lines.length * px * lh;
}

/* copy: verbatim from NGL.OFFERS in the approved HTML */
export const HEADING = 'What you can hire us for.';
export const OFFERS = {
  web: { name: 'Websites', body: 'Your website should look like it was made for you, because it was. Every page is planned around the one thing your business needs it to do, then built by hand and tuned to load fast on a phone, since that’s where most of your customers will find you. When it’s finished, the whole thing belongs to you. Domain, files, everything.' },
  photo: { name: 'Photography', body: 'Stock photos make a real business look like a stranger. Isabella takes the pictures herself, at your place, of your work and the people behind it, and she shoots with the site already in mind. That is why the two feel like they were born together.' },
  reb: { name: 'Rebuilds', body: 'Maybe you already have a site, and somewhere along the way it stopped doing its job. Send it over. You’ll get an honest read on whether it needs rebuilding or just fixing, and if a fix is enough, a fix is what you’ll get.' },
  care: { name: 'Care', body: 'Launch day is not goodbye. Updates, small fixes, a new page in busy season, a question at nine at night. Call, and one of us picks up, on Maui time. Nobody hands you off to an account manager, because there isn’t one.' }
};
export const CTA = 'Tell us what you need', MAIL = 'hello@nessmaui.com';

/* the study shell: views 1–4 from ?view= or the keys 1–4; each view(S) builds wires, camera, type */
export async function run(views, { bg = () => INK } = {}) {
  await document.fonts.load("700 100px 'Instrument Sans'"); await document.fonts.load("400 18px 'Instrument Sans'"); await document.fonts.load("500 18px 'Instrument Sans'");
  const S = stage(document.querySelector('canvas.gl'));
  let cur = clamp(+(new URLSearchParams(location.search).get('view') || 1), 1, views.length);
  const show = n => {
    cur = n; clearPlanes(S); clearDiscs(S);
    document.body.style.background = bg(n); document.documentElement.dataset.view = n;
    views[n - 1](S); S.renderer.render(S.scene, S.camera);
    document.documentElement.dataset.ready = '1';
  };
  addEventListener('keydown', e => { const n = +e.key; if (n >= 1 && n <= views.length) { history.replaceState(null, '', '?view=' + n); show(n); } });
  addEventListener('resize', () => { S.resize(); show(cur); });
  window.__study = { S, show, look(cfg) { aim(S, cfg); S.renderer.render(S.scene, S.camera); } };
  show(cur);
}
