"use client";

import { TUTOR_LMS_URL, getTutorPublicProfilePath } from "@workspace/core/constants/tutor-links";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorOnboardingViewModel } from "../TutorOnboardingProvider";

const DAY_LABELS: Record<string, string> = {
  mon: "Thứ Hai",
  tue: "Thứ Ba",
  wed: "Thứ Tư",
  thu: "Thứ Năm",
  fri: "Thứ Sáu",
  sat: "Thứ Bảy",
  sun: "Chủ Nhật",
};

const SLOT_LABELS: Record<string, string> = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
};

export function CompletedScreen() {
  const { session, state, isPreview } = useTutorOnboardingViewModel();
  const { profile, bankInfo, weeklyAvailability } = state;

  const availabilitySummary = Object.entries(weeklyAvailability)
    .filter(([, slots]) => slots && slots.length > 0)
    .map(([day, slots]) => `${DAY_LABELS[day] ?? day}: ${(slots ?? []).map((s) => SLOT_LABELS[s] ?? s).join(", ")}`)
    .join(" · ");

  return (
    <section className="grid gap-5">
      {/* Congratulations banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-center shadow-sm"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #1a0a5e 60%, var(--secondary) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-accent/10" />

        <div className="relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground text-3xl shadow-sm">
            🎉
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Chúc mừng, {session.user.firstName}!
          </h2>
          <p className="mt-2 text-base text-white/80">
            Bạn đã hoàn tất toàn bộ quá trình onboarding và chính thức trở thành gia sư BeeWise.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Profile summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Hồ sơ của bạn
          </p>

          {/* Avatar + name */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {session.user.firstName?.[0] ?? "T"}
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                {session.user.fullName}
              </p>
              {isPreview && <p className="text-sm text-muted-foreground">{profile.headline}</p>}
            </div>
          </div>

          {/* Profile details */}
          {isPreview && <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ProfileRow label="Môn dạy" value={profile.subjects.join(", ")} />
            <ProfileRow label="Học vấn" value={profile.education} />
            <ProfileRow
              label="Kinh nghiệm"
              value={profile.experience}
              fullWidth
            />
          </div>}

          {/* Availability summary */}
          {isPreview && availabilitySummary && (
            <div className="mt-4 rounded-xl bg-muted p-4">
              <p className="text-xs font-bold text-primary">Lịch rảnh đã thiết lập</p>
              <p className="mt-1 text-sm text-foreground/80">{availabilitySummary}</p>
            </div>
          )}

          {/* Bank info (masked) */}
          {isPreview ? <div className="mt-3 rounded-xl bg-muted p-4">
            <p className="text-xs font-bold text-primary">Ngân hàng nhận thanh toán</p>
            <p className="mt-1 text-sm text-foreground/80">
              {bankInfo.bankName} – TK:{" "}
              {"•".repeat(Math.max(0, bankInfo.accountNumber.length - 4))}
              {bankInfo.accountNumber.slice(-4)}
            </p>
          </div> : <p className="mt-5 rounded-xl bg-secondary/10 p-4 text-sm text-secondary">Thông tin ngân hàng và lịch rảnh của bạn đã được lưu trên hệ thống.</p>}
        </div>

        {/* CTA sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              Bắt đầu nhận lớp
            </p>
            <ul className="mt-3 grid gap-2">
              {[
                "Tutor LMS đã được mở",
                "Hồ sơ công khai đã kích hoạt",
                "Lịch rảnh đang chờ đặt lịch",
                "Thông báo nhận lớp qua email & app",
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

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => window.location.assign(TUTOR_LMS_URL)}
              className="w-full rounded-full bg-primary py-3 text-primary-foreground hover:bg-primary/90"
            >
              Vào Tutor LMS
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                window.location.assign(getTutorPublicProfilePath(session.user))
              }
              className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5"
            >
              Xem hồ sơ công khai
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProfileRow({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`rounded-lg bg-muted px-4 py-3 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}
