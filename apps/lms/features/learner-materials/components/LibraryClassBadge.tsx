import { LEARNER_CLASS_STATUS_LABELS, type LearnerClassStatus } from "../types/learner-materials.types";
import { libraryBadge } from "./learner-materials-ui";

const STATUS_STYLES: Record<LearnerClassStatus, string> = {
  active: "border-primary bg-primary text-primary-foreground",
  upcoming: "border-accent bg-accent text-accent-foreground",
  completed: "border-border bg-card text-muted-foreground",
};

export function LibraryClassBadge({ status }: { status: LearnerClassStatus }) {
  return <span className={`${libraryBadge} ${STATUS_STYLES[status]}`}>{LEARNER_CLASS_STATUS_LABELS[status]}</span>;
}
