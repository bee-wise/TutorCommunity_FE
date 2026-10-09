export function ClassChatReadOnly() {
  return <div role="status" className="shrink-0 border-t border-border bg-card p-4 sm:p-5">
    <p className="text-sm font-bold text-primary">Lớp đã kết thúc. Cuộc trò chuyện ở chế độ chỉ xem.</p>
    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Bạn có thể đọc lại tin nhắn nhưng không thể gửi nội dung mới.</p>
  </div>;
}
