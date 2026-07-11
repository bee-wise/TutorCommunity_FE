import React from "react";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";

export function AdminDashboardGreeting() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Welcome back, Admin
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here is what's happening with BeeWise today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border-none rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
          />
        </div>
        
        <button className="p-2.5 bg-white dark:bg-zinc-900 rounded-full shadow-sm text-gray-600 hover:text-blue-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
