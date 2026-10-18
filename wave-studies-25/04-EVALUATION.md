# 04 — Comparative evaluation and recommendation

Based on the final renders (`shots/final/`, 1440 × 900, plus 1280 × 800 and 1920 × 1080), the motion proof (`shots/motion2/`), and an independent critique by a separate agent that saw only the images (`research/D-independent-critique.md`).

## Scores (mine, 1–10)
| Criterion | A, The Stroke | B, Frames | C, Tension |
|---|---|---|---|
| Visual beauty | 8 | 6 | 7 |
| Recognizable wave anatomy | **9** | 7 | 6 |
| Originality | 5 | 7 | **8** |
| Sophistication | 6 | 5 | **8** |
| Compatibility with NESS | **9** | 6 | 7 |
| Potential for cinematic movement | **8** | 6 | 6 |
| Typography integration | **8** | 6 | 7 |
| Four distinct service moments | 6 | **8** | 5 |
| Final reveal | **8** | 5 | 7 |
| Technical feasibility / performance | **9** (1 wire, 900 segments, re-formed per frame at 16.7 ms median) | 7 (6 wires) | 7 (15 wires) |

Independent critic's totals: C 65, A 58, B 50, but ranking **A, C, B** because "A's problems are execution; C's problem is the form itself." Where we disagree: the critic scores A's final reveal 4 (I score 8, after the last pass made the curl and sun large: `A-stroke-v4.jpg`) and C's barrel highest (I find it the weakest of C's four: no tube exists, so it is a sail seen from under).

## A, The Stroke
- **Strengths.** The only direction a stranger names "a wave" in half a second. It *is* the hero's object at the hero's scale, so it continues the film instead of starting a new one; it starts from the Bridge's last line with no change of object. Flat type interleaves with it exactly like the hero (`A-stroke-v3.jpg`: back of the wave behind "Photography", lip in front). Red sun on the line of sight through the curl gives a strong close (`A-stroke-v4.jpg`). The motion proof shows the wire stays beautiful *between* stops from flat to barrel.
- **Weaknesses.** Little volume: beyond ±35° it becomes a knot (`shots/probe/a5-3.jpg`), so its "barrel" view is a close, low crop rather than a true tube. The doubled lip piles barbs and the cut end at the tip (critic). Simplicity risks a logo/emoji reading if composed timidly; it needs macro scale and cropping every time. Rebuilds and Care states are not yet good (spent wave is plain; Care repeats Websites).

## B, Frames
- **Strengths.** Clearest four-part structure (one stage per frame: `B-frames-v3.jpg`). The inside view, where earlier frames nest into a tunnel, is the most dimensional image of the session (`B-frames-v2.jpg`). Conceptually the film-frame idea fits a site that plays like a film.
- **Weaknesses.** Overlapping profiles read as a Slinky or cursive "e"s (`B-frames-v1.jpg`); broadside it becomes a row of wave icons (`B-frames-v4.jpg`). Five similar strokes are repetition, which is what we set out to remove.

## C, Tension
- **Strengths.** Most original and most sculptural; strongest use of the material's real function (fence wire strung taut). The red-field final is the most poster-like frame and the closest to the About section's language (`C-tension-v4.jpg`).
- **Weaknesses.** Recognizable only from the shoulder side; from the channel it reads as a sail, wing or harp, i.e. a ribbed structure, the failure 24C was rejected for. Needed three construction rebuilds to get here (`shots/r1`, `r2`, `r3`). No barrel exists, so Photography has no natural moment.

## Recommendation: develop A
A wins on the two gates that decide everything else: it reads as a breaking wave without explanation, and it is visibly the same wire as the hero and the Bridge's last line. Its problems are execution (lip termination, Rebuilds/Care states, the barrel moment), all solvable inside one line. C's problem (it reads as a structure) is in its form.

**Borrow:**
- From **B**: the plunging-breaker stages as the service states (already used in the motion proof), and for Photography a brief "multiple exposure" of earlier stages behind the curl (the Bridge's out-of-register doubling, now in steel).
- From **C**: the ending — the line pulled dead straight (tension) across a **red field**, as the hand-off to Packages.

## What was checked
- Every view of every direction rendered on the real GPU (system Chrome, Metal) and reviewed: 4 rounds for A and C, 3 for B (`shots/r0`→`final`), plus 30+ camera probes (`shots/probe`).
- Viewports: 1440 × 900 (all views), 1280 × 800 and 1920 × 1080 (views 1, 3, 4). Compositions hold; at 1920 the paragraph measure narrows (440 px cap at ~25 px type).
- No console or page errors in any study. Taste lint: 0 FAIL, 0 WARN.
- Motion proof timing (headless Chrome, 60 Hz, DPR 1): 504 frames, median 16.7 ms, p99 16.8 ms, max 16.8 ms.

## Not checked
- `inspect.mjs` (it audits full marketing pages: picture floor, section rhythm; not meaningful for WebGL studies).
- DPR 2 / 120 Hz timing, reduced-motion in a real film, a human real-time watch, phone widths (out of scope: desktop first).
- The in-app browser pane renders the study canvases at the wrong size under its viewport emulation, so visual review used headless real-GPU Chrome stills; the pane was used for the live 24C audit and the overview page.
