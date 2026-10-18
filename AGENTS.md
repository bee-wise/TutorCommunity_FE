# BeeWise agent instructions

## Scope

- Do only what the user requests. Change only files and code directly needed; do not expand scope, refactor, or clean up unrelated work.
- Report out-of-scope issues with their location and impact; do not fix them without a separate request.
- Do not change task tracking, documentation, configuration, formatting, or others' existing changes unless the request directly involves them.
- If an out-of-scope change is necessary, explain the dependency and ask before making it.

## Task-specific guidance

- [`.agents/workflows/beewise-workflow.md`](.agents/workflows/beewise-workflow.md) is the source of truth for implementation. Read only sections relevant to the task: §§2, 4 for architecture; §§5–7 for state, types, and API; §3 for UI implementation; §17 for completion. Planning and review tasks should inspect only the sections needed for their analysis, not the entire workflow. The scope rules above take precedence over its task-tracking guidance.
- Use **PowerShell** for project commands, with PowerShell syntax and cmdlets; do not use Bash or Git Bash.
- When implementing or changing UI in `apps/sale`, `apps/lms`, `apps/staff`, or `apps/admin`, use [`design-taste-frontend/SKILL.md`](.agents/skills/design-taste-frontend/SKILL.md). For `apps/lms`, also use [`design-taste-lms/SKILL.md`](.agents/skills/design-taste-lms/SKILL.md). Consult their visual references when the task requires layout or visual-design decisions. Planning-only and non-visual tasks do not require these UI skills unless the user explicitly invokes them.
- Before nontrivial code changes, use CodeGraph for targeted symbol and usage discovery, then confirm critical findings in source. If unavailable or stale, use repository search. Check shared usages before editing and run relevant checks afterward; CodeGraph is not a source of business requirements.
