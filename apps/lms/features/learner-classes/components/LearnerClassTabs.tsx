"use client";

import { usePathname } from "next/navigation";
import { LmsTabNav } from "@/components/LmsTabNav";
import { getLearnerWorkspaceLinks, getLearnerWorkspaceRoute, LEARNER_WORKSPACE_LABELS, type LearnerWorkspaceSection } from "../utils/learner-class-workspace.utils";

const SECTION_ORDER: LearnerWorkspaceSection[] = ["overview", "sessions", "materials", "exercises", "tuition"];

/** Tab bar shown above every class-scoped learner page; routes stay the same, so existing links keep working. */
export function LearnerClassTabs() {
  const workspace = getLearnerWorkspaceRoute(usePathname());
  if (!workspace) return null;
  const links = getLearnerWorkspaceLinks(workspace.classId);
  const items = SECTION_ORDER.flatMap((section) => {
    const href = links[section];
    return href ? [{ href, label: LEARNER_WORKSPACE_LABELS[section], active: workspace.section === section }] : [];
  });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
      <LmsTabNav label="Các phần của lớp học" items={items} />
    </div>
  );
}
