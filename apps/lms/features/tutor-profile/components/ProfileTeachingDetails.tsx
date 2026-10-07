import { panelClass } from "@/components/lms-page-ui";
import {
  CalendarBlank,
  CaretDown,
  Certificate,
  ChalkboardTeacher,
} from "@phosphor-icons/react";
import type { TutorProfile } from "../types/profile.schemas";

const modeLabels: Record<string, string> = {
  ONLINE: "Trực tuyến",
  OFFLINE: "Tại nhà",
  BOTH: "Trực tuyến & tại nhà",
};
const offeringStatus: Record<string, string> = {
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  PENDING_REVIEW: "Chờ duyệt",
  REJECTED: "Chưa được duyệt",
};
const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function ProfileTeachingDetails({ profile }: { profile: TutorProfile }) {
  return (
    <div className="space-y-5">
      <section
        className={`${panelClass} space-y-4`}
        aria-labelledby="profile-intro-title"
      >
        <h2
          id="profile-intro-title"
          className="font-nunito text-lg font-extrabold text-primary"
        >
          Giới thiệu & học vấn
        </h2>
        <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
          {profile.introduction ||
            profile.shortIntro ||
            "Chưa có nội dung giới thiệu."}
        </p>
        <dl className="grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Trường / cơ sở đào tạo</dt>
            <dd className="mt-1 font-bold leading-relaxed">
              {profile.university || "Chưa cập nhật"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Chuyên ngành</dt>
            <dd className="mt-1 font-bold leading-relaxed">
              {profile.major || "Chưa cập nhật"}
            </dd>
          </div>
          {profile.studentYear && (
            <div>
              <dt className="text-muted-foreground">Năm học</dt>
              <dd className="mt-1 font-bold">{profile.studentYear}</dd>
            </div>
          )}
        </dl>
        {!!profile.specializations.length && (
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </section>
      <section
        className={`${panelClass} space-y-4`}
        aria-labelledby="profile-offerings-title"
      >
        <h2
          id="profile-offerings-title"
          className="font-nunito text-lg font-extrabold text-primary"
        >
          Nội dung giảng dạy
        </h2>
        {!profile.teachingOfferings.length ? (
          <p className="text-sm text-muted-foreground">
            Chưa có môn học hoặc chương trình được cập nhật.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {profile.teachingOfferings.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between gap-3 py-4 first:pt-0 sm:flex-row"
              >
                <div>
                  <h3 className="font-bold leading-relaxed">
                    {item.teachingItemName || "Chưa có tên môn học"}
                    {item.contextName ? ` - ${item.contextName}` : ""}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.programName || "Chưa có chương trình"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {modeLabels[item.teachingMode] ||
                      item.teachingMode ||
                      "Chưa có hình thức học"}
                  </p>
                </div>
                <div className="shrink-0 space-y-2 sm:text-right">
                  {item.basePrice != null && (
                    <p className="font-nunito text-lg font-extrabold tabular-nums text-primary">
                      {currency.format(item.basePrice)}
                      <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                        mức phí cơ bản
                      </span>
                    </p>
                  )}
                  {item.status && (
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-bold leading-5 ${item.status === "APPROVED" ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-card text-muted-foreground"}`}
                    >
                      {offeringStatus[item.status] ||
                        "Chưa rõ trạng thái duyệt"}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className={panelClass} aria-label="Thông tin bổ sung">
        <details open className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-nunito text-lg font-extrabold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarBlank size={16} weight="bold" />
              </span>
              Lịch có thể nhận lớp
            </span>
            <CaretDown
              size={16}
              weight="bold"
              className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
            {profile.availability.length ? (
              profile.availability.map((slot, index) => (
                <div key={`${slot.day}-${index}`}>
                  <p className="font-bold">{slot.day || "Chưa có ngày"}</p>
                  <p className="mt-1 text-muted-foreground">
                    {slot.time || "Chưa có khung giờ"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Chưa cập nhật lịch có thể nhận lớp.
              </p>
            )}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Đây là khung giờ nhận lớp trong hồ sơ, không thay thế lịch dạy đã
            được xác nhận.
          </p>
        </details>
        <details className="group mt-4 border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-nunito text-lg font-extrabold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ChalkboardTeacher size={16} weight="bold" />
              </span>
              Phương pháp giảng dạy
            </span>
            <CaretDown
              size={16}
              weight="bold"
              className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="mt-3 space-y-4">
            {profile.teachingMethods.length ? (
              profile.teachingMethods.map((method, index) => (
                <div key={`${method.title}-${index}`}>
                  <h3 className="text-sm font-bold">{method.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có phương pháp giảng dạy được cập nhật.
              </p>
            )}
          </div>
        </details>
        <details className="group mt-4 border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-nunito text-lg font-extrabold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Certificate size={16} weight="bold" />
              </span>
              Thành tích & minh chứng
            </span>
            <CaretDown
              size={16}
              weight="bold"
              className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="mt-3 space-y-4">
            {profile.achievements.length ? (
              profile.achievements.map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.type}
                    {item.status ? ` · ${item.status}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có thành tích được cập nhật.
              </p>
            )}
          </div>
        </details>
      </section>
    </div>
  );
}
