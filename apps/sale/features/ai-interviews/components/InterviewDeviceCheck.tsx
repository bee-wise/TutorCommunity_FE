import {
  CheckCircleIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewCamera } from "./InterviewCamera";
import {
  InterviewCheck,
  InterviewNotice,
  interviewButtonClass,
  interviewPanelClass,
  type InterviewController,
} from "./InterviewUi";

export function InterviewDeviceCheck({
  interview,
}: {
  interview: InterviewController;
}) {
  const { media } = interview;
  const recording = interview.micRecording || interview.micPending;
  const connected = Boolean(media.stream) && !media.deviceError;
  const resuming = Boolean(
    interview.eligibility.data?.resumable_interview_id ||
    interview.eligibility.data?.state === "IN_PROGRESS",
  );
  return (
    <section className={`${interviewPanelClass} p-5 sm:p-7`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-nunito text-xl font-extrabold sm:text-2xl">
            Bước 2: Kiểm tra thiết bị
          </h2>
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,1fr)]">
        <InterviewCamera
          stream={media.stream}
          recording={interview.micRecording}
          className="w-full"
        />
        <div className="min-w-0 space-y-4 lg:self-center">
          {media.deviceError && (
            <InterviewNotice tone="error">{media.deviceError}</InterviewNotice>
          )}
          {!connected ? (
            <>
              <p className="text-sm leading-6 text-muted-foreground">
                Cho phép trình duyệt dùng camera và micro. <br /> Bạn sẽ thấy
                hình ảnh của mình ở bên cạnh.
              </p>
              <Button
                className={`w-full ${interviewButtonClass}`}
                disabled={media.requesting}
                onClick={() => {
                  interview.setMicOk(false);
                  void media.requestDevices();
                }}
              >
                <VideoCameraIcon aria-hidden="true" className="size-4" />
                {media.requesting ? "Đang kết nối…" : "Kết nối camera và micro"}
              </Button>
            </>
          ) : !interview.micOk ? (
            <>
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-semibold">Đọc rõ trong 5 giây</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  “Xin chào BeeWise, tôi đã sẵn sàng chia sẻ kinh nghiệm giảng
                  dạy của mình.”
                </p>
              </div>
              <Button
                className={`w-full ${interviewButtonClass}`}
                disabled={recording}
                onClick={() => void interview.checkMic()}
              >
                <MicrophoneIcon aria-hidden="true" className="size-4" />
                {interview.micRecording
                  ? "Đang ghi thử 5 giây…"
                  : interview.micPending
                    ? "Đang kiểm tra âm thanh…"
                    : "Ghi thử micro"}
              </Button>
            </>
          ) : (
            <>
              <p
                role="status"
                className="flex items-center gap-2 text-sm font-semibold text-secondary"
              >
                <CheckCircleIcon aria-hidden="true" className="size-5" />
                Camera và micro đã sẵn sàng
              </p>
              <InterviewCheck
                checked={interview.timeConfirmed}
                onChange={interview.setTimeConfirmed}
              >
                Tôi đã dành đủ thời gian để hoàn thành buổi phỏng vấn.
              </InterviewCheck>
              <Button
                className={`w-full ${interviewButtonClass}`}
                disabled={!interview.timeConfirmed || interview.pending}
                onClick={() => void interview.confirmChecks()}
              >
                {interview.pending
                  ? "Đang bắt đầu…"
                  : resuming
                    ? "Tiếp tục phỏng vấn"
                    : "Bắt đầu phỏng vấn"}
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                Lượt phỏng vấn bắt đầu khi bạn nhấn nút này. Hãy giữ camera và
                micro hoạt động suốt buổi.
              </p>
            </>
          )}
          {connected && (
            <Button
              variant="ghost"
              className="w-full rounded-full text-sm text-muted-foreground"
              disabled={recording || interview.pending || media.requesting}
              onClick={() => {
                interview.setMicOk(false);
                void media.requestDevices();
              }}
            >
              Kết nối lại thiết bị
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
