# Actions & inputs: Button, Field, Search, Checkbox/Radio/Switch

Token và quy tắc chung: [foundations.md](foundations.md). Preview: `../lms-components.html#button`.

## Button

`Button` từ `@workspace/ui/components/ui/button`. Trong `.lms-workspace` button tự có bo 12px, chữ 700, transition 300ms. Mỗi vùng tối đa một CTA chính. Touch target tối thiểu 44px (`min-h-11`).

**Nên**
- `default`: hành động chính. `outline`: phụ. `ghost`: điều hướng/ít quan trọng. `destructive`: xóa/hủy.
- Accent CTA chỉ cho khuyến mãi/thưởng, chữ tối.
- Loading: giữ nhãn động từ + spinner, `disabled` + `aria-busy`.
- Nhiều hành động phụ → gộp vào một menu `EllipsisHorizontalIcon` có `aria-label`.

**Không nên**
- `variant="secondary"` (xanh lá) làm CTA, `variant="link"` cho hành động.
- Link gạch chân có mũi tên kiểu `← Quay lại`; dùng ghost hoặc chip.
- Icon button không có `aria-label`.

```tsx
import { Button } from "@workspace/ui/components/ui/button";
import { VideoCameraIcon, EllipsisHorizontalIcon, ArrowPathIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

<Button className="min-h-11 px-5">
  <VideoCameraIcon className="size-[18px]" aria-hidden />
  Vào lớp
</Button>

<Button variant="outline" className="min-h-11">Xem chi tiết</Button>

<Button variant="outline" size="icon" className="size-11" aria-label="Thêm tùy chọn">
  <EllipsisHorizontalIcon className="size-5" />
</Button>

<Button disabled={isPending} aria-busy={isPending} className="min-h-11">
  {isPending && <ArrowPathIcon className="size-4 animate-spin" aria-hidden />}
  {isPending ? "Đang lưu..." : "Lưu thay đổi"}
</Button>

{/* Accent CTA (promo only) */}
<Button className="min-h-11 bg-accent text-accent-foreground hover:bg-accent/90">Nâng cấp Pro</Button>

{/* Chip action (back, filter reset, "Xem tất cả") */}
<button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold hover:bg-muted active:scale-95">
  <ArrowLeftIcon className="size-3.5" aria-hidden /> Quay lại
</button>
```

## Input, Select, Textarea

`Input`, `Select` từ `@workspace/ui`; `DateTimePicker` cho ngày giờ. Luôn có `<label>` hiển thị. Trong LMS field bo 12px, nền `bg-card` (tự áp bởi `.lms-workspace`). Lỗi đặt dưới field, liên kết bằng `aria-describedby` + `aria-invalid`.

- Placeholder là ví dụ, không thay label. Hint phụ: `text-xs text-muted-foreground`.
- Không chỉ đổi màu viền để báo lỗi (phải có chữ). Không nền `bg-primary/5`.

```tsx
import { Input } from "@workspace/ui/components/ui/input";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

<div className="grid gap-1.5">
  <label htmlFor="parent-email" className="text-sm font-bold">Email phụ huynh</label>
  <Input
    id="parent-email"
    className="min-h-11"
    aria-invalid={!!error}
    aria-describedby={error ? "parent-email-error" : undefined}
  />
  {error && (
    <p id="parent-email-error" className="flex items-center gap-1 text-xs font-semibold text-destructive">
      <ExclamationCircleIcon className="size-3.5" aria-hidden /> {error}
    </p>
  )}
</div>
```

## Search (pill)

```tsx
<label className="flex min-h-11 w-full max-w-xs items-center gap-2.5 rounded-full border border-border bg-card px-4 text-muted-foreground transition-colors focus-within:border-ring">
  <MagnifyingGlassIcon className="size-[18px]" aria-hidden />
  <span className="sr-only">Tìm kiếm lớp học</span>
  <input type="search" placeholder="Tìm lớp, học viên..." className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
</label>
```

## Checkbox, Radio, Switch

Không dùng checkbox native trực tiếp: ẩn input bằng `sr-only`, vẽ hộp `size-5 rounded-md border-2`. Cả hàng là vùng bấm 44px.

```tsx
<label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-semibold">
  <input type="checkbox" className="peer sr-only" checked={done} onChange={toggle} />
  <span className="grid size-5 place-items-center rounded-md border-2 border-border bg-card text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50">
    <CheckIcon className="size-3.5" aria-hidden />   {/* @heroicons/react/20/solid */}
  </span>
  <span className="peer-checked:text-muted-foreground peer-checked:line-through">Chấm bài tuần 3</span>
</label>
```

- Radio: cùng pattern, hộp `rounded-full`, checked = viền primary + chấm `size-2 bg-primary` ở giữa (nền vẫn `bg-card`).
- Switch: `role="switch"`, track `h-[26px] w-11 rounded-full bg-border peer-checked:bg-primary`, thumb `size-5 rounded-full bg-card` dịch 18px khi checked.
- Todo đã xong: chữ `text-muted-foreground line-through`.
