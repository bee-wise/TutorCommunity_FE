"use client";

import { useState } from "react";
import { groupAdmissionsService as service } from "./group.service";
import { useLmsClassResource, useLmsClassCommand } from "./useLmsClassResource";
import { handleApiError } from "../sys-libs/error-handler";

type Action =
  | { type: "proposeTrial"; input: Parameters<typeof service.proposeTrial>[1] }
  | { type: "proposeFee"; input: Parameters<typeof service.proposeFee>[1] }
  | { type: "reviewFee"; input: Parameters<typeof service.reviewFee>[1] }
  | {
      type:
        | "confirmTrial"
        | "completeTrial"
        | "acknowledgeMissed"
        | "cancel"
        | "acceptFee";
      version: number;
    };
export function useGroupAdmission(id: string) {
  const query = useLmsClassResource(
    id,
    "admission",
    (s) => service.get(id, s),
    { roles: ["TUTOR", "LEARNER", "CONSULTANT"] },
  );
  const [paymentSelection, setPaymentSelection] = useState<{
      admissionId: string;
      paymentId: string;
    } | null>(null),
    [message, setMessage] = useState("");
  const paymentId =
    paymentSelection?.admissionId === id ? paymentSelection.paymentId : null;
  const paymentQuery = useLmsClassResource(
    id,
    "payment",
    (s) => service.getPayment(paymentId ?? "", s),
    { roles: ["LEARNER"], enabled: Boolean(paymentId), params: [paymentId] },
  );
  const payment = paymentQuery.data;
  const command = useLmsClassCommand(
    id,
    (action: Action) => {
      if (action.type === "proposeTrial")
        return service.proposeTrial(id, action.input);
      if (action.type === "proposeFee")
        return service.proposeFee(id, action.input);
      if (action.type === "reviewFee")
        return service.reviewFee(id, action.input);
      return service[action.type](id, action.version);
    },
    ["TUTOR", "LEARNER", "CONSULTANT"],
  );
  const checkout = useLmsClassCommand(
    id,
    (input: Parameters<typeof service.payment>[1]) =>
      service.payment(id, input),
    ["LEARNER"],
  );
  const refresh = useLmsClassCommand(
    id,
    (paymentId: string) => service.refreshPayment(paymentId),
    ["LEARNER"],
  );
  async function run(action: Action) {
    try {
      await command.mutateAsync(action);
      await query.refetch();
      setMessage(
        "Đã cập nhật. Quyền vào lớp vẫn do enrollment/duyệt ADD quyết định.",
      );
    } catch (e) {
      await query.refetch();
      setMessage(
        handleApiError(e).statusCode === 409
          ? "Dữ liệu hoặc tháng tính phí đã đổi. Đọc phiên bản mới và xác nhận lại."
          : "Chưa cập nhật được. Kiểm tra quyền, trạng thái học thử và phí tháng đầu.",
      );
    }
  }
  async function pay(month: string | null) {
    try {
      const result = await checkout.mutateAsync({ month });
      setPaymentSelection({ admissionId: id, paymentId: result.id });
      await query.refetch();
      setMessage(
        result.status === "PAID"
          ? "Đã thanh toán. Chờ yêu cầu ADD được Consultant duyệt."
          : "Kiểm tra trạng thái thanh toán và mở checkout nếu khả dụng.",
      );
    } catch {
      await query.refetch();
      setMessage(
        "Chưa tạo được thanh toán. Đọc lại báo giá/tháng hiện tại và các bước xác nhận; không tự thu tiền.",
      );
    }
  }
  async function refreshPayment() {
    if (!payment) return;
    try {
      await refresh.mutateAsync(payment.id);
      await Promise.all([query.refetch(), paymentQuery.refetch()]);
    } catch {
      setMessage("Chưa cập nhật được trạng thái thanh toán.");
    }
  }
  return {
    query,
    payment,
    message,
    run,
    pay,
    refreshPayment,
    busy: command.isPending || checkout.isPending || refresh.isPending,
  };
}
export type GroupAdmissionController = ReturnType<typeof useGroupAdmission>;
