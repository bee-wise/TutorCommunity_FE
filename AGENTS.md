<!-- BEGIN:beewise-core-rules -->

# MANDATORY BEEWISE DEVELOPMENT STANDARDS & AGENT WORKFLOW

Tất cả các AI Agent khi làm việc trong repository này **BẮT BUỘC** phải tuân thủ nghiêm ngặt các nguyên tắc sau trong MỌI prompt:

1. **SINGLE SOURCE OF TRUTH**:
   - Mọi quy chuẩn kiến trúc Monorepo, quản lý State, quy trình gọi API 10 bước, phân tách tầng (Dumb Component ➔ Smart Hook ➔ Service) và Definition of Done đều nằm tại: [.agents/workflows/beewise-workflow.md](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/workflows/beewise-workflow.md).
   - Trước khi tạo mới hoặc sửa đổi code, Agent phải đọc và đối chiếu với workflow trên.

2. **CLEAN ARCHITECTURE & SEPARATION OF CONCERNS**:
   - **App Router (`app/`)**: Chỉ để định tuyến và compose page. Tuyệt đối không viết business logic, state phức tạp hay gọi API trực tiếp trong `app/`.
   - **Feature Modules (`features/[name]/`)**: Mọi domain logic thuộc về feature module.
   - **Dumb UI vs Smart Logic**: Tách biệt UI Component (`components/`), Business Hook (`hooks/`), API/Service (`api/` hoặc `services/`). Component không vượt quá 150-200 dòng (tối đa 300).
   - **Zero `any`**: Strict TypeScript, dùng Zod schema để validate form và dữ liệu ngoại vi.

3. **STATE MANAGEMENT & API INTEGRATION**:
   - **Server State**: Bắt buộc dùng TanStack Query (`useQuery`, `useMutation`), centralize query keys, tự động invalidate cache sau mutations. Không lưu server data trong Zustand.
   - **Global UI State**: Chỉ dùng Zustand cho Auth session, global notification queue, theme/settings.
   - **API Client**: Bắt buộc gọi qua `apiClient` từ `@workspace/core/apiClient` với `withCredentials: true`. Cấm gọi trực tiếp `axios` trong components.

4. **TERMINAL REQUIREMENT**:
   - Bắt buộc sử dụng cú pháp **Git Bash (Bash)** cho mọi câu lệnh (`mkdir -p`, `rm -rf`, `cp -r`). Tuyệt đối không sinh lệnh PowerShell.

<!-- END:beewise-core-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# NEXT.JS 16 & REACT 19 RULES

- Mặc định sử dụng **Server Components** (`.tsx` không có `'use client'`).
- Chỉ gắn `'use client'` ở các leaf-node tương tác ngoài cùng (sử dụng hooks, event listeners, animations).

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:beewise-ui-standards -->

# MANDATORY BEEWISE UI & ANTI-SLOP STANDARDS

Khi phát triển hoặc sửa đổi BẤT KỲ giao diện người dùng, button, form, chip, badge, card nào trong BeeWise:

1. **GOLDEN UI BENCHMARK**: Luôn tuân theo tiêu chuẩn thiết kế trực quan tại [.agents/skills/design-taste-frontend/references/beewise-ui-standards.html](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/skills/design-taste-frontend/references/beewise-ui-standards.html).
2. **FORBIDDEN BUTTON / ACTION PATTERNS**:
   - **CẤM HOÀN TOÀN** tạo các button/link hành động dạng text trần có gạch chân (`hover:underline`, `underline`) kèm icon mũi tên thô sơ (ví dụ: `← Đổi email`, `← Quay lại`).
   - Mọi nút bấm/action chips bắt buộc phải là:
     - **Action Chips / Badges**: Đóng gói trong container (`rounded-xl border bg-muted/40 px-3.5 py-2.5`) kèm nút chip/badge tinh tế (`rounded-lg border bg-background px-2.5 py-1 text-xs font-bold hover:bg-muted active:scale-95`).
     - **Standard Button Variants**: Dùng Button chuẩn từ `@workspace/ui` (`variant="default" | "accent" | "secondary" | "outline" | "ghost" | "destructive"`).
     - **Interactive Text Links**: Dùng `transition-colors hover:text-primary/80` (KHÔNG dùng `hover:underline` trừ nội dung chính sách pháp lý).
3. **MANDATORY MICRO-INTERACTIONS**: Mọi nút tương tác phải có `active:scale-[0.98]` hoặc `active:scale-95`, `transition-all`, và hiệu ứng bo góc mượt mà theo đúng triết lý Edutech Soft-Modern của BeeWise.

<!-- END:beewise-ui-standards -->
