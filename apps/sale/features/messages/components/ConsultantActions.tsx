"use client";

import { CalendarPlusIcon, InfoIcon, XCircleIcon } from "@phosphor-icons/react";
import type { ChatParticipantRole } from "../types/messages.types";

/** Preview controls; business actions will be wired to the Connection API. */
export function ConsultantActions({ currentRole }: { currentRole: ChatParticipantRole }) {
  if (currentRole !== "CONSULTANT") return null;

  return (
    <div className="flex min-w-max items-center gap-2 text-xs">
      <span className="mr-1 inline-flex items-center gap-1.5 font-bold text-foreground">
        <InfoIcon size={15} aria-hidden="true" />
        Công cụ tư vấn
      </span>
      <button type="button" disabled title="Bản xem trước — chờ kết nối API" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 font-semibold text-muted-foreground disabled:cursor-not-allowed">
        <CalendarPlusIcon size={15} aria-hidden="true" />
        Đề xuất học thử
      </button>
      <button type="button" disabled title="Bản xem trước — chờ kết nối API" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 font-semibold text-muted-foreground disabled:cursor-not-allowed">
        <XCircleIcon size={15} aria-hidden="true" />
        Đóng kết nối
      </button>
      <span className="text-muted-foreground">Bản xem trước</span>
    </div>
  );
}
