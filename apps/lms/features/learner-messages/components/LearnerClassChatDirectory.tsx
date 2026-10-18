"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import { formatClassIdentifier } from "../../tutor-classes/utils/classes.utils";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { LearnerClassQueryError } from "../../learner-classes/components/LearnerClassQueryError";
import { ClassWorkspaceSkeleton } from "../../tutor-classes/components/ClassWorkspaceSkeleton";

export function LearnerClassChatDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "archived"
  >("all");

  const query = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "learner-chat-classes",
    (s) => classMembersService.classes(page, s),
    { roles: ["LEARNER"], params: [page] },
  );

  const rawItems = query.data?.items ?? [];

  const activeClasses = useMemo(
    () =>
      rawItems.filter(
        (c) => c.status !== "COMPLETED" && c.status !== "CANCELLED",
      ),
    [rawItems],
  );

  const archivedClasses = useMemo(
    () =>
      rawItems.filter(
        (c) => c.status === "COMPLETED" || c.status === "CANCELLED",
      ),
    [rawItems],
  );

  const filteredItems = useMemo(() => {
    let result = rawItems;
    if (statusFilter === "active") {
      result = activeClasses;
    } else if (statusFilter === "archived") {
      result = archivedClasses;
    }

    const term = search.trim().toLocaleLowerCase("vi");
    if (!term) return result;

    return result.filter((c) => {
      const matchTitle = (c.title ?? "").toLocaleLowerCase("vi").includes(term);
      const matchCode = (c.code ?? "").toLocaleLowerCase("vi").includes(term);
      return matchTitle || matchCode;
    });
  }, [rawItems, statusFilter, activeClasses, archivedClasses, search]);

  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h1 className="mt-1 font-lms text-2xl font-extrabold text-foreground sm:text-3xl">
              Tin nhắn lớp học
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-4 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
            >
              <Link href="/lms/learner/group-classes">
                <AcademicCapIcon
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Lớp nhóm tuyển sinh
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : query.error ? (
        <LearnerClassQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          {/* Search & Filter Toolbar */}
          <section
            aria-label="Tìm kiếm và lọc phòng chat"
            className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            {/* Segmented Filter */}
            <div
              role="group"
              aria-label="Lọc theo trạng thái lớp"
              className="flex rounded-2xl bg-muted/60 p-1"
            >
              {[
                { id: "all", label: "Tất cả", count: rawItems.length },
                {
                  id: "active",
                  label: "Đang học",
                  count: activeClasses.length,
                },
                {
                  id: "archived",
                  label: "Đã kết thúc",
                  count: archivedClasses.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={statusFilter === tab.id}
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-[0.98] ${
                    statusFilter === tab.id
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                      statusFilter === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-md">
              <label htmlFor="learner-chat-search" className="sr-only">
                Tìm lớp học
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="learner-chat-search"
                type="search"
                maxLength={100}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full min-w-0 rounded-full border border-input bg-card pl-9 pr-9 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                placeholder="Tìm lớp học theo tên hoặc mã lớp..."
              />
              {search && (
                <button
                  type="button"
                  aria-label="Xóa tìm kiếm"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95"
                >
                  <XMarkIcon className="size-4" />
                </button>
              )}
            </div>
          </section>

          {/* Chat Rooms Grid */}
          <section
            aria-label="Danh sách phòng chat lớp học"
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h2 className="font-lms text-lg font-extrabold text-foreground">
                {statusFilter === "active"
                  ? "Phòng chat lớp đang học"
                  : statusFilter === "archived"
                    ? "Cuộc trò chuyện chỉ xem lại"
                    : "Tất cả phòng chat lớp học"}
              </h2>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold tabular-nums text-muted-foreground shadow-2xs">
                {filteredItems.length} lớp học
              </span>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((c) => {
                  const isArchived =
                    c.status === "COMPLETED" || c.status === "CANCELLED";
                  const isGroup = c.type === "GROUP" || c.type === "group";

                  return (
                    <article
                      key={c.id}
                      className="group flex flex-col justify-between space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-hover"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-border/70 pb-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                              <ChatBubbleLeftRightIcon
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-xs font-bold text-muted-foreground">
                              {formatClassIdentifier(c.code ?? c.id)}
                            </span>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                              isArchived
                                ? "border-border bg-muted text-muted-foreground"
                                : "border-secondary/30 bg-secondary/15 text-secondary"
                            }`}
                          >
                            {isArchived ? "Đã kết thúc" : "Đang học"}
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="mt-3.5 space-y-2">
                          <h3 className="line-clamp-1 font-lms text-lg font-extrabold text-foreground">
                            {c.title ?? "Lớp học"}
                          </h3>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center rounded-md border border-border/70 bg-muted/30 px-2 py-0.5 font-semibold text-muted-foreground">
                              {isGroup ? "Lớp nhóm" : "Lớp 1 kèm 1"}
                            </span>
                          </div>

                          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
                            Kênh trao đổi thông báo, hỏi đáp bài học với gia sư
                            và bạn cùng lớp.
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
                        <Button
                          asChild
                          variant={isArchived ? "outline" : "default"}
                          className="min-h-10 flex-1 rounded-xl px-4 text-xs font-bold transition-all active:scale-[0.98]"
                        >
                          <Link href={`/lms/learner/chat/classes/${c.id}`}>
                            <ChatBubbleLeftRightIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                            {isArchived ? "Xem tin nhắn" : "Mở tin nhắn lớp"}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                        >
                          <Link href={`/lms/learner/classes/${c.id}/sessions`}>
                            Buổi học
                          </Link>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-12 text-center shadow-soft">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                  <ChatBubbleLeftRightIcon
                    className="size-6"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-4 font-lms text-base font-extrabold text-foreground">
                  {search
                    ? "Không tìm thấy lớp học"
                    : statusFilter === "archived"
                      ? "Chưa có cuộc trò chuyện lưu trữ"
                      : "Chưa có phòng chat lớp học"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {search
                    ? `Không có lớp học nào khớp với từ khóa "${search}".`
                    : "Các phòng chat chung của lớp bạn tham gia sẽ hiển thị tại đây."}
                </p>
                {search ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-xl transition-all active:scale-[0.98]"
                    onClick={() => setSearch("")}
                  >
                    Xóa tìm kiếm
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 rounded-xl transition-all active:scale-[0.98]"
                  >
                    <Link href="/lms/learner/group-classes">
                      Khám phá các lớp nhóm
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            <ClassPagination
              page={page - 1}
              pageCount={Math.max(
                1,
                Math.ceil(
                  (query.data?.total ?? 0) / (query.data?.pageSize ?? 20),
                ),
              )}
              onPageChange={(p) => setPage(p + 1)}
              label="Phân trang lớp trò chuyện"
            />
          </section>
        </>
      )}
    </main>
  );
}
