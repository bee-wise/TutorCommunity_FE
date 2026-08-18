"use client";

import { useFavoriteTutors } from "../hooks/useFavoriteTutors";
import { TutorCard } from "../../tutor-list/components/TutorCard";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import LoadingGradient from "@workspace/ui/components/LoadingGradient";
import Link from "next/link";

export function FavoriteTutorsPage() {
  const { savedIds, favoriteTutors, isLoading, isError } = useFavoriteTutors();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <LoadingGradient
          animationSpeed={2}
          showBorder={false}
          className="text-2xl"
        >
          Đang tải danh sách yêu thích...
        </LoadingGradient>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive font-medium">
          Đã xảy ra lỗi khi tải danh sách gia sư.
        </p>
      </div>
    );
  }

  if (savedIds.length === 0 || favoriteTutors.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <EmptyState
          title="Chưa có gia sư yêu thích"
          description="Bạn chưa lưu hồ sơ gia sư nào. Hãy quay lại danh sách gia sư và tìm kiếm người phù hợp nhé!"
          action={
            <Link
              href="/tutors"
              className="mt-4 flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Khám phá ngay
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-nunito text-3xl font-extrabold text-foreground sm:text-4xl">
          Gia sư yêu thích
        </h1>
        <p className="mt-2 text-muted-foreground">
          Danh sách các hồ sơ gia sư bạn đã quan tâm và lưu lại.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteTutors.map((tutor) => (
          <TutorCard key={tutor.profileId} tutor={tutor} isLoggedIn={true} />
        ))}
      </div>
    </div>
  );
}
