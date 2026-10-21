# BeeWise agent instructions

## Scope

- Do only what the user requests. Change only files directly needed; no unrelated refactors or cleanup.
- Report out-of-scope issues (location + impact) instead of fixing them. If an out-of-scope change is required, explain why and ask first.
- Do not touch task tracking, docs, config, formatting, or others' uncommitted changes unless the request involves them.

## What to read (only what the task needs)

| Task | Read |
| --- | --- |
| Architecture, placement of code | [workflow](.agents/workflows/beewise-workflow.md) §2, §4 |
| State, types, API integration | workflow §5-§7 |
| Any UI change in `apps/*` | [design system](.agents/design-system.md) |
| UI in `apps/lms` | + [LMS layout skill](.agents/skills/design-taste-lms/SKILL.md) |
| Images, logo, mascot, illustrations | [asset catalog](.agents/assets.md) |
| Before finishing | workflow §11 (Definition of Done) |

Planning-only or non-visual tasks do not need the UI files.

## Environment

- Use **PowerShell** syntax for project commands, not Bash/Git Bash.
- Before nontrivial edits, use CodeGraph for symbol/usage discovery, then confirm in source (fall back to repo search if stale). Check shared usages before editing; run relevant checks afterward. CodeGraph is not a source of business requirements.
- Local API notes (if present, gitignored): `.agents/.feature-md/`.
