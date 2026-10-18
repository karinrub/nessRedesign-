import test from 'node:test';
import assert from 'node:assert/strict';
import { FILMS, sceneAt, stepScene } from './model.mjs';
import { pointFor } from './geometry.mjs';

test('three film studies keep distinct final objects', () => {
  assert.deepEqual(Object.keys(FILMS), ['key', 'signet', 'wayfinder']);
  assert.deepEqual(Object.values(FILMS).map(film => film.finalObject), ['key', 'signet', 'wayfinder']);
});

test('each film has the planned eight beats with the same offer order', () => {
  for (const film of Object.values(FILMS)) {
    assert.deepEqual(film.scenes.map(scene => scene.offer), [
      'Websites', 'Websites', 'Photography', 'Photography', 'Rebuilds', 'Care', 'Finale', 'Packages'
    ]);
  }
});

test('scene navigation stays within the film', () => {
  assert.equal(stepScene(-1, -1), 0);
  assert.equal(stepScene(0, 1), 1);
  assert.equal(stepScene(7, 1), 7);
  assert.equal(sceneAt('key', 2).offer, 'Photography');
});

test('all film beats yield finite wire positions', () => {
  for (const film of Object.keys(FILMS)) {
    for (let scene = 0; scene < 8; scene++) {
      for (const wire of [0, 7, 15, 23]) {
        for (const t of [0, .25, .5, .75, 1]) {
          assert.ok(pointFor(film, scene, wire, t).every(Number.isFinite));
        }
      }
    }
  }
});

test('the three final sculptures have distinct silhouettes', () => {
  const samples = Object.keys(FILMS).map(film => [0, 4, 9, 15, 23].map(i => pointFor(film, 6, i, .5)));
  assert.notDeepEqual(samples[0], samples[1]);
  assert.notDeepEqual(samples[1], samples[2]);
  assert.notDeepEqual(samples[0], samples[2]);
});
