import { ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { TutorProfileReview } from "../schemas/profile-review.schema";
import { getRejectedProfileStep } from "../utils/profile-step-completion";

const fieldLabels: Record<string, string> = {
  displayName: "Tên hiển thị",
  dateOfBirth: "Ngày sinh",
  gender: "Giới tính",
  avatarUrl: "Ảnh đại diện",
  headline: "Tiêu đề hồ sơ",
  universityId: "Trường đại học",
  majorId: "Chuyên ngành",
  studentYear: "Năm học",
  studentCardUrl: "Thẻ sinh viên / bằng tốt nghiệp",
  teachingOfferings: "Tổ hợp giảng dạy",
  teachingMode: "Hình thức dạy",
  basePrice: "Học phí",
  introduction: "Giới thiệu",
  shortIntro: "Giới thiệu ngắn",
  videoUrl: "Video giới thiệu",
  experienceYears: "Số năm kinh nghiệm",
  area: "Khu vực",
  offlineCity: "Tỉnh / thành phố",
  offlineDistrict: "Quận / huyện",
  offlineWard: "Phường / xã",
  offlineAddressDetail: "Địa chỉ dạy trực tiếp",
  travelRadiusKm: "Bán kính di chuyển",
  identityDocumentsUrl: "Giấy tờ tùy thân",
  teachingMethods: "Phương pháp giảng dạy",
  achievements: "Thành tích",
  teachingHistory: "Kinh nghiệm giảng dạy",
  specializationIds: "Chuyên môn",
  teachingModes: "Hình thức dạy",
};

function fieldLabel(fieldName: string): string {
  const parts = fieldName.split(/[.[\]]+/).filter(Boolean);
  const leaf = parts.at(-1) ?? fieldName;
  const label = fieldLabels[leaf] ?? fieldLabels[fieldName] ?? fieldName;
  return parts[0] === "teachingOfferings" && leaf !== "teachingOfferings"
    ? `Tổ hợp giảng dạy · ${label}`
    : label;
}

export function ProfileReviewFeedback({
  review,
  onLocateField,
}: {
  review: TutorProfileReview;
  onLocateField?: (fieldName: string, offeringId?: string | null) => void;
}) {
  const rejectedFields = review.rejectedFields;

  return (
    <section
      className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6"
      aria-labelledby="profile-review-feedback-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <ExclamationCircleIcon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2
            id="profile-review-feedback-title"
            className="text-base font-bold text-foreground"
          >
            Phản hồi từ BeeWise
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chỉnh sửa các mục bên dưới rồi gửi lại hồ sơ để xét duyệt.
          </p>
        </div>
      </div>
      {rejectedFields.length ? (
        <ul className="mt-4 grid gap-2">
          {rejectedFields.map((field, index) => {
            const offeringIndex = field.offeringId
              ? (review.profile.teachingOfferings?.findIndex(
                  (item) => item.id === field.offeringId,
                ) ?? -1)
              : -1;
            const offering = review.profile.teachingOfferings?.[offeringIndex];
            const offeringName =
              offering?.proposal?.teachingItemName ||
              (offeringIndex >= 0 ? `Môn dạy ${offeringIndex + 1}` : null);
            return (
              <li
                key={`${field.offeringId ?? "profile"}-${field.fieldName}-${index}`}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                {onLocateField && getRejectedProfileStep(field.fieldName) !== undefined ? (
                  <button
                    type="button"
                    onClick={() => onLocateField(field.fieldName, field.offeringId)}
                    className="group flex w-full items-center justify-between gap-3 rounded-lg text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Đến mục ${fieldLabel(field.fieldName)} cần chỉnh sửa`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                        {fieldLabel(field.fieldName)}{offeringName ? ` · ${offeringName}` : ""}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">{field.rejectionReason}</span>
                    </span>
                    <ArrowRightIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  </button>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground">
                      {fieldLabel(field.fieldName)}{offeringName ? ` · ${offeringName}` : ""}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{field.rejectionReason}</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          BeeWise chưa cung cấp lý do cụ thể cho từng mục. Vui lòng kiểm tra hồ
          sơ và cập nhật thông tin cần thiết.
        </p>
      )}
    </section>
  );
}
