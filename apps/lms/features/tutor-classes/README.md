# Quản lý lớp học TUTOR - đặc tả FE cho BE

## 1. Trạng thái triển khai

- UI đã triển khai tại `/lms/tutor/classes` và `/lms/tutor/classes/[classId]`.
- Menu **Công Việc → Quản Lý Lớp Học**. Không có card thống kê tổng quan.
- Đây là bản UI/mock, **chưa gọi API lớp học hoặc ghi điểm danh lên BE**.
- Adapter `data/classes.mock.ts` dùng cùng mã lớp, học viên, buổi học với Quản lý tài liệu.
- Có thêm hai buổi demo riêng để minh họa `ongoing` và `cancelled`. Không suy ra trạng thái bằng giờ máy người dùng; các buổi demo này chưa có trong nguồn tài liệu.
- Điểm danh và lịch sử phiên bản lưu bằng Zustand trong RAM, giữ được khi chuyển route trong phiên app nhưng **mất khi reload/đóng tab**. Không dùng localStorage và không tự gửi admin.
- Các API bên dưới là **đề xuất cần BE triển khai/thống nhất**, không phải endpoint đã được kiểm chứng.

## 2. Flow UI đã có

1. Chọn tab Lớp 1:1 / Lớp nhóm.
2. Tìm theo tên/mã lớp, môn học hoặc tên học viên; lọc trạng thái lớp; sort mới nhất/cũ nhất/trạng thái; phân trang 6 lớp.
3. Card hiển thị tên, mã, trạng thái, môn, cấp độ, học viên/số học viên, số buổi. Lớp đang học có nhắc buổi chưa xác nhận điểm danh.
4. Chọn lớp → chi tiết: bên trái danh sách buổi; bên phải học viên trong lớp và nút Tài liệu của lớp.
5. Lọc buổi theo nội dung/mã, trạng thái buổi và trạng thái điểm danh. Mới nhất trước; phân trang 6 buổi.
6. Điểm danh/Xem điểm danh → modal, mỗi học viên một card có avatar, tên, email. Avatar thiếu/lỗi dùng chữ viết tắt; email null hiển thị “Chưa có email”. Email example.com trong mock chỉ là dữ liệu demo.
7. Gia sư chọn một trạng thái bằng **radio** trên mỗi card và ghi chú, hoặc dùng **Tất cả có mặt**. Radio hỗ trợ bàn phím, nhóm riêng từng người; bulk action đổi trạng thái nhưng không xóa ghi chú. Màn hình chỉ xem không có input chỉnh sửa.
8. **Lưu bản nháp** cho phép chưa điểm danh hết; **Xác nhận điểm danh** yêu cầu đầy đủ trạng thái và lý do cần thiết.
9. Lưu thành công giữ modal mở, cập nhật badge/thông tin buổi/card lớp. Đóng/Escape/X khi còn sửa chưa lưu sẽ hỏi bỏ thay đổi hay tiếp tục.
10. Điểm danh đã xác nhận có thể chỉnh sửa nếu còn quyền; lưu tạo phiên bản mới, không ghi đè audit. Không hạ confirmed về draft.
11. Xem lịch sử lưu trong modal (UI hiển thị 5 phiên bản gần nhất của phiên mock).

## 3. Quy tắc nghiệp vụ

Quy tắc được user xác nhận: **cho điểm danh cả khi buổi đang diễn ra**.

| Trạng thái lớp | Trạng thái buổi       | Xem | Tạo/sửa điểm danh             |
| -------------- | --------------------- | --- | ----------------------------- |
| active         | ongoing               | Có  | Có                            |
| active         | completed             | Có  | Có, kể cả sửa bản đã xác nhận |
| active         | scheduled / cancelled | Có  | Không                         |
| upcoming       | bất kỳ                | Có  | Không                         |
| completed      | bất kỳ                | Có  | Không                         |

Chính sách còn lại đang áp dụng theo đề xuất FE: lớp kết thúc khóa chỉnh sửa, vắng/có phép cần ghi chú khi xác nhận, cho sửa confirmed khi lớp còn active. Cần PO/BE chốt nếu muốn quy tắc khác.

- Điểm danh và trạng thái hoàn thành buổi là hai nghiệp vụ độc lập. Xác nhận điểm danh **không tự hoàn thành buổi**.
- Không tự trừ học phí, hoàn tiền, quyết toán, tạo tài liệu hay gửi thông báo. Nếu có nghiệp vụ liên quan, BE/PO phải cung cấp quy tắc riêng.
- Chỉ gia sư được phân công lớp có quyền xem/sửa. Route FE không phải cơ chế cấp quyền; BE bắt buộc kiểm tra quyền.
- `ongoing`/`completed` do BE trả về, không chỉ dựa trên giờ trình duyệt hay sự kiện mở modal.
- Buổi đã hủy không nhận mutation, kể cả nếu client giữ dữ liệu cũ.
- Lớp 1:1: đúng một học viên trong roster. Lớp nhóm: một entry cho mỗi học viên thuộc roster buổi đó.
- BE dùng **roster snapshot của buổi**, không áp học viên mới vào buổi quá khứ. FE mock hiện dùng roster lớp tĩnh vì chưa có lịch sử enrollment.
- Nếu roster thay đổi khi modal đang mở, reject mutation và yêu cầu tải lại. Không tự drop/thêm entry rồi xác nhận thay gia sư.

### Trạng thái và validation

| Đối tượng                | Enum FE                                  |
| ------------------------ | ---------------------------------------- |
| Loại lớp                 | individual, group                        |
| Trạng thái lớp           | active, upcoming, completed              |
| Trạng thái buổi          | scheduled, ongoing, completed, cancelled |
| Trạng thái mỗi học viên  | unmarked, present, late, absent, excused |
| Trạng thái bản điểm danh | draft, confirmed                         |

- `unmarked`: chưa điểm danh, **không đồng nghĩa vắng**.
- `present`: Có mặt; `late`: Đi muộn; `absent`: Vắng; `excused`: Có phép.
- `note`: string trim đầu/cuối, tối đa 500 ký tự.
- Lưu draft: cho phép unmarked và ghi chú chưa đầy đủ.
- Confirmed: không entry nào unmarked; absent/excused cần note tối thiểu 3 ký tự sau trim.
- Entries phải đúng và đủ roster, không trùng learnerId, không có người ngoài buổi/lớp.
- FE chưa có số phút đi muộn hoặc cột điểm số. Không đặt yêu cầu bắt buộc các field đó ở BE cho UI hiện tại.
- Chưa có các action thêm/xóa học viên, tạo/hủy/chuyển lịch buổi, xóa lớp hoặc reset điểm danh.

## 4. Read models cần BE trả về

Nguồn type tham chiếu: `types/classes.types.ts`; validation: `types/attendance.schemas.ts`.

```ts
type TutorClass = {
  id: string;
  code: string;
  title: string;
  subject: string;
  level: string;
  kind: "individual" | "group";
  status: "active" | "upcoming" | "completed";
  createdAt: string;
  learnerIds: string[];
};
type ClassLearner = {
  id: string;
  fullName: string;
  initials: string;
  gradeLevel: string;
  email: string | null;
  avatarUrl: string | null;
};
type TutorClassSession = {
  id: string;
  classId: string;
  topic: string;
  taughtAt: string;
  durationMinutes: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
};
type SessionAttendance = {
  classId: string;
  sessionId: string;
  state: "draft" | "confirmed";
  version: number;
  updatedAt: string;
  entries: Array<{
    learnerId: string;
    status: "unmarked" | "present" | "late" | "absent" | "excused";
    note: string;
  }>;
};
```

Ngày giờ trả ISO 8601 có offset hoặc UTC; FE hiển thị **Asia/Ho_Chi_Minh**. `durationMinutes` là số nguyên dương.
Mã lớp/học viên/buổi phải thống nhất với Quản lý tài liệu, lịch dạy và chat. Không tạo ID riêng cho mỗi feature.
Nếu BE dùng enum viết hoa/DTO khác, viết adapter tại `services/`, không rải chuyển đổi trong components.
Email và URL avatar chỉ trả cho gia sư có quyền xem roster. Avatar là URL ảnh được phép truy cập, null nếu chưa có; email/avatar không thuộc payload ghi điểm danh và không dùng làm khóa định danh.

## 5. API đề xuất

Prefix `/lms/tutor/classes` tránh giả định read model cũ `/classes/:id` đã chứa toàn bộ dữ liệu quản lý lớp nhóm. BE có thể giữ endpoint khác nhưng phải đảm bảo hợp đồng tương đương.

### 5.1 Danh sách lớp

`GET /lms/tutor/classes?kind=group&search=Toan&status=active&sort=newest&page=1&pageSize=6`

- kind required; status/search optional; sort newest/oldest/status; page bắt đầu 1.
- Search không phân biệt hoa/thường, hỗ trợ bỏ dấu tiếng Việt và tên học viên.
- Sort status: active → upcoming → completed, sau đó createdAt giảm dần; thêm id để ổn định phân trang.
- Filter trước khi phân trang; totalItems/totalPages là tổng sau lọc.

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
          "learnerIds": [
            "learner-minh-anh",
            "learner-thao-my",
            "learner-gia-huy"
          ]
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
        "sessionCount": 3,
        "attendancePendingCount": 2
      }
    ],
    "pagination": { "page": 1, "pageSize": 6, "totalItems": 1, "totalPages": 1 }
  }
}
```

Trong response thực tế learners phải đủ roster cần hiển thị (ví dụ trên rút gọn một learner).
`attendancePendingCount`: ongoing/completed chưa có confirmed, không tính scheduled/cancelled. Không dùng nó để xác định thu nhập.

### 5.2 Chi tiết lớp và buổi

- `GET /lms/tutor/classes/:classId` → `{ classInfo, learners, permissions }`.
- `GET /lms/tutor/classes/:classId/sessions?search=&status=all&attendanceState=all&page=1&pageSize=6` → `{ items, pagination }`.
- Session item: `{ session, attendance: SessionAttendance | null, permissions: { canMarkAttendance, reason: string | null } }`.
- Trạng thái điểm danh filter: all/unmarked/draft/confirmed. unmarked ở cấp buổi là **chưa có bản lưu**; draft chứa entry unmarked vẫn thuộc draft.
- Sắp xếp buổi theo taughtAt giảm dần, id ổn định.
- Class permissions tối thiểu `{ canView, canEditAttendance }`; session permission mới là quyết định cuối cho action.
- `GET /lms/tutor/classes/:classId/sessions/:sessionId/attendance` → `{ attendance: SessionAttendance | null, roster: ClassLearner[], rosterVersion: number, permissions }`.
- Không có bản điểm danh: trả null, FE khởi tạo unmarked cho từng người, không tạo bản ghi server chỉ vì mở modal.

### 5.3 Lưu nháp / xác nhận / sửa

`PUT /lms/tutor/classes/:classId/sessions/:sessionId/attendance`

```json
{
  "expectedVersion": 0,
  "rosterVersion": 1,
  "submitKey": "uuid-moi-cho-moi-lan-luu",
  "state": "confirmed",
  "entries": [
    { "learnerId": "learner-minh-anh", "status": "present", "note": "" },
    {
      "learnerId": "learner-thao-my",
      "status": "late",
      "note": "Vào lớp sau phần khởi động"
    },
    {
      "learnerId": "learner-gia-huy",
      "status": "excused",
      "note": "Có lịch thi ở trường"
    }
  ]
}
```

- classId/sessionId lấy từ route, không tin id do client cung cấp nếu bị mâu thuẫn.
- Bản mới expectedVersion=0; khi cập nhật dùng version đã tải lúc mở/lần lưu thành công gần nhất.
- FE mock hiện chỉ có expectedVersion; adapter transport cần thêm rosterVersion + submitKey khi tích hợp BE.
- Server xác thực, kiểm tra quyền, lifecycle và roster, validation trạng thái/note, expectedVersion; transaction atomically lưu và append audit.
- Tăng version sau mỗi lần lưu thành công. confirmed → confirmed cho phép theo quyền, confirmed → draft bị từ chối.
- submitKey chống double click/retry: cùng key+cùng payload trả lại kết quả cũ, không tăng version lần hai; cùng key+payload khác reject.
- Server đặt updatedAt và updatedBy, không nhận actor/time client làm nguồn sự thật.
- Response `{ success: true, data: SessionAttendance }` (BE có thể bổ sung updatedBy/permissions).
- FE dùng response chuẩn để reset form, cập nhật danh sách buổi/card lớp và version. Không thông báo thành công trước response.
- 409: giữ draft trong modal, báo xung đột; người dùng tải lại dữ liệu mới, không tự retry ghi đè.

### 5.4 Audit

`GET /lms/tutor/classes/:classId/sessions/:sessionId/attendance/revisions?page=1&pageSize=5`

Trả `{ items: [{ version, actorId, actorName, action, createdAt, before, after }], pagination }`.
Audit append-only, cùng transaction lưu điểm danh; giữ trạng thái/note từng học viên để đối soát sửa confirmed.
Chỉ người có quyền xem buổi/lớp được truy cập ghi chú và lịch sử; không công khai cho lớp khác.
FE mock giữ before/after trong `store/attendance.store.ts`, modal hiện chỉ tóm tắt version/state/time; chưa có actor từ BE.

### 5.5 Error envelope và mã lỗi

```json
{
  "success": false,
  "error": {
    "code": "ATTENDANCE_VERSION_CONFLICT",
    "message": "Điểm danh đã được cập nhật. Vui lòng tải lại.",
    "details": { "currentVersion": 3 }
  }
}
```

| HTTP | Code đề xuất                                          | FE xử lý                                                    |
| ---- | ----------------------------------------------------- | ----------------------------------------------------------- |
| 401  | UNAUTHENTICATED                                       | Theo auth flow hiện tại                                     |
| 403  | CLASS_ACCESS_DENIED                                   | Thông báo không có quyền, không render dữ liệu              |
| 404  | CLASS_NOT_FOUND / SESSION_NOT_FOUND                   | Không tìm thấy, quay lại danh sách                          |
| 409  | ATTENDANCE_VERSION_CONFLICT / ROSTER_VERSION_CONFLICT | Giữ nội dung sửa, yêu cầu tải lại, không overwrite          |
| 409  | IDEMPOTENCY_KEY_REUSED                                | Không retry cùng key với payload khác                       |
| 422  | ATTENDANCE_VALIDATION_FAILED                          | Gắn lỗi entries[index].status/note theo learnerId tương ứng |
| 423  | CLASS_ATTENDANCE_LOCKED / SESSION_ATTENDANCE_LOCKED   | Khóa controls, hiển thị reason mới nhất                     |
| 5xx  | SERVICE_UNAVAILABLE                                   | Giữ form, cho thử lại thủ công                              |

Không biến lỗi API thành danh sách rỗng hoặc silently chuyển sang mock.

## 6. Tích hợp FE sau khi BE sẵn sàng

- Thay adapter mock bằng service GET + Zod response schema; TanStack Query theo class/session/user và filters/page.
- Thay Zustand save bằng mutation; disabled controls khi pending, phản hồi lỗi theo code.
- Không gửi tutorId để server tin client; server lấy tutor từ session/token. Scope mọi query theo user đăng nhập.
- Dùng permissions server để khóa controls, vẫn validate server ở mọi mutation.
- Refetch/invalidate list lớp, detail, sessions, attendance, revisions sau mutation; không invalidate thu nhập vì không có side effect được chốt.
- Đồng bộ nguồn class/session với Materials và Schedule. Không đưa transcript Zoom hoặc nội dung tài liệu vào response điểm danh.
- Query audit theo pagination, không tải toàn bộ history vô hạn.
- Chuẩn hóa roster snapshot/enrollment trước khi mở class nhóm cho dữ liệu thật.

## 7. Acceptance checklist cho BE/QA

- [ ] Tutor chỉ thấy lớp được phân công, kể cả truy cập trực tiếp id/room/class khác.
- [ ] Lớp 1:1 và nhóm dùng cùng model; một học viên có nhiều lớp/môn khác nhau.
- [ ] ongoing và completed điểm danh được; scheduled/cancelled/upcoming/completed-class không ghi được.
- [ ] Draft hỗ trợ một phần roster; xác nhận bắt buộc đủ trạng thái và note vắng/có phép.
- [ ] Reject duplicate/missing/foreign learnerId và buổi không thuộc classId.
- [ ] Không giả định học viên chưa điểm danh là vắng.
- [ ] Sửa confirmed giữ audit/version; không hạ confirmed về draft.
- [ ] Hai tab cùng lưu cùng version: một thành công, một 409; không lost update.
- [ ] Double submit cùng submitKey chỉ tạo một phiên bản.
- [ ] Lớp/buổi bị khóa hoặc roster thay đổi sau khi mở modal: server từ chối mutation.
- [ ] Reload đọc lại bản BE, không mất dữ liệu như mock.
- [ ] Điểm danh không tự trừ học phí hoặc hoàn thành buổi.
- [ ] UI mobile, keyboard/Escape, lỗi field, warning bỏ thay đổi và giờ Việt Nam được kiểm tra.

## 8. File tham chiếu

- `components/TutorClassesScreen.tsx`: danh sách lớp và filters.
- `components/ClassDetailScreen.tsx`, `ClassSessionList.tsx`: chi tiết lớp, danh sách buổi.
- `components/AttendanceDialog.tsx`: form điểm danh dạng bảng rộng và warning đóng.
- `components/AttendanceLearnerCard.tsx`: dòng học viên trong bảng với avatar/tên/email, 2 trạng thái (Có mặt / Chưa điểm danh) và ghi chú.
- `hooks/useAttendanceForm.ts`: validate, save/reset, lỗi form/toast.
- `services/attendance.service.ts`: guard lớp/buổi/roster/version của mock.
- `store/attendance.store.ts`: bản lưu và audit trong phiên.
- `types/classes.types.ts`, `attendance.schemas.ts`: domain và validation FE.
