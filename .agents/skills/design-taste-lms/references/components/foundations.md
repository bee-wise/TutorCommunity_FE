# Foundations: màu, chữ, bo góc, đổ bóng, icon

Thứ tự ưu tiên: `packages/ui/globals.css` > `.agents/design-system.md` > file này. Preview: `../lms-components.html#color`.

## Màu sắc

Vai trò cố định: **primary** = hành động / đang chọn, **accent** = thưởng / nổi bật (luôn chữ tối), **secondary** = xác thực / thành công. Light theme only.

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `primary` | `#162cd4` | CTA, active, link |
| `accent` | `#ffc500` | Rating, promo, vạch nav active |
| `secondary` | `#32cd32` | Verified, success |
| `highlight` | `#fadc76` | Marker sau chữ tối |
| `warning` | `#905b0f` | Chữ/icon cảnh báo |
| `error` | `#e1aba7` | Viền/nền lỗi nhẹ |
| `destructive` | `#dc2626` | Chữ lỗi, hành động xóa |
| `foreground` | `#0c0c0b` | Chữ chính |
| `muted-foreground` | `#5a6a9a` | Chữ phụ |
| `muted` | `#f0f4ff` | Canvas LMS, fill nhẹ |
| `border` / `input` | `#dce8fb` | Viền, divider |
| `ring` | `#280f91` | Focus ring |

**Nên**
- Class ngữ nghĩa: `bg-primary`, `text-muted-foreground`, `border-border`.
- Tint nhẹ cho icon tile/badge: `bg-accent/20 text-warning`, `bg-secondary/15`.
- Chữ trên nền xanh lá dùng `text-foreground` (secondary không đủ tương phản làm màu chữ).

**Không nên**
- Hex cứng (`#447353`, `#667085`...): thay bằng token khi chạm vào file.
- `bg-primary/5..10` làm nền button, badge, card, input.
- Token `glass`; `sidebar-*` ngoài sidebar của `@workspace/ui`.
- Chữ trắng trên accent; màu là tín hiệu duy nhất cho trạng thái. CTA xanh lá, sao xanh dương.

## Typography

Plus Jakarta Sans do `.lms-workspace` cung cấp; không import font khác. Tiêu đề tiếng Việt tối thiểu `leading-[1.15]`. Số `tabular-nums`, tiền VND dạng `450.000đ`.

| Vai trò | Class |
| --- | --- |
| h1 trang | `text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] text-primary` |
| h2 section | `text-lg font-extrabold` |
| Tiêu đề card (h3) | `text-base font-extrabold` |
| Body | `text-sm font-medium` |
| Meta | `text-xs text-muted-foreground` |
| Nhãn nhóm | `text-[10px] font-extrabold uppercase tracking-[0.12em]` |
| Số lớn | `text-2xl font-extrabold tabular-nums` |

- Heading 700–800, label 500–700, body 400–500. Một h1 mỗi trang.
- h1 luôn màu `primary` (base rule trong `globals.css`): dùng `text-primary` hoặc không gắn class màu; không `text-foreground`/hex. Ngoại lệ duy nhất: h1 trên nền tối/primary dùng `text-primary-foreground`. h2–h6 giữ `foreground`.
- Không đoạn subtitle trang trí dưới h1/h2 (chỉ khi mang hướng dẫn, cảnh báo, ngữ cảnh nghiệp vụ). Không chữ < 10px, gradient text, emoji.

## Bo góc, đổ bóng, chuyển động

| Radius | Dùng cho |
| --- | --- |
| 8px | Tag, tooltip |
| `rounded-lg` 12px | Button, input, nav item (LMS) |
| `rounded-2xl` 16px | List item, alert, menu |
| `rounded-3xl` / `--radius-card` 24px | Card, dialog |
| `--radius-panel` 32px | Hero, panel lớn |
| `rounded-full` | Badge, search |

| Elevation | Dùng cho |
| --- | --- |
| Không bóng | Phần tử nằm trong card |
| `shadow-soft` | Card |
| `shadow-soft-hover` | Card hover |
| `shadow-pop` | Menu, dialog, toast |

- Bề mặt đục: fill + `border-border` + bóng nhẹ.
- Hover card: `-translate-y-1 shadow-soft-hover`. Nhấn: `active:scale-[0.98]`.
- Easing `ease-[var(--ease-soft)]`, 150–300ms, luôn kèm `motion-reduce:`.
- Không `backdrop-blur` trên nội dung, glow, blur bóng > 48px. Không đổi `--radius` toàn cục để có "look LMS".

## Icon

`@heroicons/react/24/outline` mặc định, `20/solid` cho icon nhỏ/đặc. 16–18px trong button, 32–36px trong icon tile. Không mũi tên chéo lên; không tự vẽ SVG icon.

```tsx
import { BookOpenIcon } from "@heroicons/react/24/outline";

<span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
  <BookOpenIcon className="size-5" aria-hidden />
</span>
// accent:    bg-accent/20 text-warning
// success:   bg-secondary/15 text-foreground (icon có thể text-secondary nếu kèm nhãn)
// neutral:   bg-muted text-muted-foreground
```
