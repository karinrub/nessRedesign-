# NESS handoff, 2026-10-18: Offers 24C, "The Wave" (approved direction)

**Next session: elevate and develop 24C, The Wave.** Karin approved this direction for further development. It is a direction, not a finished design: the concept is kept, and the execution should improve a lot.

Read this whole file first, then the older `HANDOFF.md`, which covers project background and the history of mockups 17–23.

---

## 1. The project in one paragraph
NESS Studio (Karin Rubin, websites; Isabella, brand photography; Makawao, Maui) is a scroll-driven cinematic site that plays like a film: Hero → About → Bridge G ("In Register") → **Offers** → Packages (next, not built yet). Hero, About and Bridge are **approved and must not change**: not their pixels, timing or code. All our work is inside the Offers extension. This is a sandbox repo (`karinrub/nessRedesign-`); never touch the production NESS_Studio repo.

## 2. Files
| Path | What it is |
|---|---|
| `24C-NESS-Offers-The-Wave.html` | **The approved direction.** Standalone (about 5.8 MB, fonts and three.js inlined); contains the whole film. |
| `mockup24-src/c.js` | The Wave's film: shapes, camera, type choreography, entrance. **Edit this.** |
| `mockup24-src/c.css` | The Wave's type and layout. |
| `mockup24-src/kit.js` | Shared plumbing: wire builder, draw-on shader, story light, camera keys, film hooks. Spliced into the file at `/*KIT*/`. |
| `mockup24-src/base.css` | Shared plumbing CSS. |
| `mockup24-src/build.py` | `python3 mockup24-src/build.py c` rebuilds only 24C. Every build starts from 19's HTML, so Hero, About and Bridge stay byte for byte. |
| `mockup24-src/frames.mjs` | Stills on the real GPU. See section 7. |
| `mockup24-src/storyboard-C.jpg` | Current stills: Websites, Photography, Rebuilds, Care, the whole, the end. |
| `24A-…Balance.html`, `24B-…A-Day-on-Maui.html` | The other two directions, not chosen. Keep them; don't edit. |
| `19…` to `23…` | Earlier mockups. Keep them; don't edit. |

Suggested new version: copy `mockup24-src` to `mockup25-src` (or add a `c2.js`) and build a new file such as `25NESS-Offers-The-Wave.html`, so 24C stays as it is for comparison. **Karin's rule: every iteration is a new file; never overwrite a previous mockup.**

## 3. How the film works
- **Playhead:** `p = scrollY / innerHeight`. The About ends at p = 4.8, so Offers uses section time **`q = p − 4.8`**.
- **Stops:** `window.BRIDGE_CFG = {length: 9.7, stops: [..., 8.7, 9.6, 10.5, 11.4, 12.3, 13.3, 14.2]}`. The scroll-space CSS is `(4.8 + 9.7 + 1)`. Both are patched by `build.py`. When the visitor pauses, the film glides to the nearest stop. Changing timing means changing the stops and the length together.
- **Offers stops in q:** heading 3.9, Websites 4.8, Photography 5.7, Rebuilds 6.6, Care 7.5, the whole 8.5, end 9.4. The wire moves only *between* stops; at a stop it is still and the paragraph arrives word by word.
- **Bridge hooks:** Bridge G calls the extension's hooks `dom, init, layout, post(ctx, q), take(q), live()`. Once `take` returns true (q > 2.55), the Bridge stops drawing its sentence and Offers draws the entrance on the Bridge's own 2D canvas (`entrance(ctx, qq)` in `c.js`). The 3D layer fades in at q ≈ 3.0. The Bridge's line plates are available in `A.G.L` (each has `C`, `R`, `x`, `y0`, `pad`, `HH`, `Y`).
- **The wire:** the hero's own procedural model, `NWF.createSteelWire` and `createSteelStudio` from the inlined `ness-wire-model`: two twisted strands, instanced barbs, cut ends, a PMREM studio, ACES tone mapping.
  - `kit.js` builds **one wire** from a list of `section(f)` curves, each parametrised by rest length.
  - `refresh()` re-forms the wire only when its shape key changes.
  - A shader attribute `aM` holds each ring's position along the wire, so `X.u.rev` can **draw the wire on** progressively.
  - A **story light** (`X.u.fc`, `fr`, `dim`) keeps the subject lit and dims the rest.
- **Camera:** keys `{q, p, t, f (fov), s:[lens shift x, y], stop}`, built into Catmull-Rom curves and eased between stops. The lens shift places the subject on screen without turning the camera.
- **URL params:** `?v=7.3` boots at the Bridge's last frame; `?still` freezes smoothing for screenshots.
- **Debug:** `window.__nw` exposes `X()`, `G3()`, `camState(q)` and `keys()`.

## 4. What The Wave is now (24C)
**Concept:** one wave, a right-hander peeling down a point the way Honolua Bay does. A single barbed wire builds it as a run of cross-sections, rib after rib, with a red sun at the end of the barrel. Its sections are the four services:

| Stop | Section of the wave | Meaning | Camera now |
|---|---|---|---|
| Websites (4.8) | the swell taking shape (shoulder) | planned before it breaks | low, from the front, looking up the line |
| Photography (5.7) | inside the barrel, looking out at the light | the shot everyone remembers | inside the tube, wide FOV 54 |
| Rebuilds (6.6) | the closeout: the section falls apart (noise) and stands back up clean | an honest fix | from the front, down the line |
| Care (7.5) | the next set: two long swell lines lining up behind | launch day is not goodbye | high, looking out to sea, night lighting |
| Whole (8.5) → end (9.4) | the whole wave from the shoulder side, the red sun beyond | — | surf-photo angle from the channel; "Tell us what you need" top left |

**Entrance:** the Bridge's sentence ripples in strips like a reflection and washes out into a cream waterline, which the steel then takes over.

**Geometry** (in `c.js`):
- The wave runs along x from −150 to 150 and breaks toward +z.
- `STAGES` holds 5 profile keyframes (swell → face → barrel → lip → whitewater). There are `NS = 46` slices, alternating direction so one wire zigzags along the base and the lip.
- `S.sea` is the lead-in waterline, then `S.shoulder`, `S.barrel`, `S.close` (with `M.mess` noise, pulled true at about q 6.24–6.56), `S.white`, and finally `S.set` (the next set, as long lines behind).
- The red sun is a flat `CircleGeometry`, currently at (420, 24, 4).

**Type** (`c.css`):
- The heading is top left.
- Each service name is huge (11.5vw) along the bottom; Photography's sits at the top.
- Paragraphs are top right, except Photography's, which is bottom left.
- Care's name is red; the CTA and email are top left at the end.

**Performance:** measured on an M4 Pro (Chrome, Metal, DPR 2): median frame 8.3 ms, p99 9.4 ms, worst 16.7 ms while scrolling the whole section. Keep this budget.

## 5. Known weaknesses (the starting list for elevation)
1. **The wave reads as a wireframe mesh or a concertina coil at several stops.** Websites and Rebuilds, seen from the front, look like generic coiled wire. Only the barrel (Photography) and the final shoulder view clearly read as a wave.
   - Rethink the rib density, profile and silhouette so the *lip* and the *curl* are the hero line.
   - Consider fewer, more deliberate ribs; a continuous lip line; or a drawn crest with ribs only where needed.
2. **The final reveal is too low and flat** (a long hump on the bottom of the frame). It needs a breaking-wave silhouette with a pitching lip and a strong composition. The red sun should sit in the barrel's opening, as in a classic surf photograph from the channel.
3. **The Care stop is weak:** two thin lines going off-screen, plus night lighting that makes the set look grey. It needs a recognisable "next set" composition, or a better metaphor.
4. **The closeout (Rebuilds) noise looks like a glitch, not a wave collapsing.** It should feel like whitewater re-forming into clean lines.
5. **Type layout:**
   - Photography's paragraph overlaps the wire.
   - The huge names along the bottom can collide with the wave's base.
   - The heading and CTA sit in empty sky with little relationship to the wave.
   - Integrate the type with the sculpture (behind the lip, along the waterline).
6. **The entrance** (ripple strips) works but is a little glitchy. It could be more liquid and more elegant.
7. **Transitions between stops are camera moves along a mostly static sculpture.** The wave could actually *peel*: break progressively from shoulder to inside as the camera travels with it, so the scroll drives the breaking.
8. **Only one look-and-fix round was done. Not checked:** other viewports than 1440×900, reduced motion, and a full real-time watch-through by a human.

## 6. Standing rules (from Karin; non-negotiable)
- **Palette:** ink `#17150f`, cream `#e9e1ce`, red `#c0230b`. Tone steps of these are fine.
- **Type:**
  - Instrument Sans only.
  - Manufacturing Consent only where it already exists (hero and header), never in Offers.
  - Never split a word across lines.
  - **No 3D text: all type is flat. The barbed wire is the only 3D element.** This also applies to the end of the Bridge transition.
- **Content:**
  - Exactly four services: Websites, Photography, Rebuilds, Care.
  - Heading "What you can hire us for."
  - Service paragraphs verbatim (the `NGL.OFFERS` object in the HTML).
  - No package lists, no invented copy, never the phrase "NESS is for".
- **Never:** tattoo themes or flash sheets, stock images, photos of Karin or Isabella in Offers, phone or device mockups, doodle icons, generic service cards, the Bridge's print and registration machinery, or barbed wire used as picture frames, borders or containers.
- **The wire snaps only in the hero.**
- **Rejected, don't revisit:**
  - Concepts 10–16, 18, 19's tower, 20 (morphing line), 21 (The Stitch), 22 (Point of View), 23 (square/circle/triangle/infinity on a line).
  - 24A Balance and 24B A Day on Maui were not chosen.
- **Scope:** desktop first (1440×900), scroll-driven only. No buttons, tabs or drag to drive the sequence. Clear stops where the visitor reads; the wire moves only between them.
- **Process:**
  - Each iteration is a new file.
  - Give a short note on what changed, plus an honest verification note that says which checks were skipped.
  - Taste authority: the `design-taste-frontend` skill. Also use Emil Kowalski's skills (`emil-design-eng`, `animate`, `animation-performance`, `review-animations`, `apple-design`).
- **Karin values:** beautiful graphic design together with cinematic movement and dimensional transitions. Every frame should look art-directed when paused. Every transformation must have a purpose. Her reference is Sleep Well Creatives (Awwwards Site of the Day, Jan 2026).
- **Next section is Packages:** the ending should hand off to it naturally. No literal package or box shapes.

## 7. Local setup and QA
- **Repo and branch:** `/Users/karinrubin/Projects/nessRedesign-`, branch `claude/dreamy-thompson-axxys6`. **Nothing after commit `5b794fc` is committed**: mockups 20–24 and their src folders are untracked or modified. Commit them (ask Karin first) before big changes.
- **Server:** `.claude/launch.json` defines `mockups`, which runs `python3 -m http.server 8765`, so `preview_start name="mockups"` works. Open `http://localhost:8765/24C-NESS-Offers-The-Wave.html?v=7.3`. The built-in browser cannot open `file://`.
- **Stills on the real GPU:** Playwright Core is installed at `<scratchpad>/pw/node_modules/playwright-core`. That scratchpad was session-specific, so reinstall it with `npm i playwright-core` in a scratch dir. Then:
  `PW=<dir>/node_modules/playwright-core node mockup24-src/frames.mjs <outdir> 4.8,5.7,6.6,7.5,8.5,9.4 http://localhost:8765/24C-NESS-Offers-The-Wave.html`
  It uses system Chrome (Metal), one browser session, `?still`, and section-time positions.
- **Contact sheets:** `python3 mockup23-src/contact_sheet.py out.png a.png b.png …` (needs Pillow, which is installed).
- **Frame timing:** scroll the page from p 7.3 to 14.2 over 9 s inside a `page.evaluate` that logs rAF deltas, as in the earlier perf scripts. Report the median, p99 and max, and where any frame goes over 20 ms.
- **Lint:** `node .claude/skills/design-taste-frontend/scripts/lint.mjs mockup24-src/c.css mockup24-src/c.js`.
- **Checks before reporting anything as done:**
  - The Bridge→Offers handover is pixel-identical at q 2.50 vs 2.552 (diff the stills).
  - No console errors.
  - Every stop's still has been reviewed.

## 8. Starter prompt for the next session (paste this)
> We're continuing the NESS Offers section. Read `HANDOFF-24C-THE-WAVE.md` completely, then `HANDOFF.md` for background. The approved direction is **24C, The Wave** (`24C-NESS-Offers-The-Wave.html`, source `mockup24-src/c.js`).
>
> Elevate it substantially and save it as a new mockup (don't overwrite 24C):
> - Make the wave unmistakably a beautiful breaking wave at every stop, and a stunning final reveal.
> - Make the scroll actually drive the wave peeling and breaking.
> - Strengthen each service's moment (Websites the swell, Photography the barrel, Rebuilds the closeout re-forming, Care the next set).
> - Integrate the flat typography with the sculpture.
> - Polish the Bridge entrance and the hand-off toward Packages.
>
> Start with the weaknesses list in section 5. Research surf photography and wave forms first, use the taste and Emil Kowalski skills, inspect every stop in the browser, and refine until it's clearly better. Keep all standing rules in section 6.
