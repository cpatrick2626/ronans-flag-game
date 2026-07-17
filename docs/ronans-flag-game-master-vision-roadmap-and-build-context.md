# Ronan's Flag Game — Master Vision, Roadmap, And Build Context

## 0. Purpose Of This File

This is the master vision / roadmap / build-context file for **Ronan's Flag Game**.

It explains the whole game concept, the long-term product vision, the full game-mode catalog, reward and progression systems, visual and animation doctrine, and the staged roadmap.

This file must not conflict with the separate current-build handoff:

```txt
ronans-flag-game-clean-current-handoff.md
```

The current-build handoff controls repo truth, immediate implementation state, protected surfaces, and what is safe to work on right now. This master file explains the bigger game we are building toward and how to sequence it.

Important rule:

This file is not permission to build everything at once. The user decides what to work on next. Claude's job is to help create a real roadmap, protect the current app, and turn the vision into small validated build steps.

---

# 1. Source-Of-Truth Hierarchy

When sources disagree, trust them in this order:

1. **Actual implementation truth:** `C:\ronans-flag-game`
2. **Production truth:** `https://ronans-flag-game.vercel.app/`
3. **Current-build doctrine:** `ronans-flag-game-clean-current-handoff.md`
4. **Long-term product vision:** this file
5. **Concept images:** target visual direction only, never proof of the current live app
6. **Style references:** mood, color, lighting, and atmosphere only

Rules:

- Do not assume the current app matches concept images.
- Do not claim live state without validation.
- Do not overwrite working gameplay just to match a concept.
- Improve toward approved concepts in small validated steps.
- Repo inspection and live validation beat memory.

---

# 2. Project Identity And Canonical Names

Official app/project name:

**Ronan's Flag Game**

Preferred game mode name:

**Flag Color Challenge**

Older visible label that may still exist:

**COLOR THE FLAG**

Naming rule: use "Flag Color Challenge" as the primary mode name in planning and product docs. Use "COLOR THE FLAG" only when referring to an older visible screen label or exact existing UI copy.

Other canonical names:

- Main flag panel: **Current Flag**
- Country/progress list: **Explorer Log**
- Completion component: **CompletionOverlay**
- Completion visible copy: **FLAG COMPLETE — FRANCE**

Do not use:

- Flag Coloring Workspace
- Flag Designer
- Flag Editor
- Coloring Dashboard

---

# 3. Current Build Context

## Active repo

Use this repo only:

```txt
C:\ronans-flag-game
```

Do **not** use:

```txt
C:\Flag Game
C:\flag game
```

## Live app

```txt
https://ronans-flag-game.vercel.app/
```

## Before any code work

Always run:

```powershell
cd "C:\ronans-flag-game"
git rev-parse --show-toplevel
git status --short
git log --oneline -n 5
```

Expected root:

```txt
C:/ronans-flag-game
```

If the working tree is dirty: stop and report the dirty files. Do not edit, stage, reset, clean, commit, or push.

## Latest known important commits

Because repo state can change at any time, do not blindly assert the latest HEAD. Say "latest known important commits include…" and require `git log` verification at the start of every session.

Latest known important commits include (newest first):

```txt
57f49d9 feat: randomized fill patterns and stroking pencil choreography
eac5689 feat: hold-to-fill progressive crayon coloring for flag regions
be47dee chore: interim seamless loading loop via ping-pong asset
dde686e fix: align intro play hitbox with button art
7d2e108 feat: upgrade France flag challenge motion layer
cc6a1b5 feat: restore France flag coloring gameplay over scene art
db200ea refactor: drive France challenge from typed country config
22c7690 fix: smooth loading loop and play hitbox
```

A rewards/completion-surface fix task (mobile overflow, timestamp removal, Next Flag gating, storybook restyle) was specified after 57f49d9. Its implementation status must be verified with `git log` and live validation — do not assume it landed.

## Correct loading/startup state

The old belief that the loading seam could only be solved by replacing the MP4 asset is outdated, and the interim asset swap has since happened. Current truth:

- The original startup/loading artwork was preserved.
- A two-video opacity crossfade workaround (`22c7690`) hides hard cuts at the loop boundary.
- The invisible PLAY hitbox was mis-aligned above the button art; it was fixed in `dde686e` and validated on a real device.
- The loading MP4 was replaced with a ping-pong (forward + reversed) re-export of the same artwork in `be47dee`, which removed the visible loop pop. Known accepted trade-offs: the globe's rotation reverses direction each cycle, and there is a brief low-motion "hover" at the fold points. These were user-accepted as interim behavior.
- Local untracked helper files may exist in `public/assets/loading/` (`ronans-loading-screen-pingpong.mp4`, `ronans-loading-screen-original-backup.mp4`). They are intentional local safety copies. Do not commit them; a cleanup task should eventually delete or gitignore them.
- The permanent fix is a future Claude Design task: a true seamless loop asset whose first and last frames are identical, with continuous one-direction motion. A brief for this already exists in session history.
- Do not undo the crossfade/hitbox work. Do not mix loading asset work into rewards/completion or gameplay work.

## Current gameplay state (France)

France is the only real playable country. The Flag Color Challenge loop is implemented and live-validated:

- Blank France flag; player selects a color from the gem palette.
- **Hold-to-fill:** pressing and holding a region with the correct color progressively colors it in (~1.4s of held contact to complete; configurable via optional `fillDurationMs` on the country config). Releasing pauses fill progress; re-holding resumes. Wrong colors gently shake/reject and never accumulate progress, no matter how long they are held.
- **Randomized fill patterns:** each region's fill uses a randomly dealt pattern + direction (vertical sweep, horizontal sweep, diagonal from a corner, or perimeter-then-center), with no duplicate pattern+direction within one playthrough, and reshuffled on re-entry. Fill fronts have an irregular crayon-textured edge, not a straight wipe.
- **Stroking pencil choreography:** during a correct hold, the pencil follower rides the fill front, stroking back and forth like a child coloring, then eases back on release. The old narrow-viewport bug that pinned the pencil with a fixed transform was fixed as part of this work.
- Completion (FLAG COMPLETE — FRANCE) triggers only after all three regions reach 100%. Reset clears the flag including partial progress; re-entry starts blank.
- `prefers-reduced-motion` is supported: simple straight fill, no sparkles, no pencil oscillation, still hold-driven.

## Current known issues on the completion/rewards surface

Discovered by live playtest video and confirmed frame-by-frame:

1. The dark "Country Discovered" rewards panel **clips off the left edge on mobile** — content and buttons are cut off at phone widths.
2. A **raw ISO timestamp** appears on the passport stamp (e.g. `2026-07-09T04:03:08.355Z`). Kids should never see machine strings.
3. **"Next Flag" exposes unfinished Italy.** Italy exists only as an unstyled prototype screen and must not be reachable.
4. The rewards panel styling is **dark sci-fi**, which clashes with Ronan's magical storybook/parchment/gold identity.

Product decisions already made:

- **Hide** Next Flag until Italy is real. Do not merely disable it. Do not leave it live. Do not route to Italy. Implement the gate as config-keyed and one-line reversible.
- Preferred visible actions on the rewards panel: Continue, Back to Map, View Passport, and Play Again / Reset only if already safe.
- Timestamp becomes a kid-friendly date ("July 9, 2026") or is omitted; the underlying stored value stays untouched.

## Completion capture status

The 2026-06-29 file `07-completion-popup.png` remains mislabeled and invalid — it is actually the startup screen. A genuine live completion-badge frame was captured on 2026-07-09 from playtest video (`06b-france-completion-badge-live-2026-07-09.png`, showing FLAG COMPLETE — FRANCE over the finished flag). The full rewards panel was also captured on video, but in its broken/overflowing state; a clean capture should be retaken after the rewards surface is fixed.

## Architecture

Main app files (high-risk, edit carefully):

```txt
app/page.tsx
app/globals.css
```

Typed country architecture:

```txt
lib/countries/types.ts
lib/countries/france.ts
lib/countries/index.ts
```

The country config has been extended with optional, safely defaulted fields during recent work (e.g. `fillDurationMs`, `fillPatterns`). Future countries inherit hold-to-fill, pattern variety, and choreography for free through this architecture. Continue this pattern: country-specific behavior belongs in config, not hardcoded in `app/page.tsx`.

Important assets (verify exact paths before editing):

```txt
public/assets/loading/ronans-loading-screen.mp4
public/assets/flag-color/flag-color-select-screen.mp4
public/assets/france-scene.png
```

Tests:

```txt
tests/france-flow.spec.ts
tests/visual-check.spec.ts
```

The Playwright suite includes gameplay, completion/reset, reduced-motion, hold-to-fill choreography, and mobile-viewport overflow checks. Keep it green.

---

# 4. Uploaded Claude Project Files And How To Use Them

Primary source-of-truth file:

- **ronans-flag-game-clean-current-handoff.md** = current implementation handoff, repo safety, protected surfaces, validation rules, and what is safe right now.

This file:

- **ronans-flag-game-master-vision-roadmap-and-build-context.md** = whole-game vision, product concept, modes, reward systems, roadmap, and design doctrine.

Concept reference files:

- **concept-loading-startup-screen.png** = target visual concept for the loading/startup/PLAY screen.
- **concept-flag-color-main-screen.png** = target concept for the magical main map / home screen.
- **concept-flag-color-selection-screen.png** = target concept for the Flag Color Challenge selection screen.
- **concept-france-flag-color-challenge-complete-flag.png** = target concept for the France Flag Color Challenge gameplay screen and completed-flag state.

Style reference files:

- **ronans-style-ref-01-cinematic-magical-architecture-sky.png** = lighting, architecture, sky drama, and magical atmosphere reference only.
- **ronans-style-ref-02-dreamy-moonlit-forest-glow.png** = soft glow, dream lighting, clouds, and atmospheric depth reference only.
- **ronans-style-ref-03-cosmic-magic-sky-color-palette.png** = cosmic color, aurora, sparkle, and magical sky palette reference only.
- **ronans-style-ref-04-whimsical-storybook-world-color-concept.webp** = main Ronan world-feel reference for bright playful magical storybook color, toy-like shapes, and child-friendly wonder.

Rules:

- Concept images are target direction, not current live proof.
- Style images are mood, lighting, color, polish, and atmosphere only.
- Do not copy exact creatures, unrelated buildings, unicorns, random characters, watermarks, or non-Ronan layouts.
- Do not replace Ronan's existing layout with a style-reference composition.
- Use current live screenshots and repo validation to determine what actually exists.

Correct live/baseline reference folder:

```txt
C:\Claude Design OS\01_RAW_SOURCES\screenshots\ronans-flag-game-live-captures\2026-06-29\
```

Important corrected files:

- **01-startup-title-play-screen.png** = startup/title/PLAY screen
- **02-home-map-current-live-globe.png** = current home/map baseline
- **06-france-gameplay.png** = France gameplay reference

Important warning:

Do not use **07-completion-popup.png** as a completion reference. It was mislabeled (it is actually the startup screen). A genuine completion-badge capture from 2026-07-09 exists (`06b-france-completion-badge-live-2026-07-09.png`); a clean full rewards-panel capture should be retaken after the rewards surface is fixed and saved as `07-france-completion-popup.png`.

---

# 5. Full Game Concept

Ronan's Flag Game is a magical, kid-friendly world-map adventure where players explore countries, complete flag and geography challenges, earn rewards, collect passport stamps, unlock landmarks, build collections, and gradually explore the world.

The game should feel:

- magical
- bright
- playful
- friendly
- storybook-like
- educational through play
- polished
- kid-readable
- tactile
- rewarding
- adventure-based

The game should not feel:

- generic dashboard
- school worksheet
- flat web app
- spreadsheet
- sportsbook
- command center
- dense quiz database
- cluttered animation demo
- dark sci-fi modal system
- adult productivity app

The child should feel:

- "I am going on an adventure."
- "I discovered a country."
- "I colored the flag correctly."
- "I earned something."
- "My passport changed."
- "I want to see the next country."
- "This game is mine."

The child should understand what to do without an adult explaining it.

---

# 6. Core Product Loop

Long-term loop:

```txt
World Map → Choose Country → Choose Mode → Complete Challenge → Reward → Passport / Collections → Return to Map → Next Destination
```

Current perfect first loop:

```txt
PLAY → Map → France → Flag Color Challenge → Flag Complete → Passport Stamp → Continue
```

Current build priority:

Make the France loop excellent before scaling.

---

# 7. Complete Game Modes Master List

Important rule: this is the full product vision. It is **not** permission to build every mode now.

## Current / core mode

### 1. Flag Color Challenge / Color The Flag

The main playable mode.

- blank flag appears
- player selects color
- player presses and holds the correct region
- correct region colors in progressively (hold-to-fill with randomized crayon patterns)
- wrong region rejects gently, never fills
- full completion triggers reward

Currently playable: France only.

## Variants inside Flag Color Challenge

### 2. Play Solo

The normal single-player version. This is the current implemented path.

### 3. Team Up Co-op

Future cooperative family mode. Two players work together — e.g. one selects colors and the other holds regions, or turn-based coloring with a shared completion reward and teamwork bonus. **Build later.**

### 4. Head To Head Battle

Future friendly competitive mode — fastest to complete, best accuracy, short friendly rounds. Keep competition child-friendly; no harsh losing messages. **Build later.**

## Future gameplay modes

### 5. Guess The Flag / Flag Quiz

Show a flag; multiple-choice country answers; hints by continent/landmark if needed. **Build later** — a strong candidate for the first additional mode.

### 6. Spell The Flag

Spell the country name by dragging/tapping letters; child-friendly reading support. **Build later.**

### 7. Where In The World

Identify a country's location on the map; continent hints; gentle correction. **Build later.**

### 8. Country Match

Match a country to its flag, shape, continent, fact, or location. Example: France → French flag → Europe → Eiffel Tower. **Build later** — the other strong first-additional-mode candidate.

### 9. Map Pin Challenge

Place a pin on the world map; near-miss hints; easy mode shows the continent. **Build later.**

### 10. Landmark Match

Match famous landmarks to countries: Eiffel Tower → France, Colosseum → Italy, Mount Fuji → Japan, Pyramids → Egypt. **Build later.**

### 11. Food Match

Match famous foods to countries: croissant/baguette → France, pizza → Italy, sushi → Japan, tacos → Mexico. Keep examples kid-friendly and simple. **Build later.**

### 12. Animal Match

Match animals to countries or regions: kangaroo → Australia, panda → China, bald eagle → United States. **Build later.**

### 13. Language Match

Match simple greetings to countries: Bonjour → France, Hola → Spain, Ciao → Italy. Keep words simple and child-readable. **Build later.**

### 14. World Challenge

A larger mixed mode combining flags, maps, landmarks, foods, animals, greetings, and facts. **Build later — only after several smaller modes are stable.**

### 15. Color From Memory

Show the completed flag briefly, hide it, and have the player color it from memory. An advanced mode. **Build later.**

### 16. Time Challenge

Optional timed mode. Time pressure must stay friendly for kids, never stressful. **Build later.**

### 17. Daily Challenge

A daily country/flag/geography prompt to support return play, without stressful streak pressure. **Build later.**

## Collection / progression sections (major game experiences)

### 18. Passport

The child collects passport stamps for completed countries. See Section 8.

### 19. Collections Mode

View unlocked rewards: flag stickers, landmark cards, country badges, suitcase stickers, postcards, magical tools, souvenirs.

### 20. Progression Board

A child-readable progress screen: XP, levels, stars, badges, countries completed, continent progress, goals.

### 21. World Map / Explorer Map

The main adventure hub for choosing countries and seeing world progress.

### 22. Landmark Unlocks

Landmarks unlock after completing country activities and become collectibles/decorations.

### 23. Country Discovery / Country Complete Rewards

The post-completion reward experience — currently the CompletionOverlay + rewards panel for France. This surface exists today and is the current fix/restyle priority.

## Connected systems

- Explorer Coins
- XP / Levels
- Stars / Badges
- Continent Trophies
- Unlockable Coloring Tools
- Daily Rewards
- Passport Stamps
- Landmark Cards
- Country Badges
- Flag Stickers
- Suitcase Stickers
- Postcards
- Difficulty Levels
- Next Flag navigation (currently hidden until a second country is real)

Roadmap rule:

Do not build all modes at once. First finish and freeze France. Then rewards/passport. Then one second country. Then more modes.

## Future difficulty concept: Draw The Lines

A logged future idea from playtesting: a harder version of Flag Color Challenge where the player must first hold and trace to **draw the flag's region outlines** before coloring begins. This is a new gameplay phase with its own state and input handling. **Backlog — build later as a difficulty tier, not part of the base mode.**

---

# 8. Progression, Rewards, And Passport

Rewards should make the child feel:

- "I discovered France."
- "I earned a stamp."
- "My passport changed."
- "I can keep exploring."

## Reward overlay

The reward overlay should eventually show:

- FLAG COMPLETE — FRANCE
- the completed flag
- passport stamp
- XP / points gained
- reward unlocked (e.g. Eiffel Tower souvenir)
- Continue / Back to Map / View Passport

Do not show:

- raw timestamps
- debug text
- JSON-looking values
- developer words
- unfinished-country links

## Passport

A magical travel book:

- country stamps
- friendly completion labels ("Completed Today", "First Flag Completed!", "France Completed!", "Passport Stamped!")
- continent tabs
- flag stickers
- landmark cards
- total countries completed
- favorite countries / mastery badges later

Avoid raw technical timestamps. Bad: `2026-07-09T04:03:08.355Z`. Good: "July 9, 2026" — or, for young children, friendly labels instead of dates entirely.

## Collections

- flag stickers
- landmark cards
- country badges
- suitcase stickers
- postcards
- magical tools
- souvenirs

## XP and points

Keep it simple at first.

- XP is long-term progress: completing a country, correct answers, perfect runs, harder difficulty, milestones, returning to play.
- Points can be round score later; XP matters more than score for younger children.
- Do not expose complicated formulas to the child.
- Friendly copy: `+25 XP`, `Passport Stamped!`, `Level Up!`, `Great job!`, `Perfect flag!`

First-time country completion should feel special (stamp + badge + XP + landmark collectible + map completion mark). Repeat completions give smaller practice rewards — do not endlessly duplicate rare first-time rewards.

## Explorer Coins

Optional future reward currency. Do not build before the reward loop is clear. Do not make rewards feel gambling-like.

## Continent trophies

Big milestone rewards for continent progress. Future-facing.

## Unlockable coloring tools

Pencil, crayon, brush, magic wand, sparkle brush, stamp tool, rainbow trail, sticker tool. Future rewards, not a current core requirement. (The base pencil already has real personality via the stroking choreography — unlockable tools can build on that system later.)

---

# 9. Country Expansion

Current playable country: **France only.**

France:

- left = blue
- middle = white
- right = red
- the proof-of-quality country and the template for everything after it

Italy:

- **not real yet** — only an unstyled prototype screen exists
- do not route to Italy
- hide Next Flag until Italy is complete (this is the decided product behavior)

Before adding country #2, the country config template should support:

- country id
- country name
- continent
- flag region definitions
- valid colors
- correct color mapping
- scene/background asset
- map pin data
- reward/stamp data
- landmark data
- optional food/animal/greeting/fact data
- playable/unplayable gating

The typed architecture in `lib/countries/` already carries identity, regions, palette, scene, celebration data, and the new fill-behavior fields (`fillDurationMs`, `fillPatterns`) with safe defaults. Extend it the same way: optional fields, sensible defaults, nothing that breaks France.

Early simple country candidates:

- Italy
- Germany
- Ireland
- Belgium
- Poland
- Netherlands
- Japan
- Ukraine
- Sweden

Avoid complex early flags:

- United States
- Brazil
- Mexico
- Portugal
- Spain
- South Africa
- United Kingdom
- flags with seals/emblems/many tiny parts

Rules: one country at a time, added through the typed config, full QA, no mass expansion, never expose an unfinished country as playable.

---

# 10. Visual Design Doctrine

The game should feel like:

> A magical geography adventure book brought to life.

Visual themes:

- storybook map
- globe
- flags
- passport
- stamps
- travel stickers
- country discovery
- soft clouds
- friendly map elements
- playful pins
- reward cards
- landmarks
- child-safe color
- bright blue sky
- warm gold accents
- green/blue adventure UI
- parchment panels
- sparkle effects

France should feel like arriving in France, not just coloring three rectangles. Use: Eiffel Tower, Paris skyline, clouds, travel stamps, passport motif, magical kid-friendly art, warm celebration.

Do not use:

- MLB HR Engine style
- command center UI
- sportsbook UI
- generic dashboard
- dark sci-fi modal styling
- adult geography dashboard
- random CSS boxes over art
- flat worksheet design

## Known visual gaps (from live capture review)

These are the honest gaps between the live app and the approved direction, in priority order:

1. **Mobile loses the magic.** On desktop, the magical Paris scene, aurora sky, scroll title, and wooden gem tray are live and close to concept. On phones, the backdrop disappears and gameplay becomes flag-on-cream-void. This is the biggest gap since kids mostly play on phones.
2. **The flag canvas reads as a plain cream slab** rather than a framed hero object (concept: clean white canvas, gold/wood frame, subtle glow).
3. **Resting fills are flat color.** The fill *animation* now has crayon character; the completed *resting* fill does not yet have painterly/crayon texture.
4. **Completion is anticlimactic and off-brand.** Small brown badge plus a dark sci-fi rewards panel (also functionally broken on mobile). This is the active fix priority.
5. **Italy prototype is unstyled** and must stay unreachable until built properly.

---

# 11. Animation Doctrine

Animation should support gameplay.

Good:

- clouds drift
- stars twinkle
- title shimmers
- pencil follows cursor/finger
- pencil strokes back and forth while coloring (implemented)
- color selection glows
- correct region fills progressively with a crayon-textured front (implemented)
- wrong region shakes gently (implemented)
- completion sparkle burst
- passport stamp effect
- globe gentle motion
- button press feedback

Bad:

- everything moves at once
- constant pulsing
- animation hides hitboxes
- background overpowers gameplay
- loops with visible seams
- unstable click areas
- chaotic motion

Rules:

- Idle screens should feel alive, not chaotic. Interactive moments should feel magical and responsive.
- Mobile performance matters: rAF/CSS-var-driven animation, no per-frame layout thrash, no console errors.
- Reduced motion is supported and must remain supported: every new effect needs a calm `prefers-reduced-motion` fallback.

---

# 12. Mobile-First Rule

Ronan's Flag Game must work especially well on phones and tablets.

Mobile priorities:

- no horizontal overflow (this has already bitten the rewards panel — treat overflow checks as mandatory)
- large flag
- large color controls
- readable text
- bottom nav reachable
- no clipped modals
- no tiny buttons
- no clutter
- magical background visible enough to feel alive

Test mobile sizes:

```txt
390×844
414×736
421×743
```

Desktop should be a richer version of the same game, not a separate dashboard.

---

# 13. Multiplayer Vision

Multiplayer comes later. Do not build multiplayer before the single-player loop is excellent.

Co-op: shared flag completion, split roles (one picks colors, one colors regions), turn-based coloring, shared XP bonus, teamwork badges.

Head-to-head: fastest completion, best accuracy, best streak, quiz battle. Keep competition friendly; avoid harsh loss messages.

Note: player bars (Alex / Sam) already exist visually in the gameplay layout as a nod to this future — that UI is presentation only and does not mean multiplayer is built.

---

# 14. Parent / Family Value

The game should be something a parent is happy for a child to play:

- learning geography, flags, memory, pattern recognition
- colorful, safe environment
- no gambling-like mechanics
- no dark addictive monetization patterns
- no scary content
- no confusing ads
- no adult complexity

Rewards should feel earned and educational.

---

# 15. Roadmap

Roadmap philosophy: real, staged, and safe. Every milestone has a goal, scope, acceptance criteria, validation, risk level, protected surfaces, and a stop condition. Claude suggests order; the user decides what to start.

## Phase 0 — Current-state audit / repo truth

Always first, every session:

- verify repo root and status
- verify latest commits with `git log`
- verify the live app if the task touches it
- report dirty files if any and stop

## Phase 1 — Finish France completion/rewards surface  ← CURRENT PHASE

Goal: make the France reward surface correct and child-friendly.

- fix mobile clipping of the rewards panel
- remove the raw timestamp (friendly date or none)
- hide Next Flag until Italy is real (config-keyed, one-line reversible)
- restyle dark panel to storybook parchment/gold with a single celebration burst
- validate at all three mobile sizes
- afterward: capture the clean rewards panel as `07-france-completion-popup.png`

A full implementation prompt for this phase exists in session history. Verify with `git log` whether it has already landed before re-issuing it.

## Phase 2 — Mobile gameplay presentation

Goal: make France gameplay feel magical on phones.

- bring the magical France backdrop into the portrait layout
- avoid flag-on-cream-void
- preserve gameplay clarity and tap-target sizes
- layout/CSS against existing art first; new portrait-crop art via Claude Design only if the current scene cannot work

## Phase 3 — Flag canvas and fill polish

Goal: make the flag the hero object.

- framed flag canvas (gold/wood frame, subtle glow), cleaner blank state
- white stripe completion clarity
- painterly/crayon resting fill texture (the fill *animation* is done — `eac5689`, `57f49d9`; this phase is about the *resting* look)
- any remaining magical pencil polish

## Phase 4 — Freeze France baseline

Goal: France becomes the reusable template.

- tests pass, live validation passes
- screenshots captured (including the corrected completion capture)
- final behavior documented
- no known major mobile issues
- stop redesigning France except for specific defects

## Phase 5 — Passport MVP

Goal: make country completion feel permanent.

- France stamp
- friendly completion label
- completed-country record
- no raw timestamps anywhere

## Phase 6 — Collections MVP

Goal: show a simple unlocked France reward.

- France sticker / badge / Eiffel Tower landmark card
- child-friendly collection screen

## Phase 7 — Add one second country

Goal: prove the architecture with one simple-flag country (likely Italy, Germany, Ireland, or Japan).

- one country only, added through the typed config
- real scene art, regions, validation, completion, rewards
- full QA including mobile
- this is when the Next Flag gate flips back on

## Phase 8 — Explorer Log / country selection

Goal: make choosing countries and seeing progress visible.

- country cards
- locked/unlocked states
- progress display

## Phase 9 — Add one new mode

Goal: one additional mode after the base loop is stable.

- recommended first: Guess The Flag or Country Match
- not multiplayer yet

## Phase 10 — More countries and modes

Only after the template is repeatable.

## Phase 11 — Co-op / Head-to-head

Later, after single-player is strong.

## Side tracks (schedule opportunistically, never mixed into other tasks)

- **Loading loop, permanent fix:** Claude Design generates a true seamless loop asset (first frame == last frame, continuous one-direction motion, PLAY button position preserved for the hitbox). Replaces the interim ping-pong asset.
- **Asset cleanup:** delete or gitignore the untracked loading MP4 backup/pingpong files.
- **Draw The Lines hard mode:** future difficulty tier (see Section 7).
- **Handoff maintenance:** keep `ronans-flag-game-clean-current-handoff.md` in sync after each landed milestone.

---

# 16. Current Priority Stack

1. mechanics work ✅ (hold-to-fill, patterns, choreography landed)
2. mobile safety ← rewards panel overflow is the active item
3. completion/rewards polish ← current phase
4. visual polish toward concepts (mobile backdrop, flag hero, resting texture)
5. passport/rewards foundation
6. one second country
7. country selection
8. more modes
9. multiplayer

Do not jump to steps 8 or 9 before steps 1–5 are strong.

---

# 17. Immediate Next Action

Current best next action, unless the user chooses a different task:

**Fix the France completion/rewards surface (Phase 1).**

The implementation prompt should cover exactly:

1. mobile clipping of the Country Discovered panel
2. raw timestamp removal
3. hide Next Flag until Italy is real
4. storybook/parchment/gold visual restyle
5. mobile validation at 390×844, 414×736, 421×743
6. no unrelated surface changes

But do not implement from this file automatically. The user decides what to work on. Verify with `git log` whether this phase already landed before starting it.

---

# 18. Tool Selection Rules

Exact visual preservation + behavior bug:

```txt
Claude Code or Codex
```

New visual concepts, redesigns, variants, animation specs, or new art assets:

```txt
Claude Design / Fable
```

Production implementation from an approved design or written spec:

```txt
Claude Code or Codex with a strict handoff
```

Guidance from experience this cycle: when the target is already well-communicated (reference videos, existing in-app style language), a precise written motion/behavior spec handed straight to Claude Code beats a design-tool round-trip. Reserve Claude Design for genuinely new art or unclear direction.

Every strict handoff defines: what to preserve, what to change, what not to touch, likely files, responsive behavior, validation commands, acceptance criteria, risk level, and no commit/push without approval.

---

# 19. Workflow Rules

- one issue at a time
- small bounded tasks
- no broad redesign unless explicitly requested
- no unrelated refactors or "while I was there" changes
- no package changes unless required
- ask which design skill to use before frontend/UI/design code prompts unless the user already picked one
- no commit without validation and explicit user approval
- no push without explicit user authorization
- feature *feel* (especially anything a child touches) should be playtested on a real device before or immediately after shipping; tuning follows as its own small task

---

# 20. Validation Rules

Every code task must validate.

Before edits:

```powershell
cd "C:\ronans-flag-game"
git rev-parse --show-toplevel
git status --short
git branch --show-current
git log --oneline -n 5
```

Minimum validation:

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
git diff --check
```

If Playwright is available:

```powershell
npx playwright test
```

Browser checks for gameplay/reward work:

- app loads
- startup/PLAY works
- player name modal can be passed if shown
- home/map appears
- Flag Color Challenge entry works
- Play Solo enters France
- blue selected + hold left region fills blue progressively
- blue selected + hold middle region never fills
- white selected + hold middle fills white
- red selected + hold right fills red
- releasing mid-fill pauses; re-holding resumes
- completion appears only after all three correct
- reward panel centered and fully visible
- no raw ISO timestamp
- no Next Flag route to Italy
- safe navigation works
- no console/page errors
- no mobile overflow

Mobile sizes:

```txt
390×844
414×736
421×743
```

Do not commit or push unless the user explicitly authorizes.

---

# 21. Expected Report Format

```txt
Status:
Files changed:
What changed:
What did not change:
Commands run:
Validation result:
Browser checks:
Mobile checks:
Console/page errors:
Protected surfaces touched: yes/no
Package files changed: yes/no
Remaining issue, if any:
Recommended next action:
Commit recommendation:
Push recommendation:
Self-judge: PASS / PARTIAL / FAIL
```

---

# 22. High-Risk Mistakes To Avoid

Do not:

- use `C:\Flag Game` or `C:\flag game`
- use MLB HR Engine styling anywhere in this project
- rebuild the whole app from scratch
- replace working France logic with static images
- build many countries at once or make unfinished countries reachable
- route children into the Italy prototype
- turn the UI into a dashboard
- use dark sci-fi styling for kid-facing panels
- add constant animations everywhere
- leave visible button outlines behind art
- break mobile layout or ignore overflow
- show raw timestamps or developer text to children
- create dead buttons
- add complex scoring before the core reward loop is clear
- make rewards feel like gambling
- undo the loading crossfade/hitbox work or mix loading-asset work into other tasks
- commit unvalidated changes or push without authorization
- assume the repo is clean without checking
- assume concept art equals the current app
- treat style references as exact layout instructions
- let any tool redesign working screens without permission

---

# 23. What Good Looks Like

## Current build

A child lands on a magical startup screen with a smoothly looping globe. They press PLAY (the whole button works), enter their explorer name, see the bright globe home screen, choose Flag Color Challenge, and enter France. The France screen is a magical illustrated scene. They pick blue, press and hold the left stripe, and watch a magical pencil scribble back and forth as blue colors in — a different pattern every time they play. Wrong holds gently shake and never fill. When blue, white, and red are all complete, a joyful FLAG COMPLETE — FRANCE celebration appears, followed by a warm storybook reward panel: passport stamped, +25 XP, Eiffel Tower souvenir — nothing clipped, no machine text, no dead ends.

## Long term

They return to the map, choose another country, collect more stamps, play new flag games, unlock landmarks, and build a full magical world passport. The game feels magical, polished, educational, and fun — and a parent is glad they're playing it.

---

# 24. Instruction To Claude

When using this file:

- use it to understand the full product
- use it with the current-build handoff to make realistic roadmap decisions
- use it to avoid short-sighted design choices
- use it to keep rewards, XP, passport, and future countries coherent
- verify repo and live state before asserting anything as current
- do not treat it as permission to build everything now
- always respect the current-build handoff first
- always ask or wait for the user to choose the next build task

The user decides what to work on. Claude's job is to help create a real roadmap, protect the current app, and turn the vision into small validated build steps.
