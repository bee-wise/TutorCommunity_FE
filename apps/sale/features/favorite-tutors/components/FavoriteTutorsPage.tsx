"use client";

import { useState } from "react";
import Link from "next/link";
import { useFavoriteTutors } from "../hooks/useFavoriteTutors";
import { TutorCard } from "../../tutor-list/components/TutorCard";
import { GuestFavoriteModal } from "./GuestFavoriteModal";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import LoadingGradient from "@workspace/ui/components/LoadingGradient";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@workspace/ui/components/ui/pagination";
import { Heart, LogIn, UserPlus, Sparkles } from "lucide-react";

export function FavoriteTutorsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const {
    isAuthenticated,
    isAuthLoading,
    favoriteTutors,
    pagination,
    isLoading,
    isError,
    refetch,
  } = useFavoriteTutors({ page, pageSize });

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <LoadingGradient
          animationSpeed={2}
          showBorder={false}
          className="text-2xl font-bold"
        >
          Đang tải danh sách yêu thích...
        </LoadingGradient>
      </div>
    );
  }

  // If user is guest (not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <GuestFavoriteModal />
        <div className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#280f91_0%,#447353_100%)] text-white shadow-lg shadow-[#280f91]/20">
            <Heart className="h-10 w-10 fill-[#ffc500] text-[#ffc500]" />
          </div>

          <h1
            className="text-2xl font-extrabold text-[#17131f] sm:text-3xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Đăng nhập để xem Gia sư yêu thích
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Bạn cần đăng nhập hoặc tạo tài khoản BeeWise để xem và quản lý danh
            sách các gia sư đã lưu.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/login?redirect=/favorite-tutors"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#280f91] px-7 py-3.5 text-sm font-extrabold text-white shadow-md shadow-[#280f91]/20 transition-all hover:bg-[#1f0b70] hover:shadow-lg active:scale-[0.99]"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập ngay
            </Link>
            <Link
              href="/register?redirect=/favorite-tutors"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#ffc500] bg-[#fffdf0] px-7 py-3.5 text-sm font-extrabold text-[#8a5a00] transition-all hover:bg-[#ffc500] hover:text-[#0c0c0b] active:scale-[0.99]"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              <UserPlus className="h-4 w-4" />
              Đăng ký tài khoản
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Hoặc khám phá danh sách gia sư BeeWise
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <GuestFavoriteModal />
        <p className="text-destructive font-medium">
          Đã xảy ra lỗi khi tải danh sách gia sư yêu thích.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (favoriteTutors.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GuestFavoriteModal />
        <EmptyState
          title="Chưa có gia sư yêu thích"
          description="Bạn chưa lưu hồ sơ gia sư nào. Hãy quay lại danh sách gia sư và tìm kiếm người phù hợp nhé!"
          action={
            <Link
              href="/tutors"
              className="mt-4 flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              Khám phá gia sư ngay
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <GuestFavoriteModal />

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-3xl font-extrabold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Gia sư yêu thích
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Danh sách các hồ sơ gia sư bạn đã quan tâm và lưu lại.
          </p>
        </div>
        {pagination && (
          <span className="text-xs font-semibold text-muted-foreground">
            Tổng cộng:{" "}
            <strong className="text-foreground">{pagination.totalItems}</strong>{" "}
            gia sư
          </span>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteTutors.map((tutor) => (
          <TutorCard key={tutor.profileId} tutor={tutor} isLoggedIn={true} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 mb-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isNearCurrent = Math.abs(pageNum - page) <= 1;
                const isEdge = pageNum === 1 || pageNum === pagination.totalPages;
                if (!isNearCurrent && !isEdge) {
                  if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === page}
                      onClick={() => setPage(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className={
                    page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
