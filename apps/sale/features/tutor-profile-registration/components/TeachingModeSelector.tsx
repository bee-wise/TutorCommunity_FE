"use client";

import { Check } from "@phosphor-icons/react";

type TeachingMode = "ONLINE" | "OFFLINE";

const options: ReadonlyArray<{
  label: string;
  description: string;
  value: TeachingMode;
}> = [
  {
    label: "Online",
    description: "Dạy qua nền tảng trực tuyến",
    value: "ONLINE",
  },
  {
    label: "Trực tiếp",
    description: "Dạy tại khu vực đã đăng ký",
    value: "OFFLINE",
  },
];

function toggleMode(current: TeachingMode[], mode: TeachingMode) {
  const next = new Set(current);
  if (next.has(mode)) next.delete(mode);
  else next.add(mode);
  return options.map((option) => option.value).filter((value) => next.has(value));
}

export function TeachingModeSelector({
  value,
  onChange,
}: {
  value: TeachingMode[];
  onChange: (value: TeachingMode[]) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Hình thức dạy, có thể chọn nhiều"
      className="grid items-start gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
    >
      {options.map((option) => {
        const selected = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(toggleMode(value, option.value))}
            className={`flex min-h-16 items-start gap-2 rounded-xl border p-3 text-left transition ${selected ? "border-[#280f91] bg-[#280f91]/5 text-[#280f91] ring-1 ring-[#280f91]/15" : "border-slate-200 bg-white text-slate-700 hover:border-[#280f91]/35"}`}
          >
            <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-[#280f91] bg-[#280f91] text-white" : "border-slate-300 bg-white"}`} aria-hidden="true">
              {selected ? <Check className="h-3 w-3" weight="bold" /> : null}
            </span>
            <span className="min-w-0">
              <strong className="block text-sm leading-5">{option.label}</strong>
              <span className="mt-0.5 block text-xs font-normal leading-4 text-slate-500">{option.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
