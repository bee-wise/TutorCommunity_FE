import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { formatProfileReviewStatus, profileFieldLabels, profileSections, readableFieldName, type ProfileFieldName } from "../data/profile-fields";
import type { ProfileReview } from "../schemas/consultant-review.schema";

export function ReviewDecisionSummary({
  rejections,
  offeringRejections,
  offeringIds,
  note,
  onNoteChange,
  reviewable,
  isResubmission,
  status,
  previousRejections,
}: {
  rejections: Partial<Record<ProfileFieldName, string>>;
  offeringRejections: Record<string, string>;
  offeringIds: (string | null | undefined)[];
  note: string;
  onNoteChange: (value: string) => void;
  reviewable: boolean;
  isResubmission: boolean;
  status?: string | null;
  previousRejections: NonNullable<ProfileReview["rejectedFields"]>;
}) {
  if (!reviewable) {
    return (
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <p className="text-xs font-bold text-primary">Kết quả đã xử lý</p>
        <h2 className="mt-1 font-nunito text-2xl font-extrabold">{status ? formatProfileReviewStatus(status) : "Hồ sơ đã được xét duyệt"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Đây là kết quả từ lần xét duyệt trước. Nội dung hiện chỉ có thể xem.</p>
        {previousRejections.length > 0 && (
          <div className="mt-5 space-y-3">
            {previousRejections.map((item, index) => (
              <div key={`${item.fieldName}-${item.offeringId}-${index}`} className="rounded-2xl border border-destructive p-4 text-sm">
                <p className="font-bold text-destructive">{readableFieldName(item.fieldName)}</p>
                {item.offeringId && <p className="mt-1 text-xs text-muted-foreground">Mã tổ hợp: {item.offeringId}</p>}
                <p className="mt-1 text-foreground">{item.rejectionReason || "Không có lý do được lưu."}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
  const total = Object.keys(rejections).length + Object.keys(offeringRejections).length;
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Bước cuối</p>
        <h2 className="mt-1 font-nunito text-2xl font-extrabold">Rà soát quyết định</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isResubmission
            ? "Kiểm tra các trường gửi lại trước khi gửi. Trường đã duyệt và không đổi được giữ nguyên."
            : "Kiểm tra các mục cần sửa trước khi gửi. Các mục không được đánh dấu sẽ được phê duyệt cùng lúc."}
        </p>
      </div>
      <div className="p-5 sm:p-7">
        <div className={`flex items-start gap-3 rounded-2xl border bg-background p-4 ${total ? "border-destructive" : "border-primary"}`}>
          {total ? <ExclamationCircleIcon className="size-6 shrink-0 text-destructive" /> : <CheckCircleIcon className="size-6 shrink-0 text-primary" />}
          <div>
            <p className="font-nunito font-bold">{total ? `${total} mục cần gia sư chỉnh sửa` : isResubmission ? "Sẵn sàng duyệt các trường gửi lại" : "Sẵn sàng duyệt toàn bộ hồ sơ"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{total ? "Lý do của từng mục sẽ được gửi kèm quyết định." : "Bạn chưa đánh dấu mục nào cần chỉnh sửa."}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {profileSections.map((section) => {
            const selected = section.fields.filter((field) => field in rejections);
            const count = selected.length + (section.fields.includes("teachingOfferings") ? Object.keys(offeringRejections).length : 0);
            return (
              <div key={section.title} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-nunito text-sm font-bold">{section.title}</h3>
                  <span className={`text-xs font-bold ${count ? "text-destructive" : "text-primary"}`}>{count ? `${count} cần sửa` : "Đạt"}</span>
                </div>
                {count > 0 && (
                  <ul className="mt-3 space-y-2 text-sm">
                    {selected.map((field) => <li key={field}><span className="font-semibold">{profileFieldLabels[field]}:</span> <span className="text-muted-foreground">{rejections[field]}</span></li>)}
                    {section.fields.includes("teachingOfferings") && Object.entries(offeringRejections).map(([id, reason]) => (
                      <li key={id}><span className="font-semibold">Tổ hợp {offeringIds.indexOf(id) + 1}:</span> <span className="text-muted-foreground">{reason}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 max-w-2xl">
          <label htmlFor="review-note" className="block text-sm font-bold">Ghi chú chung (không bắt buộc)</label>
          <p className="mt-1 text-xs text-muted-foreground">Ghi chú áp dụng cho toàn bộ lần xét duyệt.</p>
          <textarea
            id="review-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            maxLength={2000}
            disabled={!reviewable}
            placeholder="Nhập ghi chú nếu cần"
            className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
          />
        </div>
      </div>
    </section>
  );
}
