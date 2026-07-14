"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  GraduationCap,
  Laptop,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import {
  TUTOR_LMS_URL,
  getTutorPublicProfilePath,
} from "@workspace/core/constants/tutor-links";
import { onboardingSteps } from "../tutor-onboarding.fixtures";
import { useTutorOnboardingViewModel } from "../tutor-onboarding.provider";
import type { AvailabilitySlot } from "../tutor-onboarding.types";
import {
  PrimaryScreenActions,
  StepDetailPanel,
  StatusCard,
  onboardingNotice,
} from "./TutorOnboardingLayout";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground/80">
      {label}
      {children}
    </label>
  );
}

function ReadOnlyItem({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof CheckCircle2;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-white p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

export function TutorOnboardingScreen() {
  const { view } = useTutorOnboardingViewModel();

  switch (view.currentScreen) {
    case "JOURNEY":
      return <JourneyScreen />;
    case "OVERVIEW":
      return <OverviewScreen />;
    case "PROFILE_DRAFT":
      return <ProfileDraftScreen />;
    case "LISTING_WAIVED":
      return <ListingWaivedScreen />;
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

  return (
    <div className="grid gap-5">
      <StepDetailPanel step={selectedStep} />
      <div className="grid gap-5 md:grid-cols-3">
        <StatusCard title="Chuỗi onboarding" tone="success">
          7 giai đoạn từ tạo tài khoản đến mở Tutor LMS, gom trong một
          màn hình để nhóm chụp slide.
        </StatusCard>
        <StatusCard title="Thanh toán">
          Được miễn phí kỳ đầu trong chương trình dành cho gia sư mới.
        </StatusCard>
        <StatusCard title="Trạng thái LMS">
          Tutor LMS được mở sau khi hoàn tất toàn bộ thông tin cần thiết.
        </StatusCard>
      </div>
    </div>
  );
}

function OverviewScreen() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <StatusCard title="Việc cần làm tiếp theo">
        <div className="grid gap-3">
          {onboardingSteps.slice(1, 5).map((step) => (
            <ReadOnlyItem
              key={step.id}
              icon={FileText}
              title={step.title}
              value={step.description}
            />
          ))}
        </div>
      </StatusCard>
      <StatusCard title="Sẵn sàng bắt đầu?" tone="success">
        <p>
          Hãy hoàn thiện hồ sơ trước. Sau khi gửi, BeeWise sẽ hướng dẫn bạn đến
          bước thanh toán và phỏng vấn.
        </p>
        <div className="mt-4">
          <PrimaryScreenActions />
        </div>
      </StatusCard>
    </section>
  );
}

function ProfileDraftScreen() {
  const { state, dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <form
        className="rounded-xl border border-border bg-white p-5 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          dispatchAction("submit-profile");
        }}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl">Form hồ sơ gia sư</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Hồ sơ chỉ chứa thông tin công khai và minh chứng chuyên môn. Không có
          thông tin ngân hàng hoặc lịch rảnh ở bước này.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Tiêu đề hồ sơ">
            <Input defaultValue={state.profile.headline} />
          </Field>
          <Field label="Học vấn">
            <Input defaultValue={state.profile.education} />
          </Field>
          <Field label="Môn dạy">
            <Input defaultValue={state.profile.subjects.join(", ")} />
          </Field>
          <Field label="Minh chứng">
            <Input defaultValue={state.profile.documents.join(", ")} />
          </Field>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground/80 md:col-span-2">
            Kinh nghiệm giảng dạy
            <textarea
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              defaultValue={state.profile.experience}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground/80 md:col-span-2">
            Phương pháp giảng dạy
            <textarea
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              defaultValue={state.profile.teachingMethod}
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={() => dispatchAction("save-draft")}>
            Lưu nháp
          </Button>
          <Button type="button" variant="outline" onClick={() => dispatchAction("preview-profile")}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Xem trước hồ sơ
          </Button>
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
            Gửi hồ sơ
          </Button>
        </div>
      </form>
      <StatusCard title="Checklist hồ sơ">
        <ul className="grid gap-2">
          <li>Thông tin cá nhân và liên hệ.</li>
          <li>Học vấn, chuyên môn và môn dạy.</li>
          <li>Kinh nghiệm, phương pháp và minh chứng.</li>
          <li>Không chứa bank information hoặc availability.</li>
        </ul>
      </StatusCard>
    </section>
  );
}

function ListingWaivedScreen() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Thanh toán kỳ đầu" tone="success">
        <div className="grid gap-4 md:grid-cols-3">
          <ReadOnlyItem icon={CheckCircle2} title="Chi phí thanh toán" value="0 VNĐ" />
          <ReadOnlyItem icon={Clock} title="Thời hạn" value="6 tháng đầu" />
          <ReadOnlyItem
            icon={ShieldCheck}
            title="Ghi chú"
            value="Dành cho 50 gia sư đầu tiên của BeeWise"
          />
        </div>
        <p className="mt-4 rounded-lg bg-primary/5 p-4 font-semibold text-primary">
          {onboardingNotice}
        </p>
      </StatusCard>
      <StatusCard title="Miễn phí kỳ đầu">
        <p>
          Gia sư được miễn phí thanh toán trong kỳ đầu.
        </p>
        <div className="mt-4">
          <PrimaryScreenActions />
        </div>
      </StatusCard>
    </section>
  );
}

function InterviewScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Lịch phỏng vấn" tone="success">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyItem icon={CalendarCheck} title="Thời gian" value="15/07/2026, 19:30" />
          <ReadOnlyItem icon={FileText} title="Hình thức" value="Online qua Google Meet" />
          <ReadOnlyItem icon={CheckCircle2} title="Badge" value="Đã lên lịch" />
          <ReadOnlyItem icon={ShieldCheck} title="Người phụ trách" value="Consultant BeeWise" />
        </div>
        <ul className="mt-5 grid gap-2 text-sm">
          <li>Chuẩn bị giới thiệu ngắn về bản thân.</li>
          <li>Trình bày kinh nghiệm giảng dạy.</li>
          <li>Mô tả phương pháp hỗ trợ học sinh.</li>
          <li>Chuẩn bị một tình huống giảng dạy minh họa.</li>
          <li>Kiểm tra camera, micro và kết nối Internet.</li>
        </ul>
      </StatusCard>
      <StatusCard title="Chuẩn bị phỏng vấn">
        <div className="grid gap-3">
          <Button onClick={() => dispatchAction("join-mock-interview")}>Tham gia phỏng vấn</Button>
          <Button variant="outline" onClick={() => dispatchAction("request-mock-reschedule")}>
            Yêu cầu đổi lịch
          </Button>
          <Button variant="outline" onClick={() => dispatchAction("complete-mock-interview")}>
            Hoàn tất phỏng vấn
          </Button>
        </div>
      </StatusCard>
    </section>
  );
}

function PendingReviewScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Đang chờ Consultant xác thực">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyItem icon={CheckCircle2} title="Hồ sơ đã gửi" value="12/07/2026" />
          <ReadOnlyItem icon={CheckCircle2} title="Phỏng vấn hoàn tất" value="15/07/2026" />
          <ReadOnlyItem icon={Clock} title="Trạng thái" value="Đang chờ Consultant xác thực" />
          <ReadOnlyItem icon={CalendarCheck} title="Dự kiến xử lý" value="1-3 ngày làm việc" />
        </div>
      </StatusCard>
      <StatusCard title="Bạn không cần thực hiện thêm hành động" tone="success">
          Hồ sơ đang trong quá trình xác thực. Bạn chưa cần chỉnh sửa, gửi lại
        hoặc thực hiện thêm thao tác nào.
        <div className="mt-4">
          <div className="grid gap-3">
            <Button onClick={() => dispatchAction("approve-mock-profile")}>
              Tiếp tục đến trạng thái đã duyệt
            </Button>
            <Button variant="outline">Liên hệ hỗ trợ</Button>
          </div>
        </div>
      </StatusCard>
    </section>
  );
}

function RejectedScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Cần cập nhật" tone="warning">
        <p className="font-semibold text-foreground">
          Ảnh thẻ sinh viên hiện chưa rõ thông tin và phần mô tả kinh nghiệm
          giảng dạy còn quá ngắn.
        </p>
        <p className="mt-3">Ngày xét duyệt: 17/07/2026</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Thẻ sinh viên", "Kinh nghiệm giảng dạy", "Mô tả phương pháp giảng dạy"].map(
            (item) => (
              <div key={item} className="rounded-lg border border-warning/20 bg-white p-3 text-sm font-semibold">
                {item}
              </div>
            ),
          )}
        </div>
      </StatusCard>
      <StatusCard title="Gửi lại sau khi chỉnh sửa">
        <div className="grid gap-3">
          <Button onClick={() => dispatchAction("edit-rejected-profile")}>Chỉnh sửa hồ sơ</Button>
          <Button variant="outline" onClick={() => dispatchAction("resubmit-profile")}>
            Gửi lại hồ sơ
          </Button>
          <Button variant="outline">Liên hệ BeeWise</Button>
        </div>
      </StatusCard>
    </section>
  );
}

function ApprovedScreen() {
  const { dispatchAction } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Chúc mừng!" tone="success">
        <p className="font-semibold text-foreground">
          Hồ sơ gia sư của bạn đã đạt yêu cầu xác thực của BeeWise.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ReadOnlyItem icon={CheckCircle2} title="Trạng thái hồ sơ" value="Đã duyệt" />
          <ReadOnlyItem icon={Eye} title="Trạng thái hồ sơ" value="Có thể công khai" />
          <ReadOnlyItem icon={CreditCard} title="Thanh toán" value="Đã miễn phí kỳ đầu" />
          <ReadOnlyItem icon={CalendarCheck} title="Ngày duyệt" value="18/07/2026" />
        </div>
      </StatusCard>
      <StatusCard title="Bước tiếp theo">
        <ol className="grid gap-2">
          <li>1. Bổ sung tài khoản nhận thanh toán.</li>
          <li>2. Thiết lập lịch rảnh nhận lớp.</li>
        </ol>
        <div className="mt-4">
          <Button onClick={() => dispatchAction("open-post-approval-form")}>
            Bổ sung thông tin
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Sau khi bổ sung thông tin nhận lớp, Tutor LMS sẽ được mở cho tài khoản của bạn.
        </p>
      </StatusCard>
    </section>
  );
}

function PostApprovalScreen() {
  const { state, dispatchAction } = useTutorOnboardingViewModel();
  const [slots] = useState<AvailabilitySlot[]>(state.availabilitySlots);

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-5">
        <StatusCard title="Thông tin tài khoản nhận thanh toán">
          <p className="mb-4">
            Thông tin này chỉ được BeeWise sử dụng để thực hiện chi trả và
            không xuất hiện trên hồ sơ công khai.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Ngân hàng">
              <Input defaultValue={state.bankInfo.bankName} autoComplete="organization" />
            </Field>
            <Field label="Số tài khoản">
              <Input defaultValue={state.bankInfo.accountNumber} autoComplete="off" />
            </Field>
            <Field label="Tên chủ tài khoản">
              <Input defaultValue={state.bankInfo.accountHolder} autoComplete="name" />
            </Field>
          </div>
        </StatusCard>
        <StatusCard title="Lịch rảnh nhận lớp">
          <div className="grid gap-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]"
              >
                <Input defaultValue={slot.day} aria-label="Ngày trong tuần" />
                <Input defaultValue={slot.startTime} aria-label="Giờ bắt đầu" />
                <Input defaultValue={slot.endTime} aria-label="Giờ kết thúc" />
                <Input defaultValue={slot.mode} aria-label="Hình thức" />
                <Button type="button" variant="outline">Xóa</Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="outline">Thêm khung giờ</Button>
            <Button type="button" variant="outline" onClick={() => dispatchAction("save-bank-information")}>
              Lưu thông tin
            </Button>
            <Button type="button" onClick={() => dispatchAction("complete-onboarding")}>
              Hoàn tất onboarding
            </Button>
          </div>
        </StatusCard>
      </div>
      <StatusCard title="Kiểm tra thông tin">
        <ul className="grid gap-2">
          <li>Các trường bắt buộc được đánh dấu rõ ràng.</li>
          <li>End time phải lớn hơn start time.</li>
          <li>Hệ thống sẽ cảnh báo nếu lịch rảnh bị trùng.</li>
          <li>Tutor LMS chỉ mở sau khi hoàn tất bước này.</li>
        </ul>
      </StatusCard>
    </section>
  );
}

function CompletedScreen() {
  const { session } = useTutorOnboardingViewModel();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <StatusCard title="Toàn bộ onboarding đã hoàn tất" tone="success">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyItem icon={CheckCircle2} title="Hồ sơ" value="Đã được duyệt" />
          <ReadOnlyItem icon={Eye} title="Thanh toán" value="Đã hoàn tất" />
          <ReadOnlyItem icon={CheckCircle2} title="Tài khoản nhận thanh toán" value="Đã hoàn tất" />
          <ReadOnlyItem icon={CalendarCheck} title="Lịch rảnh" value="Đã thiết lập" />
          <ReadOnlyItem icon={Laptop} title="Tutor LMS" value="Đã được mở" />
        </div>
      </StatusCard>
      <StatusCard title="Bắt đầu nhận lớp">
        <div className="grid gap-3">
          <Button
            type="button"
            onClick={() => window.location.assign(TUTOR_LMS_URL)}
          >
            Vào LMS
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.location.assign(getTutorPublicProfilePath(session.user))
            }
          >
            Xem hồ sơ công khai
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Tài khoản đã sẵn sàng sử dụng Tutor LMS và bắt đầu nhận lớp.
        </p>
      </StatusCard>
    </section>
  );
}

function UnknownScenarioScreen() {
  return (
    <StatusCard title="Fallback an toàn" tone="warning">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
        <p>
          Scenario không hợp lệ đã được đưa về trạng thái an toàn. LMS không
          được bật và Tutor không được xem như Approved.
        </p>
      </div>
    </StatusCard>
  );
}
