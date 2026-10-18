import { T, V3, stage, wire, clearWires, aim } from '../wave-studies-25/studies/kit.js';

// Three original constructions using the same procedural barbed steel as the NESS hero and 24C.
// Each strand is a separate steel wire. These are static end-frame art studies, not service scenes.
const S = stage(document.querySelector('canvas.gl'));
const tmp = V3();
const shapes = ['portal', 'bloom', 'meeting'];
let active = 'portal';

const mix = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const gaussian = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
const aspect = () => S.W / S.H;
const distance = base => Math.max(base, 360 / aspect());
const narrow = () => Math.max(0, Math.min(1, (1.6 - aspect()) / .43));

function strand(point, { radius = .19, barbEvery = 7.2, step = .72, offset = .5 } = {}) {
  const n = 64, pts = [];
  for (let j = 0; j <= n; j++) pts.push(point(j / n, tmp).clone());
  let length = 0;
  for (let j = 1; j <= n; j++) length += pts[j].distanceTo(pts[j - 1]);
  const path = (t, out) => point(t, out);
  path.len = length;
  return wire(S, path, { every: barbEvery, step, radius, pitch: 2.65 * radius / .23, offset });
}

function portal() {
  // A threshold made from independent nested steel arcs. The center stays open rather than
  // becoming another wire mesh surface: a clear invitation at the end of the Offers story.
  for (let i = 0; i < 29; i++) {
    const u = i / 28;
    strand((t, out) => {
      const angle = Math.PI * (1 - t);
      const rx = 34 + 34 * u, ry = 40 + 28 * u;
      const height = ry * Math.sin(angle);
      const x = 43 + rx * Math.cos(angle) + .2 * height;
      const y = -55 - 3 * u + height;
      const z = -10 + 24 * u + 9 * Math.sin(2 * angle) * Math.sin(Math.PI * u);
      return out.set(x, y, z);
    }, { radius: i % 7 === 0 ? .235 : .175, barbEvery: i % 7 === 0 ? 6.1 : 8, offset: .44 + (i % 5) * .035 });
  }
  aim(S, { p: [2, 3, distance(240)], t: [27 + 10 * narrow(), -11, 0], f: 34 });
  return ['70%', '62%'];
}

function bloom() {
  // A sculptural bouquet of five offset fan petals. Each petal is an independent bundle,
  // with visible gaps between bundles and a shared base rather than a continuous net surface.
  const petals = [
    { a: .18, l: 83, z: -12, w: 16 },
    { a: .57, l: 91, z: 5, w: 18 },
    { a: .95, l: 95, z: -5, w: 17 },
    { a: 1.34, l: 87, z: 9, w: 17 },
    { a: 1.72, l: 74, z: -14, w: 15 }
  ];
  for (let p = 0; p < petals.length; p++) {
    const { a, l, z, w } = petals[p], count = p === 2 ? 9 : 8;
    for (let i = 0; i < count; i++) {
      const u = (i / (count - 1)) * 2 - 1;
      strand((t, out) => {
        const e = smooth(t), flare = Math.sin(Math.PI * t) * u * w;
        const length = l * (1 - .08 * Math.abs(u));
        const bend = Math.sin(Math.PI * t) * 9;
        const x = 50 + Math.cos(a) * length * e - Math.sin(a) * flare + Math.cos(a + Math.PI / 2) * bend;
        const y = -53 + Math.sin(a) * length * e + Math.cos(a) * flare;
        return out.set(x, y, z + u * 6 + 7 * Math.sin(Math.PI * t));
      }, { radius: i === 0 || i === count - 1 ? .21 : .17, barbEvery: 8.3, offset: .43 + (i % 4) * .045 });
    }
  }
  aim(S, { p: [7, 3, distance(245)], t: [28 + 17 * narrow(), -13, 0], f: 34 });
  return ['70%', '70%'];
}

function meeting() {
  // Two independent clusters sweep toward one another without touching. The central void is
  // the invitation: its open space is the only element that connects the two gestures.
  for (let side = 0; side < 2; side++) {
    const sign = side ? -1 : 1;
    for (let i = 0; i < 24; i++) {
      const u = i / 23;
      strand((t, out) => {
        const e = smooth(t);
        const x0 = side ? 115 - 20 * Math.sin(Math.PI * u) : -82 + 16 * Math.sin(Math.PI * u);
        const y0 = side ? 54 - u * 48 : -49 + u * 30;
        const x1 = side ? 34 + u * 10 : 9 + u * 14;
        const y1 = side ? -20 - u * 10 : 4 + u * 12;
        const x = mix(x0, x1, e) + sign * 13 * Math.sin(Math.PI * t);
        const y = mix(y0, y1, e) + (side ? -1 : 1) * (8 + 11 * u) * Math.sin(Math.PI * t);
        const z = (side ? -11 : 12) + (u - .5) * 28 + 9 * gaussian(t, .65, .25);
        return out.set(x, y, z);
      }, { radius: i % 8 === 0 ? .24 : .175, barbEvery: 7.8, offset: .44 + (i % 5) * .03 });
    }
  }
  aim(S, { p: [0, 5, distance(250)], t: [15, -3, 0], f: 34 });
  return ['68%', '60%'];
}

const make = { portal, bloom, meeting };
const grain = document.createElement('canvas');
grain.width = grain.height = 128;
const grainContext = grain.getContext('2d');
const pixels = grainContext.createImageData(128, 128);
for (let i = 0; i < pixels.data.length; i += 4) {
  const value = Math.floor(Math.random() * 256);
  pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
  pixels.data[i + 3] = 255;
}
grainContext.putImageData(pixels, 0, 0);
document.querySelector('.grain').style.backgroundImage = `url(${grain.toDataURL()})`;
function show(name) {
  if (!make[name]) return;
  active = name;
  clearWires(S);
  const [x, y] = make[name]();
  document.documentElement.style.setProperty('--disc-x', x);
  document.documentElement.style.setProperty('--disc-y', y);
  document.querySelectorAll('[data-shape]').forEach(button => button.setAttribute('aria-pressed', button.dataset.shape === name ? 'true' : 'false'));
  document.querySelector('.study-count').textContent = `${String(shapes.indexOf(name) + 1).padStart(2, '0')} / 03`;
  const url = new URL(location.href); url.searchParams.set('shape', name); history.replaceState(null, '', url);
  S.renderer.render(S.scene, S.camera);
  document.documentElement.dataset.ready = '1';
}

document.querySelectorAll('[data-shape]').forEach(button => button.addEventListener('click', () => show(button.dataset.shape)));
addEventListener('keydown', event => {
  const index = Number(event.key) - 1;
  if (index >= 0 && index < shapes.length) show(shapes[index]);
  if (event.key === 'ArrowRight') show(shapes[(shapes.indexOf(active) + 1) % shapes.length]);
  if (event.key === 'ArrowLeft') show(shapes[(shapes.indexOf(active) + shapes.length - 1) % shapes.length]);
});
addEventListener('resize', () => { S.resize(); show(active); });
show(new URLSearchParams(location.search).get('shape') || 'portal');
window.__study28 = { S, show };
