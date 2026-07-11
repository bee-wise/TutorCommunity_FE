import React from "react";
import { MonitorPlay, Users, Plus, Calendar as CalendarIcon } from "lucide-react";

export function ActiveClassesWidget() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-6 w-full h-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Active Classes</h2>

      <div className="flex flex-col gap-4">
        {/* Class metric 1 */}
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
          <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-600">
            <MonitorPlay className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">128</span>
            <span className="text-xs text-gray-500 font-medium">Classes Happening Now</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 text-gray-400 hover:text-blue-600 shadow-sm border border-gray-100 dark:border-zinc-600 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Class metric 2 */}
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
          <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-600">
            <Users className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">45</span>
            <span className="text-xs text-gray-500 font-medium">Active Chat Rooms</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-zinc-800 text-white rounded-xl px-3 py-1 shadow-md">
            <span className="text-[10px] uppercase font-semibold text-zinc-300">Wait</span>
            <span className="text-lg font-bold">12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
