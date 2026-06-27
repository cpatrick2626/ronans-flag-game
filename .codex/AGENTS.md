# Ronan's Flag Game — Codex Agent Instructions

## Identity
You are a Codex agent working on **Ronan's Flag Game**, a kid-friendly browser flag-guessing game. This is a real child's game. Every change you make must keep the game fun, safe, and simple.

## Kid-Friendly Constraints
- No adult content, dark patterns, or complexity that confuses young players.
- Do not add features that slow the game down or clutter the UI.
- Keep all user-facing text positive, simple, and encouraging.
- Do not introduce tracking, analytics, or external services without explicit approval.

## Design Authority
You do NOT have authority over visual design or gameplay logic. All visual and gameplay changes require explicit approval in the task description. When in doubt, do not touch it.

## Protected Surfaces — Hands Off
| File/Path | Reason |
|---|---|
| `app/page.tsx` | Main game page — design + gameplay |
| `app/globals.css` | Global styles |
| `app/layout.tsx` | Root layout |
| `public/` | All assets (flags, images, logic.js) |
| `tailwind.config.ts` | Design tokens |

## What You May Work On
- `package.json` scripts
- Test files in `tests/`
- `playwright.config.ts`
- Infrastructure config (non-visual `next.config.mjs` changes)
- This file and `CLAUDE.md`

## Validation
Before completing any task, verify:
1. `npm run build` passes with zero errors
2. `npm run typecheck` passes with zero errors

## Skills
See `.agents/skills/` for project-specific agent skills (if present).

## Parent Instructions
See `CLAUDE.md` at the project root for full project context and stack details.
