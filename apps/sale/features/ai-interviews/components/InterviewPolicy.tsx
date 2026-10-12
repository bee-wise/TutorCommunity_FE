import {
  ClockIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  InterviewCheck,
  interviewButtonClass,
  interviewPanelClass,
  type InterviewController,
} from "./InterviewUi";

const guidance = [
  {
    Icon: ClockIcon,
    title: "Có thời gian chuẩn bị",
    text: "Đọc câu hỏi trước khi ghi hình. Hệ thống hiển thị thời gian cho từng câu.",
  },
  {
    Icon: MicrophoneIcon,
    title: "Chia sẻ bằng lời nói",
    text: "Trả lời tự nhiên, rõ ràng và có ví dụ từ kinh nghiệm giảng dạy của bạn.",
  },
  {
    Icon: VideoCameraIcon,
    title: "Camera và micro luôn bật",
    text: "Chọn nơi yên tĩnh, đủ ánh sáng và giữ kết nối Internet ổn định.",
  },
];

export function InterviewPolicy({
  interview,
}: {
  interview: InterviewController;
}) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className={`${interviewPanelClass} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DocumentTextIcon aria-hidden="true" className="size-5" />
            </span>
            <h2 className="font-nunito text-xl font-extrabold">
              Quy định nền tảng
            </h2>
          </div>
          <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            Phiên bản {interview.policy.data?.version}
          </span>
        </div>
        <div className="space-y-5 p-5 sm:p-7">
          <div
            aria-label="Nội dung quy định"
            tabIndex={0}
            className="max-h-[420px] overflow-y-auto whitespace-pre-wrap pr-3 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base sm:leading-8"
          >
            {interview.policy.data?.content}
          </div>
          <div className="border-t border-border pt-5">
            <InterviewCheck
              checked={interview.policyConfirmed}
              onChange={interview.setPolicyConfirmed}
            >
              {interview.policy.data?.confirmation_text}
            </InterviewCheck>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-60 text-xs leading-5 text-muted-foreground">
                Đọc và xác nhận quy định trước khi kiểm tra thiết bị.
              </p>
              <Button
                className={`w-full sm:w-auto ${interviewButtonClass}`}
                disabled={!interview.policyConfirmed}
                onClick={interview.nextFromPolicy}
              >
                Tiếp tục kiểm tra thiết bị
              </Button>
            </div>
          </div>
        </div>
      </section>
      <aside className={`${interviewPanelClass} p-5 sm:p-6`}>
        <h3 className="font-nunito text-lg font-extrabold">
          Buổi phỏng vấn của bạn
        </h3>
        <ul className="mt-5 divide-y divide-border">
          {guidance.map(({ Icon, title, text }) => (
            <li
              key={title}
              className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary"
              />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
