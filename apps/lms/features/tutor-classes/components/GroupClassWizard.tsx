"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { displayClassCode } from "@workspace/core/lms-classes/lifecycle";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useGroupClassWizard } from "../hooks/useGroupClassWizard";
import {
  GROUP_WIZARD_ROADMAP_STEP,
  GROUP_WIZARD_SUBMIT_STEP,
} from "../utils/group-class-draft";
import { GroupWizardDetailsStep } from "./GroupWizardDetailsStep";
import { GroupWizardOfferingStep } from "./GroupWizardOfferingStep";
import { GroupWizardReviewStep } from "./GroupWizardReviewStep";
import { GroupWizardRoadmapStep } from "./GroupWizardRoadmapStep";
import { GroupWizardScheduleStep } from "./GroupWizardScheduleStep";
import { GroupWizardStepper } from "./GroupWizardStepper";

export function GroupClassWizard({
  mode,
  initial,
  initialStep,
  onClose,
}: {
  mode: "create" | "edit";
  initial?: GroupDto;
  initialStep?: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const wizard = useGroupClassWizard({ mode, initial, initialStep });
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [confirmClose, setConfirmClose] = useState(false);
  const { step, saved, pending } = wizard;

  function requestClose() {
    if (pending) return;
    if (wizard.dirty && !confirmClose) return setConfirmClose(true);
    if (mode === "create" && saved)
      toast.info("Đã lưu bản nháp lớp nhóm", {
        description:
          "Bạn có thể tiếp tục từ thông báo ở trang Quản lý lớp học.",
      });
    onClose();
  }
  async function submit() {
    const result = await wizard.submitForReview();
    if (!result) return;
    toast.success("Đã gửi BeeWise duyệt", {
      description: "Bạn sẽ thấy kết quả duyệt ở trang chi tiết lớp.",
    });
    onClose();
    if (mode === "create") router.push(`/lms/tutor/classes/${result.id}`);
  }
  const nextLabel =
    step === 2 && (!saved || wizard.draftForm.formState.isDirty)
      ? "Lưu nháp & tiếp tục"
      : step === GROUP_WIZARD_ROADMAP_STEP &&
          wizard.roadmapForm.formState.isDirty
        ? "Lưu lộ trình & tiếp tục"
        : "Tiếp tục";

  return (
    <Dialog open onOpenChange={(open) => !open && requestClose()}>
      <DialogContent
        ref={setPortalContainer}
        className="flex h-[min(52rem,94dvh)] w-[calc(100%-1.5rem)] max-w-5xl flex-col gap-5 overflow-hidden rounded-3xl border-border bg-popover p-5 shadow-pop sm:p-8"
      >
        <DialogHeader className="space-y-1 pr-8">
          <DialogTitle className="font-lms text-xl font-extrabold leading-[1.15]">
            {mode === "edit" ? "Chỉnh sửa lớp nhóm" : "Tạo lớp nhóm"}
          </DialogTitle>
          <DialogDescription>
            {saved
              ? `Bản nháp${displayClassCode(saved.code) ? ` ${displayClassCode(saved.code)}` : ""} được lưu mỗi khi bạn qua bước.`
              : "Bản nháp được lưu khi bạn hoàn tất bước Lịch & học phí."}
          </DialogDescription>
        </DialogHeader>
        <GroupWizardStepper
          step={step}
          reached={wizard.reached}
          disabled={pending}
          onSelect={(s) => void wizard.goTo(s)}
        />
        <form
          id="group-class-wizard"
          className="-mx-1.5 min-h-0 flex-1 overflow-y-auto px-1.5 py-1"
          onSubmit={(event) => {
            event.preventDefault();
            void (step === GROUP_WIZARD_SUBMIT_STEP
              ? submit()
              : wizard.goTo(step + 1));
          }}
        >
          <fieldset disabled={pending} className="min-w-0">
            {step === 0 && (
              <GroupWizardOfferingStep
                form={wizard.draftForm}
                current={saved}
              />
            )}
            {step === 1 && <GroupWizardDetailsStep form={wizard.draftForm} />}
            {step === 2 && (
              <GroupWizardScheduleStep
                form={wizard.draftForm}
                portalContainer={portalContainer}
              />
            )}
            {step === GROUP_WIZARD_ROADMAP_STEP && (
              <GroupWizardRoadmapStep form={wizard.roadmapForm} />
            )}
            {step === GROUP_WIZARD_SUBMIT_STEP && saved && (
              <GroupWizardReviewStep
                data={saved}
                onEdit={(s) => void wizard.goTo(s)}
              />
            )}
          </fieldset>
        </form>
        {wizard.error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-error bg-card px-4 py-3 text-sm text-destructive"
          >
            <ExclamationTriangleIcon
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {wizard.error}
          </p>
        )}
        {confirmClose ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm"
          >
            <p className="font-bold text-foreground">
              {saved
                ? "Thay đổi ở bước này chưa được lưu. Bản nháp đã lưu vẫn có thể tiếp tục sau."
                : "Thông tin chưa được lưu. Thoát sẽ mất các thông tin đã nhập."}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => setConfirmClose(false)}
              >
                Ở lại
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="min-h-11"
                onClick={requestClose}
              >
                Thoát
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
            {step > 0 ? (
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
                disabled={pending}
                onClick={() => void wizard.goTo(step - 1)}
              >
                <ArrowLeftIcon className="size-4" aria-hidden="true" />
                Quay lại
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="submit"
              form="group-class-wizard"
              className="min-h-11 px-5"
              disabled={pending}
              aria-busy={pending}
            >
              {pending && (
                <ArrowPathIcon
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {step === GROUP_WIZARD_SUBMIT_STEP
                ? "Gửi BeeWise duyệt"
                : nextLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
