# 03 — Art direction: The Wave, as a continuation of the NESS film

## The one sentence
**The Bridge reduces everything to one line; Offers lets that line become a wave, at the hero's scale, and break.**

## 1. Relationship to the approved sections
Inherit, don't start a new chapter. The Bridge already performs the chapter change (sentence → strips → one line). From there the visitor should never see a new object or a new scale: the same wire, the same thickness on screen (≈ 25–35 px, like the hero), the same light (key + rim riding on the camera, environment turning with it), on the same ink. 24C broke all four (thin, distant, re-lit, a lattice).

## 2. Sculptural language
- **One hero line.** The lip is the line everything else serves. (Hero: one wire. Research: overhang = wave.)
- **Open strokes only.** No closed loops, no ribs that read as a cage.
- **Barbs as punctuation**, gathered where the lip curls, sparse elsewhere.
- **Macro, not model.** Frame the wave so the wire's twist and barbs are legible. If the barbs blur into fuzz, the camera is too far.

## 3. What makes it read as a wave (in order)
Overhanging lip → the void under it → long back, steep face → the sea datum (the Bridge's line) → barbs at the lip. Nothing else is needed: no foam, spray or texture.

## 4. Level of abstraction
A Hokusai level: a single line drawing that a child would read as "wave" in one second, made sophisticated by material (chrome, twist, barbs), scale (macro) and composition (cropped, edge to edge, type set into it). Not a diagram and not a model.

## 5. Negative space
The barrel is the negative space and stays empty. It is where the red sun goes and where type may sit. The sky above the wave is the second negative space: headlines live there and the back of the wave may pass behind them.

## 6. The barbed wire
It is the brand's object, so it must look like *the hero's* wire at every stop. Its meaning shifts from "edge/defence" to "drawing": sparse, gestural, under control. Its literal function, fence wire strung taut, is used once (direction C) or as the hand-off to Packages (a line pulled taut).

## 7. Composition and light
- Horizon (sea line) runs edge to edge at 60–75 % of the frame height; the wave stands on it.
- The camera stays within ±35° of the profile. Past that a single line degenerates (verified).
- Light is the hero's. Red appears once per frame: the sun in the barrel, or as a whole field at the end.

## 8. Typography with the sculpture
- Flat, Instrument Sans, 700 for names (≈ 14 vw, −0.06 em), 400 for paragraphs (17–20 px, 1.5).
- Names sit in the sky; the wave's back may pass **behind** a name and the lip **in front** of it, with occlusion kept small (the hero's device). Paragraphs never touch wire: they sit in the empty sky or below the horizon on the shoulder side.
- Implementation: type is painted with Canvas 2D on screen-facing planes at a chosen depth (`typePlane`), so it is pixel-flat and depth-sorted with the wire.

## 9. Four service moments (one wave, four states, camera mostly still)
| Stop | State of the line | Why |
|---|---|---|
| Websites | the Bridge line lifts into a swell | planned before it breaks |
| Photography | the lip throws; sun in the barrel | the shot everyone remembers |
| Rebuilds | the lip lands and the wave falls apart, then stands back up clean | an honest fix |
| Care | the line is the sea again and the next swell is already rising | launch day is not goodbye |
The *transitions* are the wave breaking: scroll drives the stage parameter (Margolin's phase), the camera holds or drifts slowly.

## 10. The hand-off to Packages
After Care, the final reveal holds the full gesture with the sun in the barrel and "Tell us what you need". Leaving it, the line releases: the wave relaxes back into the horizon, and the horizon is pulled taut and straight (fence wire under tension) across a red field, the site's About colour, ready to become the rail Packages hangs from. No package shapes.

## 11. Verdict on 24C
| Keep | Reconsider |
|---|---|
| The concept, the four meanings, Honolua's right-hander | 46 closed ribs → open strokes |
| Bridge line → sea line entrance | Wire scale: ≈ 3 px → hero scale |
| Inside-the-barrel moment, sun in the barrel | Camera tourism → a still camera, a moving wire |
| Stops where the wire is still and words arrive | Type pinned to corners → type set into the wave's sky and depth |
| `kit.js` plumbing (sections, draw-on, story light, lens shift) | Rebuilds noise and Care's night lines → states of the same line |
