"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
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

const metaItems = [
  { label: "Thời gian", value: "Linh hoạt 24/7" },
  { label: "Thời lượng", value: "15 – 20 phút" },
  { label: "Hình thức", value: "Trực tuyến cùng AI" },
  { label: "Đánh giá", value: "Tự động & khách quan" },
];

const benefits = [
  "Chủ động 100% thời gian, tham gia bất cứ khi nào bạn rảnh",
  "Không cần chờ đợi xếp lịch hẹn với cố vấn",
  "Phản hồi và chấm điểm minh bạch, khách quan",
  "Dữ liệu phỏng vấn được bảo mật tuyệt đối",
];

export function InterviewScreen() {
  const { dispatchAction, isPreview } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      {/* ── Main panel ── */}
      <div className="flex flex-col gap-5">
        {/* AI Interview Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Subtle top-edge accent stripe */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-primary" />

          <div className="p-6 pt-7">
            {/* Status badge row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                  isPreview
                    ? "bg-primary/8 text-primary ring-primary/20"
                    : "bg-muted text-muted-foreground ring-border"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isPreview ? "bg-primary" : "bg-muted-foreground"}`}
                />
                {isPreview ? "Phỏng vấn AI · Mở 24/7" : "Phỏng vấn AI · Sắp mở"}
              </span>

              {isPreview && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <CheckCircle
                    className="h-4 w-4"
                    weight="fill"
                    aria-hidden="true"
                  />
                  Sẵn sàng tham gia bất kỳ lúc nào
                </span>
              )}
            </div>

            {/* Headline */}
            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
                  Phỏng vấn năng lực giảng dạy cùng
                </h2>
                <Image
                  src="/icons/BeeWiseAI-icon.svg"
                  alt="BeeWise AI"
                  width={150}
                  height={72}
                  className="h-8 w-auto object-contain sm:h-11"
                  priority
                />
              </div>
              <p className="mt-2.5 max-w-xl text-sm leading-6 text-muted-foreground">
                {isPreview
                  ? "Hệ thống phỏng vấn AI của BeeWise hoạt động liên tục 24/7. Bạn không cần đặt lịch hẹn — hãy bắt đầu ngay khi cảm thấy sẵn sàng."
                  : "Hồ sơ của bạn đã được ghi nhận. Phỏng vấn AI là bước tiếp theo; BeeWise sẽ thông báo khi bạn có thể bắt đầu."}
              </p>
            </div>

            {/* Meta grid */}
            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {metaItems.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/80 bg-background px-3.5 py-2.5 shadow-xs"
                >
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-bold text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                disabled={!isPreview}
                onClick={() => dispatchAction("join-mock-interview")}
                className="rounded-full bg-primary px-7 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
              >
                {isPreview ? "Bắt đầu phỏng vấn ngay" : "Phỏng vấn AI sắp mở"}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!isPreview}
                onClick={() => dispatchAction("join-mock-interview")}
                className="rounded-full border-primary/30 text-primary hover:bg-primary/5 disabled:opacity-50"
              >
                Kiểm tra Micro &amp; Camera
              </Button>
            </div>
          </div>
        </div>

        {/* Prep checklist */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Chuẩn bị trước khi phỏng vấn
          </p>
          <ol className="mt-4 grid gap-3">
            {prepChecklist.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-foreground/80"
              >
                {/* Numbered step indicator — clean, no extraneous icon */}
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className="flex flex-col gap-4">
        <OnboardingVideoGuide
          title="Hướng dẫn phỏng vấn cùng Trợ lý AI"
          duration="3:30"
          description="Bí quyết trả lời tình huống sư phạm tự tin và đạt điểm tối đa cùng trợ lý AI."
        />

        {/* Benefits card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Lợi ích phỏng vấn AI
          </p>
          <ul className="mt-3.5 grid gap-2.5">
            {benefits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/80"
              >
                <CheckCircle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
                  weight="fill"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Dev preview controls */}
        {isPreview ? (
          <div className="rounded-xl border border-dashed border-border bg-muted p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              [Preview] Mô phỏng phỏng vấn AI hoàn tất:
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => dispatchAction("complete-mock-interview")}
              className="w-full rounded-lg border-primary/30 text-xs text-primary hover:bg-primary/5"
            >
              Hoàn tất phỏng vấn AI (mock)
            </Button>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
