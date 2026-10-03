Tổ Hợp Chương trình và môn dạy
Ngày: 28/09/2026
Người viết: Vỹ
Người review: Tuyết Hương

Mô tả: Hiện tại BeeWise đang hướng tới hỗ trợ giảng dạy cả về chương trình phổ thông và các chương trình khác như: IELTS, TOEIC, Chứng chỉ,... Nên cần thay đổi logic chọn tổ hợp Tutor Subject Offering với Functional Requirement như sau.
Quản lý Learning Program & Tutor Teaching Offering

1. Mục tiêu
   Cho phép Admin cấu hình các tổ hợp giảng dạy hợp lệ, Tutor có thể đề xuất thêm tổ hợp khác khi tạo hồ sơ (điều này cần duyệt lại khi duyệt hồ sơ, nếu tổ hợp được duyệt sẽ hiển thị công khai)
   Thay thế logic cố định Subject + Level bằng cấu trúc tổng quát hơn:
   Learning Program + Teaching Item + Context/Level

2. Cấu trúc dữ liệu
   LearningProgram
   id
   code
   name
   type: ACADEMIC_SCHOOL | EXAM_PREPARATION | HIGHER_EDUCATION | PROFESSIONAL_CERTIFICATION
   status
   Ví dụ: GDPT Việt Nam, IELTS, TOEIC, Đại học, Luyện thi vào 10.
   ProgramVersion
   id
   programId
   versionName
   effectiveFrom
   status: DRAFT | ACTIVE | ARCHIVED
   publishedAt
   publishedBy
   Một Program có nhiều Version. Version ACTIVE không được sửa trực tiếp.
   TeachingItem
   id
   code
   name
   status
   Ví dụ:
   Tiếng Việt
   Toán
   Computer Science
   IELTS
   TOEIC
   Toán

ProgramContext / Level
id
programVersionId
type: GRADE | LEVEL | MAJOR | EXAM_TRACK | CERT_LEVEL | OTHER
code
name
Ví dụ:
Lớp 5
Lớp 8
Đại học/Cao đẳng
Band 6.5–7.5
null
Chuyên Toán

Context có thể không tồn tại (có thể null) với chương trình không cần Level.
ProgramTeachingMapping
id
programVersionId
teachingItemId
contextId nullable
status
Đây là bảng xác định tổ hợp được phép sử dụng.

3. Logic Admin
   Admin thực hiện:
   Create Program → Create Version → Add Teaching Item Mapping → Add Context Mapping Teaching Item → Publish Version
   Rule:
   Version DRAFT được CRUD.
   Khi Publish, version chuyển ACTIVE.
   Version ACTIVE không được sửa mapping trực tiếp.
   Muốn thay đổi phải tạo/clone version mới.
   Version cũ chuyển ARCHIVED khi version mới active.
   Lưu audit: actor, thời gian, version, mapping added/removed.

4. Logic Tutor
   Khi Tutor tạo Teaching Offering:
   Gia sư chọn Program (Việt Nam, Ngoại Ngữ, Chương trình quốc tế) - Admin config không được đề xuất bởi Gia Sư
   Gia sư chọn Teaching Item dựa trên Program, nếu không tìm thấy Teaching Item, Gia sư có thể đề xuất.
   Gia sư chọn Context/Level theo Teaching Item. Context/Level được config bởi Admin nhưng có thể đề xuất thêm bởi Gia sư.
   Vẫn cho phép tạo thêm tổ hợp:
   ProgramVersion + TeachingItem + Context/Level
   nếu tổ hợp không có sẵn, tổ hợp này sẽ được duyệt trong lúc duyệt hồ sơ trước khi công khai.
   Tutor Offering nên lưu tối thiểu:
   programId
   programVersionId
   contextId nullable
   teachingItemId
   teachingMode
   basePrice

5. Ví dụ
   Program
   Teaching Item
   Context/Level
   Việt Nam
   Tiếng Việt
   Lớp 5
   Việt Nam
   Toán
   Lớp 8
   Việt Nam
   Computer Science
   Đại học/Cao đẳng
   Ngoại ngữ
   IELTS
   Band 6.5–7.5
   Ngoại ngữ
   TOEIC
   null
   Luyện thi vào 10
   Toán
   Chuyên Toán

Ví dụ FLOW:
Gia sư chọn Program (Việt Nam, Ngoại Ngữ, Chương trình quốc tế) - Admin config không được đề xuất bởi Gia Sư
Gia sư chọn Teaching Item dựa trên Program, nếu không tìm thấy Teaching Item, Gia sư có thể đề xuất.
Gia sư chọn Context/Level theo Teaching Item. Context/Level được config bởi Admin nhưng có thể đề xuất thêm bởi Gia sư.
