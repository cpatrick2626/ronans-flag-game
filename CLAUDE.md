# Ronan's Flag Game — CLAUDE.md

## Project Identity
**Ronan's Flag Game** is a kid-friendly browser game where players guess world flags. It is built for fun, clarity, and simplicity. Every change must preserve the game's playability and child-appropriate tone.

## Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Runtime:** Node.js / browser

## Design Authority
Visual design and gameplay are owned by the project author. Do **not** touch design or gameplay files without explicit written approval in the task/prompt.

## Protected Surfaces — Do NOT edit without explicit approval
- `app/page.tsx` — main game page
- `app/globals.css` — global styles
- `app/layout.tsx` — root layout
- `public/` — all static assets (images, flags, icons, logic.js)
- `tailwind.config.ts` — design tokens

## Allowed Infrastructure Work
- `package.json` scripts (typecheck, test, lint, build)
- `playwright.config.ts` and `tests/` smoke tests
- `CLAUDE.md`, `.codex/AGENTS.md`, `.agents/`
- `next.config.mjs` for non-visual config only

## Validation Requirements
Every change must pass:
```
npm run build       # Next.js production build
npm run typecheck   # tsc --noEmit, zero errors
```
Playwright smoke tests should pass when a dev server is available.

## Codex Agents
See `.codex/AGENTS.md` for Codex-specific identity and constraints.
