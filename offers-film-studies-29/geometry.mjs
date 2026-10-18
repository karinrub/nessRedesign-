const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const pulse = (x, c, w) => Math.max(0, 1 - Math.abs(x - c) / w);

function keyMade(i, t, reach = 105, broken = false) {
  const top = i < 12, u = (i % 12) / 11, side = top ? 1 : -1;
  const radius = 18 + 12 * u;
  if (t < .46) {
    const angle = side * Math.PI * (1 - t / .46);
    return [-46 + radius * Math.cos(angle), radius * Math.sin(angle), (u - .5) * 18 + 3 * Math.sin(angle)];
  }
  const e = (t - .46) / .54;
  const x = mix(-46 + radius, reach, e);
  const teeth = top ? 0 : 13 * Math.max(pulse(x, 55, 7), pulse(x, 75, 7), pulse(x, 96, 9));
  const fault = broken && !top && i % 5 < 2 ? 15 * pulse(x, 75, 9) : 0;
  return [x, side * (2 + 3 * u) - teeth + fault, (u - .5) * 18 + 3 * Math.sin(Math.PI * e)];
}

function keyScene(scene, i, t) {
  if (scene === 0) {
    const top = i < 12, u = (i % 12) / 11, r = 20 + 12 * u;
    const angle = (top ? 1 : -1) * Math.PI * (1 - t);
    return [-30 + r * Math.cos(angle), r * Math.sin(angle), (u - .5) * 17];
  }
  if (scene === 1) return keyMade(i, t, 50);
  if (scene === 2) {
    const group = Math.floor(i / 6), row = i % 6, radius = 12 + row * 1.3;
    const x0 = -66 + group * 39;
    if (t < .65) {
      const a = Math.PI * (1 - t / .65);
      return [x0 + radius * Math.cos(a), radius * Math.sin(a), group * 5 - 10];
    }
    return [mix(x0 + radius, x0 + 33, (t - .65) / .35), 1 + row * .5, group * 5 - 10];
  }
  if (scene === 3) return keyMade(i, t, 80);
  if (scene === 4) return keyMade(i, t, 105, true);
  if (scene === 5) return keyMade(i, t, 105);
  return keyMade(i, t, 105);
}

function signetMade(i, t, damaged = false) {
  if (i < 12) {
    const u = i / 11, angle = TAU * t;
    const scallop = 2.7 * Math.cos(10 * angle);
    const dent = damaged && i > 6 && i < 10 ? 8 * pulse(t, .17, .08) : 0;
    const radius = 38 + 10 * u + scallop - dent;
    return [58 + radius * Math.cos(angle), radius * Math.sin(angle), (u - .5) * 15 + 4 * Math.sin(angle)];
  }
  const group = Math.floor((i - 12) / 4), u = ((i - 12) % 4) / 3;
  const offset = (u - .5) * 6;
  if (group === 0) return [39 + offset, -23 + 46 * t, 9 + offset];
  if (group === 1) return [39 + 38 * t + offset, 23 - 46 * t, 9 + offset + 5 * Math.sin(Math.PI * t)];
  return [77 + offset, -23 + 46 * t, 9 + offset];
}

function signetScene(scene, i, t) {
  if (scene === 0) return [-46 + 115 * t, -38 + i * 3.2 + 7 * Math.sin(Math.PI * t), (i % 6 - 3) * 3];
  if (scene === 1) return signetMade(i, t, true);
  if (scene === 2) {
    const group = Math.floor(i / 8), u = (i % 8) / 7;
    const a = TAU * t, r = 15 + u * 8;
    return [-62 + group * 51 + r * Math.cos(a), -6 + r * Math.sin(a), group * 1.3];
  }
  if (scene === 3) return signetMade(i, t);
  if (scene === 4) return signetMade(i, t, true);
  return signetMade(i, t);
}

const BEARINGS = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
const LENGTHS = [100, 73, 83, 58];
function wayfinderMade(i, t, wrong = false) {
  const arm = Math.floor(i / 6), u = (i % 6) / 5;
  const angle = BEARINGS[arm] + (wrong && arm === 0 ? .24 : 0);
  const length = LENGTHS[arm];
  const side = (u - .5) * (1 - t) * (arm === 0 ? 26 : 19);
  const bow = Math.sin(Math.PI * t) * (arm % 2 ? -5 : 6);
  return [15 + Math.cos(angle) * length * t - Math.sin(angle) * (side + bow),
    -7 + Math.sin(angle) * length * t + Math.cos(angle) * (side + bow),
    (u - .5) * 18 + 10 * Math.sin(Math.PI * t) + arm * 2];
}

function wayfinderScene(scene, i, t) {
  if (scene === 0) return [-106 + 121 * t, (i - 11.5) * 3.5 * (1 - t), (i % 6 - 3) * 2.4];
  if (scene === 1) {
    const u = i / 23;
    return [-75 + 145 * t, 19 * Math.sin(Math.PI * t) + (u - .5) * 14, (u - .5) * 22];
  }
  if (scene === 2) {
    const group = Math.floor(i / 6), u = (i % 6) / 5;
    const x0 = -69 + group * 43;
    return [x0 + 26 * t, (u - .5) * 37, group * 2];
  }
  if (scene === 3) {
    const group = Math.floor(i / 6), u = (i % 6) / 5;
    const a = group * Math.PI / 2 + t * Math.PI / 2;
    const radius = 35 + u * 8 + 4 * Math.sin(Math.PI * t);
    return [15 + radius * Math.cos(a), -7 + radius * Math.sin(a), (u - .5) * 18 + 4 * Math.sin(a)];
  }
  if (scene === 4) return wayfinderMade(i, t, true);
  return wayfinderMade(i, t);
}

export function pointFor(film, scene, wire, t) {
  const i = Math.max(0, Math.min(23, wire));
  const at = Math.max(0, Math.min(1, t));
  if (film === 'key') return keyScene(scene, i, at);
  if (film === 'signet') return signetScene(scene, i, at);
  if (film === 'wayfinder') return wayfinderScene(scene, i, at);
  throw new Error(`Unknown film: ${film}`);
}
