"use client";

import { Controller } from "react-hook-form";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  useInterviewAttemptGrant,
  useInterviewDecision,
} from "../hooks/useInterviewActions";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

export function InterviewDecisionForm({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) {
  const { form, mutation, save } = useInterviewDecision(id);
  return (
    <section className={`${panelClass} border-primary/20`}>
      <div className="flex items-center gap-2">
        <CheckBadgeIcon className="size-5 text-primary" />
        <h2 className="font-nunito text-lg font-extrabold">
          Quyết định xét duyệt
        </h2>
      </div>
      {!enabled ? (
        <p className="mt-4 rounded-xl bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
          Chỉ ra quyết định khi buổi ở trạng thái chờ Consultant duyệt.
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Nhận định AI hỗ trợ xét duyệt. Consultant chịu trách nhiệm quyết
            định cuối cùng.
          </p>
          <form onSubmit={save} className="mt-5">
            <fieldset disabled={mutation.isPending} className="space-y-4">
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  htmlFor="interview-decision"
                >
                  Kết quả
                </label>
                <Controller
                  control={form.control}
                  name="decision"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger
                        id="interview-decision"
                        className="min-h-11 rounded-2xl"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVED">Phê duyệt</SelectItem>
                        <SelectItem value="NEEDS_REVISION">
                          Yêu cầu bổ sung hồ sơ
                        </SelectItem>
                        <SelectItem value="REJECTED">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <label className="block text-sm font-medium">
                Lý do
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
              <DisclosureCard
                variant="subtle"
                size="sm"
                title="Chi tiết bổ sung"
              >
                <label className="block text-xs font-medium text-muted-foreground">
                  Nội dung chi tiết (JSON)
                  <textarea
                    {...form.register("detailsText")}
                    rows={4}
                    className={`mt-2 font-mono ${fieldClass}`}
                    placeholder={'{"items": ["Minh chứng kinh nghiệm"]}'}
                  />
                </label>
                <FieldError
                  message={form.formState.errors.detailsText?.message}
                />
              </DisclosureCard>
              <Button type="submit" className={`w-full ${actionClass}`}>
                {mutation.isPending ? "Đang lưu…" : "Lưu quyết định"}
              </Button>
            </fieldset>
          </form>
        </>
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
