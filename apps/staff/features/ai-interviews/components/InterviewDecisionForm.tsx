"use client";

import { Controller } from "react-hook-form";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  useInterviewAttemptGrant,
  useInterviewDecision,
} from "../hooks/useInterviewActions";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

const decisionOptions = [
  {
    value: "APPROVED",
    label: "Phê duyệt",
    hint: "Hồ sơ và phỏng vấn đạt yêu cầu.",
    icon: CheckCircleIcon,
  },
  {
    value: "NEEDS_REVISION",
    label: "Yêu cầu bổ sung",
    hint: "Gia sư cập nhật hồ sơ rồi xét lại.",
    icon: PencilSquareIcon,
  },
  {
    value: "REJECTED",
    label: "Từ chối",
    hint: "Không đạt, kết thúc lượt này.",
    icon: XCircleIcon,
  },
] as const;

export function InterviewDecisionForm({
  id,
  enabled,
  pendingItems = 0,
}: {
  id: string;
  enabled: boolean;
  pendingItems?: number;
}) {
  const { form, mutation, save } = useInterviewDecision(id);
  const decision = form.watch("decision");
  return (
    <section className={`${panelClass} border-primary`}>
      <h2 className="font-nunito text-lg font-extrabold">
        Quyết định xét duyệt
      </h2>
      {!enabled ? (
        <p className="mt-4 rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
          Chỉ ra quyết định khi buổi ở trạng thái chờ Consultant duyệt.
        </p>
      ) : (
        <form onSubmit={save} className="mt-4">
          <fieldset disabled={mutation.isPending} className="space-y-4">
            {pendingItems > 0 && (
              <p className="rounded-xl bg-highlight p-3 text-xs font-medium leading-5">
                Còn {pendingItems} mục cần xử lý ở phần Tổng quan. AI chỉ hỗ
                trợ, quyết định cuối cùng là của bạn.
              </p>
            )}
            <Controller
              control={form.control}
              name="decision"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Kết quả"
                  className="space-y-2"
                >
                  {decisionOptions.map((option) => {
                    const Icon = option.icon;
                    const checked = field.value === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                          checked={checked}
                          onChange={() => field.onChange(option.value)}
                          className="sr-only"
                        />
                        <Icon aria-hidden="true" className="size-6 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-bold">
                            {option.label}
                          </span>
                          <span className="block text-xs opacity-85">
                            {option.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            <label className="block text-sm font-medium">
              Lý do{decision === "APPROVED" ? " (không bắt buộc)" : ""}
              <textarea
                {...form.register("reason")}
                maxLength={4000}
                rows={3}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <FieldError message={form.formState.errors.reason?.message} />
            <label className="block text-sm font-medium">
              Phản hồi gửi gia sư
              <textarea
                {...form.register("feedback")}
                maxLength={4000}
                rows={3}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <FieldError message={form.formState.errors.feedback?.message} />
            <Button type="submit" className={`w-full ${actionClass}`}>
              {mutation.isPending ? "Đang lưu…" : "Lưu quyết định"}
            </Button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
export function InterviewAttemptGrant({
  tutorId,
  id,
  enabled,
}: {
  tutorId: string;
  id: string;
  enabled: boolean;
}) {
  const { form, mutation, save } = useInterviewAttemptGrant(tutorId, id);
  return (
    <DisclosureCard title="Cấp lại lượt phỏng vấn" variant="outline" size="lg">
      <p className="text-xs leading-5 text-muted-foreground">
        Cấp thêm một lượt cho gia sư sau buổi phỏng vấn đã kết thúc.
      </p>
      <form onSubmit={save} className="mt-4">
        <fieldset disabled={!enabled || mutation.isPending}>
          <label className="text-sm font-medium">
            Lý do cấp lượt
            <textarea
              {...form.register("reason")}
              rows={3}
              maxLength={2000}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <FieldError message={form.formState.errors.reason?.message} />
          <Button
            type="submit"
            variant="outline"
            className={`mt-4 w-full ${actionClass}`}
          >
            {mutation.isPending ? "Đang cấp…" : "Cấp thêm một lượt"}
          </Button>
        </fieldset>
      </form>
      {!enabled && (
        <p className="mt-3 text-xs text-muted-foreground">
          Chỉ cấp lại lượt cho buổi đã kết thúc.
        </p>
      )}
    </DisclosureCard>
  );
}
