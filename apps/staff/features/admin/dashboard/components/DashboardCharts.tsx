"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardData, DashboardMetric } from "../schemas/dashboard.schema";

interface ChartItem {
  name: string;
  value: number;
  isMock: boolean;
  color: string;
}

const numberFormat = new Intl.NumberFormat("vi-VN");

function chartItem(
  name: string,
  metric: DashboardMetric | null | undefined,
  color: string,
): ChartItem | null {
  return metric
    ? { name, value: metric.value, isMock: metric.isMock, color }
    : null;
}

function MetricChart({
  title,
  description,
  data,
  unit,
}: {
  title: string;
  description: string;
  data: ChartItem[];
  unit: string;
}) {
  return (
    <article className="min-w-0 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {data.length === 0 ? (
        <div className="mt-5 flex h-64 items-center justify-center rounded-2xl bg-muted/50 text-sm text-muted-foreground">
          Chưa có dữ liệu để hiển thị
        </div>
      ) : (
        <div className="mt-5 h-64 min-w-0" role="img" aria-label={`${title}: ${data.map((item) => `${item.name} ${item.value} ${unit}`).join(", ")}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={80}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 12, left: 0, bottom: 4 }} accessibilityLayer>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as ChartItem;
                  return (
                    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 tabular-nums">{numberFormat.format(item.value)} {unit}</p>
                      {item.isMock && <p className="mt-1 font-semibold text-warning">Dữ liệu mẫu</p>}
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" maxBarSize={25} radius={[0, 7, 7, 0]} isAnimationActive={false}>
                {data.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {data.some((item) => item.isMock) && (
        <p className="mt-2 text-xs font-medium text-warning">Có chỉ số dùng dữ liệu mẫu từ hệ thống.</p>
      )}
    </article>
  );
}

export function ConversionActivityChart({ summary }: { summary: DashboardData["summary"] }) {
  const activityData = [
    chartItem("Tìm kiếm", summary.totalSearches, "var(--primary)"),
    chartItem("Kết nối", summary.totalConnectRequests, "var(--secondary)"),
    chartItem("Phòng chat", summary.totalChatRooms, "var(--warning)"),
  ].filter((item): item is ChartItem => item !== null);

  return <MetricChart title="Tìm kiếm → Kết nối → Chat" description="Lượt sự kiện theo từng bước của hành trình" data={activityData} unit="lượt" />;
}

export function TutorStatusChart({ summary }: { summary: DashboardData["summary"] }) {
  const tutorData = [
    chartItem("Đã duyệt", summary.approvedTutors, "var(--secondary)"),
    chartItem("Chờ duyệt", summary.pendingReviewProfiles, "var(--accent)"),
    chartItem("Từ chối", summary.rejectedProfiles, "var(--destructive)"),
  ].filter((item): item is ChartItem => item !== null);

  return <MetricChart title="Tình trạng xét duyệt" description="Các chỉ số hồ sơ từ hệ thống" data={tutorData} unit="hồ sơ" />;
}
