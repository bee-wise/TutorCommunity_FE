import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { panelClass } from "./InterviewUi";

const fieldLabels: Record<string, string> = {
  fullName: "Họ và tên",
  full_name: "Họ và tên",
  firstName: "Tên",
  lastName: "Họ",
  email: "Email",
  phone: "Điện thoại",
  experience: "Kinh nghiệm",
  bio: "Giới thiệu",
  education: "Học vấn",
  subjects: "Môn giảng dạy",
};
export function InterviewTutorProfile({ data }: { data: InterviewPackage }) {
  return (
    <section className={panelClass}>
      <h2 className="font-nunito text-lg font-extrabold">
        Hồ sơ gia sư hiện tại
      </h2>
      {data.tutor_error && (
        <p role="alert" className="mt-4 rounded-xl bg-accent/15 p-4 text-sm">
          {data.tutor_error}
        </p>
      )}
      {data.tutor ? (
        <ProfileFields value={data.tutor} />
      ) : (
        <p className="py-8 text-sm text-muted-foreground">
          Không có dữ liệu hồ sơ.
        </p>
      )}
    </section>
  );
}
function ProfileFields({ value }: { value: Record<string, unknown> }) {
  return (
    <dl className="mt-4 divide-y divide-border">
      {Object.entries(value).map(([key, item]) => (
        <div key={key} className="py-3">
          {item != null && typeof item === "object" ? (
            <DisclosureCard
              title={fieldLabels[key] ?? key}
              variant="subtle"
              size="sm"
            >
              {Array.isArray(item) ? (
                item.map((entry: unknown, index: number) => (
                  <div
                    key={index}
                    className="border-b border-border py-2 text-sm last:border-0"
                  >
                    {entry != null && typeof entry === "object" ? (
                      <ProfileFields value={entry as Record<string, unknown>} />
                    ) : (
                      String(entry ?? "—")
                    )}
                  </div>
                ))
              ) : (
                <ProfileFields value={item as Record<string, unknown>} />
              )}
            </DisclosureCard>
          ) : (
            <div className="grid gap-1 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
              <dt className="text-muted-foreground">
                {fieldLabels[key] ?? key}
              </dt>
              <dd className="break-words whitespace-pre-wrap font-medium">
                {item == null
                  ? "—"
                  : typeof item === "boolean"
                    ? item
                      ? "Có"
                      : "Không"
                    : String(item)}
              </dd>
            </div>
          )}
        </div>
      ))}
    </dl>
  );
}
