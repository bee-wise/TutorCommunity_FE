"use client";

import { useState } from "react";
import { useInterviewPoliciesQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import {
  useInterviewPolicyForm,
  useStaffInterviewMutation,
} from "../hooks/useInterviewActions";
import {
  actionClass,
  fieldClass,
  FieldError,
  InterviewQueryState,
  panelClass,
} from "./InterviewUi";
import { InterviewAudit } from "./InterviewAudit";

export function InterviewPolicies() {
  const query = useInterviewPoliciesQuery();
  const { form, mutation, save } = useInterviewPolicyForm(query.data?.map((item) => item.version));
  const [activation, setActivation] = useState("");
  const [audit, setAudit] = useState("");
  const activate = useStaffInterviewMutation(
    interviewApi.activatePolicy,
    "Đã áp dụng quy định mới.",
  );
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
      <div className="space-y-5">
        <InterviewQueryState
          pending={query.isPending}
          error={query.error}
          retry={() => void query.refetch()}
        />
        {query.data?.length === 0 && (
          <p className={panelClass}>
            Chưa có quy định. Tạo phiên bản đầu tiên để gia sư có thể xác nhận.
          </p>
        )}
        {query.data?.map((item) => (
          <article key={item.version} className={panelClass}>
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="font-bold">Quy định {item.version}</h2>
              <span
                className={`rounded-full border border-border px-3 py-1 text-xs font-bold ${item.is_active ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {item.is_active ? "Đang áp dụng" : "Chưa áp dụng"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleString("vi-VN")}
            </p>
            <DisclosureCard
              variant="subtle"
              size="sm"
              title="Nội dung và câu xác nhận"
              className="mt-4"
            >
              <p className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-7">
                {item.content}
              </p>
              <p className="mt-4 rounded-2xl bg-background p-4 text-sm border border-border">
                {item.confirmation_text}
              </p>
            </DisclosureCard>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={actionClass}
                disabled={item.is_active || activate.isPending}
                onClick={() => setActivation(item.version)}
              >
                Áp dụng
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={actionClass}
                disabled={mutation.isPending}
                onClick={() => {
                  form.reset({ version: "", content: item.content, confirmation_text: item.confirmation_text });
                  form.setFocus("version");
                }}
              >
                Sao chép để sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={actionClass}
                onClick={() => setAudit(item.version)}
              >
                Lịch sử
              </Button>
            </div>
          </article>
        ))}
        {audit && <InterviewAudit key={audit} entity="policy" id={audit} />}
      </div>
      <section className={panelClass}>
        <h2 className="text-lg font-bold">Tạo phiên bản quy định</h2>

        <form onSubmit={save} className="mt-5">
          <fieldset disabled={mutation.isPending} className="space-y-4">
            <label className="block text-sm font-medium">
              Phiên bản
              <input
                {...form.register("version")}
                maxLength={50}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <FieldError message={form.formState.errors.version?.message} />
            <label className="block text-sm font-medium">
              Nội dung quy định
              <textarea
                {...form.register("content")}
                maxLength={100000}
                rows={9}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <FieldError message={form.formState.errors.content?.message} />
            <label className="block text-sm font-medium">
              Câu xác nhận của gia sư
              <textarea
                {...form.register("confirmation_text")}
                maxLength={4000}
                rows={3}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <FieldError
              message={form.formState.errors.confirmation_text?.message}
            />
            <Button type="submit" className={actionClass}>
              {mutation.isPending ? "Đang tạo…" : "Tạo quy định"}
            </Button>
          </fieldset>
        </form>
      </section>
      <Dialog
        open={Boolean(activation)}
        onOpenChange={(open) => {
          if (!open && !activate.isPending) setActivation("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Áp dụng quy định {activation}?</DialogTitle>
            <DialogDescription>
              Gia sư cần đọc và xác nhận bản mới trước lượt phỏng vấn tiếp theo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className={actionClass}
              disabled={activate.isPending}
              onClick={() => setActivation("")}
            >
              Hủy
            </Button>
            <Button
              className={actionClass}
              disabled={activate.isPending}
              onClick={() =>
                activate.mutate(activation, {
                  onSuccess: () => setActivation(""),
                })
              }
            >
              Xác nhận áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
