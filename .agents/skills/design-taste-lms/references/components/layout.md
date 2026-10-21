# Layout: Page header, Section header, App shell

Token và quy tắc chung: [foundations.md](foundations.md). Preview: `../lms-components.html#headers`.

## Page header & Section header

- Eyebrow ngắn (ngày, ngữ cảnh) phía trên h1; search + một CTA chính căn phải.
- Section head: h2 + chip "Xem tất cả" với `ArrowRightIcon` (chip: [actions-inputs.md](actions-inputs.md#button)).
- Không đoạn subtitle trang trí dưới h1. Không nhiều CTA primary cạnh nhau.

```tsx
<header className="flex flex-wrap items-end justify-between gap-4">
  <div>
    <p className="text-sm font-semibold text-muted-foreground">{todayLabel}</p>
    <h1 className="mt-1 text-3xl font-extrabold leading-[1.15] text-primary">Lịch dạy</h1>
  </div>
  <div className="flex flex-wrap gap-2">{/* search + one primary Button */}</div>
</header>

<div className="mb-3.5 flex items-center justify-between gap-3">
  <h2 className="text-lg font-extrabold">Lớp học sắp tới</h2>
  {/* chip button / Link styled as chip */}
</div>
```

## App shell (dashboard 1440px)

- Rail trái 256px `bg-card` · main `bg-muted` padding 32px · rail phải 320px `bg-card` (tùy màn), ngăn cách bằng hairline `border-border`, mỗi vùng cuộn độc lập.
- Dưới 1150px (`xl`) ẩn rail phải; dưới 740px (`md`) gộp thành một cột, nav thành thanh ngang trên cùng.
- Rail trái: logo, org selector, nav ([navigation.md](navigation.md)). Main: header, stats + chart, lưới course 3 cột, bảng bài tập. Rail phải: profile, date selector, buổi học sắp tới, todo. Việc cần làm giữ phía trên màn hình đầu tiên.
- Form, bài học, tin nhắn dùng cùng ngôn ngữ nhưng không ép vào lưới dashboard. Chỉ dựng màn hình được yêu cầu.

```tsx
<div className="lms-workspace lms-shell grid grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)_320px]">
  <aside className="min-h-0 overflow-y-auto border-r border-border bg-card px-4 py-7">{/* logo-lms-wide, nav */}</aside>
  <main className="min-h-0 overflow-y-auto bg-muted px-4 py-6 md:p-8">{children}</main>
  <aside className="hidden min-h-0 overflow-y-auto border-l border-border bg-card px-5 py-7 xl:block">{/* rail */}</aside>
</div>
```

## Shared LMS components (`apps/lms/components/`)

Dùng các component này thay vì tự viết lại; không dùng `actionClass` (đã bỏ), dùng `Button`.

| Component | Dùng cho |
| --- | --- |
| `LmsPageHeader` | h1 + eyebrow + actions |
| `LmsSection` | h2 + chip "Xem tất cả" |
| `LmsTabs` / `LmsTabNav` | Tab theo state / tab theo route (link thật) |
| `LmsFilterBar` | Chip lọc (`aria-pressed`) + search/sort ở cuối |
| `LmsStatusBadge` | Badge trạng thái theo `statusTone` |
| `LmsEntityCard` | Card thực thể: icon, tiêu đề, status, meta, tối đa một CTA hoặc cả card là link |
| `LmsDataState` | loading / error + retry / empty / success |
| `LmsResponsiveSheet` | Sheet phải trên desktop, bottom sheet trên mobile |
| `LmsDetailLayout` | Nội dung + cột phụ dính bên phải |
