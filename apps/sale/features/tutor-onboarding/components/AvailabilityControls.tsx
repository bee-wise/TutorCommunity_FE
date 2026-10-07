"use client";

import { useRef, useState } from "react";
import { CaretDown, Check, Clock } from "@phosphor-icons/react/dist/ssr";
import { Popover, Select } from "radix-ui";

export const AVAILABILITY_DAYS = [
  { value: "MONDAY", label: "Thứ Hai" },
  { value: "TUESDAY", label: "Thứ Ba" },
  { value: "WEDNESDAY", label: "Thứ Tư" },
  { value: "THURSDAY", label: "Thứ Năm" },
  { value: "FRIDAY", label: "Thứ Sáu" },
  { value: "SATURDAY", label: "Thứ Bảy" },
  { value: "SUNDAY", label: "Chủ Nhật" },
] as const;

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const QUICK_MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

const triggerClass =
  "flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-input bg-card px-3 text-left text-sm font-semibold text-foreground shadow-soft outline-none transition hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 data-[invalid=true]:border-destructive data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive/15 data-[state=open]:border-primary data-[state=open]:ring-3 data-[state=open]:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

export function AvailabilityDaySelect({
  value,
  onChange,
  label,
  invalid = false,
  disabled = false,
  errorId,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  invalid?: boolean;
  disabled?: boolean;
  errorId?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger aria-label={label} aria-describedby={invalid ? errorId : undefined} data-invalid={invalid || undefined} className={triggerClass}>
        <Select.Value placeholder="Chọn thứ" />
        <Select.Icon asChild>
          <CaretDown className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 w-[var(--radix-select-trigger-width)] min-w-44 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-soft"
        >
          <Select.Viewport className="max-h-72">
            {AVAILABILITY_DAYS.map((day) => (
              <Select.Item
                key={day.value}
                value={day.value}
                className="relative flex h-10 cursor-pointer items-center rounded-xl px-3 pr-9 text-sm font-medium outline-none transition data-[highlighted]:bg-muted data-[highlighted]:text-primary data-[state=checked]:font-bold data-[state=checked]:text-primary"
              >
                <Select.ItemText>{day.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3 text-primary">
                  <Check className="h-4 w-4" weight="bold" aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function parseTime(value: string, fallback: string): [string, string] {
  const [hour, minute] = (value || fallback).split(":");
  return [hour ?? "08", minute ?? "00"];
}

function validPart(value: string, max: number): boolean {
  if (!/^\d{1,2}$/.test(value)) return false;
  const number = Number(value);
  return number >= 0 && number <= max;
}

export function AvailabilityTimePicker({
  value,
  onChange,
  label,
  fallback = "08:00",
  invalid = false,
  disabled = false,
  errorId,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  fallback?: string;
  invalid?: boolean;
  disabled?: boolean;
  errorId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [initialHour, initialMinute] = parseTime(value, fallback);
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const isValid = validPart(hour, 23) && validPart(minute, 59);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const [nextHour, nextMinute] = parseTime(value, fallback);
      setHour(nextHour);
      setMinute(nextMinute);
    }
    setOpen(nextOpen);
  };

  const apply = () => {
    if (!isValid) return;
    onChange(`${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button type="button" disabled={disabled} aria-label={label} aria-describedby={invalid ? errorId : undefined} data-invalid={invalid || undefined} className={triggerClass}>
          <span className={`flex min-w-0 items-center gap-2 ${value ? "tabular-nums" : "text-muted-foreground"}`}>
            <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {value || "Chọn giờ"}
          </span>
          <CaretDown className={`h-4 w-4 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            hourInputRef.current?.focus();
          }}
          className="z-50 w-[min(304px,calc(100vw-24px))] rounded-3xl border border-border bg-popover p-4 text-popover-foreground shadow-soft outline-none"
        >
          <p className="font-nunito text-sm font-extrabold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">Chọn nhanh hoặc nhập giờ phút chính xác.</p>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <label className="grid gap-1 text-center text-xs font-semibold text-muted-foreground">
              Giờ
              <input
                ref={hourInputRef}
                type="number"
                min={0}
                max={23}
                inputMode="numeric"
                aria-label={`${label}, giờ`}
                value={hour}
                onChange={(event) => setHour(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") { event.preventDefault(); apply(); }
                }}
                className="h-12 w-full rounded-2xl border border-input bg-card text-center text-lg font-bold tabular-nums text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
            </label>
            <span className="pt-5 text-lg font-bold text-primary">:</span>
            <label className="grid gap-1 text-center text-xs font-semibold text-muted-foreground">
              Phút
              <input
                type="number"
                min={0}
                max={59}
                inputMode="numeric"
                aria-label={`${label}, phút`}
                value={minute}
                onChange={(event) => setMinute(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") { event.preventDefault(); apply(); }
                }}
                className="h-12 w-full rounded-2xl border border-input bg-card text-center text-lg font-bold tabular-nums text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-bold text-muted-foreground">Chọn giờ</p>
              <div role="group" aria-label="Chọn giờ" className="grid max-h-40 grid-cols-3 gap-1 overflow-y-auto rounded-2xl border border-border bg-muted p-1.5">
                {HOURS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={validPart(hour, 23) && Number(hour) === option}
                    onClick={() => setHour(String(option).padStart(2, "0"))}
                    className={`h-10 rounded-xl text-xs font-bold tabular-nums outline-none transition active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary ${validPart(hour, 23) && Number(hour) === option ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-primary/10"}`}
                  >
                    {String(option).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-bold text-muted-foreground">Chọn phút</p>
              <div role="group" aria-label="Chọn phút" className="grid max-h-40 grid-cols-3 gap-1 overflow-y-auto rounded-2xl border border-border bg-muted p-1.5">
                {QUICK_MINUTES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={validPart(minute, 59) && Number(minute) === option}
                    onClick={() => setMinute(String(option).padStart(2, "0"))}
                    className={`h-10 rounded-xl text-xs font-bold tabular-nums outline-none transition active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary ${validPart(minute, 59) && Number(minute) === option ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-primary/10"}`}
                  >
                    {String(option).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {!isValid && <p role="alert" className="mt-3 text-xs font-semibold text-destructive">Giờ cần từ 00 đến 23, phút từ 00 đến 59.</p>}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Xóa giờ</button>
            <button type="button" onClick={apply} disabled={!isValid} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Áp dụng</button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
