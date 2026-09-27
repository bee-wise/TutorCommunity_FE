"use client";

import { useState } from "react";
import { Eye } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { useTutorOnboardingViewModel } from "../TutorOnboardingProvider";
import { OnboardingVideoGuide } from "../OnboardingVideoGuide";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[#3f3b55]">
      <span>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export function ProfileDraftScreen() {
  const { state, dispatchAction } = useTutorOnboardingViewModel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate brief loading before dispatching action
    setTimeout(() => {
      dispatchAction("submit-profile");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Main form */}
      <form
        className="rounded-2xl border border-[#cfe1fa] bg-white p-6 shadow-[0_14px_34px_rgba(40,15,145,0.08)]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold text-[#0c0c0b]">
          Thông tin hồ sơ gia sư
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5e6688]">
          Hồ sơ chứa thông tin công khai và minh chứng chuyên môn. Thông tin
          ngân hàng và lịch rảnh sẽ được bổ sung sau khi được duyệt.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Tiêu đề hồ sơ" required>
            <Input
              defaultValue={state.profile.headline}
              placeholder="Ví dụ: Gia sư Toán THPT tại TP.HCM"
              className="rounded-lg border-[#cfe1fa] focus:border-[#280f91] focus:ring-[#280f91]/20"
            />
          </Field>
          <Field label="Học vấn" required>
            <Input
              defaultValue={state.profile.education}
              placeholder="Ví dụ: Đại học Sư phạm TP.HCM – Năm 3"
              className="rounded-lg border-[#cfe1fa] focus:border-[#280f91] focus:ring-[#280f91]/20"
            />
          </Field>
          <Field label="Môn dạy" required>
            <Input
              defaultValue={state.profile.subjects.join(", ")}
              placeholder="Ví dụ: Toán, Vật lý, Luyện thi vào 10"
              className="rounded-lg border-[#cfe1fa] focus:border-[#280f91] focus:ring-[#280f91]/20"
            />
          </Field>
          <Field label="Minh chứng đính kèm" required>
            <Input
              defaultValue={state.profile.documents.join(", ")}
              placeholder="Ví dụ: Thẻ sinh viên, Bảng điểm"
              className="rounded-lg border-[#cfe1fa] focus:border-[#280f91] focus:ring-[#280f91]/20"
            />
          </Field>
          <label className="grid gap-1.5 text-sm font-semibold text-[#3f3b55] md:col-span-2">
            <span>
              Kinh nghiệm giảng dạy
              <span className="ml-1 text-red-500">*</span>
            </span>
            <textarea
              className="min-h-24 rounded-lg border border-[#cfe1fa] bg-transparent px-3 py-2 text-sm text-[#0c0c0b] outline-none transition focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/20 placeholder:text-[#5e6688]/60"
              defaultValue={state.profile.experience}
              placeholder="Mô tả kinh nghiệm giảng dạy của bạn..."
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-[#3f3b55] md:col-span-2">
            <span>Phương pháp giảng dạy</span>
            <textarea
              className="min-h-24 rounded-lg border border-[#cfe1fa] bg-transparent px-3 py-2 text-sm text-[#0c0c0b] outline-none transition focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/20 placeholder:text-[#5e6688]/60"
              defaultValue={state.profile.teachingMethod}
              placeholder="Ví dụ: Cá nhân hóa lộ trình, phản hồi sau mỗi buổi học..."
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatchAction("save-draft")}
            className="rounded-full border-[#280f91]/30 text-[#280f91] hover:bg-[#280f91]/5"
          >
            Lưu nháp
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatchAction("preview-profile")}
            className="rounded-full border-[#280f91]/30 text-[#280f91] hover:bg-[#280f91]/5"
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Xem trước hồ sơ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto rounded-full bg-[#280f91] px-6 text-white hover:bg-[#1f0b70] disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi hồ sơ"}
          </Button>
        </div>
      </form>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <OnboardingVideoGuide
          title="Hướng dẫn hoàn thiện hồ sơ gia sư"
          duration="4:32"
          description="Cách điền thông tin đúng chuẩn để tăng tỷ lệ được duyệt."
        />

        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
            Checklist hồ sơ
          </p>
          <ul className="mt-3 grid gap-2">
            {[
              "Học vấn và chuyên ngành rõ ràng",
              "Môn dạy và cấp độ cụ thể",
              "Kinh nghiệm giảng dạy thực tế",
              "Minh chứng hợp lệ (thẻ SV, bằng cấp)",
              "Phương pháp giảng dạy riêng",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#3f3b55]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#447353]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
