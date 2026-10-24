"use client";

import { useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { classMembersService as service } from "@workspace/core/lms-classes/members.service";
import { createMemberChangeSchema } from "@workspace/core/lms-classes/schemas";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { ClassListPager } from "./ClassListPager";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { formatClassDate } from "../utils/classes.utils";
import {
  classButton,
  classInput,
  classOutlineButton,
  classPanel,
} from "./classes-ui";

const schema = createMemberChangeSchema.omit({ requestId: true });
const statusPresentation: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ duyệt", className: "border border-accent/40 bg-accent/20 text-warning" },
  APPROVED: { label: "Đã duyệt", className: "border border-secondary/30 bg-secondary/15 text-foreground" },
  REJECTED: { label: "Không được duyệt", className: "border border-destructive/25 bg-destructive/10 text-destructive" },
  CANCELLED: { label: "Đã hủy", className: "border border-border bg-muted text-muted-foreground" },
};
export function MemberChangesPanel({
  classId,
  readOnly,
  creating,
  onCreatingChange: setCreating,
}: {
  classId: string;
  readOnly: boolean;
  /** Create dialog state lives in the screen so its trigger can sit in the page header. */
  creating: boolean;
  onCreatingChange: (open: boolean) => void;
}) {
  const [page, setPage] = useState(1);
  const query = useLmsClassResource(
    classId,
    "member-requests",
    (s) => service.requests(classId, page, s),
    { params: [page] },
  );
  const create = useLmsClassCommand(
    classId,
    (v: z.infer<typeof createMemberChangeSchema>) => service.create(classId, v),
  );
  const cancel = useLmsClassCommand(
    classId,
    (v: { id: string; version: number }) =>
      service.cancel(classId, v.id, v.version),
  );
  const intent = useRef<{ signature: string; id: string } | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { learnerId: "", operation: "ADD", reason: "" },
  });
  const operation = useWatch({ control: form.control, name: "operation" });
  const learnerId = useWatch({ control: form.control, name: "learnerId" });
  const members = useLmsClassResource(
    classId,
    "members-current",
    (s) => service.current(classId, s),
    { enabled: !readOnly && operation === "REMOVE" },
  );
  const submit = (event?: BaseSyntheticEvent) =>
    form.handleSubmit(async (v) => {
      if (readOnly || create.isPending) return;
      const signature = JSON.stringify(v);
      if (!intent.current || intent.current.signature !== signature)
        intent.current = { signature, id: crypto.randomUUID() };
      try {
        await create.mutateAsync({ ...v, requestId: intent.current.id });
        intent.current = null;
        form.reset();
        setCreating(false);
        toast.success("Đã gửi yêu cầu", {
          description: "Thành viên chỉ thay đổi sau khi tư vấn viên duyệt.",
        });
      } catch {
        toast.error("Chưa gửi được yêu cầu", {
          description:
            "Kiểm tra mã học viên và điều kiện tham gia lớp, rồi thử lại.",
        });
      }
    })(event);
  async function cancelRequest(id: string, version: number) {
    try {
      await cancel.mutateAsync({ id, version });
      toast.success("Đã hủy yêu cầu");
    } catch {
      toast.error("Chưa hủy được yêu cầu", {
        description: "Tải lại phiên bản mới khi yêu cầu đã thay đổi.",
      });
    }
  }
  return (
    <section aria-labelledby="member-changes-title" className={`${classPanel} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-muted text-primary"><ClipboardDocumentListIcon className="size-5" aria-hidden="true" /></span>
          <h2 id="member-changes-title" className="font-lms text-lg font-extrabold text-foreground">Yêu cầu thay đổi thành viên</h2>
        </div>
      </div>
      <Dialog open={creating} onOpenChange={(open) => { if (!create.isPending) setCreating(open); }}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl">
          <DialogHeader><DialogTitle>Thay đổi thành viên</DialogTitle><DialogDescription>Yêu cầu sẽ được gửi tư vấn viên xét duyệt trước khi cập nhật danh sách lớp.</DialogDescription></DialogHeader>
        <form
          onSubmit={submit}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label className="grid gap-1 text-xs font-bold">
            {operation === "REMOVE"
              ? "Học viên hiện tại"
              : "Mã học viên"}
            {operation === "REMOVE" ? (
              <ClassFilterSelect
                value={learnerId || "none"}
                disabled={
                  create.isPending || members.loading || Boolean(members.error)
                }
                onValueChange={(v) =>
                  form.setValue("learnerId", v === "none" ? "" : v, {
                    shouldDirty: true,
                  })
                }
                options={[
                  {
                    value: "none",
                    label: members.loading ? "Đang tải..." : "Chọn học viên",
                  },
                  ...(members.data ?? []).map((m) => ({
                    value: m.learnerId,
                    label: `${m.displayName ?? "Học viên chưa có tên"}${m.accountCode ? ` · ${m.accountCode}` : ""}`,
                  })),
                ]}
              />
            ) : (
              <input
                className={classInput}
                placeholder="Dán mã học viên đầy đủ"
                {...form.register("learnerId")}
                disabled={create.isPending}
              />
            )}
            {operation === "REMOVE" && members.error && (
              <span role="alert">
                Chưa đọc được thành viên. Tải lại trang để kiểm tra quyền.
              </span>
            )}
          </label>
          <label className="grid gap-1 text-xs font-bold">
            Thao tác
            <ClassFilterSelect
              value={operation}
              disabled={create.isPending}
              onValueChange={(v) => {
                form.setValue("operation", v === "REMOVE" ? "REMOVE" : "ADD");
                form.setValue("learnerId", "");
              }}
              options={[
                { value: "ADD", label: "Thêm học viên" },
                { value: "REMOVE", label: "Rút học viên" },
              ]}
            />
          </label>
          <label className="grid gap-1 text-xs font-bold sm:col-span-2">
            Lý do
            <textarea
              className={`${classInput} h-20`}
              maxLength={1000}
              {...form.register("reason")}
              disabled={create.isPending}
            />
          </label>
          {Object.keys(form.formState.errors).length > 0 && (
            <p role="alert" className="text-sm text-destructive sm:col-span-2">
              Nhập mã học viên đầy đủ và lý do (tối đa 1.000 ký tự).
            </p>
          )}
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Yêu cầu chỉ có hiệu lực sau khi tư vấn viên duyệt. Với lớp nhóm, học viên cần hoàn tất học thử và điều kiện thanh toán.
          </p>
          <div className="flex flex-wrap justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" className={classOutlineButton} disabled={create.isPending} onClick={() => setCreating(false)}>Đóng</Button><Button className={classButton} disabled={create.isPending}>Gửi tư vấn viên</Button></div>
        </form>
        </DialogContent>
      </Dialog>
      {query.loading ? (
        <p role="status">Đang tải yêu cầu...</p>
      ) : query.error ? (
        <ClassQueryErrorState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {query.data?.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-muted text-primary">
                      {request.operation === "REMOVE" ? (
                        <ArrowDownCircleIcon
                          className="size-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowUpCircleIcon
                          className="size-5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground">
                        {request.operation === "ADD"
                          ? "Thêm học viên"
                          : request.operation === "REMOVE"
                            ? "Rút học viên"
                            : "Thao tác chưa xác định"}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatClassDate(request.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      statusPresentation[request.status ?? ""]?.className ??
                      "border border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {statusPresentation[request.status ?? ""]?.label ??
                      "Đang xử lý"}
                  </span>
                </div>
                <div className="mt-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3.5">
                  <p className="text-sm leading-relaxed text-foreground">
                    {request.reason}
                  </p>
                </div>
                {request.reviewNote && (
                  <div className="mt-3 rounded-xl border border-border bg-muted px-3.5 py-2.5 text-xs text-foreground">
                    <span className="font-bold text-primary">Phản hồi:</span>{" "}
                    {request.reviewNote}
                  </div>
                )}
                {!readOnly && request.status === "PENDING" && (
                  <Button
                    variant="outline"
                    className="mt-3 min-h-9 rounded-xl border-border bg-card px-3 text-xs font-bold text-muted-foreground transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                    disabled={cancel.isPending}
                    onClick={() =>
                      void cancelRequest(request.id, request.version)
                    }
                  >
                    Hủy yêu cầu chờ duyệt
                  </Button>
                )}
              </article>
            ))}
          </div>
          {!query.data?.length && (
            <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-10 text-center shadow-soft">
              <ClipboardDocumentListIcon
                className="mx-auto size-8 text-muted-foreground/60"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-bold text-foreground">
                Chưa có yêu cầu thay đổi thành viên
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Các đề xuất thêm hoặc rút học viên gửi tư vấn viên sẽ hiển thị tại đây.
              </p>
            </div>
          )}
          <ClassListPager page={page} hasNext={(query.data?.length ?? 0) >= 20} label="Phân trang yêu cầu thành viên" onPageChange={setPage} />
        </>
      )}
    </section>
  );
}
