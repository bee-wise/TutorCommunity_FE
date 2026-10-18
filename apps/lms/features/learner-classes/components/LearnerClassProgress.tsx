"use client";
import { Button } from "@workspace/ui/components/ui/button";
import { useLearnerClassProgress } from "../hooks/useLearnerClassProgress";

export function LearnerClassProgress({ classId, planned }: { classId: string; planned: number }) {
  const query = useLearnerClassProgress(classId);
  if (query.loading) return <p role="status" className="text-sm text-muted-foreground">Đang tải tiến độ buổi học…</p>;
  if (query.error || !query.data) return <div className="flex flex-wrap items-center gap-2 text-sm"><span>Chưa tải được tiến độ.</span><Button variant="outline" size="sm" onClick={() => void query.refetch()}>Thử lại</Button></div>;
  const completed = query.data.total;
  const percentage = planned > 0 ? Math.min(100, Math.round(completed / planned * 100)) : null;
  return <div className="space-y-2">
    <div className="flex flex-wrap justify-between gap-2 text-sm"><span className="font-semibold">Buổi đã hoàn thành</span><strong className="tabular-nums">{completed}{planned > 0 ? <span className="font-medium text-muted-foreground"> / {planned} dự kiến</span> : " buổi"}</strong></div>
    {percentage !== null && <div role="progressbar" aria-label="Buổi hoàn thành so với kế hoạch" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={completed + " buổi hoàn thành trên " + planned + " buổi dự kiến"} className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-300 motion-reduce:transition-none" style={{ width: percentage + "%" }} /></div>}
    {completed > planned && planned > 0 && <p className="text-xs text-muted-foreground">Số buổi hoàn thành đã vượt kế hoạch ban đầu.</p>}
    {planned === 0 && <p className="text-xs text-muted-foreground">Chưa có số buổi dự kiến để tính tỷ lệ.</p>}
  </div>;
}