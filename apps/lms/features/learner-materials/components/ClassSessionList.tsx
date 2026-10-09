import type { LearnerSessionSummary } from "../types/learner-materials.types";
import { LearnerSessionCard } from "./LearnerSessionCard";
import { LibraryEmptyState } from "./LibraryStates";

interface ClassSessionListProps {
  classId: string;
  sessions: readonly LearnerSessionSummary[];
  onReset?: () => void;
}

export function ClassSessionList({ classId, sessions, onReset }: ClassSessionListProps) {
  if (sessions.length === 0) {
    return (
      <LibraryEmptyState title="Không có buổi học phù hợp" description="Hãy thay đổi bộ lọc để xem các buổi học khác." onReset={onReset} />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sessions.map((summary) => <LearnerSessionCard key={summary.session.id} classId={classId} {...summary} />)}</div>
  );
}

