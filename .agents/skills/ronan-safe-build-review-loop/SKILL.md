---
name: ronan-safe-build-review-loop
description: Use for safe Ronan's Flag Game fixes that need repo-root confirmation, build validation, and a strict self-review loop.
---

# Ronan Safe Build Review Loop

Use this workflow for Ronan's Flag Game fixes that must stay inside the existing app structure and preserve the approved game presentation.

## Workflow

1. Inspect the repo root first with `git rev-parse --show-toplevel`.
2. Confirm the repo is exactly `C:\ronans-flag-game`.
3. Check `git status --short` before any edits.
4. Preserve the current app structure unless the user explicitly requests a structural change.
5. Preserve approved asset-first screens, especially PNG/MP4-driven layouts, unless explicitly asked to replace them.
6. For visual fixes, compare against approved references when they are available.
7. For interaction fixes, verify the actual behavior works instead of inferring from code alone.
8. For animation fixes, verify the animation loops continuously with no pause, reset, or replay unless the user asked for a finite animation.
9. Make the smallest safe change required.
10. Run `npm run build` after code changes.
11. Run `git diff --check`.
12. Self-review the changed files for obvious issues.
13. Fix obvious issues, then revalidate.

## Guardrails

- Do not stop after inspection on low-risk tasks.
- Do not claim browser validation passed unless it was actually performed.
- Do not replace approved PNG/MP4 asset-first design with CSS approximations.
- Do not change unrelated screens.
- Do not add packages unless explicitly authorized.
- Do not create a remote or push unless explicitly authorized.
- Do not use `C:\Flag Game` as the active repo.

## Required Validation

- `git status --short`
- `git diff --check`
- `npm run build` after code changes

## Final Report

Every final report must include:

- `Status: PASS / FAIL / PARTIAL`
- `Files changed`
- `What changed`
- `Validation performed`
- `What was not validated`
- `Whether commit is recommended`

## Completion Rule

This skill is ready when the file exists, is clear, and can be reused for future Ronan tasks without changing app behavior or visuals.
