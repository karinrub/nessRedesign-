# NESS handoff, 2026-10-18: Offers 26, "The Strand Works"

Replaces the rejected 25 (single stroke). Returns to 24C's core: barbed wire as a monumental sculptural material, built from **many separate strands** with a designed silhouette per service. Read `HANDOFF-24C-THE-WAVE.md` first for film plumbing and standing rules. Hero, About, Bridge are untouched (byte-for-byte, and q 2.50 vs 2.552 diffs to zero pixels).

## Files (all new; nothing existing was edited)
| Path | What |
|---|---|
| `26-NESS-Offers-The-Strand-Works.html` | The mockup. Open via `python3 -m http.server 8765` (or `.claude/launch.json` `mockups`), `?v=7.3` boots at the Bridge's last frame. |
| `mockup26-src/forms.js` | The four sculptures (and the ground field) as pure strand families `at(i, s, t, out)`. Edit shapes here. |
| `mockup26-src/e.js` | The film: world layout, camera keys, draw schedules (`PLACE`), light, type blocks, entrance. |
| `mockup26-src/kit26.js` | Plumbing: many-wire builder (`sculpture`), lighter barb, shader (draw-on, 4 story lights, inflate, near-camera cut), camera. |
| `mockup26-src/e.css`, `base.css`, `build.py` | Type, shared CSS, `python3 mockup26-src/build.py` (from repo root). |
| `mockup26-src/lab/`, `lab.mjs` | Standalone sculpture lab (`lab.html?form=web|photo|reb|care&ribbon=1` = solid-ribbon silhouette test). |
| `mockup26-src/frames.mjs`, `look.mjs`, `perf.mjs`, `sheet.py`, `env.sh` | Real-GPU stills (`VW/VH` env for other viewports), local-frame camera probes, frame timing, contact sheets. `env.sh` holds the `PW` path (a scratchpad install of `playwright-core`; reinstall if gone). |
| `mockup26-src/storyboard-26.jpg`, `stills/` | Current stills at q 3.0, 3.9, 4.8, 5.7, 6.6, 7.5, 8.5, 9.4, 10.2. |

## The idea
One world: a **plan of long strands running to a horizon**, with **one red dot** (the Bridge's full stop). The dot sits on the horizon at the heading, then at the heart of each sculpture, travels between them, and at the end becomes the sun that fills the frame (red field = hand-off to Packages, q 10.2, same stop as 25). Each sculpture is built strand by strand as the camera travels (draw schedule per strand); at a stop everything is still.

| Stop (q) | Form | Why this form |
|---|---|---|
| 3.9 heading | The plan: 37 strands converge on the horizon; the Bridge's bars become the horizon line, which thins as the strands draw in from the vanishing point; the red period sits there | "A line becomes a plan" |
| 4.8 Websites | **Plan that stands up**: a flat ribbon of 24 strands lies on the ground, rises through a tapered catenary arch with a quarter-turn twist, settles | Planned, built by hand, authored and load-bearing; the dot is the light seen through |
| 5.7 Photography | **The barrel**: 44 profile strands of a plunging wave, seen end-on from the mouth, the sun through the hole | Framing, looking through, the one shot; a wave earns its place here (crest, lip, curl, hollow) |
| 6.6 Rebuilds | **The plait**: three ribbons plaited true on one side, unplaited into a fan of strands on the other; the plait grows back along the wire as you scroll (t 0 to .62) | An honest read: put back in order, or only mended; dot at the seam |
| 7.5 Care | **The shelter**: 38 strands from one low root sweep over a small red ember, graduated and leaning in; warm point light on the strands | Stewardship, protection, attention; "a hand cupped round a flame" without a hand |
| 8.5 / 9.4 whole / end | The four standing on the field under the sun; "Tell us what you need" | The plan is now a built world |
| 10.2 | Sun fills the frame, red field | Packages |

## What was tested
- Real GPU (system Chrome/Metal, M4 Pro) stills at every stop, plus transitions every ~0.15 q for all four chapters, entrance 2.5 to 3.9, finale 8.0 to 10.2.
- Viewports 1440×900 (main), 1280×800, 1100×800, 1920×1080 stills at each stop: type never collides with copy; sculptures stay framed.
- Frame timing, whole film scrolled in 14 s: median 16.7 ms, p99 16.8 ms, max 16.8 ms at DPR 2 (1440×900 and 1920×1080) and at DPR 1; no frame over 20 ms. Headless 60 Hz on an M4 Pro: **weaker GPUs not tested**.
- No console or page errors. Bridge to Offers handover identical to the pixel at q 2.50 vs 2.552.
- Scene build at load: about 550 ms, once (a hitch right when the Bridge is ready; not yet moved off the main thread or staggered).

## Remaining weaknesses (what I would do next)
1. **Heading stop is the quietest frame.** The converging lines are correct but empty above the horizon.
2. **Parallel straight strands (the field, the Websites runway) can read as fencing or a grid** at grazing angles, even though they are a deliberate plan. Consider fewer, longer, slightly bowed lines, or lighting them only in pools around each piece.
3. **Rebuilds plait looks like a diamond lattice up close**; the fan end is lovely but the plait itself is dense. Wider ribbon spacing or a slower twist may read as more hand-made.
4. **Photography's tail and the Care wing are fine at their stops but the transitions between sculptures fly high over empty field**, so mid-transition frames (q about 5.3, 6.1, 7.0) are mostly lines. The camera path could pass lower, closer to each next piece.
5. Finale pieces are small (about 300 px each) and inflated strands thicken on pull-back; the field is bright. Consider a lower, tighter camera and dimmer field.
6. Near-camera strands are cut by a 52-unit radius (otherwise dim strands pass as huge black tubes); a soft fade would be better than a hard cut.
7. Not checked: reduced motion, tall or narrow viewports (the camera uses vertical FOV, so narrow screens crop), a human real-time watch-through, touch scrolling.
8. Nothing is committed. Everything from mockup 20 onward, including this, is untracked or modified; ask Karin before committing.
