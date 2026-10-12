"use client";

import { useState } from "react";
import { ArrowPathIcon, ArrowRightIcon, CheckCircleIcon, CloudArrowUpIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/ui/dialog";
import { InterviewCamera } from "./InterviewCamera";
import { InterviewTimer } from "./InterviewTimer";
import { InterviewNotice, interviewButtonClass, interviewPanelClass, type InterviewController } from "./InterviewUi";

export function InterviewSession({ interview }: { interview: InterviewController }) {
  const [confirmExit, setConfirmExit] = useState(false);
  const { state, phase, uploads } = interview;
  const prompt = state?.prompt;
  const recording = phase === "recording";
  const timed = phase === "preparing" || recording;
  return (
    <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className={interviewPanelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <MicrophoneIcon aria-hidden="true" className="size-4 text-primary" />
            {phase === "intro" ? "Buổi phỏng vấn" : state?.all_answered ? "Đã hoàn tất câu hỏi" : prompt ? `Câu ${prompt.question_number} / ${prompt.total_questions}` : "Câu trả lời của bạn"}
          </span>
          {prompt?.kind === "followup" && <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-foreground">Câu hỏi bổ sung</span>}
          {prompt?.group && !state?.all_answered && phase !== "intro" && <span className="text-xs text-muted-foreground">{prompt.group}</span>}
        </div>
        <div className="p-5 sm:p-7">
          {phase === "intro" ? <>
            <h2 className="font-nunito text-2xl font-extrabold leading-snug sm:text-3xl">Bắt đầu buổi phỏng vấn</h2>
            <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-muted-foreground">{state?.intro}</p>
            <Button className={`mt-7 w-full sm:w-auto ${interviewButtonClass}`} onClick={() => interview.prepare()}>Xem câu hỏi đầu tiên<ArrowRightIcon aria-hidden="true" className="size-4" /></Button>
          </> : <>
            {state?.all_answered && <CheckCircleIcon aria-hidden="true" className="mb-4 size-10 text-secondary" />}
            <h2 className="font-nunito text-2xl font-extrabold leading-snug sm:text-3xl">{state?.all_answered ? "Hoàn tất câu trả lời" : prompt?.title || "Đang đồng bộ câu hỏi"}</h2>
            <p className="mt-5 whitespace-pre-wrap text-base leading-8">{state?.all_answered ? state.outro : prompt?.text}</p>
            {state?.retry && <div className="mt-5"><InterviewNotice>{state.retry_message || "Vui lòng ghi lại câu trả lời này."}</InterviewNotice></div>}
            {timed && <div className="mt-7"><InterviewTimer remaining={interview.remaining} duration={(recording ? prompt?.answer_seconds : prompt?.prep_seconds) ?? 0} recording={recording} /></div>}
            <div className="mt-6 flex flex-wrap gap-3">
              {phase === "preparing" && <Button className={`w-full sm:w-auto ${interviewButtonClass}`} onClick={() => void interview.beginRecording()}><MicrophoneIcon aria-hidden="true" className="size-4" />Trả lời ngay</Button>}
              {recording && <Button className={`w-full sm:w-auto ${interviewButtonClass}`} onClick={() => void interview.finishRecording()}>Kết thúc và gửi câu trả lời</Button>}
              {["starting", "processing"].includes(phase) && <div role="status" className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm font-semibold text-primary"><ArrowPathIcon aria-hidden="true" className="size-5 motion-safe:animate-spin" />{phase === "starting" ? "Đang bắt đầu ghi…" : "AI đang xử lý câu trả lời…"}</div>}
              {phase === "complete" && <Button className={`w-full sm:w-auto ${interviewButtonClass}`} disabled={interview.pending || uploads.pending > 0} onClick={() => void interview.submitInterview()}>{interview.pending ? "Đang nộp…" : "Nộp bài phỏng vấn"}<ArrowRightIcon aria-hidden="true" className="size-4" /></Button>}
              {phase === "paused" && <>
                {interview.hasDraft && <Button className={interviewButtonClass} disabled={interview.pending} onClick={() => void interview.retryAnswer()}>Gửi lại bản ghi</Button>}
                <Button variant="outline" className={interviewButtonClass} disabled={interview.pending} onClick={() => void interview.syncState()}>Đồng bộ câu hỏi</Button>
                <Button variant="outline" className={interviewButtonClass} onClick={interview.recheckDevices}>Kiểm tra thiết bị và tiếp tục</Button>
              </>}
            </div>
            {phase === "complete" && uploads.pending > 0 && <p className="mt-4 text-sm leading-6 text-muted-foreground">Tải xong video để có thể nộp bài. Giữ trang này mở trong khi tải.</p>}
          </>}
        </div>
      </div>
      <aside className={`${interviewPanelClass} overflow-hidden`}>
        <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold">Góc phỏng vấn của bạn</h3></div>
        <div className="space-y-5 p-5">
          <InterviewCamera stream={interview.media.stream} recording={recording} />
          <p className="text-xs leading-5 text-muted-foreground">Giữ khuôn mặt trong khung hình và nói rõ vào micro.</p>
          <div className="flex items-start gap-3 border-t border-border pt-5">
            {uploads.pending > 0 ? <CloudArrowUpIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" /> : <CheckCircleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-secondary" />}
            <div className="min-w-0"><h3 className="text-sm font-semibold">Video phỏng vấn</h3><p role="status" className={`mt-1.5 text-xs leading-5 ${uploads.failed ? "text-destructive" : "text-muted-foreground"}`}>{uploads.failed ? `${uploads.failed} video chưa tải lên được` : uploads.pending ? `${uploads.pending} video đang chờ tải lên` : phase === "complete" ? "Các video đã tải xong" : "Video được tải tự động sau mỗi câu trả lời."}</p></div>
          </div>
          {uploads.failed > 0 && <Button variant="outline" className={`w-full ${interviewButtonClass}`} onClick={uploads.retryUploads}>Thử tải lại {uploads.failed} video</Button>}
          <div className="border-t border-border pt-4"><Button variant="outline" className={`w-full ${interviewButtonClass}`} disabled={interview.pending || ["recording", "starting", "processing"].includes(phase)} onClick={() => setConfirmExit(true)}>Thoát phỏng vấn</Button></div>
        </div>
      </aside>
      <Dialog open={confirmExit} onOpenChange={setConfirmExit}>
        <DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Thoát buổi phỏng vấn?</DialogTitle><DialogDescription>Lượt đã bắt đầu sẽ không được hoàn lại. Consultant hoặc Admin cần cấp lại lượt nếu bạn muốn phỏng vấn lại.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" className={interviewButtonClass} onClick={() => setConfirmExit(false)}>Tiếp tục làm bài</Button><Button variant="destructive" className={interviewButtonClass} disabled={interview.pending} onClick={() => { setConfirmExit(false); void interview.abandonInterview(); }}>Xác nhận thoát</Button></DialogFooter></DialogContent>
      </Dialog>
    </section>
  );
}
