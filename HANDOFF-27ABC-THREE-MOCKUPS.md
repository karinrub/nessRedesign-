# NESS handoff, 2026-10-18: Offers 27A, 27B, 27C (three directions, built)

All three directions from `OFFERS-DIRECTIONS-SCRIPTS.md` are built as separate, browser-viewable mockups. Karin has not chosen between them. Hero, About and Bridge are untouched (every build starts from `19NESS-Offers-Elevation-Tower.html`; the Bridge-to-Offers handover diffs to zero pixels at q 2.50 vs 2.552 in all three). **Nothing is committed.**

## Files (all new; nothing existing was edited)

| Path | What |
|---|---|
| `27A-NESS-Offers-The-Hanging-Model.html` | I. The Hanging Model |
| `27B-NESS-Offers-The-Orb.html` | II. The Orb |
| `27C-NESS-Offers-The-Keepers-Light.html` | III. The Keeper's Light |
| `mockup27abc-src/kit27.js`, `base27.css` | Shared kit (see below). Spliced into each file at `/*KIT*/`. |
| `mockup27abc-src/a.js`/`a.css`, `b.*`, `c.*` | The three films. Each edits only its own files. |
| `mockup27abc-src/build.py` | `python3 mockup27abc-src/build.py [a b c]` from the repo root. Patches `BRIDGE_CFG` (length 13.0, the 12 Offers stops) and the scroll-space CSS `(4.8 + 13.0 + 1)` together. |
| `mockup27abc-src/storyboard-27A.jpg`, `-27B`, `-27C` | 16 stills each: every stop plus the signature turns and the hand-off. |
| `mockup27abc-src/frames.mjs`, `look.mjs`, `bench.mjs`, `perf.mjs`, `sheet.py` | Stills, camera probes, CPU frame cost, real frame timing, contact sheets (see QA). |

`mockup27-src/` already held "The Crest Study" (an earlier 27), so the new kit lives in `mockup27abc-src/` to avoid overwriting it.

Open with `python3 -m http.server 8765` at the repo root, then for example `http://localhost:8765/27A-NESS-Offers-The-Hanging-Model.html?v=7.3` (the Bridge's last frame). Add `&sil` for the solid-silhouette test (every strand drawn as a fat flat ribbon).

## What all three share (the kit)

- **Section clock** as proposed in the scripts: heading 3.9; Websites 4.7 / 5.5; Photography 6.3 / 7.1; Rebuilds 7.9 / 8.7; Care 9.5 / 10.3; whole 11.2; end 12.0; hand-off 12.8 (q = p − 4.8). The wire and camera move only between stops; at a stop the copy arrives word by word.
- **Copy**: verbatim from `NGL.OFFERS`, split once in code at the scripts' break points ("When it's finished", "Isabella takes", "Send it over.", "Updates, small"). Nothing is retyped. Heading "What you can hire us for."; CTA "Tell us what you need" with `hello@nessmaui.com`.
- **Type**: Instrument Sans only, all flat. The hook is centred, sized by length: Websites is long text at about 27px, Rebuilds medium at 3.1vw, Photography and Care large statements. The reveal is the service name at display size plus a paragraph in a protected area. There are no eyebrow labels (taste rule), so the service name arrives with the reveal; the hook stands alone.
- **Websites (Karin's brief, identical mechanics in all three)**: the hook is centred. "made for you" leaves the paragraph (the rest fades), flies into the red circle and is held there. The camera goes into the circle until red fills the frame (an invisible swap to a flat red field), and the reveal is set on red.
- **Hand-off to Packages**: every direction ends on a full red frame produced by its final shape acting (sun, hub or light), never a sheet.
- **Plumbing**: each sculpture is one *bundle*: all its strands (twisted pairs, `lightBarb` barbs) in two draw calls. The shader provides draw-on, four story lights, per-strand gain (`uK`), a light pulse along strands (`uPulse`), a soft dithered near-camera fade instead of the hard 52-unit cut, per-bundle fade, and `?sil`. The camera has roll. The kit also has flat billboard discs, `toScreen`, `madeForYou`, `redField`, and the shared Bridge entrance (identical to 26 until the line forms at q 3.04). After that, each direction takes the line.

## 27A — The Hanging Model

**Rationale.** Four loads hang in one net, and each load finds its own form, so the final shape is not designed; it is what the four loads left behind. The verbs: **hang** (Websites: the red weight lowers into the curtain and a bell of 17 catenaries hangs around it, with three ghost bells flickering beside it), **weigh-in** (Photography: twelve identical weights on a festoon slide and swell into an irregular, specific surface, with a rack focus onto the red one), **tie** (Rebuilds: a pulse reads the slack span, a ghost rebuild is declined, one bright vertical tie lifts the sag and stays visible), **sway** (Care: night, a tug runs along one far strand to the weight, three grey weights never move). **The flip**: the camera rolls 180° (type stays upright) and the four loads stand as a ridge: Care tent, Rebuilds arcade with its needle, Photography's gothic cluster, and the Websites bell, the tallest. The sun sits low in the saddle; the camera climbs over the ridge into it.

**Departures from the script, and why.** The net is staggered in depth so the four peaks overlap into one range; in a single plane they read as a frieze of four separate objects (26's failure). Rebuilds is a span strung between two posts with a vertical tie, rather than V-junctions: the V version read as hairpins, and as a span it turns over into arches. Photography's weights hang on their own plumb strands with a necklace strand festooned through them (the V-pairs read as hairpins too). The "first bell dimples" beat and the "weights release" before the flip are not built.

**Remaining weaknesses.** The heading frame is a dense barcode of plumb lines. The transits P→R and R→C (q ≈ 7.4, 9.1) are busy for a moment. The Care tug is subtle in stills; it needs a real-time look. At 1100×800, the Photography and Rebuilds paragraphs touch a strand.

## 27B — The Orb

**Rationale.** A web is built for one place. **Spin**: the radii run out from the edge of the hook paragraph to an irregular frame whose anchor lines run off-screen. The paragraph dissolves to "made for you" in the hub. A bright point lays the spiral, slow then very fast (`q = a + b√u`, "tuned to load fast"). The sun rises behind the hub, held exactly on the line of sight so the two read as one circle, and the camera goes in. **Catch light**: a clip-art web (regular, anchored to nothing) is shown alone in the dark and goes. The real web returns, seen at a grazing angle, and dew beads along the spiral. **True**: after a night of wind the web is slack and dull; a pulse goes round the hub clockwise lighting taut radii and leaving slack ones dull; a ghost new web is declined; each radius is trued in turn with a small tick; two stay a hair brighter (new silk). **Listen**: night, one far frame thread trembles, a kink of light runs down one radius to the hub, and the hub answers outward through every radius. Two far webs keep dark hubs. Finale: a dawn meadow of five webs, each with its own red hub and short anchors, ours sharp in front; the camera flies into our hub, which fills with red.

**Flag (Karin's "wire is the only 3D thing").** The dew is not geometry: each drop is a flat billboard glint holding a tiny upside-down red sun. Its offset is computed from the sun's real screen position, so the suns slide together with parallax. As in the scripts, the sun is a flat disc.

**Remaining weaknesses.** The "web for a website" pun is still the risk. The meadow is the busiest finale of the three. The hub+sun merge on the Websites turn shows briefly as two red discs. The Care kink is subtle in stills. At 1100×800 the Photography title touches the web.

## 27C — The Keeper's Light

**Rationale.** One night, dusk to dawn, with no tower: only a lens of 14 hand-irregular rings (cut ends staggered), a cone of 70 strands for the beam, and three clockwork drive cords. The flame is the dot. **Ring**: the lamp is lit with its first rings at the heading; rings are drawn outward one by one round "made for you", and three cinch in to fit. **Focus** (side view): a wide, even fan lands on nothing; the rings re-space and the fan closes onto one point on the water (a rack focus made of strands). **Re-aim** (high plan view): the flame gutters and the beam drifts and splays; one slow survey of the whole horizon; a ghost lens rises and is declined; a small nudge brings the beam true. **Keep watch**: the drive cord is wound (a pulse climbs it), the beam turns like a clock hand, a red ping appears on the water, and the beam turns to it, holds, and resumes. Finale (side view): the lens and its cone (McCall's cone) with a small red light at the apex; the light comes along the beam to us and fills the frame.

**Remaining weaknesses.** The heading frame is the quietest of the three. The cone is the same object in every chapter, so chapter variety comes from camera, focus and sweep rather than from shape; Karin may find it less shape-rich than A. The drive cords read only in side views. At 1100×800 the Photography lens is cropped at the left edge.

## QA: what was run, what was not

- **Stills**: every stop and every transition every 0.15 q for all three at 1440×900, plus every stop at 1280×800, 1100×800 and 1920×1080. All reviewed.
- **Refinement**: four or more look-and-fix rounds per direction on those stills. A: P/R redesign, depth stagger, story lights, finale framing. B: dark stage, dew size, clear fields, meadow. C: complete camera redesign, cords, rings, framing.
- **Handover**: q 2.50 vs 2.552 diffs to zero pixels (A, B, C).
- **Console**: no errors or page errors in any run.
- **Silhouette test (`&sil`)**: all main shapes read as solid silhouettes. This was done after the film was built, not as a lab-first prototype (no separate lab was built this time).
- **Lint**: `design-taste-frontend` lint.mjs on all 27ABC CSS/JS: 0 fail, 0 warn. `inspect.mjs` was not run (it scores conventional pages and does not fit a scroll film).
- **Performance**: this session ran in a Linux cloud container with **software WebGL only**, so real frame times were **not measured**. Run `GL=metal node mockup27abc-src/perf.mjs <url> 2` on the Mac (and at DPR 1 and 1920×1080). What was measured is the CPU cost per frame with GPU drawing stubbed (`bench.mjs`, q 2.56→12.8 in 0.01 steps, on this container's CPU): median 0.1 ms; p99 6 ms (A), 10.5 ms (B), 10.5 ms (C); worst 11–14 ms during the heaviest re-forming (B's slackening, C's focus). Each bundle's first form is warmed at build time, so there is no hitch at the handover. Scene build: about 140–230 ms.
- **Not checked**: a human real-time watch-through, real GPU frame times, reduced motion, touch scrolling, tall or narrow viewports.

## Open points (assumptions made)

1. Hook/reveal split: as in the scripts.
2. Section length: grows to 13 screens (`length 13.0`).
3. "made for you" in the red circle with the zoom into it: yes, in all three.
4. The twist ("born together") was not used in any direction; each one's own Photography beat was kept.
5. The strands do not stand for Karin and Isabella.

## Starter prompt for the next session

> We're continuing the NESS Offers section. Read `HANDOFF-27ABC-THREE-MOCKUPS.md`, then `OFFERS-DIRECTIONS-SCRIPTS.md`. Three mockups exist (27A The Hanging Model, 27B The Orb, 27C The Keeper's Light), sources in `mockup27abc-src/`. Karin's feedback: <paste>. Continue only in the chosen direction's `x.js`/`x.css` and save as a new numbered file; keep Hero, About and Bridge byte for byte; rerun the QA in the handoff (stills at every stop and transition, four viewports, handover diff, real-GPU perf on the Mac).
