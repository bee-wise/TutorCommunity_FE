"use client";

import { Warning } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/ui/button";
import { onboardingSteps } from "../constants/tutor-onboarding.fixtures";
import { useTutorOnboardingViewModel } from "./TutorOnboardingProvider";
import {
  PrimaryScreenActions,
  StatusCard,
  StepDetailPanel,
} from "./TutorOnboardingLayout";
import {
  CompletedScreen,
  InterviewScreen,
  PendingReviewScreen,
  PostApprovalScreen,
  ProfileDraftScreen,
} from "./screens";

export function TutorOnboardingScreenView() {
  const { view } = useTutorOnboardingViewModel();

  switch (view.currentScreen) {
    case "JOURNEY":
      return <JourneyScreen />;
    case "OVERVIEW":
      return <OverviewScreen />;
    case "PROFILE_DRAFT":
      return <ProfileDraftScreen />;
    case "INTERVIEW":
      return <InterviewScreen />;
    case "PENDING_REVIEW":
      return <PendingReviewScreen />;
    case "REJECTED":
      return <RejectedScreen />;
    case "APPROVED":
      return <ApprovedScreen />;
    case "POST_APPROVAL":
      return <PostApprovalScreen />;
    case "COMPLETED":
      return <CompletedScreen />;
    default:
      return <UnknownScenarioScreen />;
  }
}

function JourneyScreen() {
  const { state } = useTutorOnboardingViewModel();
  const selectedStep =
    onboardingSteps.find((step) => step.id === state.selectedStepId) ??
    onboardingSteps[1];

  return <StepDetailPanel step={selectedStep} />;
}

function OverviewScreen() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <StatusCard title="Lộ trình trở thành gia sư BeeWise">
        <div className="grid gap-3">
          {onboardingSteps.slice(1).map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-3 rounded-lg border border-[#cfe1fa] bg-white p-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#280f91]/10 text-xs font-bold text-[#280f91]">
                {step.order}
              </span>
              <div>
                <p className="text-sm font-bold text-[#0c0c0b]">{step.title}</p>
                <p className="mt-0.5 text-xs text-[#5e6688]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </StatusCard>
      <StatusCard title="Sẵn sàng bắt đầu?" tone="success">
        <p>
          Hãy hoàn thiện hồ sơ trước. Sau khi gửi, BeeWise sẽ sắp xếp phỏng vấn
          để xác thực chuyên môn của bạn.
        </p>
        <div className="mt-4">
          <PrimaryScreenActions />
        </div>
      </StatusCard>
    </section>
  );
}

function RejectedScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Hồ sơ cần cập nhật" tone="warning">
        <p className="font-semibold text-[#0c0c0b]">
          Một số thông tin trong hồ sơ chưa đáp ứng yêu cầu. Vui lòng xem phản
          hồi bên dưới và gửi lại.
        </p>
        <div className="mt-4 rounded-lg border border-[#ffc510]/30 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#905b0f]">
            Mục cần chỉnh sửa
          </p>
          <ul className="mt-2 grid gap-1.5">
            {[
              "Ảnh minh chứng chưa rõ thông tin (thẻ sinh viên)",
              "Phần mô tả kinh nghiệm giảng dạy còn quá ngắn",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#3f3b55]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#905b0f]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </StatusCard>
      <StatusCard title="Gửi lại hồ sơ">
        <p>Sau khi chỉnh sửa, gửi lại hồ sơ để BeeWise xét duyệt lần tiếp theo.</p>
        <div className="mt-4 grid gap-3">
          <Button
            onClick={() => dispatchAction("edit-rejected-profile")}
            className="rounded-full bg-[#280f91] text-white hover:bg-[#1f0b70]"
          >
            Chỉnh sửa hồ sơ
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatchAction("resubmit-profile")}
            className="rounded-full border-[#280f91]/30 text-[#280f91]"
          >
            Gửi lại hồ sơ
          </Button>
          <Button variant="outline" className="rounded-full border-[#cfe1fa] text-[#5e6688]">
            Liên hệ BeeWise
          </Button>
        </div>
      </StatusCard>
    </section>
  );
}

function ApprovedScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Chúc mừng! Hồ sơ đã được phê duyệt" tone="success">
        <p className="font-semibold text-[#0c0c0b]">
          Hồ sơ gia sư của bạn đã đạt yêu cầu xác thực của BeeWise.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoItem label="Trạng thái hồ sơ" value="Đã phê duyệt" />
          <InfoItem label="Hồ sơ công khai" value="Sẵn sàng kích hoạt" />
          <InfoItem label="Ngày phê duyệt" value="18/07/2026" />
          <InfoItem label="Bước tiếp theo" value="Bổ sung thông tin" />
        </div>
      </StatusCard>
      <StatusCard title="Hoàn tất để nhận lớp">
        <ol className="grid gap-2">
          <li className="flex items-start gap-2 text-sm text-[#3f3b55]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#280f91]/10 text-[10px] font-bold text-[#280f91]">
              1
            </span>
            Bổ sung tài khoản ngân hàng nhận thanh toán.
          </li>
          <li className="flex items-start gap-2 text-sm text-[#3f3b55]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#280f91]/10 text-[10px] font-bold text-[#280f91]">
              2
            </span>
            Thiết lập lịch rảnh có thể nhận lớp.
          </li>
        </ol>
        <div className="mt-4">
          <Button
            onClick={() => dispatchAction("open-post-approval-form")}
            className="w-full rounded-full bg-[#280f91] text-white hover:bg-[#1f0b70]"
          >
            Bổ sung thông tin
          </Button>
        </div>
        <p className="mt-3 text-xs text-[#5e6688]">
          Tutor LMS sẽ được mở sau khi hoàn tất bước này.
        </p>
      </StatusCard>
    </section>
  );
}

function UnknownScenarioScreen() {
  return (
    <StatusCard title="Kịch bản không hợp lệ" tone="warning">
      <div className="flex gap-3">
        <Warning className="h-5 w-5 shrink-0 text-[#905b0f]" aria-hidden="true" />
        <p>
          Trạng thái tài khoản chưa được xác định. LMS không được mở và Tutor
          chưa được xem là đã xác thực. Vui lòng liên hệ hỗ trợ nếu cần.
        </p>
      </div>
    </StatusCard>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-semibold text-[#5e6688]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#0c0c0b]">{value}</p>
    </div>
  );
}

