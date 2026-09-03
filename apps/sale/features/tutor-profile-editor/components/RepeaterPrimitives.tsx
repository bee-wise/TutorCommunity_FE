import type { ReactNode } from "react";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

interface RepeaterHeaderProps {
  label: string;
  description?: string;
  addLabel: string;
  onAdd: () => void;
  reviewRequired?: boolean;
  canAdd?: boolean;
}

export function RepeaterHeader({
  label,
  description,
  addLabel,
  onAdd,
  reviewRequired = false,
  canAdd = true,
}: RepeaterHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-[#17142f]">{label}</p>
          {reviewRequired ? (
            <span className="rounded-full bg-[#fff3cb] px-2 py-0.5 text-[11px] font-bold text-[#765000]">
              Cần duyệt lại
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-[#56516a]">{description}</p>
        ) : null}
      </div>
      {canAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-[#280f91]/25 bg-white px-3 text-xs font-bold text-[#280f91] transition hover:bg-[#280f91]/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/25"
        >
          <PlusIcon size={15} weight="bold" aria-hidden="true" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

export function RepeaterItem({
  title,
  canRemove,
  onRemove,
  children,
}: {
  title: string;
  canRemove: boolean;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#dce7f7] bg-[#fbfcff] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold text-[#56516a]">{title}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Xóa ${title.toLowerCase()}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#716c83] transition hover:bg-[#e1aba7]/22 hover:text-[#9f2017] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/25"
        >
          <TrashIcon size={16} aria-hidden="true" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function RepeaterError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-xs font-semibold text-[#9f2017]">
      {message}
    </p>
  ) : null;
}
