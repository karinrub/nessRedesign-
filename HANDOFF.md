# NESS handoff, 2026-10-17: Offers mockup 19, "Elevation: The Tower"

Next session: **keep fixing and polishing mockup 19.** The direction is accepted for development, but it is not approved yet.

## The project
- NESS Studio (Karin Rubin, websites; Isabella, brand photography; Makawao, Maui). The site is a scroll-driven cinematic film.
- The film runs: Hero → About → Bridge G ("In Register") → **Offers**.
- Hero, About and Bridge G are **approved and must stay untouched.**
- Repo: `karinrub/nessRedesign-`, branch `claude/barbed-wire-mockup-redesign-k5snad`. This is sandbox work only; never touch the production NESS_Studio repo.

## Files
| File | What it is |
|---|---|
| `19NESS-Offers-Elevation-Tower.html` | **Current mockup.** Standalone, about 5.8 MB, with fonts and three.js inlined. It contains the whole film. |
| `mockup19-src/tower.ext.js` | The Offers extension source (`window.NG_EXT`). Edit this. |
| `mockup19-src/tower.css` | The Offers CSS. |
| `mockup19-src/rebuild.py` | Splices the two source files back into the HTML in place. Run `python3 mockup19-src/rebuild.py` from the repo root. |
| `mockup19-src/shot3.mjs` | Stills for visual QA: `node mockup19-src/shot3.mjs $PWD/19NESS-Offers-Elevation-Tower.html out 9.6,10.5 9000` writes `out_9.6.png` and so on. It uses Playwright with software GL, at 1440×900. |
| `mockup19-src/contact_sheet.py` | Tiles stills: `python3 mockup19-src/contact_sheet.py sheet.png a.png b.png …` |
| `18NESS-Offers-Elevation.html` | Previous version (CSS 3D, flat colour). Keep it for comparison and don't edit it. |
| `17NESS-Offers-End-On.html` | Separate candidate (a camera move along the hero wire). Set aside: not approved, not rejected. Don't edit. |
| `NESS-Offers-Mockup.html` | Rejected early attempt. Ignore it. |

## How the film works (what you need to edit 19)
- The playhead is `p = scrollY / innerHeight`. The About ends at p = 4.8, so Offers code uses section time **`q = p − 4.8`**.
- Line config: `window.BRIDGE_CFG = {length: 8.8, stops: [5.8, 6.13, 6.46, 6.8, 7.3, 8.7, 9.6, 10.5, 11.4, 12.3, 13.3]}`.
  - Stops are absolute p values; when the visitor pauses, the film glides to the nearest one.
  - If you change section timing, update these stops **and** the scroll-space CSS `(4.8 + 8.8 + 1)` in the `offers-css` style block of the HTML.
- **Bridge G** draws the sentence on a 2D canvas and calls the extension's hooks: `dom, init, layout, post, take, live`.
  - `take(q)` returns true once 19 has taken over (after q = 2.55). G then stops drawing its letters.
  - `post()` runs each frame that q changes, and that is where 19 renders.
  - `live()` forces one extra frame after a rebuild.
- `window.NWF.THREE` provides three.js r180 from the inlined import map.
- **URL params:**
  - `?v=<p>` boots at a position. Use `?v=7.3` for the bridge's last frame and `?v=13.3` for the plan.
  - `?still` freezes the render loop for screenshots.

## What 19 is (concept and script)
**Concept:** one dark hexagonal tower with a red cap. Its six faces are six "elevations": face 0 the bridge sentence, face 1 the heading, faces 2–5 Websites, Photography, Rebuilds and Care.
- The camera makes one 360° turntable orbit, 60° per face.
- Lighting is camera-fixed: an ambient light plus a key light from the upper left, calibrated so that ambient + key·cos = π. Facing surfaces therefore render at exact brand colour; shadowed surfaces drop to 55%.
- Each face's construction slides out of the tower like a drawer as you arrive, and back in after you leave.

| q (stop p) | Shot |
|---|---|
| 2.55 | Invisible swap: the bridge's own canvas plates become WebGL planes at four depths, cast in cream with a red body. |
| 3.9 (8.7) | **Heading**: red slab, cream block, "What you can hire us for." Signature I: "the sentence was a building". |
| 4.8 (9.6) | **Websites**: one word at two depths, cream "Websi" in front and ink "tes" on a cream slab. |
| 5.7 (10.5) | **Photography**: five discs lock into concentric rings with crescent shadows. Signature II: "the lens". |
| 6.6 (11.4) | **Rebuilds**: six crooked bars spring true into a block. |
| 7.5 (12.3) | **Care**: night; a cream column, and a red lamp that switches on in two steps and washes it. |
| 8.5 (13.3) | **Plan**: the camera rises straight overhead. The red hexagonal cap is a full stop seen from above, with the services and heading labelled along its edges and the "Tell us what you need" link on the sentence's side. Signature III. |

## Known weaknesses: polish list, roughly in priority order
1. Not yet verified playing in motion on a real GPU. All QA so far is about 25 software-rendered stills. Check motion smoothness and frame timing first.
2. The tower faces are plain flat ink. They need subtle surface detail or edge light so the tower reads as an object at stops.
3. Paragraph text is small for its 3D scale (17px at the stop); consider 19–20px.
4. The heading stop is the plainest frame, with empty lower-left.
5. Plan labels are small (about 38px) and the link is a DOM element positioned by projection. Check its alignment at other viewport sizes.
6. Websites: the front half's shadow barely lands on the slab.
7. Mid-orbit frames are much better now, but the climb from Care to the plan shows the Care column dipping oddly.
8. The software renderer occasionally failed to draw the 3D layer in headless captures. Always capture with a fresh browser per still (shot3 does this) and run captures one at a time.

## Standing rules (from the client)
- **Palette:** ink `#17150f`, cream `#e9e1ce`, red `#c0230b`. Tone steps of these for shading are fine.
- **Type:** Instrument Sans only. Manufacturing Consent appears only where it already exists (the hero/header wordmark), never in Offers. Never split a word across lines.
- **Content:** exactly four services, Websites, Photography, Rebuilds, Care. Heading "What you can hire us for." Service paragraphs are verbatim (they're in the `NGL.OFFERS` object inside the HTML). No package lists, no invented copy, and never the phrase "NESS is for".
- **Never:** tattoo themes, stock images, photos of Karin or Isabella in Offers, phone mockups, doodle icons, service cards, or the bridge's print/registration machinery. No barbed wire used as frames. The wire snaps **only** in the hero; no element should repeat across the site.
- **Rejected concepts, don't revisit:** 10 Re-Register, 11 Tri-Vision, 12 The Sheet, 13 Flash Sheet, 14 Title Sequence, 15 In Their Hand, 16 The Wireframe, and the early basic mockup.
- **Scope:** desktop only (1440×900), scroll-driven only. The visitor only scrolls; no buttons, tabs or drag to drive the sequence.
- **Process:** one mockup at a time, saved as a new version without overwriting the previous one. Give a short note on what changed and an honest skill and verification note: say which checks were skipped. `design-taste-frontend` is the taste authority; also use the animate, animation-performance and review-animations skills where relevant.
- The client cares most about beautiful graphic design together with cinematic movement and dimensional transitions. Her reference is Sleep Well Creatives (Awwwards Site of the Day, Jan 2026).

## Environment notes
- The network policy blocks most of the web: Awwwards, Sleep Well, Codrops and others return 403, and WebFetch can't resolve hosts. Web search works. To browse references, add those hosts under Allowed domains in the environment's network settings.
- Playwright for Node is at `/opt/node-tools/node_modules/playwright`, and Chromium is at `/opt/pw-browsers`. There is no Python Playwright.
