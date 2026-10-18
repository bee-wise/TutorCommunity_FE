"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { groupAdmissionsService as payments } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import { guid } from "@workspace/core/lms-classes/schemas";
import { learnerAdmissionsService as service } from "../services/learner-admissions.service";

type AdmissionAction =
  | { type: "preference"; requested: boolean }
  | {
      type:
        | "trial/confirm"
        | "acknowledge-missed"
        | "first-month-fee/accept"
        | "cancel";
    };
export function useLearnerAdmission(id: string, initialPaymentId?: string) {
  const router = useRouter();
  const query = useLmsClassResource(
    id,
    "learner-admission",
    (s) => service.get(id, s),
    { roles: ["LEARNER"] },
  );
  const [selection, setSelection] = useState<{
    admissionId: string;
    paymentId: string;
  } | null>(
    initialPaymentId && guid.safeParse(initialPaymentId).success
      ? { admissionId: id, paymentId: initialPaymentId }
      : null,
  );
  const [notice, setNotice] = useState("");
  const paymentId =
    selection?.admissionId === id ? selection.paymentId : undefined;
  const paymentQuery = useLmsClassResource(
    id,
    "learner-admission-payment",
    async (s) => {
      const value = await payments.getPayment(paymentId ?? "", s);
      if (value.admissionId !== id)
        throw new Error("Thanh toán không thuộc đăng ký này.");
      return value;
    },
    {
      roles: ["LEARNER"],
      params: [paymentId],
      enabled: Boolean(paymentId) && Boolean(query.data),
    },
  );
  const command = useLmsClassCommand(
    id,
    (action: AdmissionAction) => {
      if (!query.data) throw new Error("Cần tải lại đăng ký.");
      const expectedVersion = query.data.version;
      return action.type === "preference"
        ? service.preference(id, {
            expectedVersion,
            trialRequested: action.requested,
          })
        : service.action(id, action.type, expectedVersion);
    },
    ["LEARNER"],
  );
  const checkout = useLmsClassCommand(
    id,
    (month: string | null) => payments.payment(id, { month }),
    ["LEARNER"],
  );
  const refresh = useLmsClassCommand(
    id,
    (paymentId: string) => payments.refreshPayment(paymentId),
    ["LEARNER"],
  );
  async function run(action: AdmissionAction) {
    try {
      await command.mutateAsync(action);
      setNotice("Đã cập nhật đăng ký.");
    } catch (e) {
      setNotice(
        handleApiError(e).statusCode === 409
          ? "Đăng ký hoặc tháng tính phí đã đổi. Kiểm tra lại dữ liệu mới trước khi xác nhận."
          : "Chưa cập nhật được. Kiểm tra quyền và trạng thái đăng ký.",
      );
    } finally {
      await query.refetch();
    }
  }
  async function pay(month: string | null) {
    try {
      const result = await checkout.mutateAsync(month);
      setSelection({ admissionId: id, paymentId: result.id });
      router.replace(
        `/lms/learner/group-admissions/${id}?paymentId=${result.id}`,
        { scroll: false },
      );
      setNotice(
        "Yêu cầu đã được tạo. Chỉ trạng thái xác minh từ BE xác nhận thanh toán.",
      );
    } catch {
      setNotice(
        "Chưa tạo được thanh toán. Kiểm tra học thử, tháng tính phí, báo giá và xác nhận buổi bỏ lỡ.",
      );
    } finally {
      await query.refetch();
    }
  }
  async function refreshPayment() {
    if (!paymentId) return;
    try {
      await refresh.mutateAsync(paymentId);
      await paymentQuery.refetch();
      setNotice("Đã kiểm tra trạng thái từ BE.");
    } catch {
      setNotice(
        "Chưa kiểm tra được thanh toán. Không coi chuyển hướng checkout là đã trả tiền.",
      );
    } finally {
      await query.refetch();
    }
  }
  return {
    query,
    paymentQuery,
    notice,
    run,
    pay,
    refreshPayment,
    busy: command.isPending || checkout.isPending || refresh.isPending,
  };
}
