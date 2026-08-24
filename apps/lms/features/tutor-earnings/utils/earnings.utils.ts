import type {
  EarningSession,
  EarningsPeriod,
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
  }).format(new Date(value));
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isInPeriod(
  value: string,
  period: EarningsPeriod,
  referenceDate: Date,
) {
  const date = new Date(value);
  const reference = startOfDay(referenceDate);

  if (period === "day") {
    return startOfDay(date).getTime() === reference.getTime();
  }

  if (period === "week") {
    const day = reference.getDay() || 7;
    const start = new Date(reference);
    start.setDate(reference.getDate() - day + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return date >= start && date < end;
  }

  if (period === "month") {
    return (
      date.getFullYear() === reference.getFullYear() &&
      date.getMonth() === reference.getMonth()
    );
  }

  return date.getFullYear() === reference.getFullYear();
}

function escapeExcelCell(value: string | number) {
  return String(value)
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
  URL.revokeObjectURL(url);
}

