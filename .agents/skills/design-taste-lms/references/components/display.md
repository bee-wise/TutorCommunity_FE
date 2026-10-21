# Display: Badge, Card, Stat, Course, Session, Table, Progress, Avatar, Chart, Date selector

Token và quy tắc chung: [foundations.md](foundations.md). Data view luôn kèm trạng thái loading/empty/error: [feedback-overlays.md](feedback-overlays.md). Preview: `../lms-components.html#badge`.

## Badge & Tag

Badge = trạng thái (pill, có chữ, có dot nếu cần). Tag = phân loại/metadata (bo 8px, trung tính). Ánh xạ trạng thái giữ cố định trên mọi màn hình.

- Không badge chỉ có màu, không chữ. Không biến badge thành nút (dùng chip button). Không badge trang trí không phản ánh dữ liệu.

```tsx
const STATUS_BADGE = {
  done:      "bg-secondary/15 text-foreground",
  pending:   "bg-accent/20 text-warning",
  active:    "border border-primary bg-card text-primary",
  cancelled: "bg-muted text-muted-foreground",
  overdue:   "border border-error bg-error/20 text-destructive",
  planned:   "border border-dashed border-border bg-card text-muted-foreground",
} as const;

<span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", STATUS_BADGE[status])}>
  <span className="size-1.5 rounded-full bg-current" aria-hidden />
  {STATUS_LABEL[status]}
</span>

{/* Tag */}
<span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">Toán 9</span>

{/* Count */}
<span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold text-primary-foreground">3</span>
```

Với dot của `done`, dùng `bg-secondary` thay vì `bg-current`.

## Card (base)

Thiết kế từ một câu hỏi/hành động mà card phục vụ: đối tượng chính mạnh nhất, trạng thái đọc như trạng thái, metadata phụ, tối đa một CTA chính. Cùng loại thực thể giữ cùng thứ bậc. Card tĩnh không hover; card bấm được thì cả card là một link.

```tsx
{/* Static */}
<section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">...</section>

{/* Interactive: the whole card is one link */}
<Link
  href={href}
  className="block rounded-3xl border border-border bg-card p-5 shadow-soft transition-[transform,box-shadow] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-soft-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transform-none"
>...</Link>
```

## Stat card

- Icon trái, số lớn, nhãn ngắn dưới; số `tabular-nums`. Chỉ chỉ số có thật từ API.
- Không bịa % tăng/giảm, sparkline. Tối đa 4 stat một hàng.

```tsx
<div className="flex items-center gap-3.5 rounded-3xl border border-border bg-card p-4 shadow-soft">
  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
    <AcademicCapIcon className="size-5" aria-hidden />
  </span>
  <div>
    <p className="text-2xl font-extrabold leading-none tabular-nums">{value}</p>
    <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
  </div>
</div>
```

## Course card & Join card

- Course card: icon tile → tên khóa (`text-base font-extrabold`) → meta (icon 14px `text-primary` + `text-xs text-muted-foreground`) → tiến độ ở đáy (`mt-auto`, nhãn "Tiến độ" + `18/24` tabular). Cả card là link (xem Card interactive). Tiến độ 100% dùng `bg-secondary`.
- Join card: nền `bg-accent/10`, blob SVG mờ phía sau, input trắng có label + nút accent chữ tối.
- Lưới: 3 cột ≥ lg, 2 cột md, 1 cột mobile.
- Không thêm nút "Xem" riêng khi cả card đã là link. Không mascot trong từng course card.

```tsx
<div className="relative flex min-h-52 flex-col gap-2.5 overflow-hidden rounded-3xl border border-accent/25 bg-accent/10 p-5">
  <svg viewBox="0 0 120 100" aria-hidden className="pointer-events-none absolute -right-8 top-0 w-32 fill-accent/20">
    <path d="M13 34C27 9 70 2 98 19c24 15 24 47 3 62-21 15-52-4-72-7C4 71-1 57 13 34Z" />
  </svg>
  <h3 className="relative text-base font-extrabold">Tham gia lớp mới</h3>
  <form onSubmit={onJoin} className="relative mt-auto flex items-center gap-1 rounded-2xl border border-accent/25 bg-card p-1">
    <label htmlFor="class-code" className="sr-only">Mã lớp học</label>
    <input id="class-code" placeholder="Nhập mã lớp..." className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm outline-none" />
    <button type="submit" aria-label="Tham gia lớp" className="grid size-10 place-items-center rounded-[10px] bg-accent text-accent-foreground active:scale-95">
      <ArrowRightIcon className="size-[18px]" />
    </button>
  </form>
</div>
```

## Session item & List row

- Session item: icon tile (online `VideoCameraIcon` primary, offline `MapPinIcon` accent) → tiêu đề + meta (badge hình thức + địa điểm/số học viên) → giờ căn phải.
- List row trong card: avatar 32px → tên + meta → badge trạng thái + tối đa một nút `outline sm` ở cuối. Divider `border-b border-border`, không bóng cho card chứa list. Trên mobile cho phép wrap, cụm cuối xuống dòng.

```tsx
<li className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
    <VideoCameraIcon className="size-5" aria-hidden />
  </span>
  <div className="min-w-0">
    <p className="truncate text-sm font-extrabold">{session.title}</p>
    <p className="mt-0.5 text-xs text-muted-foreground">{session.location}</p>
  </div>
  <time className="ml-auto text-right text-sm font-extrabold tabular-nums">{start}</time>
</li>
```

## Table

Bọc trong `overflow-x-auto` để không cuộn ngang cả trang. Header `bg-muted`, cột đầu đậm, `th scope="col"`, số căn phải + `tabular-nums`. Trên mobile hẹp, cân nhắc chuyển sang list row.

```tsx
<div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
  <table className="w-full min-w-[560px] border-collapse text-left">
    <thead className="bg-muted text-xs font-extrabold text-muted-foreground">
      <tr><th scope="col" className="px-4 py-3">Bài tập</th>...</tr>
    </thead>
    <tbody className="text-sm font-semibold">
      <tr className="border-t border-border transition-colors hover:bg-muted/60">
        <td className="px-4 py-3.5 font-extrabold">...</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Progress & Avatar

```tsx
<div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Hoàn thành chương trình"
  className="h-1.5 overflow-hidden rounded-full bg-border">
  <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${value}%` }} />
</div>
{/* 100% / completed: bg-secondary */}

import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/ui/avatar";
<Avatar className="size-10 ring-2 ring-card">
  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
  <AvatarFallback className="bg-primary text-sm font-extrabold text-primary-foreground">{initials}</AvatarFallback>
</Avatar>
```

Avatar size: 32px (list), 40px (mặc định), 64px (profile). Stack: `-ml-2.5` giữa các avatar, phần dư `+n` dùng `bg-muted text-muted-foreground`, nhóm có `aria-label` ("4 học viên").

## Bar chart (CSS bars)

- Màu theo vai trò: cột đang chọn/hôm nay `primary`, đạt mục tiêu `secondary`, nổi bật `accent`, còn lại `border`.
- Bo trên 12px, dưới 8px. Tooltip `bg-foreground text-background` khi hover/focus. Mỗi cột focus được bằng phím, có `aria-label` đầy đủ giá trị. Nhãn trục `text-xs text-muted-foreground`, ngày hiện tại `font-extrabold text-foreground`.
- Không dùng màu làm kênh thông tin duy nhất. Không kéo thư viện chart cho biểu đồ ≤ 7 cột.

```tsx
<div role="group" aria-label="Giờ dạy trong tuần" className="flex h-40 items-end justify-around gap-3 border-b border-border">
  {days.map((d) => (
    <button
      key={d.key}
      type="button"
      aria-label={`${d.label}: ${d.durationText}`}
      style={{ height: `${d.percent}%` }}
      className={cn(
        "group relative w-[38px] rounded-t-xl rounded-b-lg transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
        d.isToday ? "bg-primary" : d.metGoal ? "bg-secondary" : "bg-border",
      )}
    >
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1.5 text-[11px] font-extrabold text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {d.durationShort}
      </span>
    </button>
  ))}
</div>
```

## Date selector (mini calendar)

Ngày mặc định muted; ngày chọn `bg-primary text-primary-foreground`, bo 12px, `-translate-y-1`, bóng primary nhẹ, `aria-pressed`. Chấm accent 4px khi ngày có buổi học.

```tsx
<div role="group" aria-label="Chọn ngày" className="flex gap-1.5 overflow-x-auto">
  {week.map((day) => {
    const active = isSameDay(day.date, selected);
    return (
      <button
        key={day.iso}
        type="button"
        aria-pressed={active}
        aria-label={day.fullLabel}
        onClick={() => setSelected(day.date)}
        className={cn(
          "grid min-w-11 justify-items-center gap-1 rounded-lg px-1 py-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
          active && "-translate-y-1 bg-primary text-primary-foreground shadow-[0_7px_14px_color-mix(in_srgb,var(--primary)_22%,transparent)] hover:bg-primary hover:text-primary-foreground",
        )}
      >
        <span className="text-[11px] font-semibold">{day.weekday}</span>
        <span className="text-sm font-extrabold tabular-nums">{day.dd}</span>
        {day.hasSession && <span className="size-1 rounded-full bg-accent" aria-hidden />}
      </button>
    );
  })}
</div>
```
