import type {
  EarningSession,
  EarningsPeriod,
  SettlementFilter,
} from "../types/earnings.types";

export const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return VND_FORMATTER.format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

const DAY_MS = 86_400_000;
const VIETNAM_OFFSET = 7 * 60 * 60 * 1000;

export function isInPeriod(
  value: string,
  period: EarningsPeriod,
  referenceDate: Date,
) {
  const date = new Date(new Date(value).getTime() + VIETNAM_OFFSET);
  const reference = new Date(referenceDate.getTime() + VIETNAM_OFFSET);
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(reference.getTime())) return false;
  const dayIndex = Math.floor(date.getTime() / DAY_MS);
  const referenceIndex = Math.floor(reference.getTime() / DAY_MS);

  if (period === "day") {
    return dayIndex === referenceIndex;
  }

  if (period === "week") {
    const start = referenceIndex - (reference.getUTCDay() || 7) + 1;
    return dayIndex >= start && dayIndex < start + 7;
  }

  if (period === "month") {
    return (
      date.getUTCFullYear() === reference.getUTCFullYear() &&
      date.getUTCMonth() === reference.getUTCMonth()
    );
  }

  return date.getUTCFullYear() === reference.getUTCFullYear();
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
}

export function filterEarningSessions(sessions: readonly EarningSession[], filters: {
  period: EarningsPeriod; referenceDate: string; status: SettlementFilter; search: string;
}) {
  const reference = new Date(`${filters.referenceDate}T12:00:00+07:00`);
  const search = normalizeSearch(filters.search);
  return sessions.filter((session) => isInPeriod(session.taughtAt, filters.period, reference)
    && (filters.status === "all" || session.settlementStatus === filters.status)
    && normalizeSearch(`${session.sessionCode} ${session.learnerName} ${session.className} ${session.subject}`).includes(search))
    .sort((a, b) => new Date(b.taughtAt).getTime() - new Date(a.taughtAt).getTime());
}

function escapeExcelCell(value: string | number) {
  const text = typeof value === "string" && /^[=+@-]/.test(value.trimStart()) ? `'${value}` : String(value);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function exportEarningsToExcel(sessions: EarningSession[]) {
  const statusLabel = {
    settled: "Đã quyết toán",
    pending: "Chờ quyết toán",
    reviewing: "Đang kiểm tra",
  } as const;
  const rows = sessions
    .map(
      (session) => `
        <tr>
          <td>${escapeExcelCell(session.sessionCode)}</td>
          <td>${escapeExcelCell(session.learnerName)}</td>
          <td>${escapeExcelCell(session.className)}</td>
          <td>${escapeExcelCell(formatDateTime(session.taughtAt))}</td>
          <td>${session.durationMinutes}</td>
          <td>${session.fee}</td>
          <td>${statusLabel[session.settlementStatus]}</td>
          <td>${escapeExcelCell(session.settlementCode ?? "")}</td>
        </tr>`,
    )
    .join("");
  const workbook = `﻿<html><head><meta charset="UTF-8" /></head><body>
    <table><thead><tr>
      <th>Mã buổi học</th><th>Học viên</th><th>Lớp học</th><th>Thời gian</th>
      <th>Thời lượng (phút)</th><th>Học phí (VND)</th><th>Trạng thái</th><th>Mã quyết toán</th>
    </tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `thu-nhap-beewise-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

