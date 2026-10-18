const SCENES = [
  {
    offer: 'Websites',
    passage: 'Your website should look like it was made for you, because it was. Every page is planned around the one thing your business needs it to do, then built by hand and tuned to load fast on a phone, since that’s where most of your customers will find you.',
    cue: 'made for you'
  },
  {
    offer: 'Websites',
    passage: 'When it’s finished, the whole thing belongs to you. Domain, files, everything.',
    cue: 'belongs to you'
  },
  {
    offer: 'Photography',
    passage: 'Stock photos make a real business look like a stranger.',
    cue: 'a stranger'
  },
  {
    offer: 'Photography',
    passage: 'Isabella takes the pictures herself, at your place, of your work and the people behind it, and she shoots with the site already in mind. That is why the two feel like they were born together.',
    cue: 'your place'
  },
  {
    offer: 'Rebuilds',
    passage: 'Maybe you already have a site, and somewhere along the way it stopped doing its job. Send it over. You’ll get an honest read on whether it needs rebuilding or just fixing, and if a fix is enough, a fix is what you’ll get.',
    cue: 'a fix is enough'
  },
  {
    offer: 'Care',
    passage: 'Launch day is not goodbye. Updates, small fixes, a new page in busy season, a question at nine at night. Call, and one of us picks up, on Maui time. Nobody hands you off to an account manager, because there isn’t one.',
    cue: 'one of us picks up'
  },
  { offer: 'Finale', passage: 'Tell us what you need', cue: 'hello@nessmaui.com' },
  { offer: 'Packages', passage: 'Packages', cue: '' }
];

const makeFilm = (name, finalObject, movement) => ({
  name,
  finalObject,
  movement,
  scenes: SCENES.map(scene => ({ ...scene }))
});

export const FILMS = {
  key: makeFilm('The Key', 'key', 'Made for one. Owned by one.'),
  signet: makeFilm('The Signet', 'signet', 'No one else’s.'),
  wayfinder: makeFilm('The Wayfinder', 'wayfinder', 'Built around where you need to go.')
};

export function sceneAt(film, index) {
  return FILMS[film]?.scenes[Math.max(0, Math.min(7, index))];
}

export function stepScene(index, delta) {
  return Math.max(0, Math.min(7, index + delta));
}
