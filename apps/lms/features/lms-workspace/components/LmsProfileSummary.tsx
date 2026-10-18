"use client";

import Link from "next/link";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { Button } from "@workspace/ui/components/ui/button";

export function LmsProfileSummary() {
  const user = useAuthStore((state) => state.user);
  const tutor = user?.role?.trim().toUpperCase() === "TUTOR";
  const initials = user?.fullName?.trim().split(/\s+/).slice(-2).map((word) => word[0]).join("").toUpperCase() || "BW";

  return (
    <section className="space-y-4 text-center" aria-label="Tài khoản của bạn">
      <Avatar className="mx-auto size-16 border-4 border-card shadow-soft"><AvatarImage src="" alt="" /><AvatarFallback className="bg-accent/20 text-lg font-extrabold text-foreground">{initials}</AvatarFallback></Avatar>
      <div><h2 className="text-base font-extrabold text-foreground">{user?.fullName || "Tài khoản BeeWise"}</h2><p className="mt-1 break-all text-xs text-muted-foreground">{user?.email}</p></div>
      <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-xs"><span className="text-muted-foreground">Vai trò</span><span className="font-bold text-foreground">{tutor ? "Gia sư" : "Học viên"}</span></div>
      <Button asChild className="min-h-11 w-full rounded-xl font-bold shadow-lg shadow-primary/15 transition-all active:scale-[0.98]"><Link href={tutor ? "/lms/tutor/profile" : "/lms/learner/classes"}>{tutor ? "Xem hồ sơ" : "Vào lớp học"}</Link></Button>
    </section>
  );
}
