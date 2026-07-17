# Ronan's Flag Game — Claude/Codex Project Context

## Identity

Ronan's Flag Game is a magical, kid-friendly storybook geography adventure. Children explore countries and complete flag-coloring challenges. It should feel bright, playful, tactile, polished, and simple enough for a child to understand.

Active repository: `C:\ronans-flag-game`

Live app: `https://ronans-flag-game.vercel.app/`

## Current priority

France is the only real playable country. Finish and protect the France Flag Color Challenge loop before adding countries, modes, passport systems, XP, collections, or multiplayer.

The core contract is:

- blue selected + left region fills blue
- white selected + middle region fills white
- red selected + right region fills red
- wrong colors gently reject and never fill
- completion triggers only after all three regions are correct
- reset and re-entry start blank

## Source-of-truth hierarchy

1. Current repo and validated runtime behavior
2. `AGENTS.md` and `.codex/AGENTS.md`
3. `docs/ronans-flag-game-clean-current-handoff.md` when present
4. `docs/ronans-flag-game-master-vision-roadmap-and-build-context.md`
5. Design handoffs and approved visual references in `docs/`

The master vision is long-term context, not permission to build the whole future game. The current-build handoff controls immediate implementation scope.

## Workflow

- One bounded issue at a time.
- Confirm repo root and `git status --short` before code work.
- If the tree is dirty, report the files and stop before editing, staging, resetting, cleaning, committing, or pushing.
- Use Codex/Claude Code for implementation, behavior fixes, audits, and validation.
- Use Claude Design/Fable for new art, visual concepts, and motion direction.
- Preserve approved visuals and working gameplay; avoid broad rewrites and redesign drift.
- Real-device validation is required for layout and interaction work.
- Do not commit or push without explicit authorization.

## References

Concept and style references are targets or mood references, not proof of the current live app. Never claim parity without live validation. Do not copy unrelated creatures, buildings, unicorns, watermarks, or non-Ronan layouts.

The France design handoff in `docs/design/france-screen-design-to-code-handoff.md` is a design specification, not production code.

## Validation

For code changes, run the relevant checks, normally:

```text
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
git diff --check
```

For France work, verify startup/PLAY, navigation, correct and incorrect coloring, completion gating, reset, back navigation, mobile overflow, and console/page errors at 390x844, 414x736, and 421x743 when possible.

## Protected surfaces

Do not touch protected gameplay, loading, player-name, country-configuration, public-asset, or package surfaces unless the task explicitly includes them. The intentional loading-video backups must never be staged or deleted.

## Reporting

Report status, files changed, what changed, commands run, validation, browser/device checks, protected surfaces touched, remaining issue, recommended next action, commit recommendation, push recommendation, and a PASS/PARTIAL/FAIL self-judge.
