"use client";

import { useMemo, useState } from "react";
import { Popover } from "radix-ui";
import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export interface DateTimePickerProps {
  value?: string | Date | null;
  onChange?: (isoOrFormatted: string) => void;
  placeholder?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  portalContainer?: HTMLElement | null;
}

const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const WEEKDAY_LONG = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => index);

const QUICK_TIME_PRESETS = [
  "08:00",
  "09:30",
  "14:00",
  "15:30",
  "18:00",
  "19:30",
  "20:00",
];

export function parseToDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  // Try parsing dd/mm/yyyy hh:mm or dd/mm/yyyy
  const vnMatch = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/,
  );
  if (vnMatch) {
    const [, d, m, y, h = "0", min = "0"] = vnMatch;
    const date = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(min),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Standard Date parse (ISO, datetime-local)
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTimeVN(date?: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function formatToDatetimeLocalValue(date?: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy hh:mm",
  minDate,
  maxDate,
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  label,
  error,
  side = "right",
  align = "start",
  portalContainer,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const parsedDate = useMemo(() => parseToDate(value), [value]);

  // Current view month & year in the calendar
  const [viewDate, setViewDate] = useState<Date>(
    () => parsedDate ?? new Date(),
  );

  // Selected date components
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => parsedDate);
  const [hours, setHours] = useState<number>(() => parsedDate?.getHours() ?? 8);
  const [minutes, setMinutes] = useState<number>(
    () => parsedDate?.getMinutes() ?? 0,
  );

  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    setPreviousValue(value);
    setSelectedDay(parsedDate);
    if (parsedDate) {
      setHours(parsedDate.getHours());
      setMinutes(parsedDate.getMinutes());
      setViewDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    }
  }

  const min = useMemo(() => (minDate ? parseToDate(minDate) : null), [minDate]);
  const max = useMemo(() => (maxDate ? parseToDate(maxDate) : null), [maxDate]);
  const earliest = min ? new Date(Math.ceil(min.getTime() / 60_000) * 60_000) : null;
  const latest = max ? new Date(Math.floor(max.getTime() / 60_000) * 60_000) : null;

  // Calendar matrix calculations
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday as first day of week: 0 = Mon, ..., 6 = Sun
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: false,
        isSelected: false,
      });
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const selectedStr = selectedDay
      ? `${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`
      : null;

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const currentDate = new Date(year, month, d);
      const currentStr = `${year}-${month}-${d}`;

      let isDisabled = false;
      if (
        min &&
        currentDate < new Date(min.getFullYear(), min.getMonth(), min.getDate())
      ) {
        isDisabled = true;
      }
      if (
        max &&
        currentDate > new Date(max.getFullYear(), max.getMonth(), max.getDate())
      ) {
        isDisabled = true;
      }

      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isDisabled,
        isToday: currentStr === todayStr,
        isSelected: currentStr === selectedStr,
      });
    }

    // Next month padding days to complete multiple of 7
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: false,
        isSelected: false,
      });
    }

    return days;
  }, [viewDate, selectedDay, min, max]);

  function handlePrevMonth() {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function commitDateTime(date: Date, h: number, m: number) {
    let finalDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      h,
      m,
      0,
    );
    if (earliest && finalDate < earliest) finalDate = earliest;
    if (latest && finalDate > latest) finalDate = latest;
    if (earliest && latest && earliest > latest) return;
    setSelectedDay(finalDate);
    setHours(finalDate.getHours());
    setMinutes(finalDate.getMinutes());
    setViewDate(new Date(finalDate.getFullYear(), finalDate.getMonth(), 1));
    onChange?.(formatToDatetimeLocalValue(finalDate));
  }

  function handleSelectDay(day: Date) {
    commitDateTime(day, hours, minutes);
  }

  function handleHourChange(newHour: number) {
    const validHour = Math.max(0, Math.min(23, newHour));
    setHours(validHour);
    if (selectedDay) {
      commitDateTime(selectedDay, validHour, minutes);
    }
  }

  function handleMinuteChange(newMin: number) {
    const validMin = Math.max(0, Math.min(59, newMin));
    setMinutes(validMin);
    if (selectedDay) {
      commitDateTime(selectedDay, hours, validMin);
    }
  }

  function handleSelectPresetTime(timeStr: string) {
    const [h, m] = timeStr.split(":").map(Number);
    setHours(h);
    setMinutes(m);
    if (selectedDay) commitDateTime(selectedDay, h, m);
  }

  function handleSelectToday() {
    const now = new Date();
    const rounded = new Date(Math.ceil(now.getTime() / 300_000) * 300_000);
    commitDateTime(rounded, rounded.getHours(), rounded.getMinutes());
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const canSelectToday = (!earliest || earliest < todayEnd) && (!latest || latest >= todayStart);

  function handleClear() {
    setSelectedDay(null);
    onChange?.("");
  }

  const minuteOptions = useMemo(() => {
    const options = Array.from({ length: 12 }, (_, index) => index * 5);
    return options.includes(minutes)
      ? options
      : [...options, minutes].sort((a, b) => a - b);
  }, [minutes]);

  // Past/out-of-range slots on the selected day are disabled instead of silently clamped.
  function isSlotDisabled(h: number, m: number) {
    if (!selectedDay) return false;
    const slot = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      h,
      m,
    );
    return Boolean((earliest && slot < earliest) || (latest && slot > latest));
  }

  function isHourDisabled(h: number) {
    return minuteOptions.every((m) => isSlotDisabled(h, m));
  }

  const summaryString = selectedDay
    ? `${WEEKDAY_LONG[selectedDay.getDay()]}, ${formatDateTimeVN(
        new Date(
          selectedDay.getFullYear(),
          selectedDay.getMonth(),
          selectedDay.getDate(),
          hours,
          minutes,
        ),
      ).replace(" ", " · ")}`
    : "";

  const displayString = selectedDay
    ? formatDateTimeVN(
        new Date(
          selectedDay.getFullYear(),
          selectedDay.getMonth(),
          selectedDay.getDate(),
          hours,
          minutes,
        ),
      )
    : "";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-foreground mb-1"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <Popover.Root open={isOpen} onOpenChange={(open) => {
        if (open) {
          const target = selectedDay ?? earliest ?? new Date();
          setViewDate(new Date(target.getFullYear(), target.getMonth(), 1));
        }
        setIsOpen(open);
      }}>
        <Popover.Trigger asChild>
          <button
            id={id}
            name={name}
            type="button"
            disabled={disabled}
            className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2 text-xs text-left transition-all shadow-2xs cursor-pointer ${
              isOpen
                ? "border-primary ring-2 ring-primary/20"
                : error
                  ? "border-destructive ring-1 ring-destructive/20"
                  : "border-input hover:border-primary/50"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-muted/40" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <CalendarDaysIcon className="size-4 shrink-0 text-primary" />
              <span
                className={`truncate font-medium ${
                  displayString
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {displayString || placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {displayString && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Xóa ngày giờ"
                >
                    <XMarkIcon className="size-3" />
                </span>
              )}
              <ClockIcon className="size-3.5 text-muted-foreground/60" />
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal container={portalContainer ?? undefined}>
          <Popover.Content
            side={side}
            align={align}
            sideOffset={8}
            avoidCollisions={true}
            collisionPadding={16}
            style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
            className="z-[99999] w-[min(344px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-4 shadow-pop text-foreground outline-none animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Selected summary */}
            <div className="mb-3 rounded-xl bg-muted px-3 py-2">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Thời gian đã chọn
              </p>
              <p className="font-nunito text-sm font-extrabold tabular-nums text-foreground">
                {summaryString || "Chưa chọn ngày"}
              </p>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between gap-2 pb-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95 cursor-pointer"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="font-nunito text-sm font-extrabold text-foreground">
                {MONTH_NAMES[viewDate.getMonth()]}{" "}
                <span className="text-muted-foreground">
                  {viewDate.getFullYear()}
                </span>
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Tháng sau"
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95 cursor-pointer"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 pb-1 text-center text-[11px] font-bold text-muted-foreground">
              {WEEKDAYS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, idx) =>
                item.isCurrentMonth ? (
                  <button
                    key={idx}
                    type="button"
                    disabled={item.isDisabled}
                    aria-label={`${item.date.getDate()}/${item.date.getMonth() + 1}/${item.date.getFullYear()}`}
                    aria-pressed={item.isSelected}
                    onClick={() => handleSelectDay(item.date)}
                    className={`flex size-10 w-full items-center justify-center rounded-xl text-sm font-semibold tabular-nums transition-all ${
                      item.isSelected
                        ? "bg-primary text-primary-foreground font-extrabold shadow-xs"
                        : item.isDisabled
                          ? "cursor-not-allowed text-muted-foreground/40"
                          : item.isToday
                            ? "cursor-pointer border-2 border-primary text-primary hover:bg-muted"
                            : "cursor-pointer text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.date.getDate()}
                  </button>
                ) : (
                  <span key={idx} aria-hidden="true" />
                ),
              )}
            </div>

            {/* Time Picker Section */}
            <div className="mt-3 space-y-2.5 border-t border-border pt-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <ClockIcon className="size-4 text-primary" />
                  <span>Giờ học</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    aria-label="Giờ"
                    value={hours}
                    onChange={(e) => handleHourChange(Number(e.target.value))}
                    className="h-9 rounded-xl border border-input bg-background px-2 text-sm font-bold tabular-nums text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
                  >
                    {HOUR_OPTIONS.map((h) => (
                      <option key={h} value={h} disabled={isHourDisabled(h)}>
                        {String(h).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-bold text-muted-foreground">
                    :
                  </span>
                  <select
                    aria-label="Phút"
                    value={minutes}
                    onChange={(e) => handleMinuteChange(Number(e.target.value))}
                    className="h-9 rounded-xl border border-input bg-background px-2 text-sm font-bold tabular-nums text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
                  >
                    {minuteOptions.map((m) => (
                      <option key={m} value={m} disabled={isSlotDisabled(hours, m)}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Time Presets */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TIME_PRESETS.map((preset) => {
                  const [ph, pm] = preset.split(":").map(Number) as [number, number];
                  const active = ph === hours && pm === minutes;
                  const unavailable = isSlotDisabled(ph, pm);
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={unavailable}
                      onClick={() => handleSelectPresetTime(preset)}
                      className={`h-8 rounded-lg border px-2.5 text-xs font-semibold tabular-nums transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : unavailable
                            ? "cursor-not-allowed border-border bg-background text-muted-foreground/40"
                            : "cursor-pointer border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={handleSelectToday}
                disabled={!canSelectToday}
                className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-primary transition-all hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Hôm nay
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 font-nunito text-xs font-extrabold text-primary-foreground transition-all hover:bg-primary/95 active:scale-95 cursor-pointer"
              >
                <CheckIcon className="size-4" />
                <span>Xong</span>
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
