import type { ReactNode } from "react";
import { LockSimpleIcon, PencilSimpleIcon } from "@phosphor-icons/react";

interface EditableProfileBlockProps {
  label: string;
  children: ReactNode;
  onEdit?: () => void;
  systemManaged?: boolean;
}

export function EditableProfileBlock({
  label,
  children,
  onEdit,
  systemManaged = false,
}: EditableProfileBlockProps) {
  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        {systemManaged ? (
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#cfe1fa] bg-white px-3 text-xs font-bold text-[#56516a] shadow-sm">
            <LockSimpleIcon size={14} weight="bold" aria-hidden="true" />
            Dữ liệu hệ thống
          </span>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Chỉnh sửa ${label.toLowerCase()}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#280f91]/20 bg-white text-[#280f91] shadow-md transition hover:-translate-y-0.5 hover:bg-[#280f91] hover:text-white active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/30"
          >
            <PencilSimpleIcon size={18} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
