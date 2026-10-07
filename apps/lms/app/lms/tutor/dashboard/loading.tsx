import { DashboardSkeleton } from "@/features/tutor-dashboard/components/DashboardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-2 py-4 md:p-4">
      <DashboardSkeleton />
    </div>
  );
}
