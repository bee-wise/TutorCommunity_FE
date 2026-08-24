import {
  EyeSlash,
  MagicWand,
  PencilSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import type {
  LibraryMaterialStatus,
  MaterialSource,
} from "../types";

const STATUS_CONFIG = {
  draft: {
    label: "Bản nháp",
    icon: PencilSimple,
    className: "bg-[#FFC500]/15 text-[#905B0F] border-[#FFC500]/35",
  },
  published: {
    label: "Đã chia sẻ",
    icon: UploadSimple,
    className: "bg-[#447353]/10 text-[#447353] border-[#447353]/20",
  },
  hidden: {
    label: "Đang ẩn",
    icon: EyeSlash,
    className: "bg-muted text-muted-foreground border-border",
  },
} as const;

export function LibraryStatusBadge({ status }: { status: LibraryMaterialStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold ${config.className}`}>
      <Icon size={13} weight="bold" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function MaterialSourceBadge({ source }: { source: MaterialSource }) {
  const isAi = source === "ai";
  const Icon = isAi ? MagicWand : UploadSimple;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isAi ? "bg-[#280F91]/8 text-[#280F91]" : "bg-[#CFE1FA]/55 text-[#280F91]"}`}>
      <Icon size={13} weight="bold" aria-hidden="true" />
      {isAi ? "Tạo bằng AI" : "Tải lên"}
    </span>
  );
}

