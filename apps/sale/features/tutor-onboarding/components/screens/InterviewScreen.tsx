"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  Microphone,
  Sparkle,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import { useTutorOnboardingViewModel } from "../TutorOnboardingProvider";
import { OnboardingVideoGuide } from "../OnboardingVideoGuide";
import { Button } from "@workspace/ui/components/ui/button";

const prepChecklist = [
  "Chọn không gian yên tĩnh, đủ ánh sáng và kết nối Internet ổn định",
  "Đảm bảo đã cấp quyền truy cập Camera và Micro cho trình duyệt",
  "Chuẩn bị phần giới thiệu ngắn về bản thân và kinh nghiệm giảng dạy",
  "Lắng nghe kỹ câu hỏi tình huống từ AI và phản hồi tự nhiên, rõ ràng",
  "Hệ thống hỗ trợ phỏng vấn lại nếu gặp sự cố kỹ thuật bất khả kháng",
];

export function InterviewScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      {/* Main panel */}
      <div className="flex flex-col gap-5">
        {/* AI Interview Hero Card */}
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-6 shadow-[0_14px_34px_rgba(40,15,145,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3cb] px-3.5 py-1 text-xs font-bold text-[#905b0f] ring-1 ring-[#ffc510]/40">
              <Sparkle className="h-3.5 w-3.5" weight="fill" />
              Phỏng vấn tự động AI • Mở 24/7
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#447353]">
              <CheckCircle className="h-4 w-4" weight="fill" />
              Sẵn sàng tham gia bất kỳ lúc nào
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#0c0c0b] sm:text-2xl">
            Phỏng vấn năng lực giảng dạy cùng Trợ lý AI
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#3f3b55]">
            Hệ thống phỏng vấn AI của BeeWise hoạt động liên tục 24/7. Bạn không
            cần đặt lịch hẹn trước với cố vấn, hãy bắt đầu ngay khi bạn cảm thấy
            tự tin và chuẩn bị đầy đủ nhất.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoRow
              icon={<Clock className="h-4 w-4 text-[#280f91]" />}
              label="Thời gian"
              value="Linh hoạt 24/7 (Tham gia mọi lúc)"
            />
            <InfoRow
              icon={<Sparkle className="h-4 w-4 text-[#280f91]" />}
              label="Thời lượng dự kiến"
              value="Khoảng 15 – 20 phút"
            />
            <InfoRow
              icon={<VideoCamera className="h-4 w-4 text-[#280f91]" />}
              label="Hình thức"
              value="Trực tuyến tương tác cùng AI"
            />
            <InfoRow
              icon={<Microphone className="h-4 w-4 text-[#280f91]" />}
              label="Đánh giá kết quả"
              value="Tự động ghi nhận & chấm điểm"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => dispatchAction("join-mock-interview")}
              className="rounded-full bg-[#280f91] px-7 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1f0b70] hover:shadow-lg"
            >
              <VideoCamera className="mr-2 h-4 w-4" />
              Bắt đầu phỏng vấn AI ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatchAction("join-mock-interview")}
              className="rounded-full border-[#280f91]/25 text-[#280f91] hover:bg-[#280f91]/5"
            >
              Kiểm tra Micro & Camera
            </Button>
          </div>
        </div>

        {/* Prep checklist */}
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-6 shadow-[0_14px_34px_rgba(40,15,145,0.08)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
            Hướng dẫn chuẩn bị trước khi vào phỏng vấn
          </p>
          <ul className="mt-3.5 grid gap-3">
            {prepChecklist.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-[#3f3b55]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#280f91]/10 text-[10px] font-bold text-[#280f91]">
                  {i + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <OnboardingVideoGuide
          title="Hướng dẫn phỏng vấn cùng Trợ lý AI"
          duration="3:30"
          description="Bí quyết trả lời tình huống sư phạm tự tin và đạt điểm tối đa cùng trợ lý AI."
        />

        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
            Lợi ích phỏng vấn AI
          </p>
          <ul className="mt-3 grid gap-2.5">
            {[
              "Chủ động 100% thời gian, tham gia bất cứ khi nào bạn rảnh",
              "Không cần chờ đợi xếp lịch hẹn với cố vấn",
              "Phản hồi và chấm điểm minh bạch, khách quan",
              "Dữ liệu phỏng vấn được bảo mật tuyệt đối",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs leading-relaxed text-[#3f3b55]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffc510]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Dev-only: simulate completion */}
        <div className="rounded-xl border border-dashed border-[#cfe1fa] bg-[#cfe1fa]/20 p-3">
          <p className="mb-2 text-xs font-semibold text-[#5e6688]">
            [Preview] Mô phỏng phỏng vấn AI hoàn tất:
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => dispatchAction("complete-mock-interview")}
            className="w-full rounded-lg border-[#280f91]/30 text-xs text-[#280f91] hover:bg-[#280f91]/5"
          >
            Hoàn tất phỏng vấn AI (mock)
          </Button>
        </div>
      </aside>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#cfe1fa]/20 p-3.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#cfe1fa]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#5e6688]">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-[#0c0c0b]">{value}</p>
      </div>
    </div>
  );
}
