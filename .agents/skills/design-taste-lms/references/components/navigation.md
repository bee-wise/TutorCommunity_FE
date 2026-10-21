# Navigation: Sidebar nav, Tabs, Breadcrumb, Pagination

Token và quy tắc chung: [foundations.md](foundations.md). Preview: `../lms-components.html#nav`.

## Sidebar nav

Dùng class có sẵn `lms-navigation-item` + `data-active` (định nghĩa trong `apps/lms/features/lms-workspace/styles/lms-workspace.css`). Item active: chữ primary, nền muted, chữ 800, vạch dọc accent 3px bên trái (accent một phía duy nhất được phép). Sidebar thu gọn → chỉ icon, ô 44px (CSS đã xử lý).

- Nhãn nhóm: `text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground`.
- Logo: `logo-lms-wide` khi mở rộng, `logo-lms-square` khi thu gọn (`.agents/assets.md`).

```tsx
<Link
  href={item.href}
  data-active={isActive}
  aria-current={isActive ? "page" : undefined}
  className="lms-navigation-item flex items-center gap-3 text-sm"
>
  <item.icon className="size-5" aria-hidden />
  <span>{item.label}</span>
  {item.count ? (
    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold text-primary-foreground">{item.count}</span>
  ) : null}
</Link>
```

## Tabs (segmented)

- Tab chọn `bg-primary text-primary-foreground`; `role="tablist"` / `role="tab"` + `aria-selected`; mũi tên trái/phải chuyển tab.
- Không tab gạch chân mảnh khó bấm. Quá 5 tab → chuyển sang `Select`.

```tsx
<div role="tablist" aria-label="Chế độ xem lịch" className="inline-flex gap-1 rounded-[14px] border border-border bg-card p-1">
  {VIEWS.map((v) => (
    <button
      key={v.value}
      type="button"
      role="tab"
      aria-selected={view === v.value}
      onClick={() => setView(v.value)}
      className="min-h-9 rounded-[10px] px-3.5 text-[13px] font-bold text-muted-foreground transition-colors hover:text-primary aria-selected:bg-primary aria-selected:text-primary-foreground"
    >{v.label}</button>
  ))}
</div>
```

## Breadcrumb & Pagination

Dùng `Breadcrumb` và `Pagination` từ `@workspace/ui/components/ui/*`.

- Breadcrumb: `text-sm text-muted-foreground`, link `font-semibold hover:text-primary`, trang hiện tại `font-bold text-foreground` + `aria-current="page"`, phân cách `ChevronRightIcon` 14px `aria-hidden`.
- Pagination: ô 40px, `rounded-lg border border-border bg-card font-bold`; trang hiện tại `border-primary bg-primary text-primary-foreground` + `aria-current="page"`; nút trước/sau có `aria-label`, disabled ở biên.
