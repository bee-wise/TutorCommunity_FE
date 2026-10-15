"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classMembersService as service } from "@workspace/core/lms-classes/members.service";
import {
  reviewMemberChangeSchema,
  type MemberChangeDto,
} from "@workspace/core/lms-classes/schemas";
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

const panel =
  "space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft";
const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
function MemberDecision({
  classId,
  request,
  enabled,
}: {
  classId: string;
  request: MemberChangeDto;
  enabled: boolean;
}) {
  const form = useForm<z.infer<typeof reviewMemberChangeSchema>>({
    resolver: zodResolver(reviewMemberChangeSchema),
    defaultValues: {
      expectedVersion: request.version,
      decision: "APPROVE",
      note: "",
    },
  });
  const mutation = useLmsClassCommand(
    classId,
    (input: z.infer<typeof reviewMemberChangeSchema>) =>
      service.review(classId, request.id, input),
    ["CONSULTANT"],
  );
  const decision = useWatch({ control: form.control, name: "decision" });
  const submit = form.handleSubmit(async (input) => {
    if (!enabled) return;
    try {
      await mutation.mutateAsync(input);
      toast.success("Đã xử lý yêu cầu thành viên");
    } catch {
      toast.error("Chưa duyệt được yêu cầu", {
        description:
          "Cần Consultant được phân công. Khi 409, tải lại phiên bản mới; không tự hoàn tiền.",
      });
    }
  });
  return (
    <article className={panel}>
      <h3 className="font-bold">
        {request.operation} · {request.status}
      </h3>
      <p className="break-all text-xs">Học viên {request.learnerId}</p>
      <p className="text-sm">{request.reason}</p>
      {request.reviewNote && (
        <p className="text-sm">Phản hồi: {request.reviewNote}</p>
      )}
      {request.status === "PENDING" && enabled && (
        <form onSubmit={submit} className="space-y-3">
          <label className="grid gap-1 text-xs font-bold">
            Quyết định
            <Select
              value={decision}
              onValueChange={(v) =>
                form.setValue("decision", v === "REJECT" ? "REJECT" : "APPROVE")
              }
              disabled={mutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVE">Chấp thuận</SelectItem>
                <SelectItem value="REJECT">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1 text-xs font-bold">
            Ghi chú (bắt buộc khi từ chối)
            <Input
              maxLength={1000}
              {...form.register("note")}
              disabled={mutation.isPending}
            />
          </label>
          {form.formState.errors.note && (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.note.message}
            </p>
          )}
          <Button className={button} disabled={mutation.isPending}>
            Xác nhận quyết định
          </Button>
        </form>
      )}
    </article>
  );
}
export function MemberReviewPanel({ classId }: { classId: string }) {
  const [page, setPage] = useState(1);
  const overview = useLmsClassResource(
    classId,
    "overview",
    (s) => service.overview(classId, s),
    { roles: ["CONSULTANT"] },
  );
  const members = useLmsClassResource(
    classId,
    "members-current",
    (s) => service.current(classId, s),
    { roles: ["CONSULTANT"] },
  );
  const history = useLmsClassResource(
    classId,
    "members-history",
    (s) => service.history(classId, s),
    { roles: ["CONSULTANT"] },
  );
  const requests = useLmsClassResource(
    classId,
    "member-requests",
    (s) => service.requests(classId, page, s),
    { roles: ["CONSULTANT"], params: [page] },
  );
  const error =
    overview.error ?? members.error ?? history.error ?? requests.error;
  const reload = () => {
    void overview.refetch();
    void members.refetch();
    void history.refetch();
    void requests.refetch();
  };
  if (
    overview.loading ||
    members.loading ||
    history.loading ||
    requests.loading
  )
    return <p role="status">Đang tải thành viên và yêu cầu...</p>;
  if (error)
    return (
      <div role="alert" className={panel}>
        <p>
          Không xem được lớp. Chỉ Consultant được phân công có quyền xem/duyệt.
        </p>
        <Button variant="outline" className={button} onClick={reload}>
          Tải lại
        </Button>
      </div>
    );
  const editable = ["ACTIVE", "UPCOMING"].includes(overview.data?.status ?? "");
  return (
    <section className="space-y-4">
      <h2 className="font-nunito text-xl font-extrabold text-primary">
        Thành viên & yêu cầu
      </h2>
      <p className="text-sm">
        {members.data?.length ?? 0} học viên hiện tại. PENDING chưa đổi quyền;
        REMOVE được duyệt giữ lịch sử, không tự refund.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {members.data?.map((m) => (
          <article key={m.enrollmentId} className={panel}>
            <h3 className="font-bold">{m.displayName ?? "Chưa có tên"}</h3>
            <p className="break-all text-xs">{m.learnerId}</p>
            <p className="text-xs">{m.level ?? "Chưa có cấp/lớp"}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {requests.data?.map((r) => (
          <MemberDecision
            key={`${r.id}:${r.version}`}
            classId={classId}
            request={r}
            enabled={editable}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={button}
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          className={button}
          disabled={(requests.data?.length ?? 0) < 20}
          onClick={() => setPage((p) => p + 1)}
        >
          Sau
        </Button>
      </div>
      <section className={panel}>
        <h3 className="font-bold">Lịch sử tham gia</h3>
        {history.data?.map((m) => (
          <p key={m.enrollmentId} className="text-sm">
            {m.name ?? m.learnerId}: {m.leftAt ? "Đã rời lớp" : "Đang tham gia"}
          </p>
        ))}
      </section>
    </section>
  );
}
