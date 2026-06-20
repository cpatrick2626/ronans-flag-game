---
name: read-only-audit
description: Use when you need to inspect the Ronan's Flag Game repo without changing game code.
---

- Confirm repo root with `git rev-parse --show-toplevel`.
- Confirm branch with `git branch --show-current`.
- Run `git status --short` before any edit attempt.
- Read only the minimum files needed to answer the question.
- Do not modify app source, gameplay code, API code, or formulas.
- Report findings with file references and any validation gaps.
- Include final git status in the response.

