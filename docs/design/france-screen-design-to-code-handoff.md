# Ronan's Flag Game — France Screen: Design-to-Code Handoff

Prototype: `France Flag Challenge.dc.html`. **Design prototype, not production code.** No backend or audio.

## Architecture: real reference art + interactive overlays
The uploaded reference painting IS the artwork. A canvas pre-process produced `art/`:
- `bg-full.png` — full reference with the flag canvas blanked (warm off-white + vignette; removes pre-painted blue, pencil, trail) and the blue-orb selection glow neutralized (wood annulus patched from the red orb's surroundings).
- Slices (feathered PNGs, cut from the processed image): `title`, `board` (frame + pole + finial, scroll fragments erased), `tray`, `chips`, `nav`, `orb-{blue,white,red,yellow,green}` (circular), `towerL/R`, `domesL/R`, `cloudTL/TR` (portrait recomposition).
All coordinates were measured in source space (1672×941) and mapped to percentages, so overlays align pixel-perfectly at any scale.

## Layer order (back → front)
1. `bgblur` — blurred cover fill for desktop letterboxing (landscape only)
2. `stage` — fixed 1672:941 canvas (landscape) / full-height column (portrait)
3. `bgart` — bg-full.png (landscape) · gradient sky + tower/dome/cloud slices (portrait)
4. `ambient` — twinkle stars (kept off the flag), aurora shimmer ribbons, 2 drifting cloud puffs
5. Slice wrappers: `wTitle`, `wBoard`, `wTray` (scaled to 46% stage width and lowered so the flag's bottom stays clear; baked tray patched out of bg-full via mirror/gradient fill), `wChips`, `wNav`
6. Interactive children: 3 flag `region` buttons (inside `canv` at 5.23%/10.19%/92.36%/86.2% of the board slice), 5 `paint` orb buttons, 4 nav hotspots (home/passport/cards/gear), trace SVG, toast, completion label
7. `fx` particles → `pencil` (rAF cursor) → `statechip`

## Never flatten
Flag regions, paint orbs, nav hotspots, pencil, completion label. Everything else is static art.

## Gameplay (unchanged)
Blue-left / white-mid / red-right enforced; correct tap = clip-circle reveal (0.95s) from tap point with crayon-rough edge (#rough turbulence) + grain fade + edge sparkles + settle pulse; wrong tap = wobble + lavender fizzle + orb pulse + "Try another color!" toast (auto-hide, never covers flag); no fill persists on error. Completion = board glow + gold trace + star bursts → "FLAG COMPLETE — FRANCE" label (future transition hook; currently replays). Keyboard: regions/orbs are buttons, Enter/Space, dashed gold focus; `aria-live` announcements; answers never revealed in labels.

## Pencil
Ornate blue-and-gold build (crown cap, engraved collar, enamel body with star engravings, double gold ferrules, radiant star medallion, faceted gold cone, white-core magenta tip, layered glow). Cursor hidden; rAF lerp follow (k=.16), velocity tilt 36°±15°, idle bob/sway + occasional idle sparkle, press dip, pulsing tip glow (faster on hover), cyan/white (hint pink) star trail, white contact flare + 13-spark burst on correct paint.

## Motion
Entry once ~1.6s (title settle → board pop → tray rise → chips/nav fade → pencil last). Ambient: star twinkle, aurora drift (screen-blend over the painted aurora), cloud puffs. Reduced motion (`prefers-reduced-motion` or tweak): ambient + entry off, fills become 0.35s fades, particles suppressed, feedback preserved.

## Responsive
- Landscape/desktop: stage scales to viewport (`min(100vw, 177.68dvh)`), blurred art letterbox — the reference composition exactly.
- Portrait (aspect ≤ 0.95): same hierarchy recomposed — title → board → tray → chips → nav (parchment strip, center-cropped slice ≥56px tall); towers/domes/cloud slices rebuild the Paris environment; orb/nav hit targets ≥44px at 390×844.

## Prototype states
Tweaks → `demoState` stages all 8 labeled states on this same screen; `showStateLabel` toggles the corner chip; `reducedMotion` forces the reduced path.

## Compliance
All protected elements are the reference's own pixels (title scroll, Paris environment, towers, domes, framed flag + pole, pencil design language, palette tray + 5 orbs, Alex/Sam chips, parchment nav, lighting, hierarchy). Adaptations (smallest necessary): flag canvas blanked to enable play from STATE 1; blue-orb glow neutralized so selection can move; portrait recomposes the same art per the mobile spec. Bound Bitwarden design system intentionally not applied (locked art direction; approved).
