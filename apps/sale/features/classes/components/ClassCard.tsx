import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import {
  formatOpeningDate,
  formatOpeningTime,
  getClassSubject,
  getPriceSummary,
  getTotalHours,
} from "../utils/classes.utils";
import { getProgramTheme } from "../utils/program-theme";

export const priceFormatter = new Intl.NumberFormat("vi-VN");

export function ClassCard({ classItem }: { classItem: GroupDto }) {
  const program = classItem.programName?.trim();
  const context = classItem.contextName?.trim();
  const teachingItem = classItem.teachingItemName?.trim();
  const theme = getProgramTheme(program);
  const openingDate = formatOpeningDate(classItem.openingAt);
  const openingTime = formatOpeningTime(classItem.openingAt);
  const price = getPriceSummary(classItem);
  const isOnline = classItem.teachingMode === "ONLINE";

  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-background shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:grid-cols-[136px_minmax(0,1fr)] xl:grid-cols-[148px_minmax(0,1fr)_190px]">
      <div
        className={`flex items-center gap-3 p-4 sm:min-h-[190px] sm:flex-col sm:items-start sm:justify-between sm:gap-0 sm:p-5 ${theme.panel}`}
      >
        <theme.Icon className="size-8 shrink-0 sm:size-10" aria-hidden="true" />
        <p className="font-nunito text-lg font-black leading-tight sm:text-xl">
          <span className="sr-only">Chương trình: </span>
          {program || "Chương trình khác"}
        </p>
      </div>

      <div className="flex min-w-0 flex-col px-4 py-4 sm:px-5 sm:py-5">
        {(context || teachingItem) && (
          <div className="flex flex-wrap items-center gap-2">
            {context && (
              <span className={`rounded-full px-3.5 py-1.5 text-sm font-extrabold leading-none ${theme.pill}`}>
                {context}
              </span>
            )}
            {teachingItem && (
              <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold leading-none text-primary">
                {teachingItem}
              </span>
            )}
          </div>
        )}

        <h3 className="mt-3 font-nunito text-lg font-extrabold leading-snug text-foreground sm:text-xl">
          {classItem.title ?? getClassSubject(classItem)}
        </h3>
        {classItem.highlight && (
          <p className="mt-2 inline-flex w-fit max-w-full items-start gap-1.5 rounded-lg bg-highlight px-2.5 py-1 text-xs font-bold leading-snug text-foreground">
            <SparklesIcon className="mt-px size-4 shrink-0" aria-hidden="true" />
            <span className="[overflow-wrap:anywhere]">{classItem.highlight}</span>
          </p>
        )}
        {classItem.description && (
          <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
            {classItem.description}
          </p>
        )}

        <ul className="mt-4 grid gap-x-5 gap-y-2.5 border-t border-border pt-4 text-xs font-semibold text-foreground sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {openingDate
              ? `Khai giảng ${openingDate}${openingTime ? ` · ${openingTime}` : ""}`
              : "Chưa có lịch khai giảng"}
          </li>
          <li className="flex items-center gap-2">
            {isOnline ? (
              <VideoCameraIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <MapPinIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            )}
            <span className="min-w-0 truncate">
              {isOnline ? "Học trực tuyến" : classItem.location ? `Trực tiếp · ${classItem.location}` : "Học trực tiếp"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {classItem.numberOfSessions} buổi × {classItem.sessionDurationMinutes} phút · {getTotalHours(classItem)} giờ
          </li>
          <li className="flex items-center gap-2">
            <UserGroupIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            Tối đa {classItem.capacity} học viên
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-4 sm:col-span-2 sm:px-5 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:flex-col xl:items-stretch xl:justify-center xl:border-l xl:border-t-0 xl:px-5 xl:py-5">
        <div>
          <p className="font-nunito text-xl font-black tabular-nums text-primary xl:text-right">
            {priceFormatter.format(price.amount)}đ
            <span className="ml-1 text-xs font-semibold text-muted-foreground">
              {price.unit}
            </span>
          </p>
          {price.note && (
            <p className="mt-1 text-xs font-semibold text-muted-foreground xl:text-right">
              {price.note}
            </p>
          )}
        </div>
        <Link
          href={`/classes/${encodeURIComponent(classItem.id)}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:w-full"
        >
          Xem lớp
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
