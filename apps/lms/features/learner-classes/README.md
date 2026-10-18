# Không gian lớp học Learner — tích hợp LMS API

## Phạm vi và điều hướng

- `/lms/learner/classes`: danh sách lớp đã có quyền truy cập. BE chỉ trả lớp `ACTIVE` hoặc `COMPLETED` mà Learner đang có enrollment hợp lệ và Tutor còn hoạt động. Tìm kiếm, loại lớp, trạng thái, sắp xếp và phân trang đều gửi tới BE.
- `/lms/learner/classes/[classId]`: thông tin lớp lấy từ `GET /lms/classes/{classId}`. Tên lớp chỉ ở sidebar lớp. Mã, loại, trạng thái, số buổi và thời gian dùng dữ liệu BE; không điền tên Tutor hoặc tiến độ từ dữ liệu mẫu.
- `/lms/learner/classes/[classId]/sessions`: danh sách và lịch tháng của buổi thực tế từ `GET /lms/classes/{classId}/sessions`; tab lịch dự kiến dùng `GET /lms/classes/{classId}/planned-schedules`. Bộ lọc trạng thái, khoảng thời gian `[from, to)`, trang và `pageSize` do BE xử lý. Thời gian hiển thị theo giờ Việt Nam. Lịch tháng tối đa 100 buổi mỗi trang và có phân trang.
- `/lms/learner/class-sessions/[classId]` chuyển sang URL canonical ở trên. Chi tiết buổi luôn đọc theo cặp class/session, không tin `classId` trong URL là bằng chứng phân quyền.
- Chat lớp tiếp tục truy cập ở `/lms/learner/chat` và `/lms/learner/chat/classes/[classId]`, bên ngoài sidebar lớp. Lớp hoàn thành chỉ xem lại, không nhập tin nhắn.
- Tài liệu, bài tập và học phí chưa có API nằm ngoài tích hợp này. Các mục đó ở sidebar lớp được khóa, tránh nối nhầm lớp thật vào màn dữ liệu mẫu. Các URL cũ vẫn giữ để không phá deep link; báo cáo học tập và lịch học tổng hợp hiện còn dùng bộ dữ liệu mẫu riêng.

## Quyền và dữ liệu buổi học

- Tầng `services` xác thực phản hồi ngoại vi bằng Zod; GUID đi qua schema `z.guid()` của core. Tầng `hooks` dùng TanStack Query với query key có actor để không giữ dữ liệu lớp của tài khoản khác. Không fallback sang mock khi API lỗi/403.
- Chỉ tải điểm danh cho buổi GROUP `ONGOING` hoặc `COMPLETED` khi lớp bật attendance. UI lọc `learnerId` đúng người đăng nhập, không hiển thị roster hay lịch sử sửa điểm danh.
- Bản ghi chỉ được yêu cầu sau khi Learner bấm kiểm tra trên buổi GROUP hoàn thành. BE quyết định PUBLIC, roster/enrollment và quyền Tutor; chỉ render HTTPS URL hợp lệ. Mỗi lần kiểm tra dùng request mới, lỗi thì không giữ link cũ. Link Zoom đã được sao chép không thể bị thu hồi bởi FE.

## Tuyển sinh lớp GROUP

- `/lms/learner/group-classes`: danh sách tuyển sinh công khai và đăng ký học thử. Mỗi lần bấm tạo admission dùng một UUID ổn định trong lần hiển thị để hỗ trợ retry idempotent.
- `/lms/learner/group-admissions/[admissionId]`: Learner đọc admission của chính mình. Có thể mở lại qua GUID từ thông báo/gia sư vì BE chưa có endpoint liệt kê admission của Learner.
- Theo BE-10 cập nhật ngày 14/10/2026: trước khai giảng, học thử là bắt buộc; sau thanh toán được BE xác thực, enrollment được tạo tự động nhưng quyền LMS vẫn chờ lớp ACTIVE. Với lớp ACTIVE được gia sư giới thiệu, học thử là lựa chọn của Learner qua `PUT /lms/group-admissions/{id}/trial-preference` cùng `expectedVersion`. Sau xác nhận các buổi đã bỏ lỡ (nếu có), MONTHLY cần Tutor báo giá, Learner đồng ý và Consultant duyệt; FULL_COURSE bỏ qua báo giá tháng. Sau thanh toán xác thực vẫn cần Tutor ADD và Consultant duyệt mới được ghi danh.
- Mọi mutation dùng phiên bản BE và refetch admission. Lỗi 409 yêu cầu đọc lại trạng thái mới. Checkout được mở chỉ sau hành động chủ động của Learner. `paymentId` trong URL chỉ là lựa chọn để tiếp tục xem; FE gọi lại `GET /lms/group-payments/{id}` và kiểm tra `admissionId`, không coi return URL là đã thanh toán. Chỉ hiển thị số tiền và phân bổ 20/80 từ snapshot BE; không tự tính hay tạo refund/payout.
- Admission trước enrollment không được đọc `GET /lms/group-classes/{id}` (BE trả 403), còn admission DTO chưa chứa `billingMode`. UI cho nhập tháng khi chọn MONTHLY hoặc để trống cho FULL_COURSE; BE kiểm tra mode và tính hợp lệ. Cần BE thêm metadata/endpoint Learner-safe để tự nhận diện mode và hiển thị tên lớp ở màn tiếp tục đăng ký.

## Kiểm tra và giới hạn

- Test native trong `__tests__/learner-workspace.test.cjs` kiểm tra contract gọi API, filter/paging, lịch UTC+7, cache theo actor, privacy, trial preference và điều hướng. Test dùng HTTP stub/SSR, không thay thế kiểm thử trình duyệt hoặc provider thanh toán.
- Chỉ đánh dấu live check đã quan sát khi chạy với API test; không coi Swagger hay seed data là bằng chứng end-to-end. Cần QA thêm trên trình duyệt: responsive, chuyển route, chat socket, checkout/provider callback, entitlement sau enrollment, bản ghi PUBLIC có dữ liệu, và các nhánh late referral/trial với fixture riêng.

### Kết quả ngày 15/10/2026

- API test với tài khoản Learner: list lớp trả 200 và phân trang/lọc GROUP ACTIVE theo total của BE; chi tiết lớp của Learner khác bị 403. Buổi lớp GROUP trả 200; điểm danh cá nhân 200, roster và lịch sử điểm danh bị 403; buổi không thuộc lớp bị 404. Chat lớp và subscription đọc được 200. Hai bản ghi đã kiểm tra trả 404 (chưa có dữ liệu PUBLIC để xác minh nhánh mở link).
- Trên lớp thử riêng: đăng ký học thử trả 200, gửi lại cùng UUID trả cùng admission; Learner khác đọc admission bị 404; tắt học thử trước khai giảng bị 409; hủy admission thử trả 200 và đọc lại thấy `CANCELLED`. Admission trước enrollment không mở được workspace lớp (403). Không tạo checkout, thu phí hay thay đổi lớp demo có sẵn.
- Build LMS và TypeScript qua; lint riêng phần Learner qua; 12/12 test Learner qua, thêm 17/17 test role/materials liên quan qua. Lint toàn LMS còn lỗi `Date.now()` khi render ở `features/tutor-messages/components/ChatWidget.tsx:192`; test Tutor cũ còn 3 assertion UI không khớp hiện trạng. Đây là các file ngoài phạm vi task này.
- Trình duyệt trong app từ chối truy cập `localhost:3001` theo quyền đã lưu. Chưa có bằng chứng QA responsive/browser E2E hoặc provider callback; không đánh dấu task Done trước các bước đó.
