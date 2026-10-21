"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import Link from "next/link";
import { LmsPageSkeleton } from "@/components/LmsPageSkeleton";
import { headingClass, pageClass, panelClass } from "@/components/lms-page-ui";
import { useConnectionHistory } from "../hooks/useConnectionHistory";
import type { HistoryConnection } from "../types/history.types";
import { formatHistoryDate } from "../utils/history.utils";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryStatusBadge } from "./HistoryStatusBadge";
import { HistoryDetailDialog } from "./HistoryDetailDialog";

export function ConnectionHistoryScreen() {
  const history = useConnectionHistory();
  const [selected, setSelected] = useState<HistoryConnection | null>(null);
  if (history.loading) return <LmsPageSkeleton />;
  return (
    <div className={pageClass}>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className={headingClass}>Lịch sử kết nối</h1></div>
        <Button variant="outline" type="button" className="min-h-11 self-start" onClick={() => void history.refresh()} disabled={history.refreshing || !history.authorized}>{history.refreshing ? "Đang cập nhật…" : "Làm mới"}</Button>
      </header>
      {!history.authorized ? <section className={panelClass}><p className="text-sm">Đăng nhập bằng tài khoản gia sư để xem lịch sử kết nối.</p></section>
        : history.error ? <section role="alert" className={`${panelClass} space-y-4`}><h2 className="font-lms text-lg font-extrabold text-foreground">Chưa tải được lịch sử kết nối</h2><p className="text-sm text-muted-foreground">Vui lòng kiểm tra kết nối mạng hoặc quyền truy cập và thử lại.</p><Button variant="outline" type="button" className="min-h-11" onClick={() => void history.refresh()} disabled={history.refreshing}>Thử lại</Button></section>
          : <>
            <HistoryFilters filters={history.filters} onChange={history.updateFilters} />
            {history.roomsError && <p role="status" className="rounded-2xl border border-border p-4 text-sm text-warning">Chưa tải được thông tin phòng chat. Lịch sử vẫn hiển thị; hãy làm mới để xem tên học viên và mở cuộc trò chuyện.</p>}
            <section aria-labelledby="history-list-title" className={`${panelClass} space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="history-list-title" className="font-lms text-lg font-extrabold text-foreground">Các kết nối của bạn</h2><span className="text-sm text-muted-foreground">{history.total} kết nối phù hợp</span></div>
              {!history.total ? <div className="space-y-3 py-8 text-center"><h3 className="font-lms text-lg font-extrabold">Chưa có kết nối phù hợp</h3><p className="text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc làm mới khi có yêu cầu mới.</p><Button variant="outline" type="button" className="min-h-11" onClick={history.resetFilters}>Đặt lại bộ lọc</Button></div>
                : <div className="divide-y divide-border">{history.connections.map((connection) => <article key={connection.id} className="grid items-center gap-4 py-5 first:pt-0 lg:grid-cols-[minmax(0,1fr)_190px_auto]">
                  <div className="min-w-0"><h3 className="font-lms text-lg font-extrabold text-foreground">{connection.learnerName}</h3><p className="mt-1 text-sm text-muted-foreground">Kết nối ngày {formatHistoryDate(connection.createdAt)}</p></div>
                  <div><HistoryStatusBadge status={connection.status} /></div>
                  <div className="flex flex-wrap gap-2 lg:justify-end"><Button variant="outline" type="button" onClick={() => setSelected(connection)} className="min-h-11" aria-label={`Chi tiết kết nối với ${connection.learnerName}`}>Chi tiết</Button>{connection.roomId && <Button asChild variant="outline" className="min-h-11"><Link href={`/lms/tutor/messages/${encodeURIComponent(connection.roomId)}`}>Cuộc trò chuyện</Link></Button>}</div>
                </article>)}</div>}
              {!!history.total && <nav aria-label="Phân trang kết nối" className="flex items-center justify-end gap-3 border-t border-border pt-4"><Button variant="outline" type="button" className="min-h-11" disabled={!history.page} onClick={() => history.setPage(history.page - 1)}>Trước</Button><span aria-live="polite" className="text-sm text-muted-foreground">{history.page + 1} / {history.pageCount}</span><Button variant="outline" type="button" className="min-h-11" disabled={history.page + 1 === history.pageCount} onClick={() => history.setPage(history.page + 1)}>Sau</Button></nav>}
            </section>
          </>}
      <HistoryDetailDialog connection={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
