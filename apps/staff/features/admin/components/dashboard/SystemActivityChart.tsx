"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

const data = [
  { day: "T2", searches: 142, aiSearches: 68, connects: 35 },
  { day: "T3", searches: 198, aiSearches: 102, connects: 54 },
  { day: "T4", searches: 175, aiSearches: 88, connects: 46 },
  { day: "T5", searches: 224, aiSearches: 135, connects: 70 },
  { day: "T6", searches: 186, aiSearches: 99, connects: 52 },
  { day: "T7", searches: 110, aiSearches: 55, connects: 28 },
  { day: "CN", searches: 78, aiSearches: 32, connects: 14 },
];

const maxVal = Math.max(...data.flatMap((d) => [d.searches, d.aiSearches, d.connects]));

export function SystemActivityChart() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-5 h-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Hoạt Động Hệ Thống</h2>
          <p className="text-xs text-gray-400 mt-0.5">Lượt tìm kiếm, AI Search và kết nối trong tuần</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
          Tuần này <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Chart bars */}
      <div className="flex items-end justify-between gap-3 flex-1 min-h-[160px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="relative w-full flex flex-col items-center gap-[2px]">
              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-gray-900 text-white rounded-xl py-1.5 px-2.5 text-[10px] whitespace-nowrap shadow-lg">
                <div>Tìm kiếm: <b>{item.searches}</b></div>
                <div>AI Search: <b>{item.aiSearches}</b></div>
                <div>Kết nối: <b>{item.connects}</b></div>
              </div>

              {/* Bar group (search = blue, ai = purple, connect = orange) */}
              <div className="flex items-end justify-center gap-[2px] w-full" style={{ height: "140px" }}>
                {/* Search bar */}
                <div
                  className="flex-1 max-w-[10px] rounded-t-sm bg-blue-400 group-hover:bg-blue-500 transition-all duration-300"
                  style={{ height: `${(item.searches / maxVal) * 140}px` }}
                />
                {/* AI Search bar */}
                <div
                  className="flex-1 max-w-[10px] rounded-t-sm bg-violet-400 group-hover:bg-violet-500 transition-all duration-300"
                  style={{ height: `${(item.aiSearches / maxVal) * 140}px` }}
                />
                {/* Connect bar */}
                <div
                  className="flex-1 max-w-[10px] rounded-t-sm bg-orange-400 group-hover:bg-orange-500 transition-all duration-300"
                  style={{ height: `${(item.connects / maxVal) * 140}px` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 pt-2 border-t border-gray-100 dark:border-zinc-800">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />Tìm kiếm thường
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />AI Search
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />Kết nối
        </span>
      </div>
    </div>
  );
}
