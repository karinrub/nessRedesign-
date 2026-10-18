import { T, V3, stage, wire, aim, clamp, lerp, disc, RED } from '../../wave-studies-25/studies/kit.js';
import { FORMS } from '../forms.js';
const q = new URLSearchParams(location.search), form = q.get('form') || 'web', ribbon = q.get('ribbon') === '1', t = +(q.get('t') ?? .7);
const S = stage(document.querySelector('canvas.gl')), F = FORMS[form];
const tmp = V3();
function strand(i) {
  const pts = []; const n = 80; for (let k = 0; k <= n; k++) { F.at(i, k / n, t, tmp); pts.push(tmp.clone()); }
  let len = 0; for (let k = 1; k <= n; k++) len += pts[k].distanceTo(pts[k - 1]);
  const f = (s, o) => F.at(i, s, t, o); f.len = len; return f;
}
const radius = +(q.get('r') ?? .17);
if (!ribbon) {
  for (let i = 0; i < F.N; i++) wire(S, strand(i), { every: 5.5, step: .55, radius, pitch: 2.65 * radius / .23, offset: .15 + .7 * ((i * 0.618) % 1) });
  S.wires.forEach(w => w.knots.scale.setScalar(.78));
} else {
  const n = 120, g = new T.BufferGeometry(), P = [], I = [];
  for (let i = 0; i < F.N; i++) for (let k = 0; k <= n; k++) { F.at(i, k / n, t, tmp); P.push(tmp.x, tmp.y, tmp.z); }
  for (let i = 0; i < F.N - 1; i++) for (let k = 0; k < n; k++) { const a = i * (n + 1) + k, b = a + 1, c = a + n + 1, d = c + 1; I.push(a, b, c, b, d, c); }
  g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals();
  S.scene.add(new T.Mesh(g, new T.MeshBasicMaterial({ color: '#cfc8b4', side: T.DoubleSide })));
}
const cams = JSON.parse(q.get('cam') || 'null');
window.__lab = { look(c) { aim(S, c); S.renderer.render(S.scene, S.camera); }, S };
if (cams) __lab.look(cams); else { aim(S, { p: [0, 40, 220], t: [0, 30, 0], f: 30 }); S.renderer.render(S.scene, S.camera); }
if (form === 'care') { const d = disc(S, [10, 11, 14], 5); window.__lab.look = c => { aim(S, c); d.quaternion.copy(S.camera.quaternion); S.renderer.render(S.scene, S.camera); }; if (cams) __lab.look(cams); }
document.documentElement.dataset.ready = '1';
