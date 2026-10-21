# Feedback & overlays: Empty/Loading/Error, Alert, Toast, Dialog, Menu, Tooltip, Accordion

Token và quy tắc chung: [foundations.md](foundations.md). Preview: `../lms-components.html#states`.

## Empty, Loading, Error

Mọi data view có đủ 4 trạng thái: loading, empty, error/retry, success.

- Loading: `Skeleton` cùng hình dạng với nội dung thật, `aria-busy` trên vùng chứa.
- Empty: `EmptyState` (mặc định `bee-meditate`), một CTA nếu có hành động tiếp theo.
- Error: `EmptyState` với `bee-diving` + nút outline "Thử lại".
- Mascot lấy từ `.agents/assets.md`, `alt=""` (trang trí), tối đa một mascot mỗi viewport.

```tsx
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

if (isLoading) return <ClassListSkeleton />;   // Skeleton blocks matching the real rows
if (isError)
  return (
    <EmptyState
      imageSrc="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789966155/10.png" // bee-diving
      imageAlt=""
      title="Không tải được lịch dạy"
      description="Kiểm tra kết nối mạng rồi thử lại."
      action={<Button variant="outline" onClick={() => refetch()}>Thử lại</Button>}
    />
  );
if (!data.length)
  return <EmptyState title="Chưa có buổi học" action={<Button>Tạo lịch dạy</Button>} />; // default: bee-meditate

<Skeleton className="h-3 w-2/3 rounded-md" />
```

## Alert & Toast

- Alert nằm trong luồng trang; toast cho phản hồi tạm thời sau hành động (dùng `bee-toast` của `@workspace/ui`).
- Tiêu đề nói điều đã xảy ra, dòng phụ nói cách xử lý. Lỗi: `role="alert"`; toast: `role="status"`.
- Alert có thể kèm một nút `outline sm` căn phải.
- Không viền trái dày màu (side-stripe). Không dùng toast cho lỗi cần người dùng sửa form.

```tsx
<div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3.5 text-sm">
  <ExclamationTriangleIcon className="mt-0.5 size-5 text-warning" aria-hidden />
  <div>
    <p className="font-extrabold">Còn 2 bài chưa chấm quá 48 giờ</p>
    <p className="mt-0.5 text-muted-foreground">Chấm sớm để giữ điểm uy tín gia sư.</p>
  </div>
</div>
// info:  border-border bg-card, icon text-primary
// error: border-error bg-card, icon text-destructive, role="alert"
```

## Dialog, Sheet, Menu, Tooltip

Lớp phủ dùng `shadow-pop`, nền đục `bg-popover`. Dialog cho xác nhận ngắn; `Sheet` cho chi tiết/biểu mẫu dài (vd. chi tiết buổi học). Overlay tối nhẹ, không blur.

- Nút xác nhận nêu rõ hành động ("Hủy buổi học"), không "OK".
- Menu: item 40px, `rounded-[10px]`, hover `bg-muted text-primary`. Hành động hủy/xóa đặt cuối, sau divider, chữ `text-destructive`.
- Tooltip chỉ bổ sung; icon button vẫn cần `aria-label`.
- Không `backdrop-blur`, không dialog lồng dialog, không `<details><summary>`.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md rounded-3xl border-border bg-popover p-6 shadow-pop">
    <DialogHeader>
      <DialogTitle className="text-lg font-extrabold">Hủy buổi học này?</DialogTitle>
      <DialogDescription>Học viên sẽ nhận thông báo hủy. Không thể hoàn tác.</DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2">
      <Button variant="outline" className="min-h-11" onClick={() => setOpen(false)}>Giữ buổi học</Button>
      <Button variant="destructive" className="min-h-11" onClick={onCancel}>Hủy buổi học</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* DropdownMenuContent */}
<DropdownMenuContent className="w-56 rounded-2xl border-border bg-popover p-2 shadow-pop">...</DropdownMenuContent>
```

## Accordion / Collapsible

`Accordion` / `Collapsible` từ `@workspace/ui`. Trigger `min-h-13 px-4 text-sm font-extrabold`, `ChevronDownIcon` xoay 180° khi mở, panel `text-sm text-muted-foreground`.

```tsx
<AccordionTrigger className="group min-h-13 px-4 text-sm font-extrabold hover:no-underline">
  Buổi 1 · Hàm số bậc nhất
  {/* Chevron: ChevronDownIcon with group-data-[state=open]:rotate-180 */}
</AccordionTrigger>
```
