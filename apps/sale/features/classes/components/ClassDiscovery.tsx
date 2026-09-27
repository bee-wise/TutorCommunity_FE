"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  MOCK_CLASSES,
  type ClassFormat,
  type ClassSubject,
  type ClassTime,
  type MockClass,
} from "../data/mock-classes";

type AllOr<T extends string> = "all" | T;
type SortOrder = "recommended" | "price-low" | "price-high" | "soonest";

const SUBJECTS: Array<AllOr<ClassSubject>> = [
  "all",
  "Toán",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Ngữ văn",
];

const priceFormatter = new Intl.NumberFormat("vi-VN");

const SUBJECT_STYLES: Record<ClassSubject, string> = {
  Toán: "bg-[#e9e5ff] text-[#34218d]",
  "Tiếng Anh": "bg-[#fff0c2] text-[#715300]",
  "Vật lý": "bg-[#e0f1ee] text-[#27675e]",
  "Hóa học": "bg-[#e5ebfa] text-[#304d8b]",
  "Ngữ văn": "bg-[#fae9e4] text-[#8b5144]",
};

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

type FilterFieldsProps = {
  idPrefix: string;
  format: AllOr<ClassFormat>;
  onFormatChange: (value: AllOr<ClassFormat>) => void;
  time: AllOr<ClassTime>;
  onTimeChange: (value: AllOr<ClassTime>) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
};

function FilterFields({
  idPrefix,
  format,
  onFormatChange,
  time,
  onTimeChange,
  maxPrice,
  onMaxPriceChange,
  availableOnly,
  onAvailableOnlyChange,
}: FilterFieldsProps) {
  const selectClass =
    "mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-bold text-foreground">Hình thức học</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-muted/70 p-1">
          {(["all", "Online", "Trực tiếp"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onFormatChange(option)}
              aria-pressed={format === option}
              className={`rounded-lg px-1.5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${format === option ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option === "all" ? "Tất cả" : option}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${idPrefix}-time`} className="text-sm font-bold text-foreground">
          Thời gian học
        </label>
        <select
          id={`${idPrefix}-time`}
          value={time}
          onChange={(event) => onTimeChange(event.target.value as AllOr<ClassTime>)}
          className={selectClass}
        >
          <option value="all">Bất kỳ thời gian</option>
          <option value="Buổi chiều">Buổi chiều</option>
          <option value="Buổi tối">Buổi tối</option>
          <option value="Cuối tuần">Cuối tuần</option>
        </select>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-price`} className="text-sm font-bold text-foreground">
          Học phí mỗi buổi
        </label>
        <select
          id={`${idPrefix}-price`}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          className={selectClass}
        >
          <option value="all">Mọi mức học phí</option>
          <option value="180000">Đến 180.000đ</option>
          <option value="200000">Đến 200.000đ</option>
          <option value="250000">Đến 250.000đ</option>
        </select>
      </div>
      <label className="flex cursor-pointer items-center gap-3 border-t border-border pt-5 text-sm font-semibold text-foreground">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(event) => onAvailableOnlyChange(event.target.checked)}
          className="size-4 accent-primary"
        />
        Chỉ hiện lớp còn chỗ
      </label>
    </div>
  );
}

type ClassCardProps = {
  classItem: MockClass;
  saved: boolean;
  onSave: () => void;
  onView: () => void;
};

function ClassCard({ classItem, saved, onSave, onView }: ClassCardProps) {
  const levelMark = classItem.level.startsWith("IELTS")
    ? "IELTS"
    : classItem.level.replace("Lớp ", "");
  const isSpotlight = classItem.id === "toan-12-on-thi";
  const filledSeats = classItem.totalSeats - classItem.availableSeats;

  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-[22px] border border-border/85 bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_18px_42px_-28px_rgba(40,15,145,0.35)] sm:grid-cols-[136px_minmax(0,1fr)] xl:grid-cols-[148px_minmax(0,1fr)_178px]">
      <div
        aria-hidden="true"
        className={`relative flex h-24 flex-col justify-between overflow-hidden p-4 sm:h-full sm:min-h-[218px] sm:p-5 ${isSpotlight ? "bg-primary text-primary-foreground" : SUBJECT_STYLES[classItem.subject]}`}
      >
        <span className="pointer-events-none absolute -bottom-14 -right-14 size-44 rounded-full border-[24px] border-current opacity-10" />
        {isSpotlight && (
          <span className="absolute right-4 top-4 size-2 rounded-full bg-accent" />
        )}
        <span className="relative text-[10px] font-black uppercase tracking-[0.16em]">
          {classItem.subject}
        </span>
        <strong className={`relative font-nunito font-black leading-none tracking-tight ${levelMark === "IELTS" ? "text-[31px] sm:text-[26px]" : "text-[52px] sm:text-[64px]"}`}>
          {levelMark}
        </strong>
      </div>

      <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
            <span>{classItem.level}</span>
            <span className="text-primary/35" aria-hidden="true">/</span>
            <span>Khai giảng {classItem.startDate}</span>
            {classItem.highlight && (
              <span className="rounded-full bg-accent/35 px-2.5 py-1 text-[11px] text-foreground">
                {classItem.highlight}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={`${saved ? "Bỏ lưu" : "Lưu"} lớp ${classItem.title}`}
            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${saved ? "bg-primary text-primary-foreground" : "bg-muted/70 text-muted-foreground hover:text-primary"}`}
          >
            <BookmarkSimpleIcon size={18} weight={saved ? "fill" : "regular"} />
          </button>
        </div>

        <h3 className="mt-2.5 font-nunito text-lg font-extrabold leading-snug text-foreground sm:text-[21px]">
          {classItem.title}
        </h3>
        <p className="mt-1.5 hidden text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
          {classItem.description}
        </p>

        <div className="mt-4 flex items-center gap-2.5 text-sm font-bold text-foreground">
          <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            <Image
              src={classItem.tutorImage}
              alt=""
              fill
              sizes="64px"
              className="origin-top scale-[1.8] object-cover"
            />
          </span>
          {classItem.tutor}
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">· Gia sư phụ trách</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-foreground/80">
          <span className="flex items-center gap-2">
            <CalendarBlankIcon size={15} className="text-primary" />
            {classItem.schedule}
          </span>
          <span className="flex items-center gap-1.5">
            {classItem.format === "Online" ? (
              <VideoCameraIcon size={15} className="text-primary" />
            ) : (
              <MapPinIcon size={15} className="text-primary" />
            )}
            {classItem.location}
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <ClockIcon size={15} className="text-primary" />
            {classItem.duration}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 px-4 py-4 sm:col-span-2 sm:px-5 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:flex-col xl:items-stretch xl:justify-center xl:border-l xl:border-t-0 xl:px-5 xl:py-5">
        <div>
          <p className="font-nunito text-xl font-black text-primary xl:text-right">
            {priceFormatter.format(classItem.pricePerSession)}đ
            <span className="ml-1 text-xs font-semibold text-muted-foreground">/ buổi</span>
          </p>
          <div className="mt-2.5 flex items-center gap-2 xl:justify-end">
            <UsersThreeIcon size={15} className="text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              {classItem.availableSeats > 0
                ? `Còn ${classItem.availableSeats}/${classItem.totalSeats} chỗ`
                : "Đã đủ học viên"}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={`Sĩ số lớp ${classItem.title}`}
            aria-valuemin={0}
            aria-valuemax={classItem.totalSeats}
            aria-valuenow={filledSeats}
            className="mt-2 h-1 overflow-hidden rounded-full bg-primary/10"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(filledSeats / classItem.totalSeats) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 xl:w-full"
        >
          Xem lớp
          <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </article>
  );
}

export function ClassDiscovery() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<AllOr<ClassSubject>>("all");
  const [format, setFormat] = useState<AllOr<ClassFormat>>("all");
  const [time, setTime] = useState<AllOr<ClassTime>>("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<MockClass | null>(null);

  const visibleClasses = useMemo(() => {
    const search = normalizeSearch(query);
    const filtered = MOCK_CLASSES.filter((classItem) => {
      const matchesSearch =
        !search ||
        normalizeSearch(
          `${classItem.title} ${classItem.subject} ${classItem.level} ${classItem.tutor}`,
        ).includes(search);

      return (
        matchesSearch &&
        (subject === "all" || classItem.subject === subject) &&
        (format === "all" || classItem.format === format) &&
        (time === "all" || classItem.time === time) &&
        (maxPrice === "all" || classItem.pricePerSession <= Number(maxPrice)) &&
        (!availableOnly || classItem.availableSeats > 0)
      );
    });

    if (sortOrder === "price-low") {
      return filtered.sort((a, b) => a.pricePerSession - b.pricePerSession);
    }
    if (sortOrder === "price-high") {
      return filtered.sort((a, b) => b.pricePerSession - a.pricePerSession);
    }
    if (sortOrder === "soonest") {
      return filtered.sort((a, b) => {
        const [dayA, monthA, yearA] = a.startDate.split("/").map(Number);
        const [dayB, monthB, yearB] = b.startDate.split("/").map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      });
    }
    return filtered;
  }, [query, subject, format, time, maxPrice, availableOnly, sortOrder]);

  const resetFilters = () => {
    setQuery("");
    setSubject("all");
    setFormat("all");
    setTime("all");
    setMaxPrice("all");
    setAvailableOnly(false);
    setSortOrder("recommended");
  };

  const filterProps: Omit<FilterFieldsProps, "idPrefix"> = {
    format,
    onFormatChange: setFormat,
    time,
    onTimeChange: setTime,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
    availableOnly,
    onAvailableOnlyChange: setAvailableOnly,
  };

  const toggleId = (ids: string[], id: string) =>
    ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];

  const activeFilterCount = [
    format !== "all",
    time !== "all",
    maxPrice !== "all",
    availableOnly,
  ].filter(Boolean).length;

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle at 76% -40%, rgba(255,197,0,0.24), transparent 34%), linear-gradient(120deg, transparent 48%, rgba(255,255,255,0.08) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-9 lg:px-8">
          <div className="grid items-end gap-5 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:gap-10">
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                Lớp nhóm BeeWise
              </p>
              <h1 className="font-nunito text-3xl font-black tracking-tight sm:text-[38px]">
                Tìm lớp học
              </h1>
              <p className="mt-1.5 text-sm text-white/75">
                Học theo nhóm nhỏ cùng gia sư phù hợp với bạn.
              </p>
            </div>

            <div>
              <label htmlFor="class-search" className="mb-2 block text-xs font-bold text-white/80">
                Bạn muốn học gì?
              </label>
              <div className="flex h-14 items-center gap-3 rounded-2xl bg-background px-4 text-foreground shadow-[0_12px_32px_-18px_rgba(10,4,55,0.6)] ring-2 ring-transparent transition-shadow focus-within:ring-accent/85">
                <MagnifyingGlassIcon size={22} className="shrink-0 text-primary" />
                <input
                  id="class-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Môn học, khối lớp hoặc tên gia sư"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <XIcon size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto border-t border-white/15 py-3 sm:mt-7" aria-label="Lọc theo môn học">
            {SUBJECTS.map((item) => {
              const count = item === "all"
                ? MOCK_CLASSES.length
                : MOCK_CLASSES.filter((classItem) => classItem.subject === item).length;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSubject(item)}
                  aria-pressed={subject === item}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${subject === item ? "bg-accent text-accent-foreground" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                >
                  {item === "all" ? "Tất cả" : item}
                  <span className={`text-[11px] ${subject === item ? "text-accent-foreground/65" : "text-white/55"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="min-h-[60dvh] bg-[#f7f8fc] pb-20 pt-7 sm:pt-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-nunito text-xl font-black text-foreground sm:text-2xl">
                Lớp đang mở
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {visibleClasses.length} kết quả · Dữ liệu minh họa
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="class-sort" className="text-sm font-semibold text-muted-foreground">
                Sắp xếp
              </label>
              <select
                id="class-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="recommended">Mặc định</option>
                <option value="soonest">Khai giảng sớm</option>
                <option value="price-low">Học phí thấp nhất</option>
                <option value="price-high">Học phí cao nhất</option>
              </select>
            </div>
          </div>

          <details className="mt-5 rounded-2xl border border-border bg-background p-4 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-primary [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <FunnelIcon size={18} />
                Bộ lọc
              </span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </summary>
            <div className="mt-5 border-t border-border pt-5">
              <FilterFields {...filterProps} idPrefix="mobile-class" />
              <button type="button" onClick={resetFilters} className="mt-5 text-sm font-bold text-primary underline underline-offset-4">
                Xóa bộ lọc
              </button>
            </div>
          </details>

          <div className="mt-5 grid items-start gap-6 lg:grid-cols-[252px_minmax(0,1fr)] lg:gap-7">
            <aside className="hidden rounded-2xl border border-border bg-background p-5 lg:sticky lg:top-24 lg:block" aria-label="Bộ lọc lớp học">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-nunito text-lg font-extrabold text-foreground">Bộ lọc</h3>
                <button type="button" onClick={resetFilters} className="text-xs font-bold text-primary underline-offset-4 hover:underline">
                  Xóa tất cả
                </button>
              </div>
              <FilterFields {...filterProps} idPrefix="desktop-class" />
            </aside>

            <div>
              {visibleClasses.length > 0 ? (
                <div className="grid gap-3.5">
                  {visibleClasses.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      saved={savedIds.includes(classItem.id)}
                      onSave={() => setSavedIds((current) => toggleId(current, classItem.id))}
                      onView={() => setSelectedClass(classItem)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-background px-6 py-16 text-center">
                  <MagnifyingGlassIcon size={36} className="mx-auto text-primary" />
                  <h3 className="mt-4 font-nunito text-xl font-extrabold text-foreground">
                    Chưa có lớp phù hợp
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Thử đổi môn học, lịch học hoặc mức học phí để xem thêm lớp.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Dialog.Root open={selectedClass !== null} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-90 bg-foreground/55" />
          {selectedClass && (
            <Dialog.Content className="fixed left-1/2 top-1/2 z-91 max-h-[90dvh] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl focus:outline-none sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary">
                  {selectedClass.subject} · {selectedClass.level}
                </span>
                <Dialog.Close asChild>
                  <button type="button" aria-label="Đóng chi tiết lớp" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <XIcon size={18} />
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Title className="mt-4 font-nunito text-2xl font-black leading-tight text-foreground">
                {selectedClass.title}
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {selectedClass.description}
              </Dialog.Description>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted/55 p-3">
                <Image src={selectedClass.tutorImage} alt="" width={48} height={48} className="size-12 rounded-full object-cover object-top" />
                <div>
                  <p className="text-xs text-muted-foreground">Gia sư tổ chức lớp</p>
                  <p className="font-bold text-foreground">{selectedClass.tutor}</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Khai giảng</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.startDate}</dd></div>
                <div><dt className="text-muted-foreground">Lịch học</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.schedule}</dd></div>
                <div><dt className="text-muted-foreground">Hình thức</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.format}</dd></div>
                <div><dt className="text-muted-foreground">Địa điểm</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.location}</dd></div>
                <div><dt className="text-muted-foreground">Thời lượng</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.duration}</dd></div>
                <div><dt className="text-muted-foreground">Sĩ số</dt><dd className="mt-1 font-bold text-foreground">{selectedClass.availableSeats > 0 ? `Còn ${selectedClass.availableSeats}/${selectedClass.totalSeats} chỗ` : "Đã đủ học viên"}</dd></div>
              </dl>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <div>
                  <p className="text-xs text-muted-foreground">Học phí mỗi buổi</p>
                  <p className="font-nunito text-2xl font-black text-primary">{priceFormatter.format(selectedClass.pricePerSession)}đ</p>
                </div>
                <button
                  type="button"
                  disabled={selectedClass.availableSeats === 0}
                  onClick={() => setInterestedIds((current) => toggleId(current, selectedClass.id))}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {selectedClass.availableSeats === 0
                    ? "Lớp đã đủ học viên"
                    : interestedIds.includes(selectedClass.id)
                      ? "Đã đánh dấu quan tâm"
                      : "Quan tâm lớp"}
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Giao diện mẫu: thao tác quan tâm chỉ được lưu trong phiên này.</p>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
