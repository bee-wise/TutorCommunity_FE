"use client";
import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import type { LearnerAdmission } from "../services/learner-admissions.service";
import type { useLearnerAdmission } from "../hooks/useLearnerAdmission";
import { learnerAction } from "../../learner-classes/components/LearnerApiClassCard";

export const learnerMoney = (v: number | null | undefined) =>
  v == null
    ? "Chưa có báo giá"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(v);
export function LearnerAdmissionPayment({
  data,
  controller,
}: {
  data: LearnerAdmission;
  controller: ReturnType<typeof useLearnerAdmission>;
}) {
  const [month, setMonth] = useState(""),
    { busy, paymentQuery } = controller,
    payment = paymentQuery.data;
  const checkout = safeExternalUrl(payment?.checkoutUrl);
  const terminal = ["CANCELLED", "LEFT", "REJECTED"].includes(
    data.status ?? "",
  );
  const ready =
    Boolean(data.trialCompletedAt) ||
    (Boolean(data.referredByTutorId) && !data.trialRequested);
  return (
    <section className="space-y-4 border-t border-border pt-5">
      <h3 className="font-bold text-foreground">Thanh toán học phí</h3>
      {!terminal && ready && (
        <>
          <p className="text-sm text-muted-foreground">
            Chỉ tạo thanh toán khi bạn chủ động xác nhận. Lớp MONTHLY chọn
            tháng; FULL_COURSE để trống. BE kiểm tra học thử, báo giá và quyền.
            Không tự gia hạn hoặc trừ tiền.
          </p>
          <label className="grid max-w-xs gap-1.5 text-xs font-bold">
            Tháng thanh toán (MONTHLY)
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="min-h-11 rounded-2xl"
              disabled={busy}
            />
          </label>
          <Button
            className={learnerAction}
            disabled={
              busy ||
              Boolean(
                payment &&
                  ["PENDING", "RECONCILIATION"].includes(payment.status ?? ""),
              ) ||
              (data.status !== "ENROLLED" && payment?.status === "PAID") ||
              Boolean(
                data.missedSessionIds.length &&
                  !data.missedLessonsAcknowledgedAt,
              )
            }
            onClick={() => void controller.pay(month ? `${month}-01` : null)}
          >
            Tạo yêu cầu thanh toán
          </Button>
        </>
      )}
      {paymentQuery.loading && <p role="status">Đang đọc thanh toán...</p>}
      {paymentQuery.error && (
        <p role="alert" className="text-sm text-destructive">
          Không đọc được thanh toán hoặc thanh toán không thuộc đăng ký này.
        </p>
      )}
      {payment && (
        <div className="space-y-3 rounded-2xl border border-border p-4">
          <p className="font-lms text-xl font-extrabold text-primary">
            {learnerMoney(payment.amount)}
          </p>
          <p className="text-sm font-bold">
            {payment.status ?? "Chưa xác định"}
          </p>
          <p className="text-xs text-muted-foreground">
            Phân bổ từ BE: nền tảng {learnerMoney(payment.platformFeeAmount)},
            gia sư {learnerMoney(payment.tutorAmount)}.
          </p>
          <div className="flex flex-wrap gap-2">
            {checkout && payment.status === "PENDING" && !terminal && (
              <Button asChild className={learnerAction}>
                <a href={checkout} target="_blank" rel="noopener noreferrer">
                  Mở checkout
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className={learnerAction}
              disabled={busy}
              onClick={() => void controller.refreshPayment()}
            >
              Kiểm tra thanh toán
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
