"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
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
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  Avatar,
  buttonClass,
  Chip,
  EmptyState,
  fieldClass,
  formatDate,
  ListSkeleton,
  panelClass,
  RadioCards,
  SectionTitle,
  shortId,
} from "./ClassUi";

const operationLabels: Record<string, string> = {
  ADD: "Thêm học viên vào lớp",
  REMOVE: "Cho học viên rời lớp",
};
const decisions = [
  {
    value: "APPROVE",
    label: "Chấp thuận",
    hint: "Áp dụng thay đổi vào lớp.",
    icon: CheckCircleIcon,
  },
  {
    value: "REJECT",
    label: "Từ chối",
    hint: "Giữ nguyên danh sách lớp.",
    icon: XCircleIcon,
  },
] as const;

function MemberDecision({
  classId,
  request,
  enabled,
  learnerName,
}: {
  classId: string;
  request: MemberChangeDto;
  enabled: boolean;
  learnerName: string;
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
  const pending = request.status === "PENDING";
  const submit = form.handleSubmit(async (input) => {
    if (!enabled) return;
    try {
      await mutation.mutateAsync(input);
      toast.success("Đã xử lý yêu cầu thành viên");
    } catch {
      toast.error("Chưa duyệt được yêu cầu", {
        description:
          "Cần Consultant được phân công. Nếu báo xung đột, hãy tải lại để lấy phiên bản mới.",
      });
    }
  });
  return (
    <article className={panelClass}>
      <div className="flex items-start gap-3">
        <Avatar name={learnerName} />
        <div className="min-w-0 flex-1">
          <p className="font-bold">{learnerName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(request.requestedAt)}
          </p>
        </div>
        <Chip tone={pending ? "flag" : request.status === "APPROVED" ? "ok" : "neutral"}>
          {pending
            ? "Chờ duyệt"
            : request.status === "APPROVED"
              ? "Đã chấp thuận"
              : request.status === "REJECTED"
                ? "Đã từ chối"
                : request.status}
        </Chip>
      </div>
      <p className="mt-4 text-sm font-extrabold text-primary">
        {operationLabels[request.operation ?? ""] ?? request.operation}
      </p>
      {request.reason && (
        <p className="mt-1.5 rounded-xl bg-muted p-3 text-sm leading-6">
          {request.reason}
        </p>
      )}
      {request.reviewNote && (
        <p className="mt-2 text-sm">
          <strong>Phản hồi: </strong>
          {request.reviewNote}
        </p>
      )}
      {pending && enabled && (
        <form onSubmit={submit} className="mt-4 space-y-3 border-t border-border pt-4">
          <RadioCards
            name={`member-decision-${request.id}`}
            label="Quyết định"
            value={decision}
            disabled={mutation.isPending}
            onChange={(value) => form.setValue("decision", value)}
            options={[...decisions]}
          />
          <label className="block text-sm font-medium">
            Ghi chú{decision === "REJECT" ? " (bắt buộc)" : ""}
            <input
              maxLength={1000}
              {...form.register("note")}
              disabled={mutation.isPending}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          {form.formState.errors.note && (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.note.message}
            </p>
          )}
          <Button className={`w-full ${buttonClass}`} disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu…" : "Xác nhận quyết định"}
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
    return <ListSkeleton />;
  if (error)
    return (
      <div role="alert" className={panelClass}>
        <p className="flex items-center gap-2 font-bold text-destructive">
          <ExclamationCircleIcon className="size-5" aria-hidden="true" />
          Không xem được thành viên của lớp
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Chỉ Consultant được phân công mới xem và duyệt được lớp này.
        </p>
        <Button variant="outline" className={`mt-4 ${buttonClass}`} onClick={reload}>
          Tải lại
        </Button>
      </div>
    );
  const editable = ["ACTIVE", "UPCOMING"].includes(overview.data?.status ?? "");
  const names = new Map<string, string>();
  for (const m of history.data ?? []) if (m.name) names.set(m.learnerId, m.name);
  for (const m of members.data ?? [])
    if (m.displayName) names.set(m.learnerId, m.displayName);
  const nameOf = (id: string) => names.get(id) ?? `Học viên ${shortId(id)}`;
  const pendingCount =
    requests.data?.filter((item) => item.status === "PENDING").length ?? 0;
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle
          aside={
            pendingCount > 0 ? (
              <Chip tone="flag">{pendingCount} yêu cầu chờ duyệt</Chip>
            ) : undefined
          }
        >
          Yêu cầu thay đổi thành viên
        </SectionTitle>
        {!editable && (
          <p className="mt-3 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            Lớp không còn hoạt động nên chỉ xem, không duyệt thêm được.
          </p>
        )}
        {requests.data?.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {requests.data.map((r) => (
              <MemberDecision
                key={`${r.id}:${r.version}`}
                classId={classId}
                request={r}
                enabled={editable}
                learnerName={nameOf(r.learnerId)}
              />
            ))}
          </div>
        ) : (
          <div className={`${panelClass} mt-4 !p-0`}>
            <EmptyState icon={UserGroupIcon} title="Chưa có yêu cầu nào">
              Khi gia sư xin thêm hoặc cho học viên rời lớp, yêu cầu sẽ hiện ở
              đây.
            </EmptyState>
          </div>
        )}
        {(page > 1 || (requests.data?.length ?? 0) >= 20) && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className={buttonClass}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              className={buttonClass}
              disabled={(requests.data?.length ?? 0) < 20}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </section>
      <section className={panelClass}>
        <SectionTitle
          aside={<Chip>{members.data?.length ?? 0} học viên</Chip>}
        >
          Học viên đang học
        </SectionTitle>
        {members.data?.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {members.data.map((m) => (
              <li
                key={m.enrollmentId}
                className="flex items-center gap-3 rounded-2xl border border-border p-3"
              >
                <Avatar name={m.displayName} src={m.avatarUrl} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {m.displayName ?? `Học viên ${shortId(m.learnerId)}`}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[m.level, `Tham gia ${formatDate(m.joinedAt)}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Lớp chưa có học viên.
          </p>
        )}
        {!!history.data?.length && (
          <DisclosureCard
            title="Lịch sử tham gia"
            variant="subtle"
            size="sm"
            className="mt-4"
          >
            <ul className="space-y-2 text-sm">
              {history.data.map((m) => (
                <li key={m.enrollmentId} className="flex justify-between gap-3">
                  <span>{m.name ?? nameOf(m.learnerId)}</span>
                  <Chip tone={m.leftAt ? "neutral" : "ok"}>
                    {m.leftAt ? "Đã rời lớp" : "Đang tham gia"}
                  </Chip>
                </li>
              ))}
            </ul>
          </DisclosureCard>
        )}
      </section>
    </div>
  );
}
