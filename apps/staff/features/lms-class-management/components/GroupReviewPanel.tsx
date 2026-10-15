"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewGroupSchema } from "@workspace/core/lms-classes/group.schemas";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { toast } from "@workspace/ui/components/ui/bee-toast";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
export function GroupReviewPanel({ classId }: { classId: string }) {
  const query = useLmsClassResource(
    classId,
    "group",
    (s) => service.get(classId, s),
    { roles: ["CONSULTANT"] },
  );
  const mutation = useLmsClassCommand(
    classId,
    (input: z.infer<typeof reviewGroupSchema>) =>
      service.review(classId, input),
    ["CONSULTANT"],
  );
  const form = useForm<z.infer<typeof reviewGroupSchema>>({
    resolver: zodResolver(reviewGroupSchema),
    defaultValues: { expectedVersion: 0, decision: "APPROVE", reason: "" },
  });
  const decision = useWatch({ control: form.control, name: "decision" });
  const submit = form.handleSubmit(async (value) => {
    if (!query.data) return;
    try {
      await mutation.mutateAsync({
        ...value,
        expectedVersion: query.data.version,
      });
      toast.success("Đã xử lý lớp nhóm");
    } catch {
      toast.error("Chưa xử lý được lớp", {
        description: "Cần đúng Consultant, trạng thái và phiên bản mới.",
      });
    }
  });
  if (query.loading) return <p role="status">Đang tải lớp nhóm...</p>;
  if (query.error || !query.data)
    return (
      <p className="text-sm">
        Không có thông tin lớp nhóm hoặc không có quyền.
      </p>
    );
  const data = query.data;
  const canReview =
    data.approvalStatus === "PENDING" &&
    data.assignedConsultantId === query.actor.id;
  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-nunito text-xl font-extrabold text-primary">
        Duyệt lớp nhóm
      </h2>
      <p className="font-bold">{data.title}</p>
      <p className="text-sm">
        {data.approvalStatus} · {data.billingMode} · {data.capacity} học viên
      </p>
      <p className="text-sm">{data.description}</p>
      <div className="space-y-3">
        {data.roadmap.map((s) => (
          <div key={s.id}>
            <h3 className="font-bold">{s.title}</h3>
            <p className="text-sm">{s.objective}</p>
            {s.lessons.map((l) => (
              <p className="text-sm" key={l.id}>
                {l.order}. {l.title}
              </p>
            ))}
          </div>
        ))}
      </div>
      {canReview && (
        <form className="space-y-3" onSubmit={submit}>
          <label className="grid gap-1 text-xs font-bold">
            Quyết định
            <Select
              value={decision}
              onValueChange={(v) =>
                form.setValue(
                  "decision",
                  v === "REJECT"
                    ? "REJECT"
                    : v === "REQUEST_CHANGES"
                      ? "REQUEST_CHANGES"
                      : "APPROVE",
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVE">Duyệt</SelectItem>
                <SelectItem value="REQUEST_CHANGES">
                  Yêu cầu chỉnh sửa
                </SelectItem>
                <SelectItem value="REJECT">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1 text-xs font-bold">
            Lý do (bắt buộc khi từ chối/yêu cầu sửa)
            <Input
              {...form.register("reason")}
              maxLength={1000}
              disabled={mutation.isPending}
            />
          </label>
          {form.formState.errors.reason && (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.reason.message}
            </p>
          )}
          <Button className={button} disabled={mutation.isPending}>
            Xác nhận duyệt
          </Button>
        </form>
      )}
      <Button
        variant="outline"
        className={button}
        onClick={() => void query.refetch()}
      >
        Tải lại
      </Button>
    </section>
  );
}
