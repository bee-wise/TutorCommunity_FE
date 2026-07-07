# ĐẶC TẢ CẤU TRÚC SIDEBAR ĐIỀU HƯỚNG - NỀN TẢNG BEEWISE (VERSION 2026)

[cite_start]Tài liệu đặc tả cấu trúc thanh điều điều hướng bên (Sidebar) dành cho 4 phân hệ người dùng trong hệ thống BeeWise: **Admin (Quản trị viên)**, **Consultant (Tư vấn viên)**, **Tutor (Gia sư)**, và **Learner (Học viên)**[cite: 153].

---

## 1. Sidebar Phân Hệ Học Viên (Learner)

[cite_start]_Định hướng UI/UX: Tối giản tối đa để hướng người dùng vào mục tiêu cốt lõi: tìm người, tương tác chốt lớp, theo dõi lịch và minh bạch tài chính[cite: 10, 175]._

- [cite_start]**Quản Lý Lịch Học (My Schedule):** Màn hình hiển thị thời gian biểu tổng quan dạng Lịch (Calendar) hoặc Danh sách (List View)[cite: 37]. [cite_start]Cho phép theo dõi các trạng thái buổi học và kích hoạt nút "Tham gia" (Join) trực tuyến trước giờ học 10-15 phút[cite: 40, 41].
- [cite_start]**Kho Tài Liệu (Study Materials):** Nơi lưu trữ tập trung (chế độ Read-only) các tài liệu, bài tập, link video record và nội dung text tóm tắt buổi học (Zoom Summary) do Gia sư tải lên[cite: 53, 62].
- [cite_start]**Phòng Chat Hiện Tại (Active Session):** Giao diện hộp thoại chat thời gian thực nhóm 3 người (Learner - Tutor - Consultant)[cite: 50].
  > [cite_start]_Ràng buộc hệ thống (BR): Tại một thời điểm, một Learner chỉ có duy nhất 1 phòng chat ở trạng thái ACTIVE[cite: 51, 446]._
- [cite_start]**Học Phí & Thanh Toán (Billing & Tuition):** Bảng tổng hợp chi tiết tài chính, số buổi học đã hoàn thành và trạng thái hóa đơn[cite: 73]. [cite_start]Hiển thị mức giá công khai đã bao gồm phí nền tảng (Ví dụ: 220.000 VNĐ/buổi)[cite: 77, 82].
- [cite_start]**Lịch Sử Kết Nối (Chat History):** Phân hệ tra cứu danh sách các gia sư đã từng kết nối và xem lại nội dung tin nhắn của các phòng chat đã đóng (Archived)[cite: 55, 56].

---

## 2. Sidebar Phân Hệ Gia Sư (Tutor)

[cite_start]_Định hướng UI/UX: Thiết kế như một "Công cụ làm việc (Workspace)" cá nhân giúp gia sư quản lý nhiều học viên, kiểm soát lịch dạy và theo dõi doanh thu dòng tiền[cite: 92, 167]._

- [cite_start]**Tổng Quan (Dashboard):** Màn hình trang chủ hiển thị tóm tắt thu nhập trong tháng, số lớp dạy sắp tới trong ngày và các thông báo hệ thống[cite: 168].
- [cite_start]**Lịch Dạy (My Schedule):** Theo dõi toàn bộ lịch trình các buổi dạy đã chốt thông qua Tracking Request, đính kèm link phòng Zoom/Meet để bấm tham gia lớp học[cite: 100, 101].
- [cite_start]**Quản Lý Tin Nhắn (Active Sessions):** Giao diện danh sách (Inbox List) hiển thị các phòng chat 3 bên đang hoạt động[cite: 99].

  > [cite_start]_Đặc trưng hệ thống (BR): Khác với Learner, Gia sư được phép duy trì nhiều phiên chat ACTIVE đồng thời với nhiều Learner khác nhau[cite: 98, 448]._

- [cite_start]**Quản Lý Tài Liệu (Materials Management):** Phân hệ cấp toàn quyền CRUD (Tạo mới, Sửa, Xóa) cho gia sư để upload tài liệu học tập, bài tập, link drive hoặc text tóm tắt tiến độ buổi học cho từng học viên[cite: 102].
- **Thu Nhập & Thanh Toán (Earnings & Payouts):** Bảng dữ liệu (Data Table) thống kê chi tiết các buổi dạy thành công, tổng doanh thu thực nhận.
  > [cite_start]_Lưu ý: Logic hiển thị dựa trên mức học phí gốc của gia sư (Ví dụ: 200.000 VNĐ/buổi), giấu kín phần phí chênh lệch nền tảng đối với gia sư[cite: 103]._
- [cite_start]**Lịch Sử Kết Nối (Chat History):** Nơi xem lại danh sách học viên từ các lớp học cũ đã kết thúc hoặc các phiên kết nối không thành công[cite: 105].
- [cite_start]**Hồ Sơ Của Tôi (My Profile):** Form cập nhật thông tin cá nhân, chuyên môn và mức học phí gốc mong muốn[cite: 96]. [cite_start]Đây là khu vực bắt buộc upload ảnh chân dung, CCCD và bằng cấp để phục vụ kiểm tra[cite: 97].

---

## 3. Sidebar Phân Hệ Tư Vấn Viên (Consultant)

[cite_start]_Định hướng UI/UX: Thiết kế như một Bảng điều khiển vận hành (Operator Dashboard) thu nhỏ nhằm mục đích quản trị luồng giao tiếp, điều phối lớp học thử và bảo vệ dòng tiền hệ thống[cite: 121, 160]._

- [cite_start]**Tổng Quan (Dashboard):** Hiển thị số lượng phòng chat đang chờ xử lý, số hồ sơ gia sư cần duyệt và tổng doanh thu chờ xác nhận đối soát từ phụ huynh[cite: 123].
- [cite_start]**Duyệt Hồ Sơ Gia Sư (Tutor Verification):** Giao diện sử dụng TanStack Table quản lý danh sách gia sư đăng ký mới[cite: 125]. [cite_start]Kiểm tra thủ công các tài liệu minh chứng (CCCD/Bằng cấp) để bấm nút "Phê duyệt" (Approve) hoặc Từ chối[cite: 126].
- [cite_start]**Điều Phối (Workspace):** Nơi quản lý và trực tiếp tham gia nhắn tin vào tất cả các phòng chat 3 bên được hệ thống phân bổ[cite: 127]. [cite_start]Khung chat tích hợp thêm công cụ tìm kiếm gia sư nhanh và nút "Giới thiệu gia sư cho đoạn chat" (Hệ thống sẽ tự động Khóa room cũ và mở room với gia sư mới)[cite: 128, 129].
- [cite_start]**Quản Lý Lớp Học & Theo Dõi (Class Management):** Danh sách theo dõi các lớp học đang trong giai đoạn "Học thử" hoặc "Đã kích hoạt"[cite: 132]. [cite_start]Consultant có quyền bấm nút "Kích hoạt lớp học" để chuyển trạng thái lớp sang `ACTIVE_LEARNING`[cite: 133].
- [cite_start]**Quản Lý Giao Dịch (Transactions):** Bảng dữ liệu cập nhật trạng thái "Đã thanh toán" (Paid) khi phụ huynh chuyển khoản học phí (mức 220k/buổi), đồng thời tạo lệnh chi trả mức phí gốc (200k/buổi) cho Admin duyệt chuyển khoản tới Gia sư[cite: 135].
- [cite_start]**Lịch Sử Hỗ Trợ (Support History):** Lưu trữ toàn bộ các phiên chat cũ và lớp học đã đóng để tra cứu thông tin khi xảy ra khiếu nại[cite: 136].
