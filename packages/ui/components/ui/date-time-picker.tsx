"use client";

import { useEffect, useMemo, useState } from "react";
import { Popover } from "radix-ui";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  X,
} from "@phosphor-icons/react";

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

  // Sync internal state when external value changes
  useEffect(() => {
    const updated = parseToDate(value);
    if (updated) {
      setSelectedDay(updated);
      setHours(updated.getHours());
      setMinutes(updated.getMinutes());
      setViewDate(new Date(updated.getFullYear(), updated.getMonth(), 1));
    } else {
      setSelectedDay(null);
    }
  }, [value]);

  const min = useMemo(() => (minDate ? parseToDate(minDate) : null), [minDate]);
  const max = useMemo(() => (maxDate ? parseToDate(maxDate) : null), [maxDate]);

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
    const finalDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      h,
      m,
      0,
    );
    setSelectedDay(finalDate);
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
    const targetDay = selectedDay ?? new Date();
    commitDateTime(targetDay, h, m);
  }

  function handleSelectToday() {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    commitDateTime(
      now,
      now.getHours(),
      (Math.ceil(now.getMinutes() / 5) * 5) % 60,
    );
  }

  function handleClear() {
    setSelectedDay(null);
    onChange?.("");
  }

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

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
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
              <CalendarBlank
                size={16}
                weight="bold"
                className="shrink-0 text-primary"
              />
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
                  <X size={12} weight="bold" />
                </span>
              )}
              <Clock size={14} className="text-muted-foreground/60" />
            </div>
          </button>
        </Popover.Trigger>

        {/* Portal ensures calendar is rendered above modals/dialogs without overflow clipping */}
        <Popover.Portal>
          <Popover.Content
            side={side}
            align={align}
            sideOffset={8}
            avoidCollisions={true}
            collisionPadding={16}
            className="z-[99999] w-[min(320px,calc(100vw-24px))] rounded-2xl border border-border bg-card p-3.5 shadow-2xl text-foreground outline-none animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/80">
              <div className="flex items-center gap-1">
                <span className="font-nunito font-extrabold text-sm text-foreground">
                  {MONTH_NAMES[viewDate.getMonth()]}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {viewDate.getFullYear()}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Tháng trước"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
                >
                  <CaretLeft size={13} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Tháng sau"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
                >
                  <CaretRight size={13} weight="bold" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center text-[10px] font-bold text-muted-foreground uppercase">
              {WEEKDAYS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={item.isDisabled || !item.isCurrentMonth}
                  onClick={() => handleSelectDay(item.date)}
                  className={`flex h-7 w-full items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !item.isCurrentMonth
                      ? "opacity-25 pointer-events-none"
                      : item.isSelected
                        ? "bg-primary text-primary-foreground font-extrabold shadow-xs"
                        : item.isToday
                          ? "border border-primary text-primary hover:bg-primary/10"
                          : "hover:bg-muted text-foreground"
                  } ${item.isDisabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}`}
                >
                  {item.date.getDate()}
                </button>
              ))}
            </div>

            {/* Time Picker Section */}
            <div className="mt-3 pt-2.5 border-t border-border/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Clock size={14} weight="bold" className="text-primary" />
                  <span>Giờ học (hh:mm)</span>
                </div>

                {/* Steppers */}
                <div className="flex items-center gap-1 bg-background border border-input rounded-xl p-1">
                  {/* Hours */}
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={String(hours).padStart(2, "0")}
                    onChange={(e) => handleHourChange(Number(e.target.value))}
                    className="w-8 text-center text-xs font-bold bg-transparent outline-none text-foreground font-mono focus:text-primary"
                  />
                  <span className="text-xs font-bold text-muted-foreground">
                    :
                  </span>
                  {/* Minutes */}
                  <input
                    type="number"
                    min={0}
                    max={59}
                    step={5}
                    value={String(minutes).padStart(2, "0")}
                    onChange={(e) => handleMinuteChange(Number(e.target.value))}
                    className="w-8 text-center text-xs font-bold bg-transparent outline-none text-foreground font-mono focus:text-primary"
                  />
                </div>
              </div>

              {/* Quick Time Presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {QUICK_TIME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPresetTime(preset)}
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer ${
                      String(hours).padStart(2, "0") +
                        ":" +
                        String(minutes).padStart(2, "0") ===
                      preset
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Footer Action Buttons */}
            <div className="mt-3 pt-2.5 border-t border-border/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSelectToday}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                Hôm nay
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1 text-xs font-nunito font-extrabold text-primary-foreground hover:bg-primary/95 active:scale-95 transition-all cursor-pointer"
              >
                <Check size={12} weight="bold" />
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
