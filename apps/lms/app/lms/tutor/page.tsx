"use client";

import { TutorVerificationDashboard } from '@/features/tutor-dashboard/components/TutorVerificationDashboard';
import { useAuthStore } from '@workspace/core/store/useAuthStore';

export default function TutorDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isVerified = user?.isVerified !== false;

  if (!isVerified) {
    return <TutorVerificationDashboard />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Gia sư</h1>
    </div>
  );
}

