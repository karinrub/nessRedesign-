# 02 — Research: what it found and what it changed

Three research passes ran in parallel (web search + fetch). The full, sourced documents:

| File | Category | Size |
|---|---|---|
| `research/A-waves.md` | Ocean waves and surf photography: 14 references, ranked minimum wave, five stage profiles as coordinates, peel, camera positions, light | ~4,100 words |
| `research/B-sculpture.md` | Sculpture and generative art: 15 references, seven construction strategies for a wire wave, 15 rules against mesh/coil | ~3,050 words |
| `research/C-web.md` | Award-winning interactive design: Sleep Well Creative (verified), 11 references, 15 chapter principles, 8 type + 3D patterns | ~2,900 words |

Each reference in those files carries its URL, its access status (**fetched** / **search result only** / **failed with 403**), the qualities worth studying, why it matters to NESS, principles to apply and what not to copy. No images were viewed by the research agents: visual descriptions come from text sources and are marked so. Nothing below claims more than those files verify.

---

## The findings that decided the work

### From waves (A)
1. **The overhang is the wave.** A curve that rises, passes vertical and turns back down reads as a breaking wave instantly; without the overhang it reads as a hill. (Wikipedia, *Breaking wave*, fetched; Hokusai, fetched.) → every direction was judged first on whether its lip overhangs on screen.
2. **Ranked minimum set:** lip overhang → the enclosed void → steep face against a long gentle back (2–3×) → a flat sea datum → texture only at the lip. Peel and lip thickness last. → A uses exactly this list and nothing else.
3. **Plunging-breaker stage profiles** (swell, steep, pitching, barrel, collapse) as single open polylines, H = 1. → used directly in `studies/profiles.js` (A's motion proof, B's five frames).
4. **The overhang is invisible head-on; the profile collapses past ~45°.** → confirmed in our own renders: A turns into a knot from behind (`shots/probe/a5-3.jpg`); C reads as a bridge from the front (`shots/r3/C2.jpg`). Each direction keeps its camera inside the arc where its silhouette holds.
5. **Light:** thin lip bright, mass dark; red once, as a sun seen through the barrel. → the red disc is now placed on the line of sight through the curl (`discThrough` in `kit.js`), not floating in space as in 24C.

### From sculpture (B)
6. **No closed loops; one hero line; leave the barrel empty** (Gabo, Hepworth, Calder; rules 2, 3, 9). → the root cause of 24C's mesh look is 46 closed ribs. All three studies use open strokes.
7. **Barbs are punctuation** (Hokusai's claws): gathered at the lip, sparse elsewhere. → A and B put barbs on the curl; plain spans carry one barb every ~13 units so the wire never reads as rope.
8. **Ruled surface** (Gabo, Serra, Dawe): straight tensioned lines make a curved surface. → C. Its first version broke rule 9 (strings filled the barrel) and read as a harp; moving the strings to the wave's back fixed it.
9. **Margolin: a wave is a travelling phase, not a shape.** → the motion language for every direction: one scroll value drives one stage parameter.
10. Only one barbed-wire wave sculpture was found (Lungiswa Gqunta, *Ntabamanzi*; caption only). The material's charge (borders, violence) grows with density; sparse gestural use reads as drawing. → another argument for few lines.

### From interactive design (C)
11. **Sleep Well Creative** (verified: SOTD 28 Jan 2026, 8.03; Animations 9.00, Accessibility 6.40; two colours; seven chapters with a strict single metaphor). Its quality comes from one metaphor carried with discipline, restraint in colour, and investment in the moves *between* chapters.
12. **The object must change state between stops, not just the camera** (Igloo Inc; GQ × Audemars Piguet as the counter-example). → this is the motion proof's whole premise: the camera is locked and the wire does the work.
13. **Hold frames are posters.** → every study view was judged as a still at 1440 × 900.
14. **Type and object share one space** (occlusion under ~15 % of glyph area; type in the negative space). → `typePlane` in `kit.js` draws flat type at a depth so the wire can pass in front of one word and behind another, as in the hero.

### Recommendations from the research that were rejected, and why
- *A persistent "01/04" counter* (C-web §1, §3.6): index numbering is banned by the house taste rules (`design-taste-frontend`), and the Bridge doesn't use one.
- *Two-part headlines such as "Websites / built to hold"* (C-web §1): that is new marketing copy. Service copy stays verbatim.
- *Fresnel or rim light on every segment, fog, emissive lip* (A §5, B rule 14): kept to the hero's exact lighting so the wire is the same object the visitor met in frame one.
