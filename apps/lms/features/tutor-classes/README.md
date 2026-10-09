# Quản lý lớp học TUTOR - Đặc tả FE & Hợp đồng tích hợp BE

Tài liệu này đặc tả toàn bộ luồng giao diện người dùng (UI Logic), quy tắc nghiệp vụ, mô hình dữ liệu (Read/Write Models), API Contracts và kế hoạch tích hợp Backend cho tính năng **Quản lý lớp học của Gia sư** (`tutor-classes`) trong phân hệ LMS của **BeeWise**.

**Bố cục workspace theo lớp và contract chat lớp mới:** xem [WORKSPACE.md](./WORKSPACE.md). Tài liệu này tiếp tục là nguồn quy tắc điểm danh và hợp đồng dữ liệu lớp/buổi học. Các API trong hai tài liệu là đề xuất tích hợp, không phải endpoint FE đã gọi.

---

## 1. Trạng thái triển khai & Kiến trúc hiện tại

- **Routes**:
  - `/lms/tutor/classes`: Danh sách lớp học gia sư phụ trách (phân loại Lớp 1:1 và Lớp nhóm).
  - `/lms/tutor/classes/[classId]`: Thông tin tổng quan một lớp, buổi tiếp theo và danh sách học viên rút gọn.
  - `/lms/tutor/classes/[classId]/sessions`: Danh sách buổi học và modal điểm danh.
  - `/lms/tutor/classes/[classId]/members`: Danh sách học viên, tìm kiếm và phân trang.
  - `/lms/tutor/classes/[classId]/messages`: Phòng chat chung của lớp, tách biệt chat kết nối/tư vấn.
  - `/lms/tutor/materials/classes/[classId]`: Tài liệu của lớp, giữ nguyên URL và flow AI/preview.
- **Vị trí Menu**: Menu bên LMS: **Công Việc → Quản Lý Lớp Học**.
- **Trạng thái hiện tại**: UI feature-based, Form Hook (React Hook Form + Zod), mock adapter và bộ test tự động. Điểm danh giữ store phiên minh họa; chat lớp dùng TanStack Query và service mock riêng. Không dùng Zustand để lưu server data khi tích hợp BE.
- **Nguồn dữ liệu Mock**:
  - `data/classes.mock.ts`: Dùng chung định danh lớp học (`MATERIAL_CLASSES`), học viên (`CLASS_LEARNERS`) và buổi học (`CLASS_SESSIONS`) với module Quản lý tài liệu (`tutor-materials`).
  - Có 2 buổi học demo chuyên biệt để minh họa trạng thái: `demo-group-math-live` (`ongoing` - đang diễn ra) và `demo-ma-math-cancelled` (`cancelled` - đã hủy). Không suy đoán trạng thái dựa trên đồng hồ trình duyệt của client.
- **Client State**: Điểm danh và lịch sử phiên bản lưu tạm trong RAM qua Zustand (`useAttendanceStore`), giữ được trạng thái khi chuyển qua lại giữa các route trong phiên app nhưng sẽ **mất khi reload/đóng tab**. Chưa kết nối API bền vững từ BE.

---

## 2. Chi tiết luồng nghiệp vụ UI (UI Logic & User Flow)

### 2.1 Màn hình danh sách lớp học (`TutorClassesScreen`)

1. **Phân loại loại lớp (Class Kind Tabs)**:
   - Chuyển đổi giữa 2 tab: **Lớp 1:1** (`individual`) và **Lớp nhóm** (`group`).
   - Mỗi tab hiển thị badge số lượng lớp tương ứng (dữ liệu mock hiện có: 7 lớp 1:1 và 3 lớp nhóm).
   - Khi chuyển tab, trang tự động reset về trang đầu tiên (`page = 0`).

2. **Bộ lọc và Tìm kiếm (`ClassFilters`)**:
   - **Tìm kiếm**: Input tìm kiếm theo tên lớp, mã lớp, môn học, hoặc tên học viên. Hệ thống tự động chuẩn hóa tiếng Việt không dấu (NFD), loại bỏ dấu phụ và ký tự 'đ'/'Đ', không phân biệt hoa thường.
   - **Lọc trạng thái lớp**: Radix Select chọn `Tất cả trạng thái` (`all`), `Đang học` (`active`), `Sắp khai giảng` (`upcoming`), hoặc `Đã kết thúc` (`completed`).
   - **Sắp xếp**: Radix Select chọn `Mới nhất` (`newest` - theo ngày tạo `createdAt` giảm dần), `Cũ nhất` (`oldest`), hoặc `Trạng thái lớp` (`status`: active → upcoming → completed, sau đó sắp xếp theo `createdAt` giảm dần).
   - **Nút "Đặt lại bộ lọc"**: Hiển thị khi người dùng có thao tác lọc/tìm kiếm khác mặc định, hoặc khi kết quả tìm kiếm rỗng.

3. **Card lớp học (`TutorClassCard`)**:
   - Toàn bộ card là một thẻ liên kết (`Link`) duy nhất dẫn đến `/lms/tutor/classes/[classId]`, tuân thủ chuẩn Anti-Slop (không lồng nút con bên trong thẻ link).
   - **Header card**: Mã lớp (ví dụ: `BW-G201`), Badge trạng thái lớp (`ClassStatusBadge`: secondary xanh lá với chữ tối cho `active`, accent vàng với chữ tối cho `upcoming`, outline cho `completed`).
   - **Tiêu đề & Môn học**: Tên lớp học, Môn học · Cấp độ (ví dụ: `Toán · Lớp 10`).
   - **Khối thông tin học viên**:
     - Stack avatar hiển thị tối đa 3 học viên với chữ cái viết tắt (initials).
     - Với lớp 1:1: Hiển thị tên đầy đủ và cấp lớp của học viên đó.
     - Với lớp nhóm: Hiển thị số lượng học viên (`X học viên trong lớp`) và danh sách tên rút gọn.
   - **Chỉ số phụ**: Tổng số buổi học, Ngày thêm lớp (`dd/MM/yyyy`).
   - **Cảnh báo điểm danh tồn đọng (`attendancePendingCount`)**:
     - Với lớp đang học (`active`), nếu có buổi học đang diễn ra (`ongoing`) hoặc đã hoàn thành (`completed`) mà **chưa có bản ghi điểm danh đã xác nhận (`confirmed`)**, card sẽ hiển thị badge cảnh báo màu vàng: `X buổi chưa xác nhận điểm danh`.
   - **Nút điều hướng giả lập**: Khối styled button outline "Quản lý lớp" kèm icon `ChevronRightIcon`.

4. **Phân trang danh sách lớp (`ClassPagination`)**:
   - Mỗi trang hiển thị 6 lớp học.
   - Nút "Trước" và "Sau", hiển thị chỉ số `Trang X / Y`.
   - Tự động ẩn toàn bộ thanh phân trang nếu tổng số trang `<= 1`.

---

### 2.2 Màn hình chi tiết lớp học (`ClassDetailScreen`)

1. **Shell và điều hướng theo lớp**:
   - Sidebar chung được thay bằng sidebar riêng có Thông tin lớp, Buổi học & điểm danh, Thành viên, Tài liệu và Tin nhắn lớp. Có logo, active state và action **Về danh sách lớp**; trên mobile dùng menu thu gọn.
   - Breadcrumb hiển thị mã lớp và screen hiện tại. Tên/loại/trạng thái lớp định vị ở sidebar; header nội dung chỉ có tiêu đề chức năng và cảnh báo chỉ xem nếu cần, không lặp tên lớp.
   - Sidebar chung: Lịch dạy tổng hợp thuộc **Tổng quan**; Quản lý lớp học và Chat kết nối & tư vấn thuộc **Công việc**. Chat theo lớp không nằm trong chat kết nối.

2. **Thông tin lớp (overview)**:
   - Hiển thị mã lớp, môn/cấp độ, ngày thêm lớp, số học viên và số buổi học có trong dữ liệu.
   - Buổi đang diễn ra hoặc buổi sắp tới được tóm tắt, có action sang danh sách buổi học. Cảnh báo số buổi còn cần xác nhận điểm danh chỉ áp dụng khi được phép điểm danh.
   - Hiển thị tối đa 3 học viên với avatar, tên và email; action sang danh sách thành viên đầy đủ.
   - Không nhồi toàn bộ danh sách buổi học và modal điểm danh vào overview.

3. **Các screen con**:
   - `ClassSessionsScreen`: danh sách buổi học, bộ lọc, phân trang và modal điểm danh tải động.
   - `ClassMembersScreen`: danh sách học viên dạng card, tìm theo tên/email/trình độ, 12 học viên/trang. Không có action sửa thành viên trong bản mock.
   - Tài liệu: tái sử dụng workspace upload, AI và preview đang có. Chat: một phòng chung cho gia sư và toàn bộ học viên theo classId.
   - Lớp `completed`: tin nhắn chỉ xem và ẩn composer; tài liệu/điểm danh chỉ xem, mutation phải bị chặn tại BE. Lớp `upcoming`: chưa cho điểm danh.

4. **Bộ lọc danh sách buổi học (`ClassSessionList`, tại `/sessions`)**:
   - Tìm kiếm buổi học theo chủ đề (`topic`) hoặc mã buổi (`id`).
   - Lọc trạng thái buổi học: Tất cả / Chưa bắt đầu (`scheduled`) / Đang diễn ra (`ongoing`) / Đã hoàn thành (`completed`) / Đã hủy (`cancelled`).
   - Lọc trạng thái điểm danh: Tất cả / Chưa điểm danh (`unmarked`) / Bản nháp (`draft`) / Đã xác nhận (`confirmed`).
   - Sắp xếp mặc định: Buổi mới nhất lên đầu theo ngày giờ dạy `taughtAt` giảm dần.
   - Phân trang: 6 buổi/trang.

5. **Card buổi học (`ClassSessionCard`)**:
   - Hiển thị ngày giờ dạy (`dd/MM/yyyy HH:mm`, múi giờ Việt Nam `Asia/Ho_Chi_Minh`), thời lượng (phút).
   - Buổi đang diễn ra (`ongoing`) được highlight viền và màu nền riêng biệt.
   - Badge trạng thái buổi học (`SessionStatusBadge`) và Badge trạng thái điểm danh (`AttendanceStateBadge`).
   - Hiển thị thời điểm cập nhật điểm danh gần nhất nếu đã có bản ghi lưu.
   - **Quy tắc nút hành động**:
     - Nếu thỏa mãn quyền điểm danh (`canMarkAttendance` = Lớp `active` và Buổi `ongoing` hoặc `completed`):
       - Nếu chưa có bản ghi hoặc đang ở trạng thái `draft`: Nút Primary **"Điểm danh"**.
       - Nếu đã có bản ghi `confirmed`: Nút Primary **"Chỉnh sửa điểm danh"**.
     - Nếu không thỏa mãn quyền điểm danh (Buổi `scheduled`, `cancelled` hoặc Lớp `upcoming`, `completed`): Nút Outline **"Xem điểm danh"** (chỉ mở modal ở chế độ xem).

---

### 2.3 Modal Điểm danh học viên (`AttendanceDialog`)

1. **Header & Trạng thái**:
   - Tiêu đề động: `"Điểm danh buổi học"` (chế độ chỉnh sửa) hoặc `"Xem điểm danh"` (chế độ chỉ xem).
   - Tiêu đề phụ: Mã lớp · Chủ đề buổi học, Ngày giờ học · Thời lượng.
   - Badges: Badge trạng thái buổi học, Badge trạng thái điểm danh hiện tại, Badge cảnh báo màu vàng `"Có thay đổi chưa lưu"` khi form bị dirty.
   - Banner hướng dẫn: Hiển thị giải thích quy tắc khi ở chế độ chỉ xem.

2. **Bulk Action (Thao tác nhanh)**:
   - Nút **"Tất cả có mặt"**: Đánh dấu nhanh tất cả học viên trong buổi thành `Có mặt` (`present`), đồng thời xóa các thông báo lỗi validation nếu có. Chỉ khả dụng khi modal ở chế độ chỉnh sửa và danh sách học viên không rỗng.

3. **Card điểm danh từng học viên (`AttendanceLearnerCard`)**:
   - Bố cục dạng Grid: 2 cột trên màn hình `md` trở lên, 1 cột trên màn hình mobile nhỏ.
   - Thông tin học viên: Avatar (Ảnh hoặc Initials), Họ tên, Email (nếu `null` hiển thị `"Chưa có email"`).
   - **Lựa chọn trạng thái điểm danh**:
     - *Chế độ chỉnh sửa*: Sử dụng 3 Radio button riêng biệt, hỗ trợ bàn phím, hiệu ứng `peer-checked` và `active:scale-[0.98]`:
       1. **Có mặt (`present`)**
       2. **Vắng mặt (`absent`)**
       3. **Chưa điểm danh (`unmarked`)**
     - *Chế độ chỉ xem*: Hiển thị badge trạng thái tĩnh (`Có mặt`, `Vắng`, `Chưa điểm danh`).
   - **Ghi chú học viên**:
     - *Chế độ chỉnh sửa*: Input text với placeholder *"Thêm ghi chú cho học viên…"*, giới hạn tối đa 500 ký tự. Hiển thị thông báo lỗi Zod ngay dưới trường nhập liệu nếu vượt quá ký tự.
     - *Chế độ chỉ xem*: Hiển thị dòng text *"Ghi chú: [Nội dung]"* hoặc *"Ghi chú: Không có"*.

4. **Lịch sử lưu điểm danh (`AttendanceHistory`)**:
   - Dạng accordion collapsible `<details>/<summary>`, hiển thị tối đa 5 phiên bản lưu gần nhất của buổi học trong phiên hiện tại (Phiên bản X: Trạng thái Draft/Confirmed · Thời gian cập nhật).

5. **Cơ chế thoát an toàn (Safe Discard Warning)**:
   - Khi form đang có thay đổi chưa lưu (`formState.isDirty`) và ở chế độ chỉnh sửa: nếu người dùng bấm nút Đóng, nút 'X', hoặc nhấn phím `Escape`, modal sẽ chuyển sang giao diện cảnh báo *"Bạn có thay đổi chưa lưu"*.
   - Người dùng có 2 lựa chọn: **"Bỏ thay đổi & đóng"** (hủy bỏ thay đổi và đóng modal) hoặc **"Tiếp tục điểm danh"** (quay lại form).
   - Khi modal đóng hoàn tất, focus bàn phím tự động được khôi phục về nút kích hoạt ban đầu (`onRestoreFocus`).

6. **Footer & Các nút Lưu**:
   - Nút **"Đóng"**: Đóng modal (kích hoạt kiểm tra discard warning nếu dirty).
   - Nút **"Lưu bản nháp"** (`draft`): Nút Outline. Cho phép lưu khi form dirty. Bị disabled khi đang submit hoặc khi bản ghi hiện tại đã là `confirmed` (ngăn giáng cấp từ confirmed về draft).
   - Nút **"Xác nhận điểm danh" / "Lưu chỉnh sửa điểm danh"** (`confirmed`): Nút Primary. Cho phép lưu điểm danh chính thức. Bị disabled khi đang submit, danh sách học viên rỗng, hoặc form không có thay đổi nào khi đã ở trạng thái `confirmed`.

---

## 3. Ma trận quy tắc nghiệp vụ (Business Rules Matrix)

### 3.1 Quyền thao tác điểm danh theo trạng thái Lớp & Buổi

| Trạng thái lớp (`ClassStatus`) | Trạng thái buổi (`SessionStatus`) | Quyền xem điểm danh | Quyền tạo / sửa điểm danh | Nhãn nút hành động trên Card |
| :----------------------------- | :-------------------------------- | :-----------------: | :-----------------------: | :--------------------------- |
| `active` (Đang học)            | `ongoing` (Đang diễn ra)          | Có                  | **Có**                    | Điểm danh / Chỉnh sửa        |
| `active` (Đang học)            | `completed` (Đã hoàn thành)       | Có                  | **Có**                    | Điểm danh / Chỉnh sửa        |
| `active` (Đang học)            | `scheduled` (Chưa bắt đầu)        | Có                  | Không                     | Xem điểm danh                |
| `active` (Đang học)            | `cancelled` (Đã hủy)              | Có                  | Không                     | Xem điểm danh                |
| `upcoming` (Sắp khai giảng)    | Bất kỳ                            | Có                  | Không                     | Xem điểm danh                |
| `completed` (Đã kết thúc)      | Bất kỳ                            | Có                  | Không                     | Xem điểm danh                |

### 3.2 Các nguyên tắc nghiệp vụ cốt lõi

1. **Điểm danh trong lúc học**: Cho phép gia sư thực hiện điểm danh ngay khi buổi học đang diễn ra (`ongoing`) và sau khi hoàn thành (`completed`).
2. **Tính độc lập của điểm danh**: Việc xác nhận điểm danh (`confirmed`) **không tự động thay đổi trạng thái buổi học sang `completed`**, và không tự động kích hoạt tính lương/trừ tiền học viên. Nếu BE có luồng nghiệp vụ tài chính/hoàn tất buổi, cần cung cấp trigger riêng biệt.
3. **Ý nghĩa của `unmarked`**: Trạng thái `unmarked` có nghĩa là "Chưa điểm danh", **tuyệt đối không đồng nghĩa với vắng mặt (`absent`)**. Cả bản nháp (`draft`) và bản xác nhận (`confirmed`) đều cho phép tồn tại học viên có trạng thái `unmarked`.
4. **Không hạ cấp phiên bản**: Một buổi học đã có điểm danh `confirmed` thì các lần lưu tiếp theo chỉ có thể lưu dưới dạng `confirmed` (tạo version mới). Không cho phép hạ cấp từ `confirmed` về `draft`.
5. **Tính toàn vẹn của Roster**: Payload điểm danh bắt buộc phải chứa đầy đủ tất cả học viên thuộc danh sách lớp/buổi đó, không được thiếu, thừa hay trùng lặp `learnerId`.
6. **Bảo toàn Audit Log**: Mỗi lần lưu điểm danh thành công phải sinh ra một phiên bản mới (`version = expectedVersion + 1`) và ghi nhận vào lịch sử kiểm toán (Audit Trail) kèm người thực hiện và thời gian cập nhật từ server.

---

## 4. Mô hình dữ liệu (Read & Write Models)

Nguồn type chuẩn tại `types/classes.types.ts` và validation schema tại `types/attendance.schemas.ts`.

### 4.1 Enums

```ts
export type ClassKind = "individual" | "group";
export type ClassStatus = "active" | "upcoming" | "completed";
export type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type AttendanceStatus = "unmarked" | "present" | "absent";
export type AttendanceState = "draft" | "confirmed";
```

### 4.2 Read Models

```ts
export interface TutorClass {
  id: string;
  code: string;
  title: string;
  subject: string;
  level: string;
  kind: ClassKind;
  status: ClassStatus;
  createdAt: string; // ISO 8601
  learnerIds: string[];
}

export interface ClassLearner {
  id: string;
  fullName: string;
  initials: string;
  gradeLevel: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface TutorClassSession {
  id: string;
  classId: string;
  topic: string;
  taughtAt: string; // ISO 8601 Asia/Ho_Chi_Minh
  durationMinutes: number;
  status: SessionStatus;
}

export interface AttendanceEntry {
  learnerId: string;
  status: AttendanceStatus;
  note: string; // Tối đa 500 ký tự
}

export interface SessionAttendance {
  classId: string;
  sessionId: string;
  state: AttendanceState;
  version: number;
  entries: AttendanceEntry[];
  updatedAt: string; // ISO 8601
}

export interface TutorClassCardModel {
  classInfo: TutorClass;
  learners: readonly ClassLearner[];
  sessionCount: number;
  attendancePendingCount: number;
}
```

### 4.3 Validation Schema (Zod)

```ts
import { z } from "zod";

export const attendanceEntrySchema = z.object({
  learnerId: z.string().min(1, "Thiếu mã học viên"),
  status: z.enum(["unmarked", "present", "absent"]),
  note: z.string().trim().max(500, "Ghi chú không quá 500 ký tự."),
}).strict();

export const attendanceCommandSchema = z.object({
  classId: z.string().min(1),
  sessionId: z.string().min(1),
  expectedVersion: z.number().int().nonnegative(),
  state: z.enum(["draft", "confirmed"]),
  entries: z.array(attendanceEntrySchema).min(1, "Danh sách điểm danh không được rỗng."),
}).strict().superRefine((data, ctx) => {
  const uniqueLearners = new Set(data.entries.map((e) => e.learnerId));
  if (uniqueLearners.size !== data.entries.length) {
    ctx.addIssue({
      code: "custom",
      path: ["entries"],
      message: "Danh sách học viên bị trùng lặp.",
    });
  }
});
```

---

## 5. Đặc tả API Contracts đề xuất cho Backend

Tất cả các endpoint dưới đây được đề xuất với tiền tố `/lms/tutor/classes` để đồng bộ ngữ cảnh phân hệ Tutor LMS.

### 5.1 Lấy danh sách lớp học của gia sư

- **Endpoint**: `GET /lms/tutor/classes`
- **Query Parameters**:
  - `kind` (*bắt buộc*): `individual` | `group`
  - `status` (*tùy chọn*): `active` | `upcoming` | `completed`
  - `search` (*tùy chọn*): Từ khóa tìm kiếm (hỗ trợ tìm tên lớp, mã lớp, môn, tên học viên không dấu)
  - `sort` (*tùy chọn*, mặc định `newest`): `newest` | `oldest` | `status`
  - `page` (*tùy chọn*, mặc định 1): Số trang (1-indexed)
  - `pageSize` (*tùy chọn*, mặc định 6): Số lượng lớp mỗi trang

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "classInfo": {
          "id": "class-group-math",
          "code": "BW-G201",
          "title": "Toán 10: nền tảng vững vàng",
          "subject": "Toán",
          "level": "Lớp 10",
          "kind": "group",
          "status": "active",
          "createdAt": "2026-08-19T00:00:00+07:00",
          "learnerIds": ["learner-minh-anh", "learner-thao-my", "learner-gia-huy"]
        },
        "learners": [
          {
            "id": "learner-minh-anh",
            "fullName": "Nguyễn Minh Anh",
            "initials": "MA",
            "gradeLevel": "Lớp 10",
            "email": "minh.anh@example.com",
            "avatarUrl": null
          },
          {
            "id": "learner-thao-my",
            "fullName": "Trần Thảo My",
            "initials": "TM",
            "gradeLevel": "Lớp 10",
            "email": "thao.my@example.com",
            "avatarUrl": null
          },
          {
            "id": "learner-gia-huy",
            "fullName": "Phạm Gia Huy",
            "initials": "GH",
            "gradeLevel": "Lớp 10",
            "email": "gia.huy@example.com",
            "avatarUrl": null
          }
        ],
        "sessionCount": 3,
        "attendancePendingCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 6,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 5.2 Lấy chi tiết một lớp học

- **Endpoint**: `GET /lms/tutor/classes/:classId`

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
      "status": "active",
      "createdAt": "2026-08-19T00:00:00+07:00",
      "learnerIds": ["learner-minh-anh", "learner-thao-my", "learner-gia-huy"]
    },
    "learners": [
      {
        "id": "learner-minh-anh",
        "fullName": "Nguyễn Minh Anh",
        "initials": "MA",
        "gradeLevel": "Lớp 10",
        "email": "minh.anh@example.com",
        "avatarUrl": null
      }
    ],
    "permissions": {
      "canView": true,
      "canEditAttendance": true
    }
  }
}
```

---

### 5.3 Lấy danh sách buổi học của lớp

- **Endpoint**: `GET /lms/tutor/classes/:classId/sessions`
- **Query Parameters**:
  - `search` (*tùy chọn*): Từ khóa tìm kiếm chủ đề/mã buổi
  - `status` (*tùy chọn*, mặc định `all`): `all` | `scheduled` | `ongoing` | `completed` | `cancelled`
  - `attendanceState` (*tùy chọn*, mặc định `all`): `all` | `unmarked` | `draft` | `confirmed`
  - `page` (*tùy chọn*, mặc định 1): Số trang (1-indexed)
  - `pageSize` (*tùy chọn*, mặc định 6): Số lượng buổi mỗi trang

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "session": {
          "id": "demo-group-math-live",
          "classId": "class-group-math",
          "topic": "Luyện tập hệ phương trình",
          "taughtAt": "2026-10-06T18:00:00+07:00",
          "durationMinutes": 90,
          "status": "ongoing"
        },
        "attendance": {
          "classId": "class-group-math",
          "sessionId": "demo-group-math-live",
          "state": "draft",
          "version": 1,
          "entries": [
            { "learnerId": "learner-minh-anh", "status": "present", "note": "" },
            { "learnerId": "learner-thao-my", "status": "present", "note": "" },
            { "learnerId": "learner-gia-huy", "status": "unmarked", "note": "" }
          ],
          "updatedAt": "2026-10-06T18:15:00+07:00"
        },
        "permissions": {
          "canMarkAttendance": true,
          "reason": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 6,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

### 5.4 Lấy chi tiết điểm danh của một buổi học

- **Endpoint**: `GET /lms/tutor/classes/:classId/sessions/:sessionId/attendance`

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "attendance": {
      "classId": "class-group-math",
      "sessionId": "demo-group-math-live",
      "state": "draft",
      "version": 1,
      "entries": [
        { "learnerId": "learner-minh-anh", "status": "present", "note": "" },
        { "learnerId": "learner-thao-my", "status": "present", "note": "Tham gia đúng giờ" },
        { "learnerId": "learner-gia-huy", "status": "unmarked", "note": "" }
      ],
      "updatedAt": "2026-10-06T18:15:00+07:00"
    },
    "roster": [
      {
        "id": "learner-minh-anh",
        "fullName": "Nguyễn Minh Anh",
        "initials": "MA",
        "gradeLevel": "Lớp 10",
        "email": "minh.anh@example.com",
        "avatarUrl": null
      }
    ],
    "rosterVersion": 1,
    "permissions": {
      "canMarkAttendance": true,
      "reason": null
    }
  }
}
```

*Ghi chú*: Nếu buổi học chưa từng được điểm danh, trường `attendance` sẽ trả về `null`. FE sẽ tự động khởi tạo danh sách `entries` với `status: "unmarked"` dựa trên `roster` nhận được mà không tạo bản ghi rác trên server.

---

### 5.5 Lưu nháp / Xác nhận / Chỉnh sửa điểm danh

- **Endpoint**: `PUT /lms/tutor/classes/:classId/sessions/:sessionId/attendance`
- **Request Headers**: `Idempotency-Key` (UUID ngẫu nhiên cho mỗi lần bấm lưu để chống trùng lặp request).

**Request Body**:
```json
{
  "expectedVersion": 1,
  "state": "confirmed",
  "entries": [
    { "learnerId": "learner-minh-anh", "status": "present", "note": "" },
    { "learnerId": "learner-thao-my", "status": "present", "note": "Phát biểu tích cực" },
    { "learnerId": "learner-gia-huy", "status": "unmarked", "note": "" }
  ]
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "classId": "class-group-math",
    "sessionId": "demo-group-math-live",
    "state": "confirmed",
    "version": 2,
    "entries": [
      { "learnerId": "learner-minh-anh", "status": "present", "note": "" },
      { "learnerId": "learner-thao-my", "status": "present", "note": "Phát biểu tích cực" },
      { "learnerId": "learner-gia-huy", "status": "unmarked", "note": "" }
    ],
    "updatedAt": "2026-10-06T18:30:00+07:00"
  }
}
```

---

### 5.6 Lấy lịch sử phiên bản điểm danh (Audit Trail)

- **Endpoint**: `GET /lms/tutor/classes/:classId/sessions/:sessionId/attendance/revisions`
- **Query Parameters**: `page=1&pageSize=5`

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "version": 2,
        "actorId": "tutor-123",
        "actorName": "Nguyễn Văn A",
        "state": "confirmed",
        "updatedAt": "2026-10-06T18:30:00+07:00",
        "entriesCount": 3
      },
      {
        "version": 1,
        "actorId": "tutor-123",
        "actorName": "Nguyễn Văn A",
        "state": "draft",
        "updatedAt": "2026-10-06T18:15:00+07:00",
        "entriesCount": 3
      }
    ],
    "pagination": { "page": 1, "pageSize": 5, "totalItems": 2, "totalPages": 1 }
  }
}
```

---

### 5.7 Xử lý mã lỗi API (Error Codes Mapping)

Định dạng phản hồi lỗi chuẩn:
```json
{
  "success": false,
  "error": {
    "code": "ATTENDANCE_VERSION_CONFLICT",
    "message": "Điểm danh đã được cập nhật bởi phiên khác. Vui lòng tải lại dữ liệu.",
    "details": { "currentVersion": 3 }
  }
}
```

| HTTP Status | Error Code | Mô tả & Cách FE xử lý |
| :--- | :--- | :--- |
| **401** | `UNAUTHENTICATED` | Hết phiên đăng nhập. Chuyển hướng về trang đăng nhập. |
| **403** | `CLASS_ACCESS_DENIED` | Gia sư không phụ trách lớp này. Hiển thị thông báo không có quyền truy cập. |
| **404** | `CLASS_NOT_FOUND` / `SESSION_NOT_FOUND` | Không tìm thấy lớp hoặc buổi học. Điều hướng về danh sách lớp. |
| **409** | `ATTENDANCE_VERSION_CONFLICT` | Xung đột phiên bản (`expectedVersion` không khớp). Giữ dữ liệu đang sửa, hiển thị cảnh báo yêu cầu tải lại. |
| **409** | `IDEMPOTENCY_KEY_REUSED` | Request trùng lặp nhưng payload khác với lần gửi trước. Không tự ý retry. |
| **422** | `ATTENDANCE_VALIDATION_FAILED` | Dữ liệu không hợp lệ (ghi chú quá 500 ký tự, trùng/thiếu học viên). Map lỗi vào từng field học viên tương ứng. |
| **423** | `CLASS_ATTENDANCE_LOCKED` / `SESSION_LOCKED` | Buổi học hoặc lớp học đã bị khóa (lớp kết thúc hoặc buổi bị hủy). Vô hiệu hóa controls, hiển thị lý do khóa. |
| **5xx** | `INTERNAL_SERVER_ERROR` | Lỗi máy chủ. Giữ nguyên form dữ liệu và hiển thị toast cho phép người dùng bấm thử lại thủ công. |

---

## 6. Kế hoạch tích hợp Backend (Frontend Integration Roadmap)

Khi Backend sẵn sàng các API trên, các bước tích hợp trên FE gồm:

1. **Tầng Service (`services/classes.api.ts`)**:
   - Sử dụng `apiClient` từ `@workspace/core/apiClient` với `withCredentials: true`.
   - Viết các hàm gọi API tương ứng: `getTutorClasses`, `getTutorClassDetail`, `getClassSessions`, `getSessionAttendance`, `saveSessionAttendance`, `getAttendanceRevisions`.
   - Validate response qua Zod schema trước khi đưa vào React Tree.

2. **Tầng Query & Mutation (`hooks/`)**:
   - Tích hợp **TanStack Query** (`useQuery`, `useMutation`).
   - Khởi tạo centralized query keys: `['tutor-classes', 'list', filters]`, `['tutor-classes', 'detail', classId]`, `['tutor-classes', 'sessions', classId, filters]`, `['tutor-classes', 'attendance', sessionId]`.
   - Sau khi mutation `saveSessionAttendance` thành công: Tự động invalidate các query liên quan (`sessions`, `detail`, `attendance`, `list`) để làm mới badge đếm và trạng thái.

3. **Thay thế Client Store**:
   - Giữ lại Zustand store chỉ để quản lý UI state tạm thời nếu cần thiết (không lưu server state trong Zustand).

---

## 7. Danh mục kiểm thử & Nghiệm thu (Acceptance Criteria for QA/BE)

- [x] **Phân quyền truy cập**: Gia sư chỉ xem và điểm danh được các lớp mình được phân công.
- [x] **Phân loại lớp**: Tab 1:1 và Tab Nhóm lọc đúng số lượng lớp và hiển thị đúng thông tin học viên.
- [x] **Tìm kiếm tiếng Việt**: Tìm được lớp theo tên, mã, môn hoặc tên học viên dù gõ tiếng Việt có dấu hay không dấu.
- [x] **Ma trận điểm danh**: Chỉ cho phép tạo/sửa điểm danh khi lớp `active` và buổi `ongoing` hoặc `completed`. Lớp `upcoming`, `completed` hoặc buổi `scheduled`, `cancelled` chỉ được xem.
- [x] **Toàn vẹn Roster**: Payload điểm danh bắt buộc đủ học viên của lớp, không trùng lặp và không có học viên ngoài lớp.
- [x] **Hỗ trợ `unmarked`**: Cả bản nháp và bản xác nhận đều chấp nhận trạng thái `unmarked` và không tự động coi là vắng mặt.
- [x] **Sửa bản đã xác nhận**: Cho phép sửa điểm danh đã `confirmed` khi lớp còn `active`, tự động tăng version và ghi nhận audit log.
- [x] **Chặn giáng cấp**: Không cho phép chuyển điểm danh từ `confirmed` về `draft`.
- [x] **Xử lý xung đột (Optimistic Concurrency Control)**: Hai tab cùng lưu trên một version cũ sẽ kích hoạt lỗi 409 xung đột phiên bản.
- [x] **Cơ chế Discard Warning**: Đóng modal khi có thay đổi chưa lưu sẽ hiển thị cảnh báo xác nhận.
- [x] **Khôi phục Focus**: Khi đóng modal, focus bàn phím được trả về đúng nút bấm đã mở modal.
- [x] **Định dạng giờ giấc**: Hiển thị chính xác theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`).

---

## 8. Cấu trúc thư mục & File tham chiếu

```
apps/lms/features/tutor-classes/
├── README.md                           # Tài liệu đặc tả FE & hợp đồng BE (File này)
├── __tests__/
│   └── classes.test.cjs                # Bộ kiểm thử tích hợp & UI logic (14 unit tests pass)
├── components/
│   ├── AttendanceDialog.tsx            # Modal điểm danh & xem điểm danh (quản lý dirty, discard warning, restore focus)
│   ├── AttendanceHistory.tsx           # Accordion lịch sử 5 phiên bản điểm danh gần nhất
│   ├── AttendanceLearnerCard.tsx       # Card học viên (radio accessible 2 trạng thái, input note 500 ký tự)
│   ├── ClassBadges.tsx                 # Badge trạng thái lớp, trạng thái buổi và trạng thái điểm danh
│   ├── ClassDetailScreen.tsx           # Màn hình chi tiết lớp (layout 2 cột, sticky sidebar roster, link tài liệu)
│   ├── ClassFilterSelect.tsx           # Dropdown select lọc dữ liệu (Radix UI)
│   ├── ClassFilters.tsx                # Thanh tìm kiếm, phân loại tab 1:1/nhóm, lọc trạng thái và sắp xếp
│   ├── ClassLearnerIdentity.tsx        # Component hiển thị Avatar initials/ảnh, Tên và Email học viên
│   ├── ClassPagination.tsx             # Thanh phân trang (tự ẩn khi <= 1 trang)
│   ├── ClassSessionCard.tsx            # Card buổi học (highlight ongoing, badge trạng thái, action button)
│   ├── ClassSessionList.tsx            # Danh sách buổi học (tìm kiếm, lọc trạng thái/điểm danh, phân trang)
│   ├── ClassesSkeleton.tsx             # Skeleton loading cho danh sách lớp và chi tiết lớp
│   ├── TutorClassCard.tsx              # Card lớp học (single link target, metrics, cảnh báo buổi chưa điểm danh)
│   ├── TutorClassesScreen.tsx          # Màn hình danh sách lớp học của gia sư
│   └── classes-ui.ts                   # Token styles & class utilities dùng chung trong feature
├── data/
│   └── classes.mock.ts                 # Adapter dữ liệu mẫu đồng bộ với module Quản lý tài liệu
├── hooks/
│   ├── useAttendanceForm.ts            # Form hook React Hook Form + Zod resolver, submit draft/confirmed, mark all present
│   ├── useClassSessions.ts             # Hook quản lý tìm kiếm, lọc, sắp xếp và phân trang buổi học
│   ├── useTutorClassDetail.ts          # Hook lấy thông tin chi tiết lớp và danh sách học viên
│   └── useTutorClasses.ts              # Hook quản lý danh sách lớp, filter, search NFD tiếng Việt và phân trang
├── services/
│   └── attendance.service.ts           # Pure mock service kiểm tra guard nghiệp vụ, version và roster
├── store/
│   └── attendance.store.ts             # Zustand store lưu trữ bản ghi điểm danh và revision history trong RAM
├── types/
│   ├── attendance.schemas.ts           # Zod validation schemas cho form và command điểm danh
│   └── classes.types.ts                # TypeScript interfaces và enum labels cho toàn bộ feature
└── utils/
    └── classes.utils.ts                # Helper format ngày giờ Asia/Ho_Chi_Minh, normalize search NFD, card model mapper
```
