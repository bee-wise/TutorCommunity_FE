import { LEARNER_CLASS_STATUS_LABELS, type LearnerClassStatus } from "../types/learner-materials.types";
import { libraryBadge } from "./learner-materials-ui";
import { statusTone } from "../../../components/lms-status";

const STATUS_STYLES: Record<LearnerClassStatus, string> = {
  active: statusTone.active,
  upcoming: statusTone.pending,
  completed: statusTone.done,
};

export function LibraryClassBadge({ status }: { status: LearnerClassStatus }) {
  return <span className={`${libraryBadge} ${STATUS_STYLES[status]}`}>{LEARNER_CLASS_STATUS_LABELS[status]}</span>;
}
