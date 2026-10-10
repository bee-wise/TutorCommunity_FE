export function ClassChatSkeleton() {
  return <div role="status" aria-label="Đang tải tin nhắn lớp" className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1400px] flex-col gap-4 p-1 sm:p-2 lg:px-1">
    <span className="sr-only">Đang tải tin nhắn lớp…</span>
    <div aria-hidden="true" className="flex min-h-0 flex-1 flex-col gap-5 motion-safe:animate-pulse">
      <div className="flex min-h-0 flex-1 flex-col gap-6 rounded-xl border border-border bg-card p-5 shadow-soft"><div className="h-24 w-2/3 rounded-2xl bg-muted" /><div className="ml-auto h-24 w-2/3 rounded-2xl bg-muted" /><div className="mt-auto h-20 rounded-2xl bg-muted" /></div>
    </div>
  </div>;
}
