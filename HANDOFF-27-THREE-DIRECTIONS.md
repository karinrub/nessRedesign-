# NESS handoff, 2026-10-18: build three Offers mockups (27A, 27B, 27C)

**Task for the next session:** build all three directions from `OFFERS-DIRECTIONS-SCRIPTS.md` as three separate, browser-viewable mockups of the Offers section. Karin has not chosen between them; she wants to see all three. Do not ask her to approve between phases.

Read, in this order:
1. This file.
2. `OFFERS-DIRECTIONS-SCRIPTS.md`: the three scripts (copy split, stops, chapter-by-chapter beats, finales, hand-offs, risks). **This is the creative source of truth.**
3. `HANDOFF-24C-THE-WAVE.md`: how the film plumbing works (hooks, playhead, stops, bridge entrance). Still accurate.
4. `HANDOFF-26-THE-STRAND-WORKS.md`: what the last build was and what was learned. Its design direction is **rejected**; its plumbing is reusable.

## 1. State of the project

- NESS Studio (Karin Rubin, websites; Isabella, brand photography; Makawao, Maui). Scroll-driven cinematic site: Hero → About → Bridge G ("In Register") → **Offers** → Packages (not built yet).
- **Hero, About and Bridge are approved and must stay byte for byte.** All work is inside the Offers extension (`window.NG_EXT`). Sandbox repo `karinrub/nessRedesign-`, branch `claude/dreamy-thompson-axxys6`. Never touch the production NESS_Studio repo.
- **Nothing after commit `5b794fc` is committed** (mockups 20 to 26, their src folders, the handoffs). Ask Karin before committing.
- **Every iteration is a new file; never overwrite a previous mockup.**
- Rejected, do not revisit: 10 to 16, 18, 19's tower, 20, 21, 22, 23, 24A, 24B, 25 (single stroke, too slight), 26 (four disconnected end-shapes with no story). 24C (the wave) was liked for its barbed-wire-as-monumental-material idea but its shapes were weak.
- Why 25 and 26 failed, in Karin's words: the shapes were *end images without a story that earned them*. She wants a shape that makes sense and relates to what NESS offers, that the scroll builds up to, with a different animation per offer, clever smooth transitions, and a final combined shape that also transitions into Packages. **The final shape must be a shape, not a table or sheet for the packages.**

## 2. Karin's own brief for the section (keep this intact in every mockup)

- **Websites:** first the hook text, *centered*. As it appears, the wire forms a shape on the topic of the client. The red circle holds the words **"made for you"**. The camera zooms into the circle. Then the second text is shown. Animation and graphics should say: addressed to the client, original, custom.
- **Photography:** first the words "Stock photos make a real business look like a stranger."
- **Rebuilds and Care:** clever, smooth shapes, animations and transitions; not the same animation across the section.
- After the four offers: a complete shape of the barbed wire combined, which also carries the viewer into Packages.

## 3. What to build

Three mockups, three separate source folders, three output files. Suggested names (match the repo convention of number + name):

| Mockup | Direction (see scripts doc section) | Output file | Source |
|---|---|---|---|
| 27A | I. The Hanging Model | `27A-NESS-Offers-The-Hanging-Model.html` | `mockup27-src/` (shared kit + `a.*`) |
| 27B | II. The Orb | `27B-NESS-Offers-The-Orb.html` | `mockup27-src/` (`b.*`) |
| 27C | III. The Keeper's Light | `27C-NESS-Offers-The-Keepers-Light.html` | `mockup27-src/` (`c.*`) |

All three share: the section clock (below), the copy split, the type system, the entrance from the Bridge, the build script and the QA tools. Build the shared kit first, then each direction. They can be done in parallel by separate sessions, as long as each only edits its own `a.*`, `b.*` or `c.*` files and the shared kit is frozen first.

### Copy split (verbatim; only broken in two)
See the table in `OFFERS-DIRECTIONS-SCRIPTS.md` section 0. The heading stays "What you can hire us for." CTA at the end: "Tell us what you need" with `hello@nessmaui.com`.

### Section clock (proposal in the scripts; use unless it fights the build)
Section time `q = p - 4.8`, `p = scrollY / innerHeight`. Stops in q: heading 3.9; Websites 4.7 / 5.5; Photography 6.3 / 7.1; Rebuilds 7.9 / 8.7; Care 9.5 / 10.3; whole 11.2; end 12.0; hand-off 12.8.
As absolute p: add 4.8. The build script must patch two things together (as `mockup26-src/build.py` does for the old list):
- `window.BRIDGE_CFG = {length: <last q + .2>, stops: [5.8,6.13,6.46,6.8,7.3, 8.7, 9.5, 10.3, 11.1, 11.9, 12.7, 13.5, 14.3, 15.1, 16.0, 16.8, 17.6]}` (the first five are the Bridge's own; the rest are Offers stops in p). So length = 13.0.
- The scroll-space CSS `(4.8 + 8.8 + 1)` becomes `(4.8 + 13.0 + 1)`.

The wire (and the camera) move only between stops. At a stop everything is still; the copy arrives word by word.

## 4. The plumbing you can reuse (all in the repo)

Start from `mockup26-src/` (copy, do not edit in place):
- `kit26.js`: `sculpture(key, form, world, {place, step, every, radius, dim})` builds N separate barbed wires from strand functions; per-ring draw-time attribute `aM` (draw-on driven by q); four "story lights" (`uF[4]`, `uFr[4]`) that keep one sculpture lit and the others dark; `uInfl` thickens strands as the camera pulls away; near-camera cut (`distance(vFp, cameraPosition) < 52`, otherwise dimmed strands next to the camera render as huge black tubes); `lightBarb()` (a barb with a fifth of the triangles; **essential**, see pitfalls); camera keys with a red-dot track (`d`, `r` per key, dot billboard); `hooks()` that return the Bridge's film hooks (`dom, init, layout, post, take, live`).
- `forms.js`: pure strand families `at(i, s, t, out)`. Shows the pattern (strand i of N, parameter s along it, optional morph t).
- `e.js`: world layout, camera keys, draw schedules (`PLACE`), entrance, text blocks, finale. Mockup 26's entrance (copied from 25) turns the Bridge's lines into bars that converge on the horizon line; it is pixel-identical to the Bridge until q 2.55. Reuse or replace it, but the handover rule stands.
- `build.py`: splices JS and CSS into the approved HTML **starting from `19NESS-Offers-Elevation-Tower.html`** (so hero, about and bridge stay byte for byte).
- `lab/` and `lab.mjs`: standalone sculpture lab (`lab.html?form=...&ribbon=1` renders the strands as a solid ribbon, a silhouette test: if the ribbon form is not beautiful, the strands won't be).
- `frames.mjs` (stills at film times on the real GPU; `VW`/`VH` env for other viewports), `look.mjs` (try local-frame cameras at a q), `perf.mjs` (scroll the whole film, report frame times), `sheet.py` (contact sheets), `env.sh`.

The older plumbing and the rules are in `HANDOFF-24C-THE-WAVE.md` sections 3 and 6.

## 5. Direction-specific build notes (details are in the scripts doc)

**27A, The Hanging Model.** Strands are catenaries that hang from above-frame anchors (same topology in every state: plumb, bell, scalloped, sagged, tied). Relax the states offline (position-based dynamics, or closed-form catenaries) and interpolate on scroll. The red dot is the weight. Ghost bells = dim copies. The honest-read pulse = a brightness wave along each strand (use a second shader attribute or reuse `aM` as "distance along strand plus strand offset"). **The flip** = camera roll 180° about the horizontal axis with the DOM type left upright (never rotate the type). Light is camera-fixed, so the flip stays consistent. Finale: ridge of four spires with the sun low in the saddle. Photography is the weakest chapter, so prototype the regular-to-irregular weight slide first.

**27B, The Orb.** Build the web in real construction order (bridge thread relaxes from the cream line, Y, hub, radii, then a spiral laid by a travelling point; speed ramp for "tuned to load fast"). The outer frame lines run off-screen at irregular angles. Dew is *not* geometry: bright glints on the barbs, each with a tiny inverted red dot that moves with parallax; these are flat billboards (Karin's "wire is the only 3D thing" still holds; flag them in the notes). Finale: several webs at different depths, each with a red hub, dawn light; then fly into our hub. Keep strand counts low enough to trace. Never show a spider.

**27C, The Keeper's Light.** No tower. Fresnel-like concentric rings (about 14 loops, hand-irregular; loops have cut ends, so stagger the two ends) around the flame, a cone of about 70 radial strands for the beam, a few long drive strands for the clockwork. The beam sweep rotates one group. Finale: the lens plus its cone seen from outside, then the beam finds a small red light on the water which comes toward the camera and fills the frame.

**Motif available to all three:** the twist (two strands twisted so the barbs stay put). A twist wave down two strands can replace the Photography turn if one of the directions needs it.

## 6. Standing rules (non-negotiable)

- **Palette:** ink `#17150f`, cream `#e9e1ce`, red `#c0230b` (tone steps are fine). Red is the only event: the dot.
- **Type:** Instrument Sans only; Manufacturing Consent never in Offers; never split a word across lines. **All type is flat; the barbed wire is the only 3D element.** Protect a clear area for every title and paragraph: wire must never make copy hard to read.
- **Content:** exactly four services (Websites, Photography, Rebuilds, Care); copy verbatim (`NGL.OFFERS` in the HTML); heading "What you can hire us for."; no package lists, no invented copy, never "NESS is for".
- **Never:** tattoo or flash-sheet themes, stock images, photos of Karin or Isabella in Offers, phone or device mockups, doodle icons, generic service cards, the Bridge's print and registration machinery, barbed wire as picture frames, borders or containers.
- **The wire snaps only in the hero.** (So "ghost" rebuilds and repairs are by re-tension, tie, re-aim, never a snap.)
- Scroll-driven only; desktop first (1440×900), also check 1280×800, 1100×800 and 1920×1080. No buttons or tabs to drive the sequence.
- Taste authority: the `design-taste-frontend` skill, plus `emil-design-eng`, `animate`, `animation-performance`, `apple-design`.
- Karin's reference: Sleep Well Creative (two-colour discipline, animation-forward). Every frame must look art-directed when paused.

## 7. Pitfalls already paid for (do not repeat)

- **Barb triangles.** The hero barb has about 6k triangles. 1,300 barbs = 29M triangles = 33 ms frames. Use `lightBarb()` (about 1.1k triangles) and keep barb spacing wide (every 8 to 13 units). After this change: median 16.7 ms, p99 16.8 ms at DPR 2 on an M4 Pro.
- **Story lights.** `X.focus[k]` is an array: use `set(...X.focus[k], w)`, not `.x`. A bug here lit things at the world origin.
- **Near-camera strands** render as huge dark tubes; the 52-unit cut in the shader is the hard fix. A soft fade would be better.
- **Lens shift:** positive `s[0]` moves the picture right (the sign is not intuitive; verify with `look.mjs`).
- **`look.mjs`** only re-renders when q changes: the script adds a tiny q offset per shot. If a probe looks identical to the last, that is why.
- **Caps** of wire ends use an unpatched material: toggle their visibility with draw state.
- **Wire loops** have two cut ends; for closed rings, stagger the ends.
- **zsh does not word-split `$v`** in loops. Use `${sz%%:*}` / `${sz##*:}`.
- **Scene build** of about 170 wires takes about 550 ms once at load. Staggering or deferring it would remove the hitch.
- **Playwright:** `env.sh` points to a scratchpad install that no longer exists. `npm i playwright-core` in a scratch dir, then `export PW=<dir>/node_modules/playwright-core`. Chrome (Metal) is used headless. The server is `python3 -m http.server 8765` at the repo root (`.claude/launch.json` name `mockups`).
- **Python is 3.9** on this Mac; `sed -i ''` is BSD.

## 8. Process and QA (do all of it; report honestly)

1. Audit: read the scripts doc and the mockup 26 build; look at `mockup26-src/storyboard-26.jpg` as the old baseline.
2. Shared kit first (copy `mockup26-src` to `mockup27-src`; keep `kit26.js` ideas, add what each direction needs; freeze before the three directions start).
3. For each direction: prototype each chapter's signature moment in the lab (the ribbon/silhouette test for shapes), then build the film, then at least **three refinement passes after looking at real stills**.
4. Inspect every stop and every transition (stills every about 0.15 q).
5. Checks per mockup: the overall silhouette reads before the title; each chapter is distinct in shape and in motion; strands individually visible and traceable; no generic mesh or fence look; type has clear space and nothing collides; Bridge-to-Offers handover pixel-identical at q 2.50 vs 2.552; the final shape is a shape, not a sheet; the Packages hand-off feels authored; no console errors; frame times (`perf.mjs`) at DPR 1 and 2 and at 1920×1080.
6. Output per mockup: the HTML file, a contact-sheet storyboard (`storyboard-27A.jpg` etc.), and a short honest note (artistic rationale, what was tested, what was skipped, remaining weaknesses). One combined handoff at the end.
7. Do not claim success without critically evaluating the rendered result.

## 9. Open points Karin has not answered (state your assumption in each mockup's notes)

1. Hook / reveal split of each offer (assumed as in the scripts doc).
2. Section length growing from about 10 to about 13 screens (assumed yes).
3. Whether "made for you" in the red circle with the zoom stays in every direction (assumed yes, her own idea).
4. Whether the twist ("born together") should carry Photography in any direction (default: only if a direction's own beat is weaker).
5. Whether the two strands may stand for Karin and Isabella (not used in the mockups unless she confirms).

## 10. Starter prompt for the next session (paste this)

> We're continuing the NESS Offers section. Read `HANDOFF-27-THREE-DIRECTIONS.md` completely, then `OFFERS-DIRECTIONS-SCRIPTS.md`, `HANDOFF-24C-THE-WAVE.md` and `HANDOFF-26-THE-STRAND-WORKS.md`. Hero, About and Bridge stay untouched; everything is built as new files.
>
> Build **all three directions as three separate mockups**: 27A The Hanging Model, 27B The Orb, 27C The Keeper's Light, following the scripts chapter by chapter (hook, signature turn, reveal; a different wire verb and a different transition per chapter; the red dot as the persistent graphic; Karin's Websites brief intact: hook text centered, "made for you" in the red circle, camera zooms into it). Each direction ends in a complete shape built from many separate strands and hands off to Packages by that shape acting (never a table or sheet).
>
> Work in this order: shared kit first (reuse `mockup26-src`, especially `lightBarb`, the story lights, the near-camera cut), then the three directions (separate sessions in parallel are fine if each stays in its own `a.*`, `b.*` or `c.*` files). Prototype each chapter's signature moment in the lab with the solid-ribbon silhouette test, then build the film, then do at least three refinement passes after looking at real-GPU stills at every stop and transition, in 1440×900 and the other viewports. Keep all standing rules in section 6, avoid the pitfalls in section 7, run the QA in section 8, and finish with a storyboard and an honest note per mockup plus one combined handoff. Do not commit; ask first.
