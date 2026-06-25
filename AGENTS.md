# Ronan’s Flag Game - Agent Operating Rules

## Project Identity

Ronan’s Flag Game is a magical, kid-friendly world map adventure where players explore countries and color flags.

The game should feel:

- playful
- magical
- bright
- friendly
- polished
- simple
- tactile
- easy for a child to understand

The project is not:

- a generic dashboard
- a spreadsheet-style app
- a complicated geography simulator
- a dark sci-fi interface
- a cluttered learning platform

The project is:

- a game
- a colorful learning adventure
- a magical map experience
- a flag coloring challenge
- a reusable country/gameplay system

## Current Priority

Finish the current country/gameplay loop before scaling to more countries.

Do not build more countries until the current Flag Color Challenge flow is visually and functionally correct.

Current core flow:

- Title/loading experience
- Player name modal
- Main magical world/map screen
- Flag Color Challenge entry
- Country selection / challenge start
- Current country gameplay screen
- Correct coloring interaction
- Completion celebration
- Reset/back behavior

## Design Authority

Preserve the approved visual direction:

- magical geography world map
- kid-friendly UI
- playful flag-coloring gameplay
- clean mobile/tablet layout
- approved screenshots and concept references
- parchment/magical adventure tone where already established
- animated effects only when intentionally triggered

Avoid:

- random redesigns
- generic dashboard UI
- oversized center buttons unless specifically intended
- hidden hitboxes that create confusing interactions
- visible hitbox/layout outlines behind artwork
- duplicate overlays
- dark popups that do not match the design
- animations running constantly when they should be triggered
- changing unrelated screens

## Design Skill Picker

For frontend, UI, and design tasks, ask which design skill to use unless the task already names one.

Available design skills:

- `frontend-design` - `C:\Users\ChrisPatrick\.agents\skills\frontend-design\SKILL.md`
- `gpt-taste` - `C:\Users\ChrisPatrick\.agents\skills\gpt-taste\SKILL.md`
- `design-taste-frontend` - `C:\Users\ChrisPatrick\.agents\skills\design-taste-frontend\SKILL.md`
- `high-end-visual-design` - `C:\Users\ChrisPatrick\.agents\skills\high-end-visual-design\SKILL.md`
- `redesign-existing-projects` - `C:\Users\ChrisPatrick\.agents\skills\redesign-existing-projects\SKILL.md`
- `webapp-testing` - `C:\Users\ChrisPatrick\.agents\skills\webapp-testing\SKILL.md`

Ronan-specific priorities always win:

- kid-friendly clarity
- magical geography style
- approved reference/screenshot parity
- asset-first France screen preservation
- no design drift
- no gameplay logic changes unless explicitly requested
- no building more countries until the current country/gameplay loop is correct
- small finishable tasks only

## Default Completion Loop

For every coding, repo, audit, validation, or docs task, the agent must automatically run a complete goal/build/validate/self-judge loop.

The agent must:

- Restate the task as GOAL.
- Define DONE MEANS before editing.
- Identify protected files, screens, assets, and gameplay surfaces before editing.
- Make only the smallest safe change required.
- Run relevant validation directly.
- Not ask the operator to run PowerShell or terminal commands unless blocked by permissions, login, authentication, missing tooling, or tool limitation.
- Self-review the result against DONE MEANS.
- Report PASS / FAIL / PARTIAL.
- Report files changed.
- Report commands run and validation results.
- Report protected surfaces touched: yes/no.
- Recommend the next action.
- Include commit/push recommendation.

If SELF-JUDGE is FAIL or PARTIAL and the issue can be fixed within the original task scope, the agent should fix it and revalidate.

Maximum internal loop count:

- 3 attempts

The agent must stop early only if:

- blocked by permissions, authentication, missing files, or tool limitation
- protected/high-risk surfaces would need to be touched
- scope would need to expand
- destructive action is required
- commit or push authorization is needed

The agent must not stop after initial inspection for LOW-risk tasks.
The agent must not require a separate judge/review prompt for normal low-risk work.

## Operator-Friction Rule

The agent should do the repo work directly.

The agent is responsible for:

- inspecting files
- editing authorized files
- running git status
- running build/test/lint checks
- running browser/runtime validation when appropriate
- reporting results clearly

Do not make the operator bounce between chat, code, and PowerShell.

Only ask the operator to run a command when blocked by:

- permissions
- login/authentication
- missing local tool access
- environment limitation

## Task Size Rule

One task = one bounded issue.

Do not:

- start a second task
- refactor unrelated code
- redesign unrelated screens
- “while I’m here” cleanup
- modify package files unless required and authorized
- build new countries before the current flow is correct

## Protected Surfaces

Do not touch these unless explicitly authorized:

- title screen video/loading flow
- player name modal behavior
- Flag Color Challenge gameplay logic
- country data architecture
- app-wide routing
- package.json
- package-lock.json
- public assets
- major visual direction
- unrelated screens
- completed working flows

## Validation Rules

For UI/gameplay work, run available validation such as:

- npm run build
- npm run lint if available
- typecheck if available
- browser/runtime validation when appropriate
- screenshot comparison or visual observations when relevant

Always run:

- git status before edits
- git status after edits
- git diff --check before final report

For visual/gameplay tasks, validation should confirm:

- screen loads
- intended UI is visible
- unintended overlays are absent
- animations trigger only when intended
- buttons work
- current flow still works
- mobile/tablet layout is not obviously broken

## Commit and Push Rules

Do not commit unless explicitly authorized.

Do not push unless explicitly authorized.

Never recommend committing unvalidated code changes.

For uncommitted code:

- Audit.
- Validate.
- Self-judge.
- Then recommend COMMIT or DO NOT COMMIT.

If commit is authorized:

- stage only intended files
- run git diff --cached --check
- commit with a clear message
- do not push unless separately authorized

## Report Format

Every final report must use:

1. Status: PASS / FAIL / PARTIAL
2. Loop count used
3. Files changed
4. What changed
5. Commands run
6. Validation result
7. Protected surfaces touched: yes/no
8. Remaining issue, if any
9. Recommended next action
10. Commit recommendation
11. Suggested commit message if recommended

## Design/Gameplay Output Standard

When implementing UI/gameplay changes, the result should be:

- visually clear
- child-friendly
- aligned with approved references
- not overbuilt
- not cluttered
- easy to understand
- stable on mobile/tablet
- reusable where reasonable, but not abstracted too early

Reusable architecture is important, but visual/gameplay correctness comes first.

## Ronan Project Command List

These commands are for Ronan’s Flag Game only. They are lightweight routing shortcuts for future planning, design, audit, validation, and execution packets.

### `!mp` — Project Routing
Identify the correct Ronan’s Flag Game project context, repo path, current priority, and protected surfaces before giving next steps.

### `!rp` — Room Routing
Decide which Ronan room/context should receive the update, prompt, handoff, or final report.

### `!q` — Question Only
Answer the user’s question only. Do not create an action packet, Codex prompt, Claude prompt, or task plan unless asked.

### `!x` — Execution Packet
Create one bounded Codex/Claude Code execution packet for a small implementation task.

### `!xa` — Read-Only Audit Packet
Create one read-only audit packet. No file edits, no gameplay changes, no commits, no pushes.

### `!design` — Design Direction
Give visual direction, reference alignment, screenshot parity notes, or a Claude Design prompt.

### `!play` — Gameplay Loop Review
Review the current gameplay flow for clarity, child-friendliness, trigger timing, and completion logic.

### `!mobile` — Mobile Layout Check
Create or review a mobile/tablet layout validation task focused on tap targets, readability, spacing, and screen fit.

### `!kid` — Child-Friendly Clarity Check
Review whether the screen is easy for a child to understand without extra explanation.

### `!test` — Validation Packet
Create a build/runtime/browser validation packet. This should check the actual game behavior, not just static code.

### `!handoff` — Full Room Handoff
Create a concise handoff for a fresh Ronan’s Flag Game session, including current priority, repo path, protected surfaces, and next action.

### `!nr` — New Room Setup
Create setup instructions for starting a new Ronan room with the correct project identity, repo path, priorities, and boundaries.

### `!list` — Tracked Tasks
List current Ronan’s Flag Game tracked tasks in priority order.

### `!add` — Add Tracked Task
Add a new tracked Ronan task only if it supports the current gameplay loop and does not distract from the active priority.
