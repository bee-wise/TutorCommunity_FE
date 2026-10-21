// Canonical status tones (.agents/skills/design-taste-lms/references/components/display.md#badge--tag).
export const statusTone = {
  done: "border-secondary/30 bg-secondary/15 text-foreground",
  pending: "border-accent/40 bg-accent/20 text-warning",
  active: "border-primary bg-card text-primary",
  cancelled: "border-border bg-muted text-muted-foreground",
  overdue: "border-error bg-error/20 text-destructive",
  planned: "border-dashed border-border bg-card text-muted-foreground",
} as const;

export const statusDot = {
  done: "bg-secondary",
  pending: "bg-warning",
  active: "bg-primary",
  cancelled: "bg-muted-foreground",
  overdue: "bg-destructive",
  planned: "bg-muted-foreground",
} as const;

export type StatusTone = keyof typeof statusTone;
