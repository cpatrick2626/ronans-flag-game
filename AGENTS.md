# Ronan's Flag Game - AGENT OPERATING RULES

## REPO BOUNDARIES

- Use `C:\ronans-flag-game` only.
- Do not use `C:\flag game` unless explicitly asked for recovery/audit.

## PRODUCT IDENTITY

- App/page title: Ronan's Flag Game
- Screen/module: COLOR THE FLAG
- Main flag panel: Current Flag
- Country list: Explorer Log
- Reward popup component: CompletionOverlay
- Visible popup title: Flag Complete

## WORKFLOW RULES

- Preserve the PLAY-gated title screen unless explicitly asked to change it.
- Preserve real game interactions.
- Run `npm run build` after code changes.
- Make the smallest safe change.
- Do not refactor unrelated code.
- Do not commit, push, or deploy unless explicitly instructed.
- Always report files changed, validation run, and final git status.

## Skill Routing

- Use `read-only-audit` for inspection-only tasks.
- Use `ronan-design-authority` for UI, gameplay, art direction, naming, or design-system decisions.
- Use `ui-reference-parity` when matching screenshots or reference images.
- Use `frontend-visual-parity` when preserving the existing visual system during UI edits.
- Use `build-validation` after code changes that could affect build or runtime.
- Use `runtime-validation` when browser or manual behavior must be checked.
- Use `git-hygiene` before and after changes to prevent accidental churn.
- Use `single-patch-execution` for tightly scoped implementation tasks.
