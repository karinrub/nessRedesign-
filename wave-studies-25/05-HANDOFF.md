# 05 — Handoff: build the Offers film from direction A, The Stroke

For the next Claude Code session. Read `HANDOFF-24C-THE-WAVE.md` (standing rules, film plumbing) first, then this file, then `03-ART-DIRECTION.md` and `04-EVALUATION.md`.

## What was decided
- **Direction A, The Stroke**, is the selected sculptural language: one barbed wire, one open gesture (horizon → long back → lip thrown forward and folded back → face → out to sea), barbs gathered at the curl. Studies: `studies/A-stroke.html` (views 1–4) and the scroll proof `studies/A-motion.html`.
- **Borrowed from B (Frames):** the plunging-breaker *stages* as the service states, and the inside-the-barrel "tunnel" idea for the Photography transition (ghost exposures of the earlier stages, like the Bridge's out-of-register doubling). **Borrowed from C (Tension):** the red field and a line pulled dead straight for the final hand-off to Packages.

## Files
| Path | Use |
|---|---|
| `studies/kit.js` | Study kit: hero steel, hero lights, lens-shift camera (`aim`), `wire()` with barb positions `at` and dimmer `steel()`, flat depth-sorted type (`typePlane`), red disc on a line of sight (`discThrough`). |
| `studies/profiles.js` | The five stage polylines (H = 1), from `research/A-waves.md` §3. |
| `studies/a-stroke.js` | A's hand-built gesture `P` (z, y, peel) and the four composed cameras. |
| `studies/a-motion.js` | Stage morph by arc-length resampling, fixed camera. |
| `lib/` | three r180, `ness-wire-model` and Instrument Sans, extracted verbatim from 24C's import map and font faces. |
| `tools/shots.mjs`, `tools/look.mjs`, `tools/motion.mjs`, `tools/sheet.py` | Real-GPU stills, camera probes, motion frames + frame timing, contact sheets. `tools/env.sh` sets `PW` (reinstall `playwright-core` in a scratch dir if missing). |

## How to build it into the film
1. Copy `mockup24-src` → `mockup25-src`; new `c.js` (or `d.js`) and build to a **new** file `25-NESS-Offers-The-Stroke.html`. Never overwrite 24C. Hero/About/Bridge stay byte for byte (`build.py` already guarantees it).
2. Replace `slices()`/`STAGES`/`S.*` in `c.js` with one section built from a **stage function** `shape(q)` like `a-motion.js`: resample each key to the same N by arc length, ease between keys, add the peel (A's third coordinate) as a function of how far the lip has thrown. `refresh()` already re-forms the wire only when its key changes; the motion proof measured re-forming 900 segments every frame at median 16.7 ms / p99 16.8 ms / max 16.8 ms (headless, 60 Hz).
3. **Scale:** H = 14 world units, wire radius 0.3, camera ≈ 60 units away, fov 26. That gives the hero's on-screen thickness. Do not frame the whole sea; let the line run off both edges.
4. **Camera:** one base framing (`[-58, 3.5, 20] → [10, 7, 2]`, fov 26, lens shift y −0.2) and small drifts per stop. Stay within ±35° of the profile; beyond that the single line turns into a knot (`shots/probe/a5-3.jpg`). The Photography stop may dolly low and close (view 2's camera) because the lip frames the sun there.
5. **Entrance:** at q ≈ 3.0 the Bridge's collapsed line (24C `entrance()` already draws it) must be met by the wire at the *same screen height and thickness*; the flat key of the morph is that line. Lift it into the swell only after the heading has landed.
6. **Stops (q):** heading 3.9 (flat line, heading in the sky) · Websites 4.8 (swell) · Photography 5.7 (barrel, sun on the line of sight through `VOID`) · Rebuilds 6.6 (landing → whitewater → clean again) · Care 7.5 (sea line, next swell rising) · whole 8.5 (full gesture, the final composition of view 4) · end 9.4 (CTA). The wire moves only between stops; at a stop it is still and the paragraph arrives word by word (`stopBlock`).
7. **Type:** use `typePlane`'s idea inside the film (or keep DOM type and render a second wire pass in front where needed). Names ≈ 14 vw, 700, −0.06 em in the sky; the back of the wave passes behind the name, the lip in front, occlusion small. Paragraphs never touch wire.
8. **Ending:** after "Tell us what you need", release the curl back into the horizon, pull the horizon straight, and cut the field to red for Packages.

## Known problems to solve first
1. **Lip termination.** The doubled lip (out along the top, back along the underside) piles barbs and the cut end at the tip (`A-stroke-v1.jpg`, `A-stroke-v3.jpg`; independent critique). Taper it: thin the barb spacing in the last 15 % of the curl, and end the fold with one clean overlap.
2. **Rebuilds needs its own state.** `a-motion.js` now goes barrel → LANDED → SPENT, which morphs cleanly (`shots/motion2/m_0.52`–`m_0.70`) but SPENT is a plain low swell. Design a still first: whitewater as short barbed kinks along the sea line that are then pulled straight. Minor kink left at `m_0.64`.
3. **Care repeats Websites** (`m_0.90` ≈ `m_0.20`). Make Care "the next set": the sea line with a second, further swell rising behind the first (depth, smaller), so the image differs.
4. **Barrel moment.** A has no true tube; use a low, close dolly under the lip with the sun on the line of sight (view 2), optionally with faint "exposures" of earlier stages (from B) for depth.
5. **Volume.** Stay within ±35° of the profile; get depth from small parallax and the doubled lip, never from orbiting.
6. Not yet checked: reduced motion in the film, a human real-time watch, DPR 2 at 120 Hz, viewports beyond 1280 × 800 / 1440 × 900 / 1920 × 1080.

## Rules that still apply
Palette ink/cream/red only; Instrument Sans; all type flat; the wire is the only 3D object; four services, verbatim copy, heading "What you can hire us for."; no counters/index numbers, no frames/borders of wire, no package shapes; every iteration a new file; report which checks were skipped.
