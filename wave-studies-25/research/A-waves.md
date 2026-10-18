# A — Ocean waves and surf photography

Research brief for the NESS barbed-wire wave sculpture (Three.js; ink `#17150f`, cream `#e9e1ce`, red `#c0230b`).
Compiled 2026-10-18. Access status is stated for each source.

- **fetched**: I read the page with WebFetch.
- **search only**: I saw the page only as a search result or snippet. Treat these as leads, not verified content.

Each entry separates **Verified** (what the source says) from **Interp** (my reading for NESS).

---

## 1. Curated references

### R1. Breaking wave, Wikipedia: breaker types, the tube, closeout
- URL: https://en.wikipedia.org/wiki/Breaking_wave (fetched; the first 100k characters were read)
- **Verified:**
  - *Spilling*: on gentle slopes the crest becomes unstable and whitewater spreads down the face.
  - *Plunging*: the crest "becomes vertical, then curls over" and drops onto the trough. Most of the energy is released at once.
  - *Collapsing*: the crest never fully breaks and the lower face steepens and collapses.
  - *Surging*: the face stays smooth.
  - Once the jet collapses, it forms "a very coherent and defined horizontal vortex".
  - The tube has several names: barrel, pit, greenroom. The curl forms first in shallow water and then moves sideways along the face. When the whole length breaks at once, the wave is "closed out".
- **Interp:** For us this is the taxonomy that matters. Only the **plunger** has the overhang and the enclosed void, so we should build a plunger. A spiller reads as a "hill with fuzz on top", which wire cannot carry. The coherent horizontal vortex is a physical argument for an axis: the barrel is a rotating tube whose axis lies parallel to the crest.
- **Principles:**
  - The sculpture is a plunger, not a spiller.
  - Give the void a real axis, running along the crest.
  - The breaking point travels laterally. That travel is the animation, not the rise and fall.
- **Do not copy:** foam, spray, and turbulence. Wire turns them into scribble.

### R2. Iribarren number, Wikipedia
- URL: https://en.wikipedia.org/wiki/Iribarren_number (fetched)
- **Verified:**
  - The formula is ξ = tanα / √(H/L₀), with L₀ = gT²/2π.
  - Offshore thresholds: spilling at ξ₀ < 0.5, plunging at 0.5–3.3, surging/collapsing above 3.3.
  - Break-point thresholds: spilling at ξb < 0.4, plunging at 0.4–2.0, surging above 2.0.
- **Search only, for the caveat:** a flume study on a 1:10 slope (https://www.doi.org/10.3390/JMSE8040296) found that, apart from spilling and early plunging, Ir does not map one-to-one onto breaker type.
- **Interp:** ξ works as a single "shape dial" for a parametric wave.
  - ξ ≈ 0.3: soft spiller.
  - ξ ≈ 1.0–1.5: ideal open barrel.
  - ξ ≈ 2.5: thick, square, Teahupo'o-like slab.
- **Principle:** Expose one parameter, `xi`. It drives three things together: front-face steepness, lip throw distance, and lip thickness.

### R3. Peel angle (Hutt, Black & Mead 2001 and later work)
- URLs, all **search only** (the snippets were consistent with each other):
  - https://ref.coastalrestorationtrust.org.nz/site/assets/files/9762/si87-005_1.pdf
  - https://www2.mdpi.com/2077-1312/8/8/599
  - https://swellnet.com/news/coastal-creationism/2015/10/19/coastal-creationism-part-1-basic-reef-shapes (WebFetch returned **403**)
- **Verified from the snippets:**
  - Peel angle is the angle between the trail of broken whitewater and the unbroken crest. Another phrasing: the line tracking the interface between broken and unbroken crest.
  - A small angle means a fast wave. Below about 25–30° the wave closes out.
  - Expert surfing waves sit at about 30–50°. Beginner waves sit at 70–90°.
- **Interp:** The peel angle is the single most important *plan-view* number for us. See Section 3.

### R4. Hokusai, *The Great Wave off Kanagawa* (c. 1831): the canonical reduction
- URLs:
  - https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa (fetched)
  - Met collection record https://www.metmuseum.org/art/collection/search/39799 (search only; fetch returned **429**)
  - Met article https://www.metmuseum.org/articles/great-wave (search only; **429**)
  - Christie's note on Cartwright & Nakamura (2009), *Notes & Records of the Royal Society* 63(2), doi 10.1098/rsnr.2007.0039 (search only)
- **Verified:**
  - The crest breaks into claw-like fractal "fingers", with more of them on the left wave, poised over the boats.
  - The wave curls into a near-spiral, and Fuji sits small inside the hollow.
  - Hokusai used *uki-e* perspective rather than strict single-point perspective, which gives strong foreground/background contrast.
  - The calm empty background is set against the violent wave, a contrast the article links to yin and yang.
  - The print is about 25×37 cm. The wave is estimated at 10–12 m, after accounting for Hokusai's roughly 30% vertical reduction.
  - Cartwright & Nakamura classify it as a **plunging breaker**, not a tsunami.
- **Interp:** Hokusai's reduction keeps three things.
  1. One dominant overhanging curve.
  2. A void that frames something, here Fuji.
  3. A crest edge that fractures into hooks.

  Barbed wire *is* that fractured crest edge: the barbs play the role of Hokusai's claws. This is our strongest conceptual alibi.
- **Principles:**
  - Put the barbs' density on the lip, where Hokusai put his claws.
  - Keep the face and back smooth.
  - Leave the void deliberately empty, or frame a single small element in it, such as a red point (a "sun" or "Fuji").
  - Composition reads right to left. A left-breaking wave reads as "coming at" a Western viewer.
- **Do not copy:** the double crest, the boats, Fuji itself, or Prussian-blue pastiche. Avoid the literal spiral that unrolls into a logarithmic coil. I found no solid source for the "logarithmic spiral" or "golden ratio" claims, so don't build on them.

### R5. Teahupo'o (Tahiti): the extreme plunger, a "hole in the sea"
- URLs:
  - https://www.dailymaverick.co.za/article/2024-07-30-anatomy-of-a-wave-what-makes-the-olympic-surf-break-at-teahupoo-unique-and-so-challenging.md (fetched; it republishes The Conversation analysis)
  - https://www.theinertia.com/?p=205417 (fetched)
  - https://en.wikipedia.org/wiki/Teahupo%CA%BBo (fetched)
  - Swellnet "Anatomy of a wave" https://www.swellnet.com/news/swellnet-analysis/2024/08/01/anatomy-wave-what-makes-teahupoo-unique (**403**)
- **Verified:**
  - A flat shelf at about 10 m lets the wave "stand up" before the reef rises.
  - More water sits in the crest, and the trough is deeper, *below* sea level.
  - The overturning lip is about **half the wave height**. Wikipedia says the lip is "often as thick as the wave is tall".
  - The Inertia: the lip on a roughly 10 ft day can be "well over a meter" thick, and the face is about 2–3× taller than the back of the wave. It describes the wave as looking "more like a gaping hole in the sea than a rideable wave".
  - A steep reef wall folds the wave into a "scalloped, semicircular breaking arc".
  - Compressed air is spat out of the barrel after the break.
- **Interp:** The defining feature here is that **the face is taller than the back**. The wave seems to *drop into* the sea rather than rise out of it. In plan view the crest is a scalloped arc, not a straight line.
- **Principles:**
  - Push the trough below the "sea line".
  - Make the lip thick. A double wire, or two parallel wires, can stand for lip thickness.
  - Curve the crest line in plan.
- **Do not copy:** mass and bulk. A wire can't show volume, so imply thickness with paired lines, not with fill.

### R6. Brian Bielmann at Teahupo'o (National Geographic): the channel shot
- URL: https://www.nationalgeographic.com/adventure/article/surfer-nathan-fletcher-rides-a-monster-wave-at-teahupoo-tahiti-unbelievable-photo (fetched; the caption credits "Bruce", the text says "Brian")
- **Verified:**
  - The photo was shot from a boat in the channel. Bielmann: "we were always the farthest boat inside."
  - The lip "can project farther than the wave is tall."
  - Bielmann: "Teahupoo is in front of you while you're in the channel and another wave breaks behind you."
- **Interp:** The channel view is a 3/4 view from beside and slightly in front of the peel. It shows the lip's throw *and* the tube opening at once. It is the default "hero" camera.
- **Principle:** The default camera sits about 30–40° off the crest axis, at or just above lip height.

### R7. Clark Little: shorebreak from inside and below
- URLs:
  - https://www.theinertia.com/surf/clark-little-surf-shorebreak-photos/ (fetched)
  - PetaPixel interview https://petapixel.com/2013/04/05/interview-with-shorebreak-photographer-clark-little (**403**)
  - clarklittlephotography.com (search only)
- **Verified:**
  - He shoots "looking from behind the barrel" and "looking out of a snow-white barrel". He also shoots underwater, and lying on the sand.
  - Most of his images are made at sunrise or sunset. Backlit waves turn green, and gold light runs up the face.
  - He uses a strobe to light the inside of the tube.
  - Sand carried in the water defines the wave's shape.
  - Light breeze on glassy mornings facets the surface.
- **Interp:** Shorebreak is the plunger at its most **geometric**: small, clean, and fully enclosing. Little's frames show that from inside, the barrel is an **oval aperture framing the sky or the sun**. That frame is the "negative space" image.
- **Principles:**
  - Offer an "inside" camera that looks out through the oval.
  - Use a red sun disc seen *through* the aperture as the one focal accent.
- **Do not copy:** sand textures, the strobe look, and literal water color.

### R8. Ray Collins, *Seascapes*: wave as landform
- URLs:
  - https://www.thisiscolossal.com/2015/03/wave-photography-ray-collins/ (fetched)
  - https://www.sfomuseum.org/node/21723 (fetched)
  - PetaPixel "Seascapes: ocean waves photographed to look like mountain ranges" https://petapixel.com/2015/03/30/seascapes-ocean-waves-photographed-to-look-like-mountain-ranges (**403**; title seen)
  - Book *Found at Sea* (search only)
- **Verified:**
  - Collins is colorblind and says this sharpened his attention to light, shapes and lines. Colossal: "perhaps more attuned to contrast than the nuance of color".
  - Swells are "frozen at particular moments" and resemble landforms or mountain ranges.
- **Interp:** Collins removes the surfer and treats the unbroken or just-breaking wave as a *ridge line against light*, close to monochrome. That is exactly our palette problem: cream line on ink, with contrast doing the work. The pre-break swell, a ridge with a glowing translucent crest, is as sculptural as the barrel.
- **Principles:**
  - Low, water-level camera.
  - The crest as silhouette ridge.
  - Monochrome reliance on contrast.
- **Do not copy:** photographic detail. Take the *ridge* idea, not the texture.

### R9. Honolua Bay, Maui: the local subject
- URLs:
  - The Inertia, Damian Antioco https://www.theinertia.com/?p=74575 (fetched)
  - Surfertoday "Honolua Bay: the mechanics…" https://www.surfertoday.com/surfing/honolua-bay-the-mechanics-of-the-famous-maui-point-break (**403**)
  - Surfline guide https://www.surfline.com/travel/zones/north-maui/surf-guide/honolua-bay/5842041f4e65fad6a7708de4 (**403**)
  - Outbound https://www.theoutbound.com/hawaii/surfing/surf-honolua-bay (search only)
  - MauiGuide https://mauiguide.com/?p=10444 (search only)
- **Verified (fetched):**
  - The Inertia describes "classic 6-8 ft Honolua perfection" from a swell that "slid past Molokai and wrapped into the bay".
  - It notes that "Honolua gets blocked by Molokai a lot".
  - It advises viewers to watch from the cliffs.
- **Search only:**
  - A right-hand point break with four sections: Coconuts (outermost takeoff), Outside (it "will stand up into a hollow wall"), Cave (named for a hole in the reef), and Keiki Bowl (racy, shallow).
  - A ride of up to about a quarter mile.
- **Interp:** Honolua is a **right-hander wrapping around a point**. In plan view the crest bends around the headland and the break peels along a curve. It is a *sequence of sections*, not one barrel. The cliff vantage is a high 3/4 view.
- **Principles:**
  - A NESS-specific wave should break **right**, seen from the beach.
  - The wire could make a long path with 3–4 "sections", each a small barrel of different openness. Hollow at Outside, most open at Cave, tight at Keiki.
- **Do not copy:** the topography, or literal mapping of the bay.

### R10. Pipeline (Oahu): the reference "perfect pipe"
- URLs:
  - Surfertoday "Pipeline: meet the underwater reef caves" https://www.surfertoday.com/surfing/how-does-the-reef-at-pipeline-look-like (**403**)
  - Red Bull "Spot check Pipeline" https://redbull.com/se-en/spot-check-pipeline-hawaii (search only)
  - Gear Patrol on Zak Noyle at Pipe https://www.gearpatrol.com/?p=346639 (search only)
- **Verified:** none. All Pipeline sources were search only.
- **Search snippets:**
  - A left-hander (Backdoor is the right) over First, Second and Third Reef.
  - A "suddenly rising plateau of reef flips the force of the wave up and over onto itself".
  - The name is linked to the wave's resemblance to large pipes. That etymology comes from a weak source.
- **Interp:** Pipe is the cleanest, most cylindrical barrel. The name literally means *a tube*. Use it as the "ideal" stage-4 profile (Section 3), with a roughly round void.

### R11. Zak Noyle: the water-housing "inside barrel" shot
- URLs:
  - Surfer's Journal "Hazardous Positioning" https://archives.surfersjournal.com/articles/hazardous-positioning (fetched, but the page holds only a stub and images with no captions)
  - Free Surf profile https://freesurfmagazine.com/spotlight-zak-noyle/ (search only; he endorses Watershot and SPL housings)
  - Inertia course https://courses.theinertia.com/p/courses/zak-noyle-guide-surf-photography-class/893836-welcome/2680088-intro-to-zak-noyle-s-guide-to-surf-photography (search only)
- **Verified:** the article exists, titled "The high risk, high reward of Zak Noyle's water photography". Nothing more was readable.
- **Interp:** These are the canonical wide-angle, in-water frames, shot from the shoulder or from deep, looking into the tube with the surfer framed by the lip. See Section 4.

### R12. Ben Thouard and Morgan Maassen: under the lip
- URLs, all **search only**:
  - Red Bull Ben Thouard interview https://www.redbull.com/gb-en/theredbulletin/ben-thouard-interview-the-shape-of-water (the fetch returned an empty page)
  - Outer Edge "Water II" https://www.outeredgemag.com.au/film-water-ii/
  - Stellar "The Thoughtful Observer" https://www.stellarequipment.com/interstellar/portfolio/the-thoughtful-observer/
- **Search snippets:**
  - Thouard shoots from underwater "just under the lip", fractions of a second before it explodes.
  - Maassen's *Water II* uses high-contrast slow motion of waves forming and collapsing over the reef, seen from below.
- **Interp:** From below, the wave reads as a **single bright line, the surface, folding over on itself**. That is close to what a single wire is. It is an argument for a "below sea" camera in the sculpture, where the ink ground stands for water.

### R13. Backlighting waves: technique
- URL: https://uwphotographyguide.com/node/2132 (fetched)
- Also seen in search only:
  - Zigzag https://zigzag.co.za/how-to-capture-an-epic-backlit-shot-pid9976/
  - FredMiranda forum https://www.fredmiranda.com/forum/topic/1597152
- **Verified:**
  - Align yourself so "the wave breaks through the light". Backlight lights the lip, face and back.
  - Refraction produces turquoise and green in the lip.
  - Shoot mornings on east-facing coasts and evenings on west-facing ones.
  - There are two exposure modes. Expose for the shadows for a high-key look. Expose for the highlights to **silhouette the wave as a sculpture**.
  - Search snippet: the lip "naturally diffuses the light", acting as a diffuser inside the tube.
- **Interp:** Section 5. Honolua faces roughly north-west, so the evening backlight condition applies to it. That is my inference from geography, not from a source.

### R14. Plunging-breaker fluid mechanics: profile shapes
- URLs, all **search only**:
  - Basco (1985) "A qualitative description of wave breaking", ASCE JWPCOE https://ascelibrary.com/doi/10.1061/%28ASCE%290733-950X%281985%29111%3A2%28171%29
  - Bonmarin (1989) JFM https://data-ww3.ifremer.fr/BIB/Bonmarin_JFM1989.pdf (**403**)
  - McIver & Peregrine (1985) https://data-ww3.ifremer.fr/BIB/McIver_Peregrine_JFM1985.pdf
- **Search snippets:**
  - A jet is thrown forward from the crest, grows horizontally, falls under gravity, and strikes the surface ahead.
  - The jet causes a splash-up of trough fluid and then a roller vortex.
  - Spilling and plunging share the same initial motion at very different scales.
  - The jet tip can tend to a sharp cusp (Longuet-Higgins).
  - McIver & Peregrine report a "remarkable similarity in the overturning regions" across breaker types.
- **Interp:** That similarity matters: **one overturn shape, scaled**, can serve every stage. The cusp-tipped jet justifies a *pointed* lip tip, a natural barb location. Section 3's coordinates are my own hand construction consistent with these descriptions. **They are not digitised from a paper figure**, because I couldn't open the PDFs.

Other leads, not used in depth, all **search only**:
- Jaws/Pe'ahi aerial coverage: Vertical Mag "Into the Mist" https://www.verticalmag.com/features/into-the-mist-html/ and Swellnet drone footage https://www.swellnet.com/news/swellnet-dispatch/2014/01/22/drone-footage-jaws-peahi-video. The Wikipedia pages for Jaws returned **404**.
- Chris Burkard: NatGeo, Iceland and Norway https://www.nationalgeographic.com/adventure/article/chris-burkard-on-photographing-surfing-in-iceland-and-norway-stunning-photos. The snippets describe a small surfer inside a big landscape, which supports the "lineup and scale" camera.

---

## 2. Minimum recognizable wave (ranked)

1. **The lip line.** A curve that rises, passes vertical, overhangs, and turns back *down* toward the water ahead of itself. The overhang past vertical is the single most diagnostic feature. A curve that only rises and falls reads as a hill or dune. Add the overhang and it instantly reads as a breaking wave (R1, R4).
2. **The enclosed void under the lip.** The negative space bounded by the lip above and the face behind. Its *openness* is the expression dial: closed oval means barrel, half-open means pitching. One wire can bound it on three sides, and the eye closes the fourth (R7, R10).
3. **The asymmetry between face and back.** A long, gentle back rising from behind, and a short, steep, concave face. Without it the curl reads as a hook or a scroll. With a face 2–3× steeper than the back, it reads as moving forward (R5).
4. **The flat line of the sea (trough/datum).** A horizontal reference the lip reaches toward. Without a ground line there is no "falling". A single straight red line could be the datum.
5. **The crest edge texture.** A fractured or hooked edge *only along the lip*: Hokusai's claws, our barbs (R4). The face stays clean.
6. **Lateral progression (peel).** In 3D or animation, the overhang exists at one point along the crest and not yet further along, so the wave is a *taper* from unbroken swell to full barrel to whitewater. This is the line that turns "a curl" into "a wave" (R3).
7. **Lip thickness.** Optional. Two parallel lines at the lip read as power and weight (Teahupo'o), and a single line reads as clean or small.

Everything else can be dropped: foam, spray, the rider, color, texture.

---

## 3. Profile geometry

**Coordinates:** z is forward (direction of travel, toward shore), y is up. The trough or still level is at y = 0 and the crest at y ≈ 1, so wave height = 1. The crest's initial z is 0.

**Basis:** a hand construction consistent with the sources.
- The crest goes vertical, then a jet is thrown forward and falls to strike ahead (R1, R14).
- The lip is about 0.5 H thick in extreme cases (R5), and its throw can exceed H (R6).
- The face is 2–3× steeper than the back (R5).

Each stage is **one continuous polyline**, ordered back → crest → lip outer → tip → lip underside → face → trough, so a single wire can trace it. Smooth it with a Catmull-Rom spline (centripetal).

**S1. Steepening swell.** Front slope about 45°, no overhang.
```
(-2.0,0.05) (-1.5,0.15) (-1.0,0.38) (-0.5,0.72) (-0.2,0.92) (0.0,1.00)
(0.15,0.95) (0.30,0.78) (0.45,0.52) (0.60,0.28) (0.80,0.08) (1.0,0.0) (1.5,0.0)
```

**S2. Incipient break.** The front goes vertical in its upper half, and the crest sharpens.
```
(-2.0,0.05) (-1.5,0.16) (-1.0,0.40) (-0.5,0.76) (-0.15,0.96) (0.10,1.00)
(0.25,0.97) (0.32,0.86) (0.34,0.66) (0.37,0.45) (0.46,0.25) (0.65,0.08) (0.90,0.0) (1.5,0.0)
```

**S3. Pitching lip.** The jet leaves the crest and overhangs. The tip sits at about z 0.65, y 0.62, and lip thickness is about 0.12.
```
(-2.0,0.05) (-1.5,0.18) (-1.0,0.42) (-0.5,0.78) (-0.2,0.97) (0.05,1.04)
(0.30,1.00) (0.50,0.90) (0.62,0.75) (0.66,0.62)      <- tip (barb cluster)
(0.58,0.68) (0.45,0.80) (0.30,0.83) (0.20,0.72)      <- lip underside
(0.18,0.50) (0.22,0.30) (0.35,0.12) (0.60,0.03) (1.0,0.0) (1.5,0.0)
```

**S4. Barrel / tube.** The lip lands at about z 1.0, y 0.05. The cavity is about 0.9 wide by 0.8 high, so its aspect is roughly 1.1:1, a Pipe-like near-circle. For Teahupo'o, set lip thickness to 0.3–0.5 and lower the trough to y = −0.2.
```
(-2.0,0.05) (-1.0,0.45) (-0.4,0.85) (-0.1,1.00) (0.20,1.03) (0.50,0.95)
(0.75,0.75) (0.90,0.50) (0.98,0.25) (1.02,0.05)      <- tip touches down
(0.92,0.10) (0.85,0.35) (0.72,0.62) (0.52,0.80) (0.30,0.84) (0.12,0.75)
(0.02,0.55) (0.00,0.35) (0.05,0.15) (0.20,0.03) (0.45,0.0)   <- face/back of tube
```

**S5. Collapse / splash-up.** The tube flattens into an air pocket, and the splash-up rises ahead of the impact. Use it for the trailing, broken end.
```
(-1.0,0.40) (-0.3,0.72) (0.1,0.78) (0.5,0.66) (0.85,0.42) (1.05,0.0)
(1.20,0.32) (1.40,0.48) (1.60,0.34) (1.90,0.14) (2.3,0.03)
pocket: ellipse centre (0.55,0.30), rx 0.30, ry 0.18
```

**Shape dial (from R2):**
- `xi` ≈ 0.4 → use S1–S2 only (spiller).
- `xi` ≈ 1.2 → S4 as given.
- `xi` ≈ 2.5 → S4 with doubled lip thickness, the throw shortened to about 0.8, and the trough lowered (a slab).

**Peel**
- The breaking point travels along the crest. The peel angle α is measured between the crest line and the trail of the broken/unbroken interface (R3).
- Rideable waves sit at about **30–60°**, expert waves at about 30–50°, beginner waves at 70–90°. Below about 25–30° the wave closes out.
- Standard relation (textbook; not verified from a fetched source): the peel or surfer speed along the crest is about c / sin α, where c ≈ √(g·d) is the wave speed. At α = 30° the break runs at 2c, and at 60° at about 1.15c.
- **Build it:** Lay the profile family S1→S5 along a crest path x ∈ [0, L]. The stage index at position x and time t is a function of (x − x₀ − v_p·t). In plan view, the S3/S4 location advances diagonally across the crest at angle α relative to the wave's forward motion.
- **From above** (drone, plan view): you see a straight or curved crest line. Behind the peel point a white diagonal trail opens up, so the shape looks like a **wedge or chevron** whose half-angle is α. At Honolua the crest also bends around the point, so the trail is a curve.
- **From the channel:** you see the taper as a row of profiles in perspective. Nearest you is unbroken swell (S1), then the pitching lip (S3), then the deepest tube (S4), and furthest away the whitewater (S5). The barrel opening faces you, which is why this is the hero view.

---

## 4. Camera positions that make waves iconic

| Camera | Setup (Three.js) | Reveals | Hides |
|---|---|---|---|
| **Channel 3/4** (R6) | 30–40° off the crest axis, in front of the peel, at lip height or slightly above. FOV 35–50 | The lip throw, the tube opening, the taper along the peel, face/back asymmetry | The plan geometry and the interior. The void reads as a dark mouth |
| **Inside the barrel looking out** (R7, R11) | On the tube axis, behind the deepest point. Wide FOV of 80–100. Look toward the opening | The negative space as an **oval aperture**, the lip as a framing arch, light at the exit | The wave as an object. You lose the silhouette entirely, which makes this a reveal, not an establishing shot |
| **Top-down drone** (Jaws/Honolua aerials, search only) | Overhead or near-nadir, high | The peel angle, the crest curvature around the point, the sequence of sections. It reads as a **diagram** | Height, overhang and void. Everything flattens, so the wave becomes calligraphy |
| **Low eye-level lineup** (R8, Burkard) | Camera just above the "sea line", looking along the swell lines toward the horizon | The crest as **ridge silhouette**, multiple lines in a set, scale and rhythm | The barrel. The overhang reads only as a sharp crest |
| **Head-on, from shore** (Hokusai, shorebreak) | Facing the wave, perpendicular to the crest | Symmetry, menace, and the curtain of the lip | The profile. The overhang is invisible head-on, so you need slight elevation or a side offset |
| **Pure side elevation** (diagram) | Orthographic, along the crest axis | The exact profile curve: the stages from Section 3 | Depth and peel. It looks like a technical drawing (useful as an "elevation" beat) |

**Recommendation:**
- Open on the low lineup ridge.
- Orbit to the channel 3/4 view for the hero.
- Dolly into the tube for the climax.
- Keep the top-down view as a brief "map" beat that shows the peel chevron.
- Head-on works only with an offset of at least 15°.

---

## 5. Light

- **Backlit lip (R13, R7).** With the sun behind the wave, the thin lip glows, because thin water transmits light. The thick base stays dark. *Depth reads as a brightness gradient: thin parts bright, thick parts dark.*
  - For wire: make the lip wire the brightest element, cream at full intensity, or emissive.
  - Fade the face and back wires toward ink as they get "thicker" (further from the edge).
- **Silhouette (R13: "expose for highlights to silhouette the wave as a sculpture").** A dark wave on a bright sky reduces it to its **outline**, which is exactly our medium.
  - Inverse for NESS: ink sky, cream line. The silhouette logic still holds: only the *edge* carries information.
- **Sunset/sunrise (R7).** Low sun gives warm light running up the face and colored light through the lip.
  - Use **red `#c0230b` once**: a sun disc seen through the barrel opening, or a short red segment where the lip is thinnest and most backlit.
  - Don't scatter red. Hokusai's restraint (R4) is the model.
- **Inside the tube.** The lip acts as a diffuser (R13 snippet). The interior is darker than the exit, and the opening is the light source.
  - In Three.js: brightest at the aperture, falling off inward. Fog or depth-attenuated line opacity along the tube axis sells the void.
- **How depth reads overall:**
  1. Brightness: the thin lip is bright, the mass is dark.
  2. Overlap: the lip occludes the face behind it. Keep the lip wire visually in front, with slightly thicker linewidth.
  3. Atmospheric fade: distant sections of the peel are dimmer.
  4. Convergence: in the channel view, the profiles of successive sections shrink toward the vanishing point.

  These four cues are enough for line art. Don't add shading.
