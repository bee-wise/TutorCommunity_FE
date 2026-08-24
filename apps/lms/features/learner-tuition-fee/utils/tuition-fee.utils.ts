import type {
  LearnerTuitionClass,
  TuitionClassSummary,
  TuitionSession,
} from "../types/tuition-fee.types";

export const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatTuitionCurrency(value: number) {
  return VND_FORMATTER.format(value);
}

export function formatTuitionDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function buildTuitionSummary(
  classInfo: LearnerTuitionClass,
  sessions: TuitionSession[],
): TuitionClassSummary {
  const classSessions = sessions.filter((session) => session.classId === classInfo.id);
  const recordedSessions = classSessions.filter((session) => session.chargeStatus === "RECORDED");
  const reservedSessions = classSessions.filter((session) => session.chargeStatus === "RESERVED");
  const allocatedCount = recordedSessions.length + reservedSessions.length;
  const remainingSessionCount = Math.max(0, classInfo.purchasedSessionCount - allocatedCount);

  return {
    classInfo,
    recordedSessionCount: recordedSessions.length,
    reservedSessionCount: reservedSessions.length,
    remainingSessionCount,
  };
}

function escapeInvoiceValue(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function exportTuitionInvoice(classInfo: LearnerTuitionClass) {
  const invoice = `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><title>${escapeInvoiceValue(classInfo.invoiceNumber)}</title>
  <style>body{font-family:Arial,sans-serif;color:#17142f;max-width:760px;margin:40px auto;padding:24px}h1{color:#280f91;margin:0 0 8px}.meta{color:#667085;margin-bottom:28px}.row{display:flex;justify-content:space-between;gap:24px;padding:12px 0;border-bottom:1px solid #e5eaf5}.total{font-size:22px;font-weight:800;color:#280f91}.status{display:inline-block;margin-top:20px;padding:8px 12px;background:#dfeee4;color:#365d43;border-radius:8px;font-weight:700}@media print{body{margin:0}}</style></head><body>
  <h1>HÓA ĐƠN HỌC PHÍ BEEWISE</h1><p class="meta">Số hóa đơn: ${escapeInvoiceValue(classInfo.invoiceNumber)}<br>Ngày phát hành: ${escapeInvoiceValue(formatTuitionDate(classInfo.invoiceIssuedAt))}</p>
  <div class="row"><span>Lớp học</span><strong>${escapeInvoiceValue(classInfo.className)}</strong></div>
  <div class="row"><span>Gia sư</span><strong>${escapeInvoiceValue(classInfo.tutorName)}</strong></div>
  <div class="row"><span>Gói học</span><strong>${escapeInvoiceValue(classInfo.packageName)}</strong></div>
  <div class="row"><span>Đơn giá mỗi buổi</span><strong>${escapeInvoiceValue(formatTuitionCurrency(classInfo.feePerSession))}</strong></div>
  <div class="row"><span>Mã đơn SALE</span><strong>${escapeInvoiceValue(classInfo.saleOrderCode)}</strong></div>
  <div class="row total"><span>Tổng đã thanh toán</span><strong>${escapeInvoiceValue(formatTuitionCurrency(classInfo.totalPaid))}</strong></div>
  <p class="status">Đã thanh toán qua BeeWise SALE</p></body></html>`;
  const blob = new Blob([invoice], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hoa-don-${classInfo.invoiceNumber}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
