import { ClockIcon } from "@heroicons/react/24/outline";

export function InterviewTimer({ remaining, duration, recording }: { remaining: number; duration: number; recording: boolean }) {
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const width = Math.min(100, Math.max(0, remaining / Math.max(1, duration) * 100));
  return <div className={`rounded-2xl border p-4 ${recording ? "border-destructive/20 bg-destructive/5" : "border-border bg-muted/40"}`}>
    <div className="flex items-center justify-between gap-4"><div><p className={`flex items-center gap-2 text-sm font-semibold ${recording ? "text-destructive" : "text-primary"}`}><ClockIcon aria-hidden="true" className="size-4" />{recording ? "Đang ghi câu trả lời" : "Thời gian chuẩn bị"}</p><p className="mt-1 text-xs text-muted-foreground">{recording ? "Hết giờ, bản ghi sẽ tự gửi." : "Hết giờ, hệ thống tự bắt đầu ghi."}</p></div><span role="timer" aria-label={`Còn ${remaining} giây`} className={`font-nunito text-3xl font-extrabold tabular-nums ${recording ? "text-destructive" : "text-foreground"}`}>{minutes}:{seconds}</span></div>
    <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-border"><div className={`h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none ${recording ? "bg-destructive" : "bg-primary"}`} style={{ width: `${width}%` }} /></div>
  </div>;
}
