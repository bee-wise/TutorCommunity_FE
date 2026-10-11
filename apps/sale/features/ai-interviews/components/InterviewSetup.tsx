"use client";

import { MicrophoneIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { useTutorInterview } from "../hooks/useTutorInterview";
import { InterviewCamera } from "./InterviewCamera";

type Controller = ReturnType<typeof useTutorInterview>;
const buttonClass = "rounded-full transition-all active:scale-[0.98]";

export function InterviewSetup({ interview }: { interview: Controller }) {
  const { phase, policy, eligibility, media } = interview;
  const resumable =
    eligibility.data?.state === "IN_PROGRESS" ||
    Boolean(eligibility.data?.resumable_interview_id);
  if (phase === "policy")
    return (
      <section className="rounded-[32px] border border-border bg-card p-5 shadow-[var(--bw-shadow-soft)] sm:p-7">
        <h2 className="text-xl font-bold leading-snug">Quy định nền tảng</h2>

        <div
          className="mt-5 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-border bg-background p-5 text-sm leading-7"
          tabIndex={0}
        >
          {policy.data?.content}
        </div>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm">
          <input
            type="checkbox"
            checked={interview.policyConfirmed}
            onChange={(event) =>
              interview.setPolicyConfirmed(event.target.checked)
            }
            className="mt-1 size-4 accent-primary"
          />
          <span>{policy.data?.confirmation_text}</span>
        </label>
        <Button
          className={`mt-5 ${buttonClass}`}
          disabled={!interview.policyConfirmed}
          onClick={interview.nextFromPolicy}
        >
          Tiếp tục kiểm tra thiết bị
        </Button>
      </section>
    );
  if (phase === "ready")
    return (
      <section className="rounded-[32px] border border-border bg-card p-6 shadow-[var(--bw-shadow-soft)]">
        <h2 className="text-xl font-bold">Bạn đã sẵn sàng?</h2>
        <p className="mt-4 text-sm leading-6">
          {resumable
            ? "Tiếp tục buổi trước trong vòng 30 phút kể từ hoạt động cuối. Các câu đã trả lời được giữ lại."
            : "Khi xác nhận bắt đầu, một lượt phỏng vấn sẽ được tính. Chủ động thoát hoặc không quay lại trong 30 phút vẫn tính lượt."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            className={buttonClass}
            disabled={interview.pending}
            onClick={() => void interview.beginInterview()}
          >
            {interview.pending
              ? "Đang kết nối…"
              : resumable
                ? "Tiếp tục buổi trước"
                : "Có, bắt đầu phỏng vấn"}
          </Button>
          <Button
            variant="outline"
            className={buttonClass}
            disabled={interview.pending}
            onClick={interview.recheckDevices}
          >
            Kiểm tra lại thiết bị
          </Button>
        </div>
      </section>
    );
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <div className="rounded-[32px] border border-border bg-card p-5 shadow-[var(--bw-shadow-soft)] sm:p-7">
        <h2 className="mb-5 text-xl font-bold">Kiểm tra camera và micro</h2>
        <InterviewCamera stream={media.stream} />
        {media.deviceError && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {media.deviceError}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className={buttonClass}
            disabled={
              media.requesting || interview.micRecording || interview.micPending
            }
            onClick={() => {
              interview.setMicOk(false);
              void media.requestDevices();
            }}
          >
            {media.requesting ? "Đang mở thiết bị…" : "Kết nối camera và micro"}
          </Button>
          <Button
            className={buttonClass}
            disabled={
              !media.stream ||
              Boolean(media.deviceError) ||
              interview.micRecording ||
              interview.micPending
            }
            onClick={() => void interview.checkMic()}
          >
            <MicrophoneIcon className="size-4" />
            {interview.micRecording
              ? "Đang ghi thử 5 giây…"
              : interview.micPending
                ? "Đang kiểm tra âm thanh…"
                : "Ghi thử micro"}
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Đọc rõ trong 5 giây: “Xin chào BeeWise, tôi đã sẵn sàng chia sẻ kinh
          nghiệm giảng dạy của mình.”
        </p>
        {interview.micOk && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <CheckCircleIcon className="size-4" />
            Micro đã đạt kiểm tra
          </p>
        )}
      </div>
      <aside className="rounded-3xl border border-border bg-card p-5 shadow-[var(--bw-shadow-soft)]">
        <h3 className="font-bold">Trước khi bắt đầu</h3>
        <ul className="mt-4 grid gap-3 text-sm leading-6">
          <li>Không gian yên tĩnh, đủ ánh sáng.</li>
          <li>Kết nối Internet ổn định.</li>
          <li>Camera và micro phải hoạt động suốt buổi.</li>
        </ul>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-primary"
            checked={interview.timeConfirmed}
            onChange={(event) =>
              interview.setTimeConfirmed(event.target.checked)
            }
          />
          <span>Tôi đã dành đủ thời gian để hoàn thành buổi phỏng vấn.</span>
        </label>
        <Button
          className={`mt-5 w-full ${buttonClass}`}
          disabled={
            !interview.micOk ||
            !interview.timeConfirmed ||
            !media.stream ||
            Boolean(media.deviceError) ||
            interview.pending
          }
          onClick={() => void interview.confirmChecks()}
        >
          Xác nhận kiểm tra
        </Button>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Kiểm tra thiết bị và xác nhận quy định chưa tính lượt.
        </p>
      </aside>
    </section>
  );
}
