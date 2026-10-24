"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

const ctaClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function Notice({ children }: { children: string }) {
  return (
    <p role="status" className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

// Registration itself happens in the LMS learner area, so the action depends on who is signed in.
export function ClassEnrollAction() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  if (isAuthLoading) return <Skeleton className="h-11 w-full rounded-full" aria-busy="true" />;

  if (!isAuthenticated)
    return (
      <Link href="/login" className={ctaClass}>
        Đăng nhập để đăng ký học thử
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
    );

  if (user?.role?.trim().toUpperCase() !== "LEARNER")
    return <Notice>Chỉ tài khoản học viên mới đăng ký được lớp nhóm. Bạn có thể dùng tài khoản học viên để đăng ký.</Notice>;

  if (user.canAccessLearnerLms !== true)
    return <Notice>Tài khoản của bạn chưa được mở quyền vào LMS để đăng ký lớp. Vui lòng liên hệ BeeWise để được hỗ trợ.</Notice>;

  return (
    <Link href="/lms/learner/group-classes" className={ctaClass}>
      Đăng ký học thử
      <ArrowRightIcon className="size-4" aria-hidden="true" />
    </Link>
  );
}
