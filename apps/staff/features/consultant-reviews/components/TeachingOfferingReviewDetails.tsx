import type { TutorProfileSubmission } from "../schemas/consultant-review.schema";

type Offering = NonNullable<TutorProfileSubmission["teachingOfferings"]>[number];

const contextTypeLabels: Record<string, string> = {
  GRADE: "Lớp học",
  LEVEL: "Trình độ",
  MAJOR: "Chuyên ngành",
  EXAM_TRACK: "Hướng luyện thi",
  CERT_LEVEL: "Cấp chứng chỉ",
  OTHER: "Khác",
};

export function TeachingOfferingReviewDetails({ offering }: { offering: Offering }) {
  const teachingItemName = offering.proposal?.teachingItemName?.trim();
  const contextName = offering.proposal?.contextName?.trim();
  const teachingMode = offering.teachingMode === "ONLINE"
    ? "Trực tuyến"
    : offering.teachingMode === "OFFLINE"
      ? "Trực tiếp"
      : offering.teachingMode || "Chưa cung cấp";
  const references = [
    { label: "Mã tổ hợp", value: offering.id },
    { label: "Phiên bản chương trình", value: offering.programVersionId },
    { label: "Mã môn / nội dung", value: offering.teachingItemId },
    { label: "Mã cấp học", value: offering.contextId },
  ].filter((reference) => reference.value);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(150px,auto)]">
        <dl className="grid gap-3">
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Môn / nội dung dạy</dt>
            <dd className="mt-1 font-nunito text-base font-extrabold leading-6 text-foreground">
              {teachingItemName || (offering.teachingItemId ? "Đã chọn từ danh mục" : "Chưa cung cấp")}
            </dd>
            {teachingItemName ? <span className="mt-1 inline-flex rounded-md bg-accent/25 px-2 py-0.5 text-[11px] font-bold text-accent-foreground">Môn đề xuất</span> : null}
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Cấp học / ngữ cảnh</dt>
            <dd className="mt-1 text-sm font-bold text-foreground">
              {contextName || (offering.contextId ? "Đã chọn từ danh mục" : "Không áp dụng")}
            </dd>
            {contextName ? <span className="mt-1 inline-flex rounded-md bg-accent/25 px-2 py-0.5 text-[11px] font-bold text-accent-foreground">Cấp học đề xuất</span> : null}
            {contextName && offering.proposal?.contextType ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Loại: {contextTypeLabels[offering.proposal.contextType] ?? offering.proposal.contextType}
              </p>
            ) : null}
          </div>
        </dl>

        <div className="flex flex-col justify-between gap-3 rounded-xl border border-accent/40 bg-accent/15 p-3.5">
          <div>
            <p className="text-xs font-bold text-muted-foreground">Học phí đề xuất</p>
            <p className="mt-1 font-nunito text-xl font-extrabold leading-tight text-primary">
              {offering.basePrice == null ? "Chưa cung cấp" : `${offering.basePrice.toLocaleString("vi-VN")} ₫`}
              {offering.basePrice != null ? <span className="ml-1 text-xs font-semibold text-muted-foreground">/giờ</span> : null}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Hình thức dạy</p>
            <span className="mt-1 inline-flex rounded-full border border-primary/15 bg-background px-2.5 py-1 text-xs font-bold text-primary">
              {teachingMode}
            </span>
          </div>
        </div>
      </div>

      {references.length > 0 ? (
        <div className="border-t border-border pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Mã tham chiếu</p>
          <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {references.map((reference) => (
              <div key={reference.label} className="min-w-0">
                <dt className="text-[11px] text-muted-foreground">{reference.label}</dt>
                <dd className="break-all font-mono text-[11px] leading-4 text-muted-foreground">{reference.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
