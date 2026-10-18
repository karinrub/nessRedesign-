import { stage, wire, aim } from '../wave-studies-25/studies/kit.js';
import { FILMS, sceneAt, stepScene } from './model.mjs';
import { pointFor } from './geometry.mjs';

const viewer = document.querySelector('.viewer');
const frame = document.querySelector('.frame');
const canvas = document.querySelector('canvas.gl');
const S = stage(canvas);
S.resize = () => {
  S.W = frame.clientWidth;
  S.H = frame.clientHeight;
  S.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  S.renderer.setSize(S.W, S.H, false);
};
S.resize();

const params = new URLSearchParams(location.search);
let activeFilm = FILMS[params.get('film')] ? params.get('film') : 'key';
let activeScene = Math.max(0, Math.min(7, Number(params.get('scene') || 0)));
let motionId = 0;
let copyId = 0;
let busyUntil = 0;
const mix = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function cameraFor(film, scene) {
  const d = Math.max(265, 390 / (S.W / S.H));
  if (film === 'key') {
    if (scene === 0) return { p: [0, 3, d * 1.08], t: [-26, 42, 0], f: 34 };
    if (scene === 2) return { p: [5, 3, d], t: [-6, 9, 0], f: 34 };
    if (scene === 7) return { p: [-34, 0, d * .78], t: [-46, -4, 0], f: 34 };
    return { p: [0, 4, d], t: [4, 23, 0], f: 34 };
  }
  if (film === 'signet') {
    if (scene === 0) return { p: [50, 9, d], t: [0, 4, 0], f: 34 };
    if (scene === 2) return { p: [42, 7, d], t: [-5, 0, 0], f: 34 };
    if (scene === 6) return { p: [80, 23, d], t: [20, -1, 0], f: 34 };
    if (scene === 7) return { p: [94, 27, d * 1.1], t: [35, -9, 0], f: 34 };
    return { p: [45, 12, d * 1.08], t: [-10, 2, 0], f: 34 };
  }
  if (scene === 0) return { p: [2, 2, d], t: [-19, 20, 0], f: 34 };
  if (scene === 2) return { p: [40, 4, d], t: [-9, 6, 0], f: 34 };
  if (scene === 3) return { p: [5, 5, d * 1.08], t: [-30, 12, 0], f: 34 };
  if (scene === 6) return { p: [28, 15, d * 1.14], t: [-10, 12, 0], f: 34 };
  if (scene === 7) return { p: [48, 18, d * 1.32], t: [15, 13, 0], f: 34 };
  return { p: [5, 5, d], t: [-6, 12, 0], f: 34 };
}

function discFor(film, scene) {
  if (scene === 0) return film === 'signet' ? ['70%', '64%', '102px'] : film === 'key' ? ['48%', '67%', '112px'] : ['55%', '67%', '112px'];
  if (scene === 7) return film === 'signet' ? ['64%', '46%', '135px'] : film === 'key' ? ['71%', '36%', '150px'] : ['72%', '38%', '72px'];
  if (scene === 6) return film === 'key' ? ['33%', '59%', '76px'] : film === 'signet' ? ['66%', '50%', '126px'] : ['59%', '57%', '75px'];
  if (film === 'key') return ['34%', '60%', '72px'];
  if (film === 'signet') return ['70%', '64%', '70px'];
  return ['58%', '58%', '72px'];
}

const grain = document.createElement('canvas');
grain.width = grain.height = 128;
const context = grain.getContext('2d');
const pixels = context.createImageData(128, 128);
for (let i = 0; i < pixels.data.length; i += 4) {
  const value = Math.floor(Math.random() * 255);
  pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
  pixels.data[i + 3] = 255;
}
context.putImageData(pixels, 0, 0);
document.querySelector('.grain').style.backgroundImage = `url(${grain.toDataURL()})`;

for (let i = 0; i < 24; i++) {
  const path = (t, out) => out.set(...pointFor(activeFilm, activeScene, i, t));
  path.len = 145;
  wire(S, path, { every: i % 6 === 0 ? 6.5 : 8, step: .72, radius: i % 6 === 0 ? .235 : .18, offset: .42 + (i % 5) * .03 });
}

function paintCopy(film, scene) {
  const token = ++copyId;
  const copy = document.querySelector('.copy');
  copy.classList.add('is-changing');
  setTimeout(() => {
    if (token !== copyId) return;
    const data = sceneAt(film, scene);
    document.querySelector('.offer-name').textContent = data.offer;
    const passage = document.querySelector('.passage');
    passage.replaceChildren();
    const cueAt = data.cue && data.passage.indexOf(data.cue);
    if (cueAt >= 0 && data.cue && scene < 6) {
      passage.append(document.createTextNode(data.passage.slice(0, cueAt)));
      const mark = document.createElement('em');
      mark.textContent = data.cue;
      passage.append(mark, document.createTextNode(data.passage.slice(cueAt + data.cue.length)));
    } else passage.textContent = data.passage;
    const transportLabel = document.querySelector('.transport-label');
    const withinOffer = scene === 0 || scene === 2 ? ' · 1 / 2' : scene === 1 || scene === 3 ? ' · 2 / 2' : '';
    transportLabel.textContent = `${data.offer.toUpperCase()}${withinOffer}`;
    document.querySelector('.current-beat').textContent = String(scene + 1).padStart(2, '0');
    copy.classList.remove('is-changing');
  }, 180);
}

function setDecor(film, scene) {
  viewer.dataset.film = film;
  viewer.dataset.scene = String(scene);
  const [x, y, size] = discFor(film, scene);
  viewer.style.setProperty('--disc-x', x);
  viewer.style.setProperty('--disc-y', y);
  viewer.style.setProperty('--disc-size', size);
  document.querySelectorAll('[data-film-choice]').forEach(button => {
    button.setAttribute('aria-pressed', button.dataset.filmChoice === film ? 'true' : 'false');
  });
  document.querySelector('.previous').disabled = scene === 0;
  document.querySelector('.next').disabled = scene === 7;
  document.title = `NESS — ${FILMS[film].name} film study`;
  const url = new URL(location.href);
  url.searchParams.set('film', film);
  url.searchParams.set('scene', String(scene));
  history.replaceState(null, '', url);
}

function renderBetween(fromFilm, fromScene, toFilm, toScene, alpha) {
  for (let i = 0; i < 24; i++) {
    S.wires[i].update((t, out) => {
      const a = pointFor(fromFilm, fromScene, i, t);
      const b = pointFor(toFilm, toScene, i, t);
      return out.set(mix(a[0], b[0], alpha), mix(a[1], b[1], alpha), mix(a[2], b[2], alpha));
    });
  }
  const a = cameraFor(fromFilm, fromScene), b = cameraFor(toFilm, toScene);
  aim(S, {
    p: a.p.map((n, i) => mix(n, b.p[i], alpha)),
    t: a.t.map((n, i) => mix(n, b.t[i], alpha)),
    f: mix(a.f, b.f, alpha)
  });
  S.renderer.render(S.scene, S.camera);
}

function show(film, scene, instant = false) {
  if (!FILMS[film]) return;
  const targetScene = Math.max(0, Math.min(7, scene));
  if (!instant && film === activeFilm && targetScene === activeScene) return;
  const fromFilm = activeFilm, fromScene = activeScene, start = performance.now();
  activeFilm = film; activeScene = targetScene;
  setDecor(film, targetScene);
  paintCopy(film, targetScene);
  motionId++;
  const thisMotion = motionId;
  const duration = instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : film === 'signet' ? 760 : film === 'wayfinder' ? 1040 : 900;
  const tick = now => {
    if (thisMotion !== motionId) return;
    const alpha = duration ? ease(Math.min(1, (now - start) / duration)) : 1;
    renderBetween(fromFilm, fromScene, film, targetScene, alpha);
    if (alpha < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  busyUntil = start + duration * .74;
}

function step(delta) { show(activeFilm, stepScene(activeScene, delta)); }
document.querySelector('.previous').addEventListener('click', () => step(-1));
document.querySelector('.next').addEventListener('click', () => step(1));
document.querySelectorAll('[data-film-choice]').forEach(button => button.addEventListener('click', () => show(button.dataset.filmChoice, activeScene)));
addEventListener('keydown', event => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); step(1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); step(-1); }
  const choices = ['key', 'signet', 'wayfinder'];
  if (['1', '2', '3'].includes(event.key)) show(choices[Number(event.key) - 1], activeScene);
});
addEventListener('wheel', event => {
  event.preventDefault();
  const now = performance.now();
  if (Math.abs(event.deltaY) < 6 || now < busyUntil) return;
  step(Math.sign(event.deltaY));
}, { passive: false });
let touchY = null;
addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY ?? null; }, { passive: true });
addEventListener('touchend', event => {
  if (touchY === null) return;
  const delta = touchY - (event.changedTouches[0]?.clientY ?? touchY);
  if (Math.abs(delta) > 45) step(Math.sign(delta));
  touchY = null;
}, { passive: true });
addEventListener('resize', () => { S.resize(); renderBetween(activeFilm, activeScene, activeFilm, activeScene, 1); });

setDecor(activeFilm, activeScene);
paintCopy(activeFilm, activeScene);
renderBetween(activeFilm, activeScene, activeFilm, activeScene, 1);
document.documentElement.dataset.ready = '1';
window.__offersFilm29 = { show, get state() { return { film: activeFilm, scene: activeScene }; } };
