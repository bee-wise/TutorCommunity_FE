import type { LearnerClassSummary } from "../types/learner-materials.types";
import { LearnerClassCard } from "./LearnerClassCard";
import { LibraryEmptyState } from "./LibraryStates";

export function ClassLibraryList({ classes, onReset }: { classes: readonly LearnerClassSummary[]; onReset: () => void }) {
  if (classes.length === 0) {
    return (
      <LibraryEmptyState title="Không tìm thấy lớp học" description="Thử đổi tab, từ khóa, môn học hoặc trạng thái lớp." onReset={onReset} />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{classes.map((summary) => <LearnerClassCard key={summary.classInfo.id} {...summary} />)}</div>
  );
}
