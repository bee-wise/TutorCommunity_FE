"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarPlusIcon, InfoIcon, XCircleIcon } from "@phosphor-icons/react";
import { chatRoomsService } from "@workspace/core/services/chat-rooms.service";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@workspace/ui/components/ui/dialog";
import { CLOSE_REASON_LABELS } from "../constants/messages.utils";
import type { ChatParticipantRole, CloseReason } from "../types/messages.types";

export function ConsultantActions({ currentRole, roomId }: { currentRole: ChatParticipantRole; roomId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<CloseReason>("OTHER");
  const [note, setNote] = useState("");
  const closeRoom = useMutation({
    mutationFn: () => chatRoomsService.closeRoom(roomId, reason, note.trim() || undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", "list"] });
      setOpen(false);
    },
  });

  if (currentRole !== "CONSULTANT") return null;

  const handleClose = (event: FormEvent) => {
    event.preventDefault();
    void closeRoom.mutateAsync().catch(() => undefined);
  };

  return (
    <div className="flex min-w-max items-center gap-2 text-xs">
      <span className="mr-1 inline-flex items-center gap-1.5 font-bold text-foreground">
        <InfoIcon size={15} aria-hidden="true" /> Công cụ tư vấn
      </span>
      <button type="button" disabled title="Chưa kết nối API lịch học thử" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 font-semibold text-muted-foreground disabled:cursor-not-allowed">
        <CalendarPlusIcon size={15} aria-hidden="true" /> Đề xuất học thử
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 font-semibold text-foreground hover:border-primary">
            <XCircleIcon size={15} aria-hidden="true" /> Đóng kết nối
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đóng kết nối</DialogTitle>
            <DialogDescription>Phòng chat sẽ chuyển sang chế độ chỉ đọc sau khi đóng.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleClose} className="space-y-4">
            <label className="block text-sm font-semibold text-foreground">
              Lý do
              <select value={reason} onChange={(event) => setReason(event.target.value as CloseReason)} className="mt-1 block w-full rounded-lg border border-input bg-background p-2 text-sm">
                {Object.entries(CLOSE_REASON_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-foreground">
              Ghi chú (tùy chọn)
              <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-1 block w-full rounded-lg border border-input bg-background p-2 text-sm" />
            </label>
            {closeRoom.error && <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(closeRoom.error)}</p>}
            <DialogFooter>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Hủy</button>
              <button type="submit" disabled={closeRoom.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {closeRoom.isPending ? "Đang đóng..." : "Xác nhận đóng"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
