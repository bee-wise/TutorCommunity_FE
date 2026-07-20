import React from "react";
import { TutorDashboard } from "@/features/tutor-dashboard/components/TutorDashboard";

export const metadata = {
  title: "Dashboard Gia sư | BeeWise",
};

export default function TutorDashboardPage() {
  return (
    <div className="container mx-auto p-2 md:p-4 max-w-[1400px]">
      <TutorDashboard />
    </div>
  );
}
