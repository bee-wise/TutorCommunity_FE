import { LockClosedIcon } from "@heroicons/react/16/solid";

export function ClassChatReadOnly() {
  return (
    <div
      role="status"
      className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/60 px-4 py-3 text-xs text-muted-foreground"
    >
      <LockClosedIcon className="size-4 shrink-0" aria-hidden="true" />
      <p>Bạn có thể xem lại tin nhắn của lớp đã kết thúc.</p>
    </div>
  );
}
