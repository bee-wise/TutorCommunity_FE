"use client";

import Link from "next/link";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { GroupDraft, GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { useOwnTutorProfile } from "../../tutor-profile/hooks/useOwnTutorProfile";

const modeLabels: Record<string, string> = {
  ONLINE: "Trực tuyến",
  OFFLINE: "Trực tiếp",
  BOTH: "Trực tuyến & trực tiếp",
};
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

type Offering = {
  id: string;
  programName: string;
  teachingItemName: string;
  contextName: string;
  teachingMode: string;
  basePrice?: number | null;
};

export function GroupWizardOfferingStep({
  form,
  current,
}: {
  form: UseFormReturn<GroupDraft>;
  current?: GroupDto;
}) {
  const profile = useOwnTutorProfile();
  const selected = useWatch({ control: form.control, name: "teachingOfferingId" });
  const error = form.formState.errors.teachingOfferingId;
  if (profile.loading)
    return (
      <div className="grid gap-3" aria-busy="true">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    );
  if (profile.error || !profile.data)
    return (
      <EmptyState
        imageSrc="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789966155/10.png"
        imageAlt=""
        imageWidth={120}
        imageHeight={120}
        className="py-6 sm:py-8"
        title="Chưa tải được nội dung giảng dạy"
        description="Kiểm tra kết nối mạng rồi thử lại."
        action={<Button variant="outline" className="min-h-11" onClick={() => void profile.refetch()}>Thử lại</Button>}
      />
    );
  const offerings: Offering[] = profile.data.teachingOfferings.filter((o) => o.status === "APPROVED");
  // An existing class may reference an offering no longer listed on the profile.
  if (current?.teachingOfferingId && !offerings.some((o) => o.id === current.teachingOfferingId))
    offerings.unshift({
      id: current.teachingOfferingId,
      programName: current.programName ?? "",
      teachingItemName: current.teachingItemName ?? "",
      contextName: current.contextName ?? "",
      teachingMode: current.teachingMode ?? "",
    });
  if (!offerings.length)
    return (
      <EmptyState
        imageAlt=""
        imageWidth={120}
        imageHeight={120}
        className="py-6 sm:py-8"
        title="Chưa có nội dung giảng dạy được duyệt"
        description="Lớp nhóm cần tạo từ một nội dung giảng dạy đã được duyệt. Cập nhật hồ sơ giảng dạy rồi quay lại."
        action={<Button asChild variant="outline" className="min-h-11"><Link href="/lms/tutor/profile">Mở hồ sơ giảng dạy</Link></Button>}
      />
    );
  function choose(offering: Offering) {
    form.setValue("teachingOfferingId", offering.id, { shouldDirty: true, shouldValidate: true });
    if (offering.teachingMode === "ONLINE" || offering.teachingMode === "OFFLINE")
      form.setValue("teachingMode", offering.teachingMode, { shouldDirty: true });
  }
  return (
    <fieldset className="grid gap-3" aria-describedby={error ? "group-offering-error" : undefined}>
      <legend className="mb-3 text-sm text-muted-foreground">
        Chọn nội dung giảng dạy cho lớp nhóm
      </legend>
      {offerings.map((offering) => {
        const checked = offering.id === selected;
        return (
          <label
            key={offering.id}
            className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${checked ? "border-primary" : "border-border"}`}
          >
            <input type="radio" name="teachingOfferingId" className="sr-only" checked={checked} onChange={() => choose(offering)} />
            <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 bg-card ${checked ? "border-primary" : "border-border"}`}>
              {checked && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block font-bold leading-snug text-foreground">
                {offering.teachingItemName || "Chưa có tên môn học"}
                {offering.contextName ? ` - ${offering.contextName}` : ""}
              </span>
              <span className="block text-sm text-muted-foreground">
                {[offering.programName, modeLabels[offering.teachingMode]].filter(Boolean).join(" · ") || "Chưa có chương trình"}
              </span>
            </span>
            {offering.basePrice != null && (
              <span className="shrink-0 text-sm font-extrabold tabular-nums text-primary">{currency.format(offering.basePrice)}</span>
            )}
          </label>
        );
      })}
      {error && (
        <p id="group-offering-error" className="flex items-center gap-1 text-xs font-semibold text-destructive">
          <ExclamationCircleIcon className="size-3.5" aria-hidden="true" />
          Chọn một nội dung giảng dạy đã được duyệt.
        </p>
      )}
    </fieldset>
  );
}
