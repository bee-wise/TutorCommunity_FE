"use client";

import { profileInputClass } from "./ProfileField";

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
        <label className="grid gap-1 text-xs font-medium text-slate-500">
          Bắt đầu
          <select
            value={range.start}
            onChange={(event) => changeStart(event.target.value)}
            className={profileInputClass}
            aria-label="Giờ bắt đầu"
          >
            {TIME_OPTIONS.slice(0, -1).map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-slate-500">
          Kết thúc
          <select
            value={range.end}
            onChange={(event) => onChange(`${range.start}-${event.target.value}`)}
            className={profileInputClass}
            aria-label="Giờ kết thúc"
          >
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time} disabled={toMinutes(time) <= toMinutes(range.start)}>{time}</option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
