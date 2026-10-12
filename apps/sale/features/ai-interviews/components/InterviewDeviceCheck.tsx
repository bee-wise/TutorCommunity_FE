import { CheckCircleIcon, ClockIcon, MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewCamera } from "./InterviewCamera";
import { InterviewCheck, InterviewNotice, interviewButtonClass, interviewPanelClass, type InterviewController } from "./InterviewUi";

export function InterviewDeviceCheck({ interview }: { interview: InterviewController }) {
  const { media } = interview;
  const recording = interview.micRecording || interview.micPending;
  const checks = [
    { label: "Camera", ready: Boolean(media.stream) && !media.deviceError, text: media.stream ? "Đã kết nối" : "Chưa kết nối", Icon: VideoCameraIcon },
    { label: "Micro", ready: interview.micOk, text: interview.micOk ? "Đã đạt kiểm tra" : "Cần ghi thử", Icon: MicrophoneIcon },
    { label: "Thời gian", ready: interview.timeConfirmed, text: interview.timeConfirmed ? "Đã xác nhận" : "Chờ bạn xác nhận", Icon: ClockIcon },
  ];
  return <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div className={`${interviewPanelClass} p-5 sm:p-7`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-nunito text-xl font-extrabold">Kiểm tra camera và micro</h2><span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">Chưa tính lượt</span></div>
      <InterviewCamera stream={media.stream} recording={interview.micRecording} />
      {media.deviceError && <div className="mt-4"><InterviewNotice tone="error">{media.deviceError}</InterviewNotice></div>}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="outline" className={`w-full sm:w-auto ${interviewButtonClass}`} disabled={media.requesting || recording} onClick={() => { interview.setMicOk(false); void media.requestDevices(); }}><VideoCameraIcon aria-hidden="true" className="size-4" />{media.requesting ? "Đang mở thiết bị…" : "Kết nối camera và micro"}</Button>
        <Button className={`w-full sm:w-auto ${interviewButtonClass}`} disabled={!media.stream || Boolean(media.deviceError) || recording} onClick={() => void interview.checkMic()}><MicrophoneIcon aria-hidden="true" className="size-4" />{interview.micRecording ? "Đang ghi thử 5 giây…" : interview.micPending ? "Đang kiểm tra âm thanh…" : "Ghi thử micro"}</Button>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4"><p className="text-sm font-semibold">Đọc rõ trong 5 giây</p><p className="mt-2 text-sm leading-7 text-muted-foreground">“Xin chào BeeWise, tôi đã sẵn sàng chia sẻ kinh nghiệm giảng dạy của mình.”</p></div>
      {interview.micOk && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-secondary"><CheckCircleIcon aria-hidden="true" className="size-5" />Micro đã đạt kiểm tra</p>}
    </div>
    <aside className={`${interviewPanelClass} p-5 sm:p-6`}>
      <h3 className="font-nunito text-lg font-extrabold">Sẵn sàng trước khi bắt đầu</h3>
      <ul className="mt-5 divide-y divide-border">{checks.map(({ label, ready, text, Icon }) => <li key={label} className="flex items-center justify-between gap-3 py-4 first:pt-0"><div className="flex min-w-0 items-start gap-3"><Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" /><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{text}</p></div></div>{ready ? <CheckCircleIcon aria-label={`${label} đã sẵn sàng`} className="size-5 shrink-0 text-secondary" /> : <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-border" />}</li>)}</ul>
      <div className="mt-5"><InterviewCheck checked={interview.timeConfirmed} onChange={interview.setTimeConfirmed}>Tôi đã dành đủ thời gian để hoàn thành buổi phỏng vấn.</InterviewCheck></div>
      <Button className={`mt-5 w-full ${interviewButtonClass}`} disabled={!interview.micOk || !interview.timeConfirmed || !media.stream || Boolean(media.deviceError) || interview.pending} onClick={() => void interview.confirmChecks()}>Xác nhận kiểm tra</Button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Giữ camera và micro hoạt động suốt buổi. Kiểm tra thiết bị chưa tính lượt phỏng vấn.</p>
    </aside>
  </section>;
}
