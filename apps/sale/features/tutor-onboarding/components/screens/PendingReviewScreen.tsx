"use client";

import { Button } from "@workspace/ui/components/ui/button";

const reviewSteps = [
  { label: "Hồ sơ đã gửi", date: "12/07/2026", done: true },
  { label: "Phỏng vấn AI hoàn tất", date: "Đã hoàn thành", done: true },
  {
    label: "Đang xét duyệt",
    date: "1–3 ngày làm việc",
    done: false,
    current: true,
  },
  { label: "Nhận kết quả", date: "", done: false },
];

export function PendingReviewScreen() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Main: waiting state */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Animated waiting indicator */}
        <div className="flex flex-col items-center py-6 text-center sm:py-8">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-border" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-foreground">
            Đang xét duyệt hồ sơ
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Đội ngũ BeeWise đang thẩm định hồ sơ và kết quả phỏng vấn AI của
            bạn. Dự kiến có kết quả trong{" "}
            <strong className="text-primary">1–3 ngày làm việc</strong>.
          </p>
        </div>

        {/* Review timeline */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Tiến trình xét duyệt
          </p>
          <ol className="mt-4 grid gap-0">
            {reviewSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step.done
                        ? "bg-secondary text-secondary-foreground"
                        : step.current
                          ? "border-2 border-primary bg-card text-primary"
                          : "border-2 border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {step.done ? "✓" : i + 1}
                  </div>
                  {i < reviewSteps.length - 1 && (
                    <div
                      className={`mt-0.5 h-8 w-0.5 ${step.done ? "bg-secondary" : "bg-border"}`}
                    />
                  )}
                </div>
                {/* Content */}
                <div className="pb-2 pt-1">
                  <p
                    className={`text-sm font-semibold ${
                      step.current
                        ? "text-primary"
                        : step.done
                          ? "text-secondary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.date}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Sidebar: info + support */}
      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Trong thời gian chờ
          </p>
          <ul className="mt-3 grid gap-2">
            {[
              "Không cần thực hiện thêm thao tác nào",
              "BeeWise sẽ thông báo kết quả qua email",
              "Hồ sơ không thể chỉnh sửa trong giai đoạn này",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Cần hỗ trợ?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nếu bạn chưa nhận được kết quả sau 3 ngày làm việc, hãy liên hệ đội
            ngũ BeeWise.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full rounded-full border-primary/30 text-primary hover:bg-primary/5"
          >
            Liên hệ hỗ trợ
          </Button>
        </div>
      </aside>
    </section>
  );
}
