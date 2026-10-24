import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import {
  formatOpeningDate,
  getBillingLabel,
  getClassLevel,
  getClassSubject,
  getLevelMark,
  getSubjectStyle,
  getTeachingModeLabel,
} from "../utils/classes.utils";

export const priceFormatter = new Intl.NumberFormat("vi-VN");

export function ClassCard({
  classItem,
  onView,
}: {
  classItem: GroupDto;
  onView: () => void;
}) {
  const subject = getClassSubject(classItem);
  const level = getClassLevel(classItem);
  const levelMark = getLevelMark(classItem);
  const openingDate = formatOpeningDate(classItem.openingAt);
  const billing = getBillingLabel(classItem.billingMode);
  const isOnline = classItem.teachingMode === "ONLINE";

  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-background shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:grid-cols-[136px_minmax(0,1fr)] xl:grid-cols-[148px_minmax(0,1fr)_190px]">
      <div
        aria-hidden="true"
        className={`flex h-24 flex-col justify-between p-4 sm:h-full sm:min-h-[190px] sm:p-5 ${getSubjectStyle(subject)}`}
      >
        <span className="line-clamp-2 text-[10px] font-black uppercase tracking-[0.16em]">
          {subject}
        </span>
        <strong
          className={`font-nunito font-black leading-none tracking-tight ${levelMark.length > 2 ? "text-[28px] sm:text-[26px]" : "text-[48px] sm:text-[60px]"}`}
        >
          {levelMark}
        </strong>
      </div>

      <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
          {level && <span>{level}</span>}
          {level && openingDate && (
            <span className="text-border" aria-hidden="true">
              /
            </span>
          )}
          {openingDate && <span>Khai giảng {openingDate}</span>}
          {classItem.highlight && (
            <span className="rounded-full bg-highlight px-2.5 py-1 text-[11px] text-foreground">
              {classItem.highlight}
            </span>
          )}
        </div>

        <h3 className="mt-2.5 font-nunito text-lg font-extrabold leading-snug text-foreground sm:text-xl">
          {classItem.title ?? subject}
        </h3>
        {classItem.description && (
          <p className="mt-1.5 hidden text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
            {classItem.description}
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-foreground">
          <li className="flex items-center gap-1.5">
            {isOnline ? (
              <VideoCameraIcon className="size-4 text-primary" />
            ) : (
              <MapPinIcon className="size-4 text-primary" />
            )}
            {getTeachingModeLabel(classItem.teachingMode)}
            {!isOnline && classItem.location ? ` · ${classItem.location}` : ""}
          </li>
          <li className="flex items-center gap-1.5">
            <CalendarDaysIcon className="size-4 text-primary" />
            {classItem.numberOfSessions} buổi
          </li>
          <li className="flex items-center gap-1.5">
            <ClockIcon className="size-4 text-primary" />
            {classItem.sessionDurationMinutes} phút/buổi
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-4 sm:col-span-2 sm:px-5 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:flex-col xl:items-stretch xl:justify-center xl:border-l xl:border-t-0 xl:px-5 xl:py-5">
        <div>
          <p className="font-nunito text-xl font-black tabular-nums text-primary xl:text-right">
            {priceFormatter.format(classItem.pricePerSession)}đ
            <span className="ml-1 text-xs font-semibold text-muted-foreground">
              / buổi
            </span>
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground xl:justify-end">
            <UserGroupIcon className="size-4" />
            Tối đa {classItem.capacity} học viên
          </p>
          {billing && (
            <p className="mt-1 text-xs font-semibold text-muted-foreground xl:text-right">
              {billing}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onView}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:w-full"
        >
          Xem lớp
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </article>
  );
}
