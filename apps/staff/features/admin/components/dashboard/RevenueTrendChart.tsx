"use client";

import React, { useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";

// Months data: [month, revenue (M VND), cashflow (M VND)]
const monthlyData = [
  { month: "T1", revenue: 45, cashflow: 12 },
  { month: "T2", revenue: 52, cashflow: 15 },
  { month: "T3", revenue: 61, cashflow: 18 },
  { month: "T4", revenue: 58, cashflow: 16 },
  { month: "T5", revenue: 74, cashflow: 22 },
  { month: "T6", revenue: 88, cashflow: 27 },
  { month: "T7", revenue: 95, cashflow: 30 },
  { month: "T8", revenue: 102, cashflow: 33 },
  { month: "T9", revenue: 115, cashflow: 38 },
  { month: "T10", revenue: 109, cashflow: 35 },
  { month: "T11", revenue: 120, cashflow: 40 },
  { month: "T12", revenue: 124.5, cashflow: 42 },
];

const weeklyData = [
  { month: "T2", revenue: 28, cashflow: 8 },
  { month: "T3", revenue: 32, cashflow: 9 },
  { month: "T4", revenue: 25, cashflow: 7 },
  { month: "T5", revenue: 38, cashflow: 11 },
  { month: "T6", revenue: 30, cashflow: 9 },
  { month: "T7", revenue: 15, cashflow: 5 },
  { month: "CN", revenue: 10, cashflow: 3 },
];

function SVGLineChart({ data, width = 600, height = 180 }: { data: typeof monthlyData; width?: number; height?: number }) {
  const maxVal = Math.max(...data.map((d) => d.revenue)) * 1.1;
  const pad = { top: 16, bottom: 28, left: 32, right: 16 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const n = data.length;

  const xPos = (i: number) => pad.left + (i / (n - 1)) * chartW;
  const yPos = (val: number) => pad.top + chartH - (val / maxVal) * chartH;

  const revenuePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xPos(i)},${yPos(d.revenue)}`).join(" ");
  const cashflowPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xPos(i)},${yPos(d.cashflow)}`).join(" ");

  // Gradient fill areas
  const revenueArea = `${revenuePath} L ${xPos(n - 1)},${pad.top + chartH} L ${xPos(0)},${pad.top + chartH} Z`;
  const cashflowArea = `${cashflowPath} L ${xPos(n - 1)},${pad.top + chartH} L ${xPos(0)},${pad.top + chartH} Z`;

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full" style={{ paddingBottom: "30%" }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={pad.left} y1={pad.top + chartH * (1 - t)}
            x2={pad.left + chartW} y2={pad.top + chartH * (1 - t)}
            stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="4 4"
          />
        ))}

        {/* Cashflow area */}
        <path d={cashflowArea} fill="url(#cashGrad)" />
        {/* Revenue area */}
        <path d={revenueArea} fill="url(#revGrad)" />

        {/* Cashflow line */}
        <path d={cashflowPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Revenue line */}
        <path d={revenuePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points + tooltips */}
        {data.map((d, i) => (
          <g key={i}>
            {/* Revenue dot */}
            <circle
              cx={xPos(i)} cy={yPos(d.revenue)} r={hovered === i ? 5 : 3}
              fill="#3b82f6" stroke="white" strokeWidth="1.5"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all"
            />
            {/* Cashflow dot */}
            <circle
              cx={xPos(i)} cy={yPos(d.cashflow)} r={hovered === i ? 4 : 2.5}
              fill="#10b981" stroke="white" strokeWidth="1.5"
            />

            {/* Tooltip */}
            {hovered === i && (
              <g>
                <rect
                  x={xPos(i) - 44} y={yPos(d.revenue) - 46}
                  width={88} height={40} rx="6" ry="6"
                  fill="#1e293b" opacity="0.92"
                />
                <text x={xPos(i)} y={yPos(d.revenue) - 31} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
                  Revenue: {d.revenue}M ₫
                </text>
                <text x={xPos(i)} y={yPos(d.revenue) - 19} textAnchor="middle" fill="#6ee7b7" fontSize="8">
                  Cashflow: {d.cashflow}M ₫
                </text>
              </g>
            )}

            {/* X label */}
            <text x={xPos(i)} y={height - 6} textAnchor="middle" fill="#9ca3af" fontSize="9">
              {d.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function RevenueTrendChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const data = period === "monthly" ? monthlyData : weeklyData;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-5 w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Biểu Đồ Doanh Thu</h2>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-semibold text-green-500">+12.5%</span>
            <span className="text-xs text-gray-400">so với kỳ trước</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs text-gray-500 mr-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Doanh thu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>Dòng tiền
            </span>
          </div>
          <div className="flex border border-gray-200 dark:border-zinc-700 rounded-full overflow-hidden">
            <button
              onClick={() => setPeriod("weekly")}
              className={`text-xs px-3 py-1.5 transition-colors ${period === "weekly" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`text-xs px-3 py-1.5 transition-colors ${period === "monthly" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              12 tháng
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
          <span className="text-xs text-blue-600 font-medium">Tổng Doanh Thu</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">124.5M ₫</span>
          <span className="text-xs text-blue-500">Tháng 12/2025</span>
        </div>
        <div className="flex flex-col gap-1 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
          <span className="text-xs text-emerald-600 font-medium">Dòng Tiền Ròng</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">42.0M ₫</span>
          <span className="text-xs text-emerald-500">Phí DV đã thu: 24.9M ₫</span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <SVGLineChart data={data} width={700} height={200} />
    </div>
  );
}
