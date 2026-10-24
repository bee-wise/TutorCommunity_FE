"use client";

import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { Button } from "@workspace/ui/components/ui/button";
import { useGroupDraftResume } from "../hooks/useGroupDraftResume";
import { groupWizardSteps } from "../utils/group-class-draft";

export function GroupDraftResumeBanner({
  onResume,
}: {
  onResume: (data: GroupDto, step: number) => void;
}) {
  const { resume, dismiss } = useGroupDraftResume();
  if (!resume) return null;
  return (
    <section
      aria-label="Lớp nhóm đang tạo dở"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm shadow-soft"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-primary">
        <PencilSquareIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-foreground">
          Lớp nhóm “{resume.data.title || "Chưa đặt tên"}” chưa được gửi duyệt
        </p>
        <p className="mt-0.5 text-muted-foreground">
          Bạn dừng ở bước {resume.step + 1}/{groupWizardSteps.length}:{" "}
          {groupWizardSteps[resume.step]}. Tiếp tục để hoàn tất và gửi BeeWise
          duyệt.
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="min-h-11"
          onClick={() => onResume(resume.data, resume.step)}
        >
          Tiếp tục tạo lớp
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-11"
          aria-label="Ẩn thông báo bản nháp"
          onClick={dismiss}
        >
          <XMarkIcon className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
