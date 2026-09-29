"use client";

import { useState, type Ref } from "react";
import { DayPicker } from "@daypicker/react";
import { vi } from "@daypicker/react/locale";
import "@daypicker/react/style.css";
import { CalendarBlank } from "@phosphor-icons/react";
import { Popover } from "radix-ui";
import {
  formatBirthDate,
  getLatestEligibleBirthDate,
  isEligibleBirthDate,
  MIN_TUTOR_AGE,
  parseBirthDate,
} from "../utils/birth-date";
import { profileInputClass } from "./ProfileField";
import styles from "./BirthDatePicker.module.css";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function BirthDatePicker({
  id,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLButtonElement>;
  invalid: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseBirthDate(value);
  const latestBirthDate = getLatestEligibleBirthDate();

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) onBlur();
      }}
    >
      <Popover.Trigger asChild>
        <button
          ref={inputRef}
          id={id}
          type="button"
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={`${profileInputClass} flex items-center justify-between text-left ${selected ? "" : "text-muted-foreground/60"}`}
        >
          <span>{selected ? dateFormatter.format(selected) : "Chọn ngày sinh"}</span>
          <CalendarBlank size={18} aria-hidden="true" className="shrink-0 text-primary" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          aria-label="Chọn ngày sinh"
          className="z-50 w-[min(352px,calc(100vw-24px))] rounded-2xl border border-border bg-popover p-3 shadow-lg outline-none sm:p-4 text-popover-foreground"
        >
          <p className="mb-2 text-sm font-bold text-foreground">Chọn ngày sinh</p>
          <DayPicker
            mode="single"
            locale={vi}
            weekStartsOn={1}
            captionLayout="dropdown"
            navLayout="after"
            reverseYears
            startMonth={new Date(1900, 0)}
            endMonth={latestBirthDate}
            defaultMonth={selected && selected <= latestBirthDate ? selected : latestBirthDate}
            selected={selected}
            disabled={{ after: latestBirthDate }}
            onSelect={(date) => {
              if (!date || !isEligibleBirthDate(date)) return;
              onChange(formatBirthDate(date));
              onBlur();
              setOpen(false);
            }}
            className={styles.calendar}
          />
          <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
            Gia sư cần từ đủ {MIN_TUTOR_AGE} tuổi trở lên.
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
