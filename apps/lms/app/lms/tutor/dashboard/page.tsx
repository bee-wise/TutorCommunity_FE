import { TutorDashboard } from "@/features/tutor-dashboard/components/TutorDashboard";

export const metadata = {
  title: "Dashboard Gia sư | BeeWise",
};

export default function TutorDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-2 py-4 md:p-4">
      <TutorDashboard />
    </div>
  );
}
