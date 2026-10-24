"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import {
  CLASS_WORKSPACE_LABELS,
  getClassWorkspaceLinks,
  type ClassWorkspaceRoute,
} from "../utils/class-workspace.utils";

const BEE_PENCIL =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1789966160/19.png";
const BEE_MEDITATE =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1789966153/8.png";
const waitingStatuses = ["SUBMITTED", "PENDING"];

// Sessions, members, materials and chat only make sense once a group class
// is approved; until then show a friendly notice instead of the screen.
export function ClassApprovalGate({
  workspace,
  children,
}: {
  workspace: ClassWorkspaceRoute;
  children: ReactNode;
}) {
  const { classInfo, loading } = useTutorClassDetail(workspace.classId);
  if (workspace.section === "overview") return children;
  if (loading)
    return (
      <div className="space-y-4 p-4 sm:p-6" aria-busy="true">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  const status = classInfo?.serverDetails?.approvalStatus ?? "";
  const draft = status === "DRAFT";
  if (
    classInfo?.kind !== "group" ||
    !(draft || waitingStatuses.includes(status))
  )
    return children;
  const section = CLASS_WORKSPACE_LABELS[workspace.section].toLowerCase();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <div
        role="status"
        className="rounded-3xl border border-border bg-card shadow-soft"
      >
        <EmptyState
          imageSrc={draft ? BEE_PENCIL : BEE_MEDITATE}
          imageAlt=""
          imageWidth={200}
          imageHeight={200}
          title={
            draft
              ? "Lớp của bạn vẫn đang là bản nháp"
              : "Lớp của bạn đang chờ BeeWise duyệt"
          }
          description={
            draft
              ? `Hoàn tất thông tin lớp và gửi BeeWise duyệt, ${section} sẽ sẵn sàng ngay sau khi lớp được duyệt.`
              : `Cảm ơn bạn đã kiên nhẫn. ${CLASS_WORKSPACE_LABELS[workspace.section]} sẽ mở ngay khi BeeWise duyệt xong lớp.`
          }
          action={
            <Button asChild className="min-h-11 px-5">
              <Link href={getClassWorkspaceLinks(workspace.classId).overview}>
                {draft ? "Hoàn tất & gửi duyệt" : "Xem thông tin lớp"}
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
