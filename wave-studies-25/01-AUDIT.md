# 01 — Design audit: the approved NESS film and 24C, The Wave

Date: 2026-10-18. Method: 37 stills of the full film (Hero → About → Bridge G → Offers 24C) captured at 1440 × 900 on the real GPU (system Chrome, Metal, `?still`) with `tools/audit-frames.mjs`; contact sheets `sheet-approved-1.jpg` and `sheet-approved-2.jpg`; the film was also opened live in the in-app browser and scrolled into the Offers section. Source read: `mockup24-src/c.js`, `c.css`, `kit.js`, both handoffs.

Labels: **[seen]** = visible in captured frames. **[read]** = from source. **[view]** = my interpretation.

---

## 1. What makes the approved NESS experience distinctive

1. **Type is the architecture [seen].** Every approved frame is built from one enormous typographic mass that runs to (or past) the edges: the blackletter NESS, the red "CUSTOM WEBSITES & BRAND PHOTOGRAPHY.", "Let's make you stand out.", the KARIN / ISABELLA names, and the Bridge's four-line sentence that fills the whole 1440 × 900 frame (p 5.0–7.3). Body copy is small and sits in a corner of that mass. Headline-to-body ratio is roughly 8–10×.
2. **The wire is macro, never a model [seen].** In the hero the barbed wire is photographed close: its thickness is about the stroke of a blackletter capital (≈ 25–35 px on a 900 px frame), the twist and every barb read individually, and the red studio card shows in the chrome. It is an *object at the scale of the type*, not a drawing of a thing far away.
3. **Wire and type interleave in depth [seen].** The wire passes in front of "Let's" and behind "out." Type and steel share one space; neither is a caption for the other. This is the single most "NESS" device on the site.
4. **One line, one gesture [seen].** The hero has exactly one wire, one long S-curve crossing the frame edge to edge, which then snaps. No grids of wire, no repetition.
5. **Whole-field colour chapters [seen].** Ink → full red field (About, p 2.6–4.6) → ink. The red is a field, not an accent. Against red, cream type and flash photography carry everything.
6. **Horizontal slicing as the transition language [seen].** The Bridge shears its sentence into horizontal strips that slide, double and re-register (p 5.4–6.5), and finally collapses into a single horizontal hairline that becomes the wire (p 7.6 → 8.0). The horizon line is the last thing the approved film hands to Offers.
7. **Flat graphic posters at every hold [seen].** Each paused frame is a poster: one dominant mass, a small block of text, a strict margin (≈ 52 px), nothing decorative.
8. **Directness of camera [seen/read].** The approved film has almost no "orbiting". The camera faces the page; depth comes from layering and scale changes, not from flying around objects.
9. **Raw and personal [seen].** Flash photographs, blackletter, barbed wire, red: a tattoo-adjacent, punk-editorial energy kept in check by Swiss-tight sans type and strict margins.

## 2. Why 24C feels disconnected (precise causes)

| # | Cause | Evidence |
|---|---|---|
| 1 | **Scale collapse.** The wave is 300 units long and filmed from 120–300 units away, so the wire renders ≈ 2–4 px thick. At that size the twisted strands and barbs blur into a fuzzy line and the sculpture reads as a *line drawing of a wireframe*. The hero's wire is ≈ 10× thicker on screen. | Stills p 9.6, 11.4, 13.3, 14.2 vs p 0–1.4 |
| 2 | **Repetition replaces gesture.** 46 cross-section ribs alternating direction = a concertina / slinky. The site's language is *one* line; 24C's is a lattice. | `NS = 46`, `slices()` in `c.js`; storyboard Rebuilds/Care |
| 3 | **Silhouette owned by the ribs, not the lip.** The lip is only the turning point of each rib, so the most diagnostic line of a breaking wave (the overhanging lip) never exists as one continuous curve. From the front and from the channel the form reads as a hump or a tunnel. | final frames p 13.3–14.2 |
| 4 | **The object sits in the bottom third of an empty frame.** 60–70 % of most Offers frames is dead ink. The approved sections are full posters. | p 9.6, 11.4, 13.3 |
| 5 | **Type and wire never touch.** Names are pinned to the bottom edge, paragraphs to the top right, regardless of where the wave is. In the hero, wire and type interleave. In 24C the type is a caption parked in a corner; Photography's paragraph even collides with wire by accident. | storyboard; `c.css` (fixed vw/vh positions) |
| 6 | **Camera tourism.** Fourteen camera keys orbit a static object (front, inside, front, high, channel). The approved film never orbits. The sculpture does not change between stops except a short noise in Rebuilds. | `setKeys` in `c.js` |
| 7 | **Rebuilds and Care have no form of their own.** Rebuilds is the same lattice with noise; Care is two thin lines going off-screen, under grey "night" lighting that kills the steel. | p 11.4, 12.3 |
| 8 | **The red disc is a dot, not a field or a full stop.** It floats in empty space with no relationship to type or to the barrel opening. | p 13.3–14.2 |

What 24C gets **right** and should be kept:
- **The concept**: one barbed wire becomes one breaking wave; the four services are moments of a wave (swell, barrel, closeout re-forming, next set). It is specific to Maui and to NESS.
- **The entrance idea**: the Bridge's sentence collapses into a horizontal line, and that line *is* the sea. This continuity is excellent and already approved.
- **The inside-the-barrel frame (Photography)**: the only stop where the wire is close, thick and fills the frame. It proves the macro thesis: the wave reads best when the wire is big.
- **The red sun seen through the barrel**: a good idea, under-composed.
- **Stops where the wire is still and type arrives word by word** (kit `stopBlock`): good reading rhythm.
- **Plumbing**: `kit.js` (rest-length sections, draw-on shader, story light, lens-shift camera) is sound and should be reused.

## 3. Answers to the brief's questions

**What makes NESS visually distinctive?** One macro steel line at the scale of giant flat type, interleaved with it in depth, on whole fields of ink or red, with horizontal slicing as the transition language and a direct, page-facing camera.

**What is missing from The Wave?** Macro scale; a single dominant line (the lip); interleaving with type; full-frame composition; red as a field; and a camera that faces the page instead of orbiting.

**How can The Wave continue the film?** The Bridge ends with a horizontal wire across the frame (p 8.0). That is the sea's horizon at the scale of the hero. The wave should *rise out of that line* at the same on-screen thickness, so the visitor never sees a change of object, only a change of shape. The services happen as the wave forms and breaks; the scroll does the breaking, the camera mostly does not move.

**Inherit, or a new chapter?** Inherit. The Bridge has already done the "new chapter" work (it reduced the type to a line). Offers should feel like the same wire, same scale, same light, now drawing something. A second chapter break (new world, new scale) is exactly what makes 24C feel like another site.

**Would small changes to earlier sections help? (proposals only, not implemented)**
- *Bridge, last beat (p 7.6–8.0):* the collapsing line could settle slightly lower (≈ 58–62 % of the frame height) so it reads as a horizon with sky above, giving the heading its natural place. Optional; Offers can also move the line itself after the handover.
- *Hero:* nothing. Its single S-curve wire is already the best wave reference on the site; the wave should rhyme with it rather than the other way round.
- *About:* nothing; its red field gives Offers licence to use red as a field at the end.
