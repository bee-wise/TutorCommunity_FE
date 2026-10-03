"use client";

import { ProfileSelect } from "./ProfileSelect";

const TIME_OPTIONS = Array.from({ length: 36 }, (_, index) => {
  const totalMinutes = 6 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

function toMinutes(value: string): number {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function parseRange(value: string): { start: string; end: string } {
  const [start, end] = value.split("-");
  return {
    start: TIME_OPTIONS.includes(start ?? "") ? (start as string) : "18:00",
    end: TIME_OPTIONS.includes(end ?? "") ? (end as string) : "20:00",
  };
}

export function AvailabilityTimeRangeField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const range = parseRange(value);

  const changeStart = (start: string) => {
    const currentEnd = toMinutes(range.end);
    const startMinutes = toMinutes(start);
    const nextEnd =
      currentEnd > startMinutes
        ? range.end
        : TIME_OPTIONS.find((time) => toMinutes(time) >= startMinutes + 60) ??
          TIME_OPTIONS[TIME_OPTIONS.length - 1];
    onChange(`${start}-${nextEnd}`);
  };

  return (
    <div>
      <div className="grid grid-cols-2 items-start gap-2">
        <div className="grid gap-1 text-xs font-medium text-muted-foreground">
          <span>Bắt đầu</span>
          <ProfileSelect
            value={range.start}
            onChange={changeStart}
            label="Giờ bắt đầu"
            placeholder="Chọn giờ"
            searchable
            searchPlaceholder="Tìm giờ bắt đầu..."
            options={TIME_OPTIONS.slice(0, -1).map((time) => ({ value: time, label: time }))}
          />
        </div>
        <div className="grid gap-1 text-xs font-medium text-muted-foreground">
          <span>Kết thúc</span>
          <ProfileSelect
            value={range.end}
            onChange={(end) => onChange(`${range.start}-${end}`)}
            label="Giờ kết thúc"
            placeholder="Chọn giờ"
            searchable
            searchPlaceholder="Tìm giờ kết thúc..."
            options={TIME_OPTIONS.map((time) => ({ value: time, label: time, disabled: toMinutes(time) <= toMinutes(range.start) }))}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
