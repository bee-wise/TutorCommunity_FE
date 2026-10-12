import { CheckCircleIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewCamera } from "./InterviewCamera";
import { InterviewNotice, interviewButtonClass, interviewPanelClass, type InterviewController } from "./InterviewUi";

export function InterviewReady({ interview }: { interview: InterviewController }) {
  const resumable = interview.eligibility.data?.state === "IN_PROGRESS" || Boolean(interview.eligibility.data?.resumable_interview_id);
  return <section className={`${interviewPanelClass} grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:gap-10`}>
    <div className="space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary"><CheckCircleIcon aria-hidden="true" className="size-4" />Đã hoàn tất kiểm tra thiết bị</span>
      <h2 className="font-nunito text-2xl font-extrabold leading-snug sm:text-3xl">Bạn đã sẵn sàng?</h2>
      <InterviewNotice>{resumable ? "Tiếp tục buổi trước trong vòng 30 phút kể từ hoạt động cuối. Các câu đã trả lời được giữ lại." : "Khi xác nhận bắt đầu, một lượt phỏng vấn sẽ được tính. Chủ động thoát hoặc không quay lại trong 30 phút vẫn tính lượt."}</InterviewNotice>
      <div className="flex flex-wrap gap-3"><Button className={`w-full sm:w-auto ${interviewButtonClass}`} disabled={interview.pending} onClick={() => void interview.beginInterview()}><PlayIcon aria-hidden="true" className="size-4" />{interview.pending ? "Đang kết nối…" : resumable ? "Tiếp tục buổi trước" : "Có, bắt đầu phỏng vấn"}</Button><Button variant="outline" className={`w-full sm:w-auto ${interviewButtonClass}`} disabled={interview.pending} onClick={interview.recheckDevices}>Kiểm tra lại thiết bị</Button></div>
    </div>
    <InterviewCamera stream={interview.media.stream} />
  </section>;
}
