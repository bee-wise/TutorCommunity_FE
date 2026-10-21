"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AcademicCapIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { LmsPageHeader } from "../../../components/LmsPageHeader";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { LearnerClassQueryError } from "../../learner-classes/components/LearnerClassQueryError";
import { ClassWorkspaceSkeleton } from "../../tutor-classes/components/ClassWorkspaceSkeleton";
import { isArchivedRoom, LearnerChatRoomCard } from "./LearnerChatRoomCard";

type StatusFilter = "all" | "active" | "archived";

export function LearnerClassChatDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const query = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "learner-chat-classes",
    (s) => classMembersService.classes(page, s),
    { roles: ["LEARNER"], params: [page] },
  );

  const rawItems = useMemo(() => query.data?.items ?? [], [query.data?.items]);
  const activeCount = rawItems.filter((room) => !isArchivedRoom(room)).length;
  const filterTabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "Tất cả", count: rawItems.length },
    { id: "active", label: "Đang học", count: activeCount },
    { id: "archived", label: "Đã kết thúc", count: rawItems.length - activeCount },
  ];

  const filteredItems = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("vi");
    return rawItems.filter((room) => {
      if (statusFilter === "active" && isArchivedRoom(room)) return false;
      if (statusFilter === "archived" && !isArchivedRoom(room)) return false;
      return !term || (room.title ?? "").toLocaleLowerCase("vi").includes(term) || (room.code ?? "").toLocaleLowerCase("vi").includes(term);
    });
  }, [rawItems, statusFilter, search]);

  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <LmsPageHeader
        title="Tin nhắn lớp học"
        actions={
          <Button asChild variant="outline" className="min-h-11 px-4 text-xs">
            <Link href="/lms/learner/group-classes"><AcademicCapIcon className="size-4 text-primary" aria-hidden="true" />Lớp nhóm tuyển sinh</Link>
          </Button>
        }
      />

      {query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : query.error ? (
        <LearnerClassQueryError error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <section aria-label="Tìm kiếm và lọc phòng chat" className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div role="group" aria-label="Lọc theo trạng thái lớp" className="flex gap-1 rounded-2xl bg-muted p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={statusFilter === tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className="flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-soft"
                >
                  {tab.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${statusFilter === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{tab.count}</span>
                </button>
              ))}
            </div>
            <div className="relative flex-1 sm:max-w-md">
              <label htmlFor="learner-chat-search" className="sr-only">Tìm lớp học</label>
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="learner-chat-search"
                type="search"
                maxLength={100}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm lớp học theo tên hoặc mã lớp..."
                className="h-11 w-full min-w-0 rounded-full border border-input bg-card pl-9 pr-10 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              {search && (
                <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setSearch("")} className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95">
                  <XMarkIcon className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </section>

          <section aria-label="Danh sách phòng chat lớp học" className="space-y-4">
            <p role="status" className="px-1 text-sm font-bold tabular-nums text-muted-foreground">{filteredItems.length} lớp học</p>
            {filteredItems.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((room) => <LearnerChatRoomCard key={room.id} room={room} />)}
              </div>
            ) : (
              <EmptyState
                imageAlt=""
                title={search ? "Không tìm thấy lớp học" : statusFilter === "archived" ? "Chưa có cuộc trò chuyện lưu trữ" : "Chưa có phòng chat lớp học"}
                description={search ? `Không có lớp học nào khớp với từ khóa "${search}".` : "Các phòng chat chung của lớp bạn tham gia sẽ hiển thị tại đây."}
                action={
                  search
                    ? <Button type="button" variant="outline" className="min-h-11" onClick={() => setSearch("")}>Xóa tìm kiếm</Button>
                    : <Button asChild variant="outline" className="min-h-11"><Link href="/lms/learner/group-classes">Khám phá các lớp nhóm</Link></Button>
                }
              />
            )}
            <ClassPagination
              page={page - 1}
              pageCount={Math.max(1, Math.ceil((query.data?.total ?? 0) / (query.data?.pageSize ?? 20)))}
              onPageChange={(p) => setPage(p + 1)}
              label="Phân trang lớp trò chuyện"
            />
          </section>
        </>
      )}
    </main>
  );
}
