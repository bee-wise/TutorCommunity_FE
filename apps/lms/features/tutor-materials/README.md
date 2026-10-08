# Quản lý tài liệu lớp học TUTOR - Đặc tả FE & Hợp đồng tích hợp BE

Tài liệu này đặc tả toàn bộ luồng giao diện người dùng (UI Logic), quy tắc nghiệp vụ, mô hình dữ liệu (Read/Write Models), API Contracts và kế hoạch tích hợp Backend cho tính năng **Quản lý tài liệu lớp học của Gia sư & Trợ lý AI soạn tài liệu** (`tutor-materials`) trong phân hệ LMS của **BeeWise**.

---

## 1. Trạng thái triển khai & Kiến trúc hiện tại

- **Routes**:
  - `/lms/tutor/materials`: Thư viện lớp học & tổng quan tài liệu (phân loại Lớp 1:1 và Lớp nhóm).
  - `/lms/tutor/materials/classes/[classId]`: Không gian làm việc tài liệu của lớp (Upload thủ công, danh sách tài liệu, AI wizard modal, sidebar học viên).
  - `/lms/tutor/materials/[lessonId]/preview`: Màn hình xem trước & chỉnh sửa toàn màn hình tài liệu AI (Document Renderer/Editor, Smooth transition, Safe Discard Guard).
  - `/lms/tutor/materials/learner/[learnerId]`: Tuyến đường điều hướng/lọc tài liệu theo học viên cá nhân.
- **Vị trí Menu**: Menu bên LMS: **Công Việc → Quản Lý Tài Liệu**.
- **Trạng thái hiện tại**: Đã hoàn thiện 100% tầng UI Components, Client Persistence (Zustand Persist + IndexedDB), AI Flow Wizard, Fullscreen Preview Transition, Form Validation Zod và bộ kiểm thử tự động (25 unit tests pass).
- **Cơ chế lưu trữ & Mocking**:
  - `data/classroom.mock.ts`: Dữ liệu mẫu đồng bộ mã lớp (`MATERIAL_CLASSES`), học viên (`CLASS_LEARNERS`) và buổi học (`CLASS_SESSIONS`) với module Quản lý lớp học (`tutor-classes`).
  - **Local Storage**: Quản lý metadata tài liệu qua Zustand persist (`beewise-class-materials-v1`), tự động đồng bộ giữa các tab trình duyệt qua sự kiện `storage`.
  - **IndexedDB**: Lưu trữ tệp tài liệu upload thực tế trên trình duyệt qua cơ sở dữ liệu `beewise-material-files` (Object store `files`), hỗ trợ xem và tải lại file cục bộ.
  - **Detached AI Lifecycle**: Mutation tạo tài liệu AI được gắn vào `QueryClient` độc lập (`services/ai-generation.service.ts`), đảm bảo khi người dùng đóng modal hoặc chuyển trang thì tiến trình gọi API AI vẫn tiếp tục chạy ngầm trong tab và cập nhật kết quả khi hoàn tất.

---

## 2. Chi tiết luồng nghiệp vụ UI (UI Logic & User Flow)

### 2.1 Màn hình Thư viện lớp học (`TutorMaterialsScreen` / `MaterialLibraryContent`)

1. **Phân loại loại lớp (Class Kind Tabs)**:
   - Chuyển đổi giữa 2 tab: **Lớp 1:1** (`individual`) và **Lớp nhóm** (`group`).
   - Mỗi tab hiển thị badge đếm số lượng lớp tương ứng (dữ liệu mock: 7 lớp 1:1 và 3 lớp nhóm).
   - Khi chuyển tab, bộ lọc tự động giữ nguyên các tiêu chí tìm kiếm/sắp xếp khác.

2. **Bộ lọc và Tìm kiếm (`MaterialLibraryFilters`)**:
   - **Tìm kiếm**: Input tìm kiếm theo tên lớp, mã lớp, môn học hoặc tên học viên. Hệ thống tự động chuẩn hóa tiếng Việt không dấu (NFD), không phân biệt hoa thường.
   - **Lọc trạng thái lớp**: Radix Select chọn `Tất cả trạng thái` (`all`), `Đang học` (`active`), `Sắp khai giảng` (`upcoming`), hoặc `Đã kết thúc` (`completed`).
   - **Sắp xếp**: Radix Select chọn `Mới nhất` (`newest` - theo ngày tạo `createdAt` giảm dần), `Cũ nhất` (`oldest`), hoặc `Trạng thái lớp` (`status`: active → upcoming → completed).
   - **Nút "Đặt lại bộ lọc"**: Hiển thị khi người dùng thay đổi bộ lọc khác mặc định, hoặc khi kết quả tìm kiếm rỗng.

3. **Card lớp học tài liệu (`MaterialClassCard`)**:
   - Mỗi card là một thẻ `Link` duy nhất dẫn đến `/lms/tutor/materials/classes/[classId]`.
   - **Header card**: Mã lớp, Badge trạng thái lớp (`active` màu xanh lá, `upcoming` vàng nhạt, `completed` xám).
   - **Tiêu đề & Môn học**: Tên lớp học, Môn học · Cấp độ (ví dụ: `Toán 10: nền tảng vững vàng`, `Toán · Lớp 10`).
   - **Khối học viên**:
     - Stack avatar hiển thị tối đa 3 học viên với initials.
     - Lớp 1:1: Hiển thị tên đầy đủ và khối lớp học viên.
     - Lớp nhóm: Hiển thị số lượng học viên (`X học viên trong lớp`) và danh sách tên học viên.
   - **Số liệu tài liệu**: Số buổi học, Số tài liệu đã có trong không gian lớp.
   - **Cảnh báo thiếu tài liệu xuất bản (`missingPublishedCount`)**:
     - Nếu lớp có các buổi học đã hoàn thành (`completed: true`) mà **chưa có bất kỳ tài liệu nào ở trạng thái đã xuất bản (`published`)**, card sẽ hiển thị badge cảnh báo màu vàng: `X buổi chưa có tài liệu đã xuất bản`.
   - **Nút hành động**: Styled button "Không gian tài liệu" kèm icon điều hướng.

4. **Skeleton Loading (`MaterialLibrarySkeleton`)**:
   - Hiển thị khung skeleton mô phỏng đúng bố cục tabs, filters và danh sách cards khi dữ liệu đang hydrate từ bộ nhớ.

---

### 2.2 Không gian tài liệu của lớp (`ClassMaterialsWorkspace`)

1. **Header & Điều hướng**:
   - Nút quay lại: `← Danh sách lớp` dẫn về `/lms/tutor/materials`.
   - Badge loại lớp ("Lớp 1:1" / "Lớp nhóm"), Badge trạng thái lớp, Tên lớp, Mã lớp · Môn học & Cấp độ.
   - **Nút AI Action Button**:
     - Nút gradient cao cấp "Tạo tài liệu AI" (hoặc "Theo dõi AI" khi có job đang chạy nền).
     - Bị vô hiệu hóa nếu lớp đã kết thúc (`completed`) hoặc lớp chưa có buổi học nào đã hoàn thành.

2. **Banner ngữ cảnh trạng thái**:
   - Nếu lớp `completed`: Hiển thị banner *"Lớp đã kết thúc. Không gian tài liệu ở chế độ chỉ xem."* (Khóa toàn bộ tính năng upload, tạo AI, đổi tên, đổi trạng thái tài liệu).
   - Nếu có AI Job đang chạy nền: Hiển thị thông báo trạng thái *"BeeWise AI đang tạo tài liệu trong nền. Không đóng hoặc tải lại tab."* kèm nút "Mở cửa sổ AI".

3. **Bố cục 2 cột (Desktop) / 1 cột (Mobile)**:
   - **Cột chính (Trái)**:
     1. **Khu vực Upload tài liệu thủ công (`ClassUploadSpace`)**:
        - Vùng kéo thả file (Drag & Drop Zone) với viền nét đứt tương tác. Hỗ trợ các định dạng: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx` (giới hạn dung lượng tối đa 20 MB/tệp).
        - Kiểm tra tính hợp lệ của tệp: Từ chối tệp rỗng (0 byte), tệp sai định dạng hoặc vượt quá 20 MB.
        - Form tải lên: Tự động điền tên tệp vào ô "Tên tài liệu", chọn buổi học gắn kèm (dropdown chọn từ danh sách buổi học của lớp), lựa chọn lưu dưới dạng **"Lưu bản nháp"** hoặc **"Xuất bản cho cả lớp"**.
        - Tệp upload được lưu an toàn vào IndexedDB (`beewise-material-files`) và tạo bản ghi metadata trong store.
     2. **Danh sách tài liệu của lớp (`ClassMaterialRow`)**:
        - Bộ lọc nội bộ: Lọc theo **Nguồn tài liệu** (`all`, `ai` - Tạo bằng AI, `upload` - Upload thủ công); **Trạng thái tài liệu** (`all`, `draft` - Bản nháp, `published` - Đã xuất bản, `hidden` - Đang ẩn); **Buổi học** (chọn buổi học cụ thể).
        - Cảnh báo tồn đọng: Hiển thị danh sách các buổi học đã hoàn thành nhưng chưa có tài liệu xuất bản.
        - Mỗi card tài liệu hiển thị:
          - Nguồn tài liệu: Icon BeeWise AI hoặc nhãn "Upload thủ công".
          - Badge trạng thái tài liệu: `Bản nháp`, `Đã xuất bản`, `Đang ẩn`.
          - Tiêu đề tài liệu, định dạng file (`PDF`, `DOCX`, `PPTX`, `BEEWISE`), dung lượng (nếu có), thời gian cập nhật gần nhất.
          - Nút bấm nhanh trên desktop: "Preview & chỉnh sửa" (đối với tài liệu tạo bằng AI).
          - Menu thao tác (Dropdown 3 chấm):
            - **Preview & chỉnh sửa**: Mở màn hình xem trước toàn màn hình.
            - **Mở tài liệu (PDF) / Tải tài liệu**: Mở hoặc tải file trực tiếp từ IndexedDB.
            - **Đổi tên**: Form inline chỉnh sửa tên tài liệu trực tiếp.
            - **Xuất bản / Ẩn tài liệu**: Chuyển đổi qua lại giữa trạng thái `published` và `hidden`.
            - **Lưu nháp**: Đưa tài liệu về trạng thái `draft`.
   - **Cột phụ (Phải)**:
     - **Danh sách học viên trong lớp (`ClassLearnersPanel`)**: Hiển thị toàn bộ học viên trong lớp với Avatar, Họ tên, Email và Khối lớp.

---

### 2.3 Quy trình Tạo tài liệu bằng BeeWise AI (`ClassAIFlowModal`)

Modal Wizard 3 bước hỗ trợ gia sư tạo tài liệu tự động từ bản ghi buổi học:

```
[ Bước 1: Chọn buổi học ] ──▶ [ Bước 2: Review transcript & Cấu hình ] ──▶ [ Đang tạo AI ] ──▶ [ Bước 3: Xem kết quả & Xuất bản ]
```

1. **Bước 1 - Chọn buổi học**:
   - Danh sách các buổi học đã hoàn thành (`completed: true`) của lớp.
   - Mỗi card buổi học hiển thị: Tên chủ đề, Ngày giờ học, Thời lượng, và trạng thái có sẵn bản ghi Zoom minh họa hay cần dán nội dung.
   - Nút "Review nội dung" kích hoạt chuyển sang Bước 2.

2. **Bước 2 - Kiểm tra nội dung & Cấu hình AI**:
   - Textarea chỉnh sửa/dán nội dung bản ghi Zoom (`transcript`), hiển thị bộ đếm ký tự tiếng Việt thời gian thực.
   - Dropdown chọn số lượng câu hỏi trắc nghiệm: `3 câu`, `4 câu`, `6 câu`, `10 câu`.
   - Nút "Chọn lại buổi học" (quay về Bước 1) và nút "Tạo tài liệu AI".

3. **Tiến trình tạo tài liệu (`GeneratingState`)**:
   - Hiển thị animation tiến trình tạo tài liệu, thời gian đã trôi qua kể từ lúc bắt đầu (`startedAt`).
   - Nếu người dùng bấm đóng modal trong lúc AI đang chạy: Hiển thị popup cảnh báo (`AIBackgroundWarning`). Nếu người dùng xác nhận đóng, AI vẫn tiếp tục xử lý ngầm và hiển thị trạng thái trên banner không gian lớp.

4. **Bước 3 - Kết quả sẵn sàng (`AIReadyState`)**:
   - Hiển thị thông tin tài liệu AI vừa tạo: Tiêu đề, Số khái niệm trọng tâm, Số câu hỏi trắc nghiệm & bài tập tự luận.
   - Nút "Xem & Chỉnh sửa chi tiết" (mở màn hình Preview toàn màn hình với tham số `returnToAI=true`).
   - Nút "Xuất bản cho cả lớp" (chuyển trạng thái tài liệu thành `published`).
   - Nút "Tạo lại tài liệu" (khởi động lại wizard từ Bước 1).

---

### 2.4 Màn hình Xem trước & Chỉnh sửa tài liệu toàn màn hình (`MaterialPreviewScreen`)

1. **Fullscreen Shell (`MaterialPreviewShell`)**:
   - Giao diện tràn viền chuyên dụng, ẩn toàn bộ navigation bar và sidebar của LMS để tối ưu hóa không gian đọc và chỉnh sửa tài liệu.
   - Header hiển thị Logo BeeWise, nút "Quay lại" (`← Quay lại`), nhãn trạng thái tài liệu và các nút hành động chính ("Chỉnh sửa nội dung", "Xuất bản cho cả lớp").

2. **Hiệu ứng chuyển cảnh mượt mà (`usePreviewTransition`)**:
   - Cơ chế render 2 frames qua `requestAnimationFrame` đảm bảo nội dung được paint trước khi kích hoạt chuyển động slide-in.
   - Khi bấm quay lại, màn hình trượt ra ngoài êm ái trước khi gọi `router.replace`.
   - Tự động tắt animation nếu trình duyệt bật chế độ giảm chuyển động (`prefers-reduced-motion`).
   - Hỗ trợ tham số `returnToAI=true`: Khi gia sư bấm quay lại từ màn hình preview sau khi tạo AI, hệ thống tự động mở lại modal AI ở Bước 3.

3. **Chế độ xem tài liệu (`DocumentRenderer`)**:
   - **Phần 1: Tóm tắt lý thuyết (`TheorySummary`)**:
     - Tiêu đề tài liệu và Đoạn giới thiệu tổng quan (`overview`).
     - Danh sách Kiến thức cần có (`prerequisites`).
     - Danh sách Khái niệm trọng tâm (`key_concepts`): Tên khái niệm, Lời giải thích chi tiết, Khối công thức toán học/khoa học dạng LaTeX kèm chú thích.
   - **Phần 2: Bộ câu hỏi củng cố (`QuizData`)**:
     - Danh sách Câu hỏi trắc nghiệm (`multiple_choice`): Nội dung câu hỏi, độ khó (`easy`/`medium`/`hard`), các phương án lựa chọn A/B/C/D, đáp án đúng được highlight nổi bật kèm lời giải thích chi tiết.
     - Danh sách Bài tập tự luận (`exercises`): Đề bài, độ khó, các bước giải chi tiết từng bước (`solution_steps`), và đáp án cuối cùng (`final_answer`).

4. **Chế độ chỉnh sửa tài liệu (`DocumentEditor`)**:
   - **Chỉnh sửa Lý thuyết (`SummaryEditorFields`)**:
     - Form chỉnh sửa Tiêu đề, Tổng quan, Kiến thức cần có (thêm/xóa/sửa tags).
     - Quản lý danh sách Khái niệm trọng tâm: Thêm khái niệm mới, xóa khái niệm, chỉnh sửa giải thích, thêm/xóa công thức LaTeX và mô tả công thức.
   - **Chỉnh sửa Bài tập (`QuizEditorFields`)**:
     - Quản lý câu hỏi trắc nghiệm: Chỉnh sửa nội dung, độ khó, thêm/xóa lựa chọn, chọn radio đáp án đúng, chỉnh sửa giải thích đáp án.
     - Quản lý bài tập tự luận: Chỉnh sửa đề bài, độ khó, thêm/xóa/sắp xếp các bước giải từng bước, chỉnh sửa kết quả cuối cùng.
   - **Bảo vệ dữ liệu khi đang chỉnh sửa**:
     - Tự động bắt sự kiện `beforeunload` để ngăn người dùng vô tình reload hoặc đóng tab khi đang sửa dở.
     - Hộp thoại xác nhận (`MaterialConfirmDialog`): Khi bấm "Hủy" hoặc nút "Quay lại" lúc đang chỉnh sửa, hiển thị popup hỏi xác nhận bỏ thay đổi hay tiếp tục chỉnh sửa.
     - Kiểm tra phiên bản chống ghi đè (`Optimistic Concurrency Control`): Báo cảnh báo nếu tài liệu bị cập nhật từ tab khác trong quá trình mở form.

---

## 3. Ma trận quy tắc nghiệp vụ (Business Rules Matrix)

### 3.1 Quyền hạn theo trạng thái lớp học

| Trạng thái lớp (`ClassStatus`) | Xem tài liệu | Upload tài liệu | Tạo tài liệu AI | Đổi tên / Trạng thái | Chỉnh sửa nội dung AI |
| :----------------------------- | :----------: | :-------------: | :-------------: | :------------------: | :-------------------: |
| `active` (Đang học)            | Có           | **Có**          | **Có**          | **Có**               | **Có**                |
| `upcoming` (Sắp khai giảng)    | Có           | **Có**          | **Có**          | **Có**               | **Có**                |
| `completed` (Đã kết thúc)      | Có           | *Khóa*          | *Khóa*          | *Khóa*               | *Khóa* (Chỉ xem)      |

### 3.2 Vòng đời trạng thái tài liệu (`LibraryMaterialStatus`)

```
               ┌───────────────┐
               │  Bản nháp     │ (draft)
               └───────┬───────┘
                       │ Xuất bản
                       ▼
               ┌───────────────┐
       Ẩn      │ Đã xuất bản   │ (published)
   ┌───────────┤               │
   │           └───────┬───────┘
   ▼                   ▲
┌──────────────┐       │ Xuất bản lại
│   Đang ẩn    │───────┘
│   (hidden)   │
└──────────────┘
```

1. **`draft` (Bản nháp)**: Tài liệu vừa upload hoặc vừa tạo bằng AI. Chỉ gia sư nhìn thấy, học viên trong lớp chưa xem được.
2. **`published` (Đã xuất bản)**: Tài liệu đã được gia sư kiểm duyệt và chia sẻ chung cho toàn bộ học viên thuộc lớp.
3. **`hidden` (Đang ẩn)**: Tài liệu tạm thời bị ẩn khỏi danh sách của học viên nhưng vẫn lưu giữ trong không gian của gia sư.

### 3.3 Điều kiện kích hoạt tạo tài liệu AI

- Lớp học phải ở trạng thái chưa kết thúc (`active` hoặc `upcoming`).
- Buổi học được chọn bắt buộc phải là buổi **đã hoàn thành** (`completed: true`).
- Nội dung bản ghi (`transcript`) không được để trống (tối thiểu 1 ký tự có nghĩa sau khi trim).
- Không cho phép khởi chạy đồng thời 2 tiến trình tạo AI trên cùng một lớp học (`job.status === "running"`).

---

## 4. Mô hình dữ liệu (Data & Read Models)

### 4.1 TypeScript Types

```ts
export type ClassKind = "individual" | "group";
export type ClassStatus = "active" | "upcoming" | "completed";
export type MaterialSource = "ai" | "upload";
export type LibraryMaterialStatus = "draft" | "published" | "hidden";

export interface MaterialClass {
  id: string;
  code: string;
  title: string;
  subject: string;
  level: string;
  kind: ClassKind;
  status: ClassStatus;
  createdAt: string;
  learnerIds: string[];
}

export interface ClassSession {
  id: string;
  classId: string;
  topic: string;
  taughtAt: string;
  durationMinutes: number;
  completed: boolean;
  zoomTranscript?: string;
}

export interface ClassMaterial {
  id: string;
  classId: string;
  sessionId: string;
  title: string;
  source: MaterialSource;
  status: LibraryMaterialStatus;
  fileType: "PDF" | "DOCX" | "PPTX" | "BEEWISE";
  fileSize?: string;
  updatedAt: string; // ISO 8601
  hasLocalFile?: boolean;
  data?: AIAnalyzeResponse;
}

export interface AIJob {
  id: string;
  classId: string;
  sessionId: string;
  startedAt: number;
  status: "running" | "ready" | "error";
  materialId?: string;
  error?: string;
}
```

### 4.2 Cấu trúc Nội dung Tài liệu AI (`AIAnalyzeResponse`)

```ts
export interface Formula {
  latex: string;
  description: string;
}

export interface KeyConcept {
  name: string;
  explanation: string;
  formulas: Formula[];
}

export interface TheorySummary {
  title: string;
  overview: string;
  key_concepts: KeyConcept[];
  prerequisites: string[];
}

export interface QuizOption {
  label: string; // "A", "B", "C", "D"
  content: string;
}

export interface MultipleChoiceQuestion {
  question: string;
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface SolutionStep {
  step_number: number;
  description: string;
}

export interface EssayExercise {
  problem: string;
  solution_steps: SolutionStep[];
  final_answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizData {
  multiple_choice: MultipleChoiceQuestion[];
  exercises: EssayExercise[];
}

export interface AIAnalyzeResponse {
  summary: TheorySummary;
  quiz: QuizData;
}
```

### 4.3 Zod Validation Schemas

```ts
import { z } from "zod";

const difficulty = z.enum(["easy", "medium", "hard"]);

export const AIAnalyzeResponseSchema = z.object({
  summary: z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    overview: z.string(),
    prerequisites: z.array(z.string()),
    key_concepts: z.array(z.object({
      name: z.string().min(1),
      explanation: z.string(),
      formulas: z.array(z.object({
        latex: z.string(),
        description: z.string(),
      })),
    })),
  }),
  quiz: z.object({
    multiple_choice: z.array(z.object({
      question: z.string().min(1),
      options: z.array(z.object({
        label: z.string(),
        content: z.string(),
      })).min(2, "Cần tối thiểu 2 phương án lựa chọn"),
      correct_answer: z.string(),
      explanation: z.string(),
      difficulty,
    }).refine(
      (q) => q.options.some((opt) => opt.label === q.correct_answer),
      "Đáp án đúng phải khớp với một trong các lựa chọn"
    )),
    exercises: z.array(z.object({
      problem: z.string().min(1),
      solution_steps: z.array(z.object({
        step_number: z.number(),
        description: z.string(),
      })),
      final_answer: z.string(),
      difficulty,
    })),
  }),
});
```

---

## 5. Đặc tả API Contracts đề xuất cho Backend

### 5.1 Phân tích & Tạo tài liệu AI từ Transcript

- **Endpoint**: `POST /ai/lesson/analyze`
- **Timeout**: `180000ms` (3 phút)

**Request Body**:
```json
{
  "transcript": "Gia sư: Hôm nay chúng ta học hệ phương trình bậc nhất hai ẩn. Với x + y = 3 và 2x - y = 3...",
  "subject": "Toán",
  "num_questions": 4
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "title": "Hệ phương trình bậc nhất hai ẩn",
      "overview": "Tổng hợp phương pháp giải hệ phương trình bằng phương pháp thế và cộng đại số.",
      "prerequisites": ["Phương trình bậc nhất một ẩn", "Quy tắc chuyển vế"],
      "key_concepts": [
        {
          "name": "Phương pháp cộng đại số",
          "explanation": "Cộng hoặc trừ từng vế hai phương trình để triệt tiêu một ẩn số.",
          "formulas": [
            {
              "latex": "ax + by = c \\\\ a'x + b'y = c'",
              "description": "Dạng tổng quát của hệ phương trình bậc nhất hai ẩn"
            }
          ]
        }
      ]
    },
    "quiz": {
      "multiple_choice": [
        {
          "question": "Nghiệm của hệ phương trình x + y = 3 và 2x - y = 3 là gì?",
          "options": [
            { "label": "A", "content": "(2; 1)" },
            { "label": "B", "content": "(1; 2)" },
            { "label": "C", "content": "(3; 0)" },
            { "label": "D", "content": "(0; 3)" }
          ],
          "correct_answer": "A",
          "explanation": "Cộng hai vế ta được 3x = 6 => x = 2, thay vào phương trình đầu ta được y = 1.",
          "difficulty": "easy"
        }
      ],
      "exercises": [
        {
          "problem": "Giải hệ phương trình sau bằng phương pháp thế: 3x - y = 5 và 2x + 3y = 7.",
          "solution_steps": [
            { "step_number": 1, "description": "Từ phương trình (1) rút ra: y = 3x - 5." },
            { "step_number": 2, "description": "Thế y vào phương trình (2): 2x + 3(3x - 5) = 7 <=> 11x = 22 => x = 2." },
            { "step_number": 3, "description": "Tính y = 3(2) - 5 = 1." }
          ],
          "final_answer": "Hệ có nghiệm duy nhất (x; y) = (2; 1).",
          "difficulty": "medium"
        }
      ]
    }
  }
}
```

---

### 5.2 Lấy danh sách tài liệu của lớp

- **Endpoint**: `GET /lms/tutor/materials/classes/:classId`
- **Query Parameters**: `source=all&status=all&sessionId=all`

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "classInfo": {
      "id": "class-group-math",
      "code": "BW-G201",
      "title": "Toán 10: nền tảng vững vàng",
      "subject": "Toán",
      "level": "Lớp 10",
      "kind": "group",
      "status": "active"
    },
    "materials": [
      {
        "id": "mat-101",
        "classId": "class-group-math",
        "sessionId": "session-group-math-01",
        "title": "Tóm tắt & Bài tập Hệ phương trình",
        "source": "ai",
        "status": "published",
        "fileType": "BEEWISE",
        "updatedAt": "2026-08-21T19:30:00+07:00"
      }
    ],
    "missingPublishedSessions": []
  }
}
```

---

### 5.3 Upload tài liệu tệp lên đám mây

- **Endpoint**: `POST /lms/tutor/materials/classes/:classId/upload`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: File nhị phân (PDF, DOCX, PPTX, tối đa 20 MB)
  - `sessionId`: Mã buổi học gắn kèm
  - `title`: Tên tài liệu
  - `status`: `draft` | `published`

**Response 201 Created**:
```json
{
  "success": true,
  "data": {
    "id": "mat-upload-202",
    "classId": "class-group-math",
    "sessionId": "session-group-math-01",
    "title": "De-cuong-on-tap-he-phuong-trinh.pdf",
    "source": "upload",
    "status": "published",
    "fileType": "PDF",
    "fileSize": "3.45 MB",
    "fileUrl": "https://storage.beewise.edu.vn/materials/de-cuong.pdf",
    "updatedAt": "2026-08-22T08:00:00+07:00"
  }
}
```

---

### 5.4 Cập nhật nội dung & trạng thái tài liệu

- **Endpoint**: `PUT /lms/tutor/materials/:materialId`

**Request Body**:
```json
{
  "title": "Hệ phương trình bậc nhất hai ẩn (Đã chỉnh sửa)",
  "status": "published",
  "data": {
    "summary": { "...": "..." },
    "quiz": { "...": "..." }
  }
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": "mat-101",
    "title": "Hệ phương trình bậc nhất hai ẩn (Đã chỉnh sửa)",
    "status": "published",
    "updatedAt": "2026-08-22T09:15:00+07:00"
  }
}
```

---

### 5.5 Bảng mã lỗi API (Error Codes Mapping)

| HTTP Status | Error Code | Mô tả & Cách FE xử lý |
| :--- | :--- | :--- |
| **400** | `INVALID_FILE_TYPE` | Tệp tải lên không thuộc định dạng cho phép (PDF, DOCX, PPTX). |
| **400** | `FILE_SIZE_EXCEEDED` | Dung lượng tệp vượt quá 20 MB. Báo lỗi trên vùng upload. |
| **403** | `CLASS_MATERIAL_LOCKED` | Lớp học đã kết thúc (`completed`). Không cho phép thêm/sửa tài liệu. |
| **404** | `MATERIAL_NOT_FOUND` | Tài liệu không tồn tại hoặc đã bị xóa. |
| **409** | `MATERIAL_VERSION_CONFLICT` | Tài liệu đã bị sửa đổi ở phiên khác. Yêu cầu tải lại trang trước khi lưu. |
| **422** | `AI_PAYLOAD_INVALID` | Kết quả phân tích AI không vượt qua schema validation Zod. Báo lỗi và cho phép thử lại. |
| **504** | `AI_SERVICE_TIMEOUT` | Quá thời gian chờ phản hồi AI (3 phút). Cho phép gia sư bấm thử lại. |

---

## 6. Kế hoạch tích hợp Backend (Frontend Integration Roadmap)

1. **Thay thế Local Storage & IndexedDB**:
   - Chuyển đổi các thao tác đọc/ghi sang API Client `@workspace/core/apiClient` với `withCredentials: true`.
   - Lưu trữ tệp upload thật lên S3/Google Cloud Storage thông qua Presigned URL hoặc endpoint backend multipart.

2. **TanStack Query State Architecture**:
   - Centralize Query Keys:
     - `['tutor-materials', 'classes', filters]`
     - `['tutor-materials', 'class-detail', classId]`
     - `['tutor-materials', 'material', materialId]`
   - Mutations:
     - `useUploadMaterialMutation`
     - `useUpdateMaterialMutation`
     - `useAIAnalyzeMutation` (hỗ trợ background polling hoặc SSE nếu BE xử lý bất đồng bộ).

---

## 7. Danh mục nghiệm thu cho QA & Backend (Acceptance Checklist)

- [x] **Phân loại & Tìm kiếm**: Lọc chính xác Lớp 1:1 và Lớp nhóm; tìm kiếm tiếng Việt không dấu NFD hoạt động tốt.
- [x] **Cảnh báo thiếu tài liệu**: Card lớp và workspace hiển thị đúng số buổi đã hoàn thành nhưng chưa có tài liệu `published`.
- [x] **Chế độ chỉ xem cho lớp kết thúc**: Lớp `completed` khóa mọi thao tác upload, tạo AI, đổi tên và lưu bản nháp.
- [x] **Upload tệp**: Kiểm tra đúng định dạng (PDF, DOCX, PPTX), chặn tệp rỗng và tệp > 20 MB.
- [x] **Detached AI Flow**: Đóng modal khi AI đang chạy vẫn duy trì request ngầm và hiển thị banner trạng thái.
- [x] **Bảo vệ dữ liệu khi sửa**: Cảnh báo `beforeunload` khi đang sửa nội dung; hộp thoại xác nhận hủy thay đổi hoạt động chuẩn xác.
- [x] **Transition toàn màn hình**: Mở/đóng màn hình Preview mượt mà 2 frames, tự động quay lại đúng bước AI nếu có `returnToAI`.
- [x] **Validate Schema AI**: Parse đầy đủ cấu trúc Lý thuyết, Công thức LaTeX, Trắc nghiệm và Tự luận qua Zod.

---

## 8. Cấu trúc thư mục & File tham chiếu

```
apps/lms/features/tutor-materials/
├── README.md                           # Tài liệu đặc tả FE & hợp đồng BE (File này)
├── __tests__/                          # 25 Unit tests pass
│   ├── class-materials.test.cjs        # Kiểm thử bộ lọc, quyền lớp completed, upload validation, AI lifecycle
│   ├── material-library.test.cjs       # Kiểm thử danh sách lớp, filter selects, search state, card model
│   ├── preview-navigation.test.cjs     # Kiểm thử fullscreen shell, returnToAI navigation, attention notice
│   └── preview-transition.test.cjs     # Kiểm thử 2-frame requestAnimationFrame, exit transition, reduced motion
├── api/
│   └── analyze.api.ts                  # Gọi API POST /ai/lesson/analyze với timeout 180s và Zod validation
├── components/
│   ├── AIActionButton.tsx              # Nút CTA gradient tạo tài liệu AI
│   ├── AIBackgroundWarning.tsx         # Popup cảnh báo AI đang chạy nền khi đóng modal
│   ├── AIFlowSteps.tsx                 # Thanh chỉ báo 3 bước trong quy trình AI
│   ├── AIJobNavigationGuard.tsx        # Guard theo dõi trạng thái AI job
│   ├── AIReadyState.tsx                # Giao diện Bước 3: Xem tóm tắt kết quả AI và nút hành động
│   ├── ClassAIFlowModal.tsx            # Modal Wizard 3 bước tạo tài liệu AI
│   ├── ClassLearnersPanel.tsx          # Sidebar danh sách học viên trong lớp
│   ├── ClassMaterialRow.tsx            # Dòng tài liệu trong không gian lớp (actions dropdown, inline rename, preview link)
│   ├── ClassMaterialsSkeleton.tsx      # Skeleton loading cho không gian lớp học
│   ├── ClassMaterialsWorkspace.tsx     # Không gian làm việc tài liệu chính của một lớp
│   ├── ClassUploadSpace.tsx            # Khu vực kéo thả upload file thủ công (IndexedDB persistence)
│   ├── DocumentEditor.tsx              # Form chỉnh sửa toàn bộ tài liệu (Lý thuyết & Bài tập)
│   ├── DocumentRenderer.tsx            # Trình hiển thị toàn bộ nội dung tài liệu (LaTeX formulas, Quiz, Exercises)
│   ├── GeneratingState.tsx             # Animation và thời gian tiến trình AI đang tạo
│   ├── MaterialClassCard.tsx           # Card lớp học trong thư viện tài liệu
│   ├── MaterialConfirmDialog.tsx       # Modal xác nhận bỏ các chỉnh sửa chưa lưu
│   ├── MaterialLibraryContent.tsx      # Nội dung danh sách lớp và xử lý bộ lọc
│   ├── MaterialLibraryFilters.tsx      # Thanh công cụ tìm kiếm, tabs phân loại và dropdown sắp xếp
│   ├── MaterialPreviewScreen.tsx       # Màn hình xem trước & chỉnh sửa toàn màn hình
│   ├── MaterialPreviewShell.tsx        # Shell fullscreen loại bỏ chrome LMS và xử lý transition
│   ├── QuizEditorFields.tsx            # Trình chỉnh sửa chi tiết câu hỏi trắc nghiệm & tự luận
│   ├── SummaryEditorFields.tsx         # Trình chỉnh sửa chi tiết lý thuyết, khái niệm và công thức
│   ├── TutorMaterialsScreen.tsx        # Màn hình chính Thư viện tài liệu của Gia sư
│   ├── material-library-ui.ts          # Utility styles dùng cho danh sách lớp
│   └── materials-ui.ts                 # Utility styles & action classes dùng cho không gian tài liệu
├── data/
│   └── classroom.mock.ts               # Dữ liệu mẫu lớp học, học viên, buổi học và transcript Zoom
├── hooks/
│   ├── useAIClassFlow.ts               # Quản lý state 3 bước của wizard tạo tài liệu AI
│   ├── useClassMaterials.ts            # Hook đọc/ghi tài liệu từ Zustand store và lắng nghe storage sync
│   ├── useLocalMaterialFile.ts         # Hook đọc tệp nhị phân từ IndexedDB thành Object URL
│   ├── usePreviewTransition.ts         # Hook điều khiển hiệu ứng vào/ra 2-frame requestAnimationFrame của Preview
│   └── useTutorClassLibrary.ts         # Hook quản lý danh sách lớp, filter, search tiếng Việt NFD
├── services/
│   ├── ai-generation.service.ts        # Quản lý detached mutation qua QueryClient, lưu draft khi xong
│   └── local-files.service.ts          # Thao tác lưu và đọc tệp nhị phân qua IndexedDB (beewise-material-files)
├── store/
│   ├── ai-jobs.store.ts                # Zustand store theo dõi tiến trình chạy ngầm của AI jobs
│   └── class-materials.store.ts        # Zustand store lưu trữ danh sách tài liệu (persist LocalStorage)
├── types/
│   ├── class-materials.types.ts        # Types cho lớp học, buổi học, tài liệu lớp và AI job
│   ├── material-library.types.ts       # Types cho bộ lọc và card danh sách lớp
│   └── material.schemas.ts             # Zod Schemas cho AI Response, Class Material và Local Persistence
├── types.ts                            # Interfaces cho Learner, Session, AI Analyze Request/Response
└── utils/
    ├── class-library.utils.ts          # Helper lọc và sắp xếp danh sách lớp
    ├── material-library.utils.ts       # Helper tính toán số liệu card (số buổi, tài liệu thiếu)
    ├── materials.utils.ts              # Helper format ngày tháng và nhận diện loại file
    └── preview-navigation.utils.ts     # Helper tính toán URL quay lại từ preview (returnToAI)
```
