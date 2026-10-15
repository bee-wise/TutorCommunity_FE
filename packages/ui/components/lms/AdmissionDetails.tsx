"use client";

import { useState } from "react";
import type { GroupAdmissionController } from "@workspace/core/lms-classes/useGroupAdmission";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import { Button } from "../ui/button";
import { AdmissionTutorActions } from "./AdmissionTutorActions";
import { Input } from "../ui/input";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
const money = (v: number | null | undefined) =>
  v == null ? "Chưa chốt" : `${new Intl.NumberFormat("vi-VN").format(v)}đ`;
const date = (v: string | null | undefined) =>
  v
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(v))
    : "Chưa có";
const displayId = (value: string, compact: boolean) =>
  (compact ? value.slice(-8) : value).toUpperCase();
const tutorStatusLabels: Record<string, string> = {
  REFERRED: "Đã giới thiệu",
  TRIAL_PROPOSED: "Đã đề xuất học thử",
  TRIAL_CONFIRMED: "Đã xác nhận học thử",
  TRIAL_COMPLETED: "Đã học thử",
  ENROLLED: "Đã vào lớp",
  LEFT: "Đã rời lớp",
  CANCELLED: "Đã hủy",
  REJECTED: "Không được duyệt",
};
const feeStatusLabels: Record<string, string> = {
  PROPOSED: "Đã đề xuất",
  ACCEPTED: "Đã chấp nhận",
  APPROVED: "Đã duyệt",
  REJECTED: "Không được duyệt",
  PAID: "Đã thanh toán",
};
export function AdmissionDetails({
  controller,
  compactTutorView = false,
}: {
  controller: GroupAdmissionController;
  compactTutorView?: boolean;
}) {
  const { query, run, pay, busy, payment, message } = controller;
  const [paymentMonth, setPaymentMonth] = useState("");
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  if (query.loading) return <p role="status">Đang tải đăng ký...</p>;
  if (query.error || !query.data)
    return (
      <div role="alert" className="space-y-3">
        <p>Không đọc được đăng ký hoặc không có quyền.</p>
        <Button
          variant="outline"
          className={button}
          onClick={() => void query.refetch()}
        >
          Tải lại
        </Button>
      </div>
    );
  const data = query.data,
    role = query.actor.role,
    fee = data.firstMonthFee;
  const terminal = ["CANCELLED", "REJECTED", "ENROLLED", "LEFT"].includes(
    data.status ?? "",
  );
  const action = (
    type:
      | "confirmTrial"
      | "completeTrial"
      | "acknowledgeMissed"
      | "cancel"
      | "acceptFee",
  ) => void run({ type, version: data.version });
  const checkout = safeExternalUrl(payment?.checkoutUrl);
  return (
    <section ref={setPortalContainer} className={compactTutorView ? "space-y-5" : "space-y-5 rounded-3xl border border-border bg-card p-5 shadow-soft"}>
      <h2 className="font-nunito text-lg font-extrabold text-primary">
        Đăng ký tham gia lớp
      </h2>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">
          {compactTutorView ? tutorStatusLabels[data.status ?? ""] ?? "Đang xử lý" : data.status ?? "Chưa xác định"}
        </span>
        {!compactTutorView && <span className="text-xs">Phiên bản {data.version}</span>}
      </div>
      <p className="text-xs text-muted-foreground">
        Mã đăng ký {displayId(data.id, compactTutorView)} · Mã học viên {displayId(data.learnerId, compactTutorView)}
      </p>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">
            Học thử (giờ Việt Nam)
          </dt>
          <dd className="text-sm">
            {date(data.trialStartAt)} - {date(data.trialEndAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Hoàn thành học thử</dt>
          <dd className="text-sm">{date(data.trialCompletedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Phí tháng tham gia {fee?.month ?? ""}
          </dt>
          <dd className="font-bold">
            {money(fee?.amount)} ({compactTutorView && fee?.status ? feeStatusLabels[fee.status] ?? "Đang xử lý" : fee?.status ?? "Chưa có báo giá"})
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{compactTutorView ? "Phân bổ học phí" : "Snapshot BE"}</dt>
          <dd className="text-sm">
            Nền tảng {money(fee?.platformFeeAmount)} / Gia sư{" "}
            {money(fee?.tutorAmount)}
          </dd>
        </div>
      </dl>
      {data.missedSessionIds.length > 0 && (
        <p className="rounded-2xl border border-border p-3 text-sm">
          Có {data.missedSessionIds.length} buổi đã bỏ lỡ.{" "}
          {data.missedLessonsAcknowledgedAt
            ? "Đã xác nhận."
            : "Cần học viên xác nhận trước các bước tiếp theo."}
        </p>
      )}
      {role === "TUTOR" && !terminal && (
        <AdmissionTutorActions data={data} busy={busy} run={run} portalContainer={portalContainer} />
      )}
      {role === "LEARNER" && !terminal && (
        <div className="flex flex-wrap gap-2">
          {data.status === "TRIAL_PROPOSED" && (
            <Button
              className={button}
              disabled={busy}
              onClick={() => action("confirmTrial")}
            >
              Đồng ý lịch học thử
            </Button>
          )}
          {data.missedSessionIds.length > 0 &&
            !data.missedLessonsAcknowledgedAt && (
              <Button
                variant="outline"
                className={button}
                disabled={busy}
                onClick={() => action("acknowledgeMissed")}
              >
                Xác nhận buổi bỏ lỡ
              </Button>
            )}
          {fee?.amount != null && !fee.acceptedAt && (
            <Button
              className={button}
              disabled={busy}
              onClick={() => action("acceptFee")}
            >
              Đồng ý báo giá tháng này
            </Button>
          )}
          <Button
            variant="outline"
            className={button}
            disabled={busy}
            onClick={() => action("cancel")}
          >
            Hủy đăng ký
          </Button>
        </div>
      )}
      {role === "CONSULTANT" && !terminal && fee?.acceptedAt && !fee.reviewedAt && (
        <div className="flex flex-wrap gap-2">
          {(["APPROVE", "REJECT"] as const).map((decision) => (
            <Button
              key={decision}
              variant={decision === "APPROVE" ? "default" : "outline"}
              className={button}
              disabled={busy}
              onClick={() =>
                void run({
                  type: "reviewFee",
                  input: { expectedVersion: data.version, decision },
                })
              }
            >
              {decision === "APPROVE" ? "Duyệt báo giá" : "Từ chối báo giá"}
            </Button>
          ))}
        </div>
      )}
      {role === "LEARNER" &&
        (!terminal || data.status === "ENROLLED") &&
        data.trialCompletedAt && (
          <div className="space-y-3">
            <p className="text-sm">
              Thanh toán không tự cấp quyền vào lớp; vẫn cần Consultant duyệt
              ADD. Đổi tháng có thể cần báo giá/xác nhận lại. Tháng sau ENROLLED
              dùng lịch/giá thường, không tự gia hạn.
            </p>
            <label className="grid max-w-xs gap-1 text-xs">
              Tháng cần thanh toán (để trống nếu FULL_COURSE)
              <Input
                type="month"
                value={paymentMonth}
                onChange={(e) => setPaymentMonth(e.target.value)}
              />
            </label>
            <Button
              className={button}
              disabled={
                busy ||
                ["PENDING", "RECONCILIATION"].includes(payment?.status ?? "") ||
                (data.status !== "ENROLLED" && payment?.status === "PAID")
              }
              onClick={() =>
                void pay(paymentMonth ? `${paymentMonth}-01` : null)
              }
            >
              Tạo yêu cầu thanh toán
            </Button>
          </div>
        )}
      {payment && (
        <div className="space-y-3 rounded-2xl border border-border p-4">
          <p className="font-bold">
            {money(payment.amount)} · {payment.status}
          </p>
          <p className="text-xs">
            Snapshot: nền tảng {money(payment.platformFeeAmount)}, gia sư{" "}
            {money(payment.tutorAmount)}
          </p>
          <div className="flex flex-wrap gap-2">
            {checkout && payment.status === "PENDING" && (
              <Button asChild className={button}>
                <a href={checkout} target="_blank" rel="noopener noreferrer">
                  Mở checkout
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className={button}
              disabled={busy}
              onClick={() => void controller.refreshPayment()}
            >
              Cập nhật thanh toán
            </Button>
          </div>
        </div>
      )}
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
      <Button
        variant="outline"
        className={button}
        disabled={busy}
        onClick={() => void query.refetch()}
      >
        Tải lại trạng thái
      </Button>
    </section>
  );
}
