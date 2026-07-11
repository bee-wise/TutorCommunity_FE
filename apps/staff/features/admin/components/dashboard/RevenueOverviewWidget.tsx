import React from "react";
import { TrendingUp, DollarSign, Wallet } from "lucide-react";

export function RevenueOverviewWidget() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-6 w-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between z-10">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Revenue & Cash Flow</h2>
        <button className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
          Monthly 
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 z-10">
        {/* Revenue */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-green-500" />
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            124.5M ₫
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Cash Flow */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <Wallet className="w-4 h-4 text-blue-500" />
            Net Cash Flow
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            32.0M ₫
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+8.2% from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
