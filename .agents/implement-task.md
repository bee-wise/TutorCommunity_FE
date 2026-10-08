# Consultant widget modal

- [x] Đối chiếu workflow, skill thiết kế và giao diện hiện tại.
- [x] Sắp xếp lại form học thử và kích thước modal.
- [x] Gắn calendar popover vào nội dung modal để chọn ngày.
- [x] Thử chọn ngày và giờ bắt đầu/kết thúc trong modal trên trình duyệt.
- [x] Đổi icon Widget Modal sang Heroicons.
- [x] Kiểm tra TypeScript và lint lần cuối; dọn trang kiểm tra tạm.
- [x] Đồng bộ chiều rộng widget trong chat consultant với chat Sale.

## Messages icons

- [x] Chuyển icon Messages ở Sale, LMS, Staff và widget dùng chung sang Heroicons.
- [x] Kiểm tra TypeScript, ESLint và các icon hiển thị.

## LMS Tutor Dashboard redesign

- [x] Đọc workflow, design skill và benchmark; audit dashboard hiện tại.
- [x] Thiết kế lại theo buổi dạy kế tiếp, danh sách lịch và công cụ giảng dạy.
- [x] Kiểm tra dữ liệu mock, trạng thái rỗng, điều hướng và semantics bằng SSR tests; rà responsive/skeleton ở code.
- [x] 48 tests LMS, TypeScript và production build đạt; lint feature sạch. LMS còn 2 warning cũ ở preview-navigation.test.cjs.
- [ ] QA trực quan desktop/mobile, keyboard trên trình duyệt và Lighthouse chưa thực hiện (quyền localhost đã bị chặn ở phiên trước).

## LMS Quản lý lớp học — BeeWise UI standards

- [x] Đọc workflow, design skill, benchmark; audit danh sách, chi tiết và điểm danh.
- [x] Thiết kế lại card, bộ lọc, buổi học và modal theo standards; giữ logic hiện hành. Heroicons, Button chuẩn, badge nhẹ, card radio và skeleton responsive.
- [x] Đồng bộ doc BE với UI/validation điểm danh hiện tại; không thay đổi schema/guard nghiệp vụ.
- [x] 52 regression tests, TypeScript và production build LMS đạt. Lint feature sạch; toàn LMS còn 2 warning cũ ở test Quản lý tài liệu. git diff --check sạch.
- [ ] QA trực quan desktop/mobile và keyboard trên trình duyệt (quyền localhost đang bị chặn).

## LMS Quản lý tài liệu — chỉ trang chính

- [x] Đọc workflow, skill và benchmark; audit trang chính. Redesign-preserve, dials 5/3/5, dùng Button/Radix của app.
- [x] Chỉnh danh sách lớp, bộ lọc, trạng thái rỗng/lỗi và skeleton riêng cho /lms/tutor/materials. Card nhỏ, Button chuẩn, Heroicons, logic card nằm ở hook/helper.
- [x] Giữ nguyên workspace, upload, AI flow và preview; 53 file được kiểm tra hash không thay đổi.
- [x] 59 tests, TypeScript, lint toàn LMS/feature (không warning) và production build đạt. git diff --check sạch.
- [x] Bổ sung: chỉnh class card theo standards, gom thông tin học viên/buổi/tài liệu, badge trạng thái và CTA rõ ràng.
- [ ] QA trực quan/Lighthouse trên trình duyệt (quyền localhost đang bị chặn).
