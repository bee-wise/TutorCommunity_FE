"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { useLearnerAdmission } from "../hooks/useLearnerAdmission";
import { LearnerClassQueryError } from "../../learner-classes/components/LearnerClassQueryError";
import { learnerAction } from "../../learner-classes/components/LearnerApiClassCard";
import { LearnerWorkspaceSkeleton } from "../../learner-classes/components/LearnerWorkspaceSkeleton";
import { LearnerAdmissionTrial } from "./LearnerAdmissionTrial";
import {
  LearnerAdmissionPayment,
  learnerMoney,
} from "./LearnerAdmissionPayment";

const states: Record<string, string> = {
  REGISTERED: "Đã đăng ký",
  PENDING: "Chờ xử lý",
  TRIAL_PROPOSED: "Chờ đồng ý học thử",
  TRIAL_CONFIRMED: "Đã đồng ý học thử",
  TRIAL_COMPLETED: "Đã học thử",
  ENROLLED: "Đã ghi danh",
  CANCELLED: "Đã hủy",
  LEFT: "Đã rời lớp",
  REJECTED: "Đã từ chối",
};
export function LearnerAdmissionDetails({
  id,
  paymentId,
}: {
  id: string;
  paymentId?: string;
}) {
  const controller = useLearnerAdmission(id, paymentId),
    { query, busy } = controller;
  const [confirmation, setConfirmation] = useState<
    "cancel" | "fee" | "missed" | null
  >(null);
  if (query.loading) return <LearnerWorkspaceSkeleton view="detail" />;
  if (query.error || !query.data)
    return (
      <LearnerClassQueryError
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    );
  const data = query.data,
    late = Boolean(data.referredByTutorId),
    fee = data.firstMonthFee,
    payment = controller.paymentQuery.data;
  const terminal = ["CANCELLED", "LEFT", "REJECTED"].includes(
      data.status ?? "",
    ),
    enrolled = data.status === "ENROLLED";
  const locked = Boolean(
    payment &&
      ["PENDING", "PAID", "RECONCILIATION"].includes(payment.status ?? ""),
  );
  return (
    <section className="space-y-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-nunito text-lg font-extrabold text-primary">
          Theo dõi đăng ký
        </h2>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-primary">
          {states[data.status ?? ""] ?? data.status ?? "Chưa xác định"}
        </span>
      </div>
      <p className="break-all text-xs text-muted-foreground">
        Mã đăng ký {data.id}
      </p>
      <p className="rounded-2xl border border-border p-4 text-sm">
        {late
          ? "Bạn được gia sư giới thiệu vào lớp đã khai giảng. Sau thanh toán xác thực, Tutor gửi yêu cầu ADD và Consultant duyệt trước khi bạn được vào lớp."
          : "Đăng ký trước khai giảng: học thử bắt buộc. Thanh toán xác thực tự tạo enrollment; bạn vào LMS khi lớp được khai giảng."}
      </p>
      {!terminal && !enrolled && (
        <>
          <LearnerAdmissionTrial
            data={data}
            controller={controller}
            locked={locked}
          />
          {data.missedSessionIds.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-bold text-primary">Buổi học đã bỏ lỡ</h3>
              <p className="text-sm">
                Có {data.missedSessionIds.length} buổi trước khi bạn tham gia.{" "}
                {data.missedLessonsAcknowledgedAt
                  ? "Bạn đã xác nhận."
                  : "Cần xác nhận trước khi tiếp tục."}
              </p>
              {!data.missedLessonsAcknowledgedAt && (
                <Button
                  variant="outline"
                  className={learnerAction}
                  disabled={busy}
                  onClick={() => setConfirmation("missed")}
                >
                  Xác nhận buổi bỏ lỡ
                </Button>
              )}
            </section>
          )}
          {late && fee && (
            <section className="space-y-3 rounded-2xl border border-border p-4">
              <h3 className="font-bold text-primary">Phí tháng tham gia</h3>
              <p className="text-sm">Tháng {fee.month}</p>
              <p className="font-nunito text-xl font-extrabold text-primary">
                {learnerMoney(fee.amount)}
              </p>
              <p className="text-sm">
                {fee.status ?? "Chưa chốt"}
                {fee.acceptedAt ? ". Bạn đã đồng ý." : ""}
                {fee.reviewedAt ? " Đã được Consultant xử lý." : ""}
              </p>
              {fee.amount != null && !fee.acceptedAt && (
                <Button
                  className={learnerAction}
                  disabled={busy || locked}
                  onClick={() => setConfirmation("fee")}
                >
                  Đồng ý báo giá
                </Button>
              )}
            </section>
          )}
        </>
      )}
      <LearnerAdmissionPayment data={data} controller={controller} />
      {confirmation && !terminal && !enrolled && (
        <div
          role="alert"
          className="space-y-3 rounded-2xl border border-accent p-4"
        >
          <p className="text-sm font-semibold">
            {confirmation === "cancel"
              ? "Bạn muốn hủy đăng ký này? Thao tác không tự hoàn tiền."
              : confirmation === "fee"
                ? `Bạn đồng ý báo giá ${learnerMoney(fee?.amount)} của tháng ${fee?.month}?`
                : "Bạn đã đọc và xác nhận các buổi học bỏ lỡ?"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              className={learnerAction}
              disabled={busy}
              onClick={() => {
                void controller.run({
                  type:
                    confirmation === "cancel"
                      ? "cancel"
                      : confirmation === "fee"
                        ? "first-month-fee/accept"
                        : "acknowledge-missed",
                });
                setConfirmation(null);
              }}
            >
              Xác nhận
            </Button>
            <Button
              variant="outline"
              className={learnerAction}
              onClick={() => setConfirmation(null)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
      {controller.notice && (
        <p role="status" className="text-sm">
          {controller.notice}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={learnerAction}
          disabled={busy}
          onClick={() => void query.refetch()}
        >
          Tải lại trạng thái
        </Button>
        {!terminal && !enrolled && (
          <Button
            variant="outline"
            className={learnerAction}
            disabled={busy}
            onClick={() => setConfirmation("cancel")}
          >
            Hủy đăng ký
          </Button>
        )}
        {enrolled && (
          <Button asChild variant="outline" className={learnerAction}>
            <Link href="/lms/learner/classes">Về lớp học của tôi</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
