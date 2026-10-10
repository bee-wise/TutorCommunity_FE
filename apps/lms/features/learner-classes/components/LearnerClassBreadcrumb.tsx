import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { getLearnerClassSummary } from "../services/learner-classes.mock.service";
import { LEARNER_WORKSPACE_LABELS, type LearnerWorkspaceRoute } from "../utils/learner-class-workspace.utils";

export function LearnerClassBreadcrumb({ workspace }: { workspace: LearnerWorkspaceRoute }) {
  const summary = getLearnerClassSummary(workspace.classId);
  return <nav aria-label="Vị trí trong lớp học" className="hidden min-w-0 items-center gap-2 text-sm md:flex">
    <Button asChild variant="ghost" className="min-h-11 shrink-0 rounded-xl px-3 text-muted-foreground transition-all active:scale-[0.98] motion-reduce:transform-none"><Link href="/lms/learner/classes">Lớp học</Link></Button>
    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    <span className="truncate font-bold text-primary">{summary?.classInfo.code ?? "Lớp học"}</span>
    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    <span aria-current="page" className="truncate text-muted-foreground">{LEARNER_WORKSPACE_LABELS[workspace.section]}</span>
  </nav>;
}
