import type { Learner } from "../types";
import type { ClassKind, ClassSort, ClassStatus, MaterialClass } from "../types/class-materials.types";

export function filterMaterialClasses(classes: readonly MaterialClass[], learners: readonly Learner[], filter: {
  kind: ClassKind; search: string; status: "all" | ClassStatus; sort: ClassSort;
}) {
  const query = filter.search.trim().toLocaleLowerCase("vi");
  const order: Record<ClassStatus, number> = { active: 0, upcoming: 1, completed: 2 };
  return classes.filter((item) => {
    const names = learners.filter((learner) => item.learnerIds.includes(learner.id)).map((learner) => learner.fullName).join(" ");
    return item.kind === filter.kind && (filter.status === "all" || item.status === filter.status)
      && `${item.title} ${item.code} ${item.subject} ${names}`.toLocaleLowerCase("vi").includes(query);
  }).sort((a, b) => filter.sort === "oldest" ? a.createdAt.localeCompare(b.createdAt)
    : filter.sort === "status" ? order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt)
    : b.createdAt.localeCompare(a.createdAt));
}
