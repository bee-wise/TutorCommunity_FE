"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/ui/dialog";
import { InterviewCamera } from "./InterviewCamera";
import type { useTutorInterview } from "../hooks/useTutorInterview";

const buttonClass = "rounded-full transition-all active:scale-[0.98]";
export function InterviewSession({ interview }: { interview: ReturnType<typeof useTutorInterview> }) {
  const [confirmExit, setConfirmExit] = useState(false);
  const { state, phase, uploads } = interview;
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <div className="rounded-[32px] border border-border bg-card p-5 shadow-[var(--bw-shadow-soft)] sm:p-7">
        {phase === "intro" ? <><h2 className="text-xl font-bold">Bắt đầu buổi phỏng vấn</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{state?.intro}</p><Button className={`mt-5 ${buttonClass}`} onClick={() => interview.prepare()}>Xem câu hỏi đầu tiên</Button></> : <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">Câu {state?.prompt?.question_number} / {state?.prompt?.total_questions}{state?.prompt?.kind === "followup" ? " · Bổ sung" : ""}</span>
            {["preparing", "recording"].includes(phase) && <span role="timer" className={`rounded-full px-4 py-2 text-sm font-bold tabular-nums ${phase === "recording" ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>{phase === "recording" ? "Đang ghi" : "Chuẩn bị"} · {interview.remaining}s</span>}
          </div>
          <h2 className="mt-5 text-xl font-bold leading-snug">{state?.all_answered ? "Hoàn tất câu trả lời" : state?.prompt?.title}</h2>
          <p className="mt-4 whitespace-pre-wrap text-base leading-7">{state?.all_answered ? state.outro : state?.prompt?.text}</p>
          {state?.retry && <p role="status" className="mt-4 rounded-2xl border border-border bg-muted p-4 text-sm">{state.retry_message || "Vui lòng ghi lại câu trả lời này."}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {phase === "preparing" && <Button className={buttonClass} onClick={() => void interview.beginRecording()}>Trả lời ngay</Button>}
            {phase === "recording" && <Button className={buttonClass} onClick={() => void interview.finishRecording()}>Kết thúc và gửi câu trả lời</Button>}
            {["starting", "processing"].includes(phase) && <p role="status" className="text-sm font-semibold text-primary">{phase === "starting" ? "Đang bắt đầu ghi…" : "AI đang xử lý câu trả lời…"}</p>}
            {phase === "complete" && <Button className={buttonClass} disabled={interview.pending || uploads.pending > 0} onClick={() => void interview.submitInterview()}>{interview.pending ? "Đang nộp…" : "Nộp bài phỏng vấn"}</Button>}
            {phase === "paused" && <>
              {interview.hasDraft && <Button className={buttonClass} disabled={interview.pending} onClick={() => void interview.retryAnswer()}>Gửi lại bản ghi</Button>}
              <Button variant="outline" className={buttonClass} disabled={interview.pending} onClick={() => void interview.syncState()}>Đồng bộ câu hỏi</Button>
              <Button variant="outline" className={buttonClass} onClick={interview.recheckDevices}>Kiểm tra thiết bị và tiếp tục</Button>
            </>}
          </div>
          {phase === "preparing" && <p className="mt-3 text-xs text-muted-foreground">Hết thời gian chuẩn bị, hệ thống tự bắt đầu ghi. Hết thời gian trả lời, hệ thống tự dừng và gửi.</p>}
        </>}
      </div>
      <aside className="space-y-4">
        <InterviewCamera stream={interview.media.stream} />
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--bw-shadow-soft)]">
          <h3 className="font-bold">Video phỏng vấn</h3>
          <p role="status" className="mt-3 text-sm">{uploads.pending ? `${uploads.pending} video đang chờ tải lên` : "Các video đã tải xong"}</p>
          {uploads.failed > 0 && <Button variant="outline" className={`mt-3 ${buttonClass}`} onClick={uploads.retryUploads}>Thử tải lại {uploads.failed} video</Button>}
          <Button variant="outline" className={`mt-5 w-full ${buttonClass}`} disabled={interview.pending || ["recording", "starting", "processing"].includes(phase)} onClick={() => setConfirmExit(true)}>Thoát phỏng vấn</Button>
        </div>
      </aside>
      <Dialog open={confirmExit} onOpenChange={setConfirmExit}><DialogContent><DialogHeader><DialogTitle>Thoát buổi phỏng vấn?</DialogTitle><DialogDescription>Lượt đã bắt đầu sẽ không được hoàn lại. Consultant hoặc Admin cần cấp lại lượt nếu bạn muốn phỏng vấn lại.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" className={buttonClass} onClick={() => setConfirmExit(false)}>Tiếp tục làm bài</Button><Button variant="destructive" className={buttonClass} disabled={interview.pending} onClick={() => { setConfirmExit(false); void interview.abandonInterview(); }}>Xác nhận thoát</Button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}
