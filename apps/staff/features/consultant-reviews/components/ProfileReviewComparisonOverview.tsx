import { ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { profileFieldLabels, type ProfileFieldName } from "../data/profile-fields";

export function ProfileReviewComparisonOverview({
  reviewCount,
  fields,
  onLocateField,
}: {
  reviewCount: number;
  fields: ProfileFieldName[];
  onLocateField: (field: ProfileFieldName) => void;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-label="Các trường đã chỉnh sửa theo phản hồi">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-nunito text-lg font-extrabold text-foreground">Đã chỉnh sửa theo phản hồi</h2>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">
          Gửi lại lần {reviewCount}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Chọn trường để xem nội dung gia sư vừa sửa trong lượt gửi lại này.</p>
      {fields.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {fields.map((field) => (
            <li key={field}>
              <button
                type="button"
                onClick={() => onLocateField(field)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-sm font-bold text-primary transition-all hover:border-primary/40 hover:bg-primary/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Đến trường ${profileFieldLabels[field]}`}
              >
                <ExclamationCircleIcon className="size-4 shrink-0" aria-hidden="true" />
                {profileFieldLabels[field]}
                <ArrowRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Không có trường nào được chỉnh sửa trong lượt gửi lại này.</p>
      )}
    </section>
  );
}
