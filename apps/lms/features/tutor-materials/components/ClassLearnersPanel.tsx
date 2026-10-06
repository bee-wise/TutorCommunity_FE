import { CLASS_LEARNERS } from "../data/classroom.mock";
import type { MaterialClass } from "../types/class-materials.types";
import { panelClass } from "./materials-ui";

export function ClassLearnersPanel({ classInfo }: { classInfo: MaterialClass }) {
  const learners = CLASS_LEARNERS.filter((item) => classInfo.learnerIds.includes(item.id));
  return (
    <aside className={`${panelClass} min-w-0`} aria-labelledby="class-learners-title">
      <h2 id="class-learners-title" className="text-xl leading-[1.25] text-primary">Học viên ({learners.length})</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tài liệu đã xuất bản được chia sẻ với toàn bộ học viên trong lớp.</p>
      <ul className="mt-5 space-y-5">
        {learners.map((learner) => <li key={learner.id} className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-hidden="true">{learner.initials}</span><div className="min-w-0"><p className="text-sm font-bold text-foreground">{learner.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{learner.gradeLevel}</p></div></li>)}
      </ul>
    </aside>
  );
}
