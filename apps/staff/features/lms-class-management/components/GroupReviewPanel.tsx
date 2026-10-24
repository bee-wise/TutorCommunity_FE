"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { reviewGroupSchema } from "@workspace/core/lms-classes/group.schemas";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  billingLabels,
  buttonClass,
  Chip,
  fieldClass,
  formatDate,
  ListSkeleton,
  modeLabels,
  money,
  panelClass,
  RadioCards,
  SectionTitle,
  StatusChip,
} from "./ClassUi";

const decisions = [
  {
    value: "APPROVE",
    label: "Duyệt lớp",
    hint: "Lớp được mở tuyển sinh.",
    icon: CheckCircleIcon,
  },
  {
    value: "REQUEST_CHANGES",
    label: "Yêu cầu chỉnh sửa",
    hint: "Gia sư sửa lại rồi gửi duyệt.",
    icon: PencilSquareIcon,
  },
  {
    value: "REJECT",
    label: "Từ chối",
    hint: "Lớp không được mở.",
    icon: XCircleIcon,
  },
] as const;

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
  if (query.loading) return <ListSkeleton rows={2} />;
  if (query.error || !query.data)
    return (
      <div role="alert" className={panelClass}>
        <p className="flex items-center gap-2 font-bold text-destructive">
          <ExclamationCircleIcon className="size-5" aria-hidden="true" />
          Không xem được thông tin lớp
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Lớp không tồn tại hoặc bạn chưa được phân công duyệt lớp này.
        </p>
        <Button
          variant="outline"
          className={`mt-4 ${buttonClass}`}
          onClick={() => void query.refetch()}
        >
          Tải lại
        </Button>
      </div>
    );
  const data = query.data;
  const canReview =
    data.approvalStatus === "PENDING" &&
    data.assignedConsultantId === query.actor.id;
  const facts = [
    { label: "Hình thức", value: modeLabels[data.teachingMode ?? ""] ?? data.teachingMode },
    { label: "Sĩ số tối đa", value: `${data.capacity} học viên` },
    {
      label: "Số buổi",
      value: `${data.numberOfSessions} × ${data.sessionDurationMinutes} phút`,
    },
    { label: "Học phí / buổi", value: money(data.pricePerSession) },
    { label: "Tổng học phí", value: money(data.totalAmount) },
    { label: "Khai giảng", value: formatDate(data.openingAt) },
  ];
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        <section className={panelClass}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip value={data.approvalStatus} />
            <Chip>{billingLabels[data.billingMode ?? ""] ?? data.billingMode}</Chip>
            {data.code && <Chip>{data.code}</Chip>}
          </div>
          <h2 className="mt-3 font-nunito text-2xl font-extrabold leading-[1.2]">
            {data.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {[data.programName, data.teachingItemName, data.contextName]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-muted p-3.5">
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-sm font-bold tabular-nums">
                  {fact.value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
          {data.location && (
            <p className="mt-3 text-sm">
              <strong>Địa điểm: </strong>
              {data.location}
            </p>
          )}
          {data.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
              {data.description}
            </p>
          )}
          {data.approvalNote && (
            <p className="mt-4 rounded-xl bg-highlight p-3 text-sm">
              <strong>Ghi chú duyệt trước đó: </strong>
              {data.approvalNote}
            </p>
          )}
        </section>
        <section className={panelClass}>
          <SectionTitle
            aside={<Chip>{data.roadmap.length} giai đoạn</Chip>}
          >
            Lộ trình học
          </SectionTitle>
          {data.roadmap.length ? (
            <div className="mt-4 space-y-3">
              {data.roadmap.map((stage, index) => (
                <DisclosureCard
                  key={stage.id}
                  variant="outline"
                  defaultOpen={index === 0}
                  title={`${index + 1}. ${stage.title}`}
                  description={
                    stage.objective ? stage.objective : undefined
                  }
                  badge={<Chip>{stage.lessons.length} bài</Chip>}
                >
                  <ol className="space-y-2">
                    {stage.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex gap-3 rounded-xl bg-muted p-3 text-sm"
                      >
                        <span className="font-bold text-primary tabular-nums">
                          {lesson.order}
                        </span>
                        <span>
                          <span className="font-semibold">{lesson.title}</span>
                          {lesson.content && (
                            <span className="mt-0.5 block text-muted-foreground">
                              {lesson.content}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </DisclosureCard>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Gia sư chưa xây dựng lộ trình.
            </p>
          )}
        </section>
      </div>
      <aside className={`${panelClass} border-primary xl:sticky xl:top-24`}>
        <h2 className="font-nunito text-lg font-extrabold">Quyết định duyệt</h2>
        {!canReview ? (
          <p className="mt-3 rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
            {data.approvalStatus !== "PENDING"
              ? "Lớp này không còn ở trạng thái chờ duyệt."
              : "Chỉ Consultant được phân công mới duyệt được lớp này."}
          </p>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={submit}>
            <RadioCards
              name="group-decision"
              label="Quyết định"
              value={decision}
              disabled={mutation.isPending}
              onChange={(value) => form.setValue("decision", value)}
              options={[...decisions]}
            />
            <label className="block text-sm font-medium">
              Lý do{decision === "APPROVE" ? " (không bắt buộc)" : ""}
              <textarea
                {...form.register("reason")}
                rows={3}
                maxLength={1000}
                disabled={mutation.isPending}
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            {form.formState.errors.reason && (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.reason.message}
              </p>
            )}
            <Button
              className={`w-full ${buttonClass}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang lưu…" : "Xác nhận quyết định"}
            </Button>
          </form>
        )}
      </aside>
    </div>
  );
}
