import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { studentYearLabel, text } from "../utils/interview-presentation";
import { Chip, panelClass } from "./InterviewUi";

type Row = { label: string; value: string };
const modeLabels: Record<string, string> = {
  ONLINE: "Online",
  OFFLINE: "Tại nhà",
};
function names(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) =>
          item && typeof item === "object"
            ? text((item as Record<string, unknown>).name)
            : text(item),
        )
        .filter(Boolean)
    : [];
}
function money(value: unknown) {
  return typeof value === "number"
    ? `${value.toLocaleString("vi-VN")}đ / giờ`
    : "";
}

export function InterviewTutorProfile({ data }: { data: InterviewPackage }) {
  const tutor = data.tutor;
  if (!tutor)
    return (
      <section className={panelClass}>
        {data.tutor_error && (
          <p role="alert" className="mb-4 rounded-xl bg-highlight p-4 text-sm">
            {data.tutor_error}
          </p>
        )}
        <p className="py-8 text-center text-sm text-muted-foreground">
          Không có dữ liệu hồ sơ gia sư.
        </p>
      </section>
    );
  const basics: Row[] = [
    { label: "Trường", value: text(tutor.universityName) },
    { label: "Chuyên ngành", value: text(tutor.major) },
    { label: "Năm học", value: studentYearLabel(tutor.studentYear) },
    { label: "Học phí", value: money(tutor.hourlyRate) },
    {
      label: "Hình thức dạy",
      value: names(tutor.teachingModes)
        .map((mode) => modeLabels[mode] ?? mode)
        .join(", "),
    },
  ].filter((row) => row.value);
  const subjects = names(tutor.subjects);
  const grades = names(tutor.gradeLevels);
  const offerings = Array.isArray(tutor.teachingOfferings)
    ? (tutor.teachingOfferings as Record<string, unknown>[])
    : [];
  const bio = text(tutor.bio);
  return (
    <div className="space-y-5">
      {data.tutor_error && (
        <p role="alert" className="rounded-xl bg-highlight p-4 text-sm">
          {data.tutor_error}
        </p>
      )}
      <section className={panelClass}>
        <h2 className="font-nunito text-lg font-extrabold">
          Hồ sơ đã đăng ký
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Dùng để đối chiếu với những gì gia sư nói trong buổi phỏng vấn.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {basics.map((row) => (
            <div key={row.label} className="rounded-2xl bg-muted p-3.5">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 text-sm font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TagGroup title="Môn đăng ký" items={subjects} />
          <TagGroup title="Cấp lớp / đối tượng" items={grades} />
        </div>
      </section>
      {!!offerings.length && (
        <section className={panelClass}>
          <h2 className="font-nunito text-lg font-extrabold">Môn và gói dạy</h2>
          <ul className="mt-4 divide-y divide-border">
            {offerings.map((item, index) => (
              <li
                key={index}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {text(item.teachingItemName)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[text(item.programName), text(item.contextName)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums text-primary">
                  {money(item.basePrice)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {bio && (
        <section className={panelClass}>
          <h2 className="font-nunito text-lg font-extrabold">Giới thiệu</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{bio}</p>
        </section>
      )}
    </div>
  );
}
function TagGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-muted-foreground">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => <Chip key={item}>{item}</Chip>)
        ) : (
          <span className="text-sm text-muted-foreground">Chưa có</span>
        )}
      </div>
    </div>
  );
}
