# TUTOR: Không gian quản lý theo lớp

## Flow đã chốt với sản phẩm

- Sidebar chung: **Tổng quan** có Dashboard và Lịch dạy tổng hợp; **Công việc** có Quản lý lớp học và Chat kết nối & tư vấn; Quản trị cá nhân giữ nguyên.
- Danh sách lớp 1:1/nhóm, tìm kiếm, sắp xếp và bộ lọc giữ nguyên. Chọn lớp mở trang thông tin lớp, thay sidebar chung bằng sidebar riêng.
- Sidebar lớp: Thông tin lớp, Buổi học & điểm danh, Thành viên, Tài liệu, Tin nhắn lớp. Nút **Về danh sách lớp** đặt bên trái logo BeeWise + nhãn LMS, vẫn dùng được khi thu gọn.
- Tên/mã lớp, loại lớp và trạng thái định vị ở sidebar; không lặp tên lớp ở header nội dung. Mỗi screen có tiêu đề chức năng, không lặp lại ở card danh sách. Chat dùng heading chỉ dành cho screen reader để dành không gian cho lịch sử.
- Badge theo mẫu status pill của benchmark: nền nhẹ, viền mảnh, biểu tượng trạng thái nhỏ; dùng chữ tối trên secondary hiện tại để giữ tương phản. Không đổi global color tokens. Toolbar lọc gọn, chia hàng ở mobile, custom select và vùng bấm tối thiểu 44px; skeleton cùng grid với toolbar thật.
- Một phòng chat chung mỗi lớp. Lớp 1:1 = gia sư + học viên; lớp nhóm = gia sư + toàn bộ học viên. Không sử dụng phòng chat kết nối hoặc tư vấn làm phòng chat lớp.
- Lớp đã kết thúc: lịch, điểm danh, tài liệu và chat chỉ xem; không tạo/upload/sửa/xuất bản tài liệu, không gửi tin nhắn, không sửa điểm danh.
- Lớp đang học: điểm danh được mở cho buổi đang diễn ra hoặc đã hoàn thành. Buổi chưa bắt đầu/đã hủy và lớp chưa khai giảng không được điểm danh. Giữ nguyên validation và lịch sử sửa trong `README.md`.

## Đường dẫn và tương thích

| Màn hình | URL |
| --- | --- |
| Danh sách lớp | `/lms/tutor/classes` |
| Thông tin lớp | `/lms/tutor/classes/[classId]` |
| Buổi học/điểm danh | `/lms/tutor/classes/[classId]/sessions` |
| Thành viên | `/lms/tutor/classes/[classId]/members` |
| Tin nhắn lớp | `/lms/tutor/classes/[classId]/messages` |
| Tài liệu của lớp (giữ URL) | `/lms/tutor/materials/classes/[classId]` |
| Preview AI (giữ URL) | `/lms/tutor/materials/[sessionId]/preview` |
| Chat kết nối/tư vấn (giữ URL) | `/lms/tutor/messages` |

URL tài liệu cũ vẫn hoạt động và dùng sidebar lớp. Trang danh sách tài liệu cũ `/lms/tutor/materials` vẫn truy cập trực tiếp được, nhưng không còn là mục sidebar. Preview giữ fullscreen, logo, slide transition và return-to-modal chỉ khi mở từ AI modal. Topbar giữ trên screen quản lý lớp và chat lớp; chat kết nối giữ shell hiện tại.

## Tổ chức FE

- `features/lms-workspace`: compose shell chung, lấy session hiện có và chọn sidebar theo route/role. Không thay layout LEARNER/STAFF.
- `features/tutor-classes`: đọc classId thống nhất, thông tin lớp, danh sách buổi học, thành viên, sidebar/breadcrumb.
- `features/tutor-materials`: tái sử dụng upload, modal AI, background job/navigation guard, editor/preview và publication guards.
- `features/tutor-class-chat`: UI/hook/service riêng; không đổi mapper/chat API kết nối thật.
- Shared `DashboardLayout` chỉ nhận slot sidebar/breadcrumb; không import feature LMS hoặc xử lý nghiệp vụ lớp.

## Trạng thái tích hợp hiện tại

Lớp, thành viên, buổi học và điểm danh vẫn là mock như trước. Tài liệu vẫn dùng local mock storage. Chat lớp dùng **TanStack Query** và service mock bộ nhớ trong tab; tin nhắn không gửi đến BE, không realtime, không đồng bộ LEARNER/tab khác và mất khi reload. UI ghi rõ điều này. Chưa thêm hoặc gọi endpoint suy đoán.

## Yêu cầu BE trước khi kết nối chat lớp

Đây là đề xuất contract để BE xác nhận, **không phải API hiện đang triển khai**:

1. Read model lớp trả về classId, quyền truy cập, trạng thái và `chatRoomId` riêng. Một classId ánh xạ duy nhất một room; room có type **CLASS**, phân biệt CONNECTION/SUPPORT.
2. Room trả về đầy đủ `participants[]` (gia sư, toàn bộ học viên), `classId`, `status`, `canSendMessage`. Không dùng các trường đơn `learner/tutor/consultant` của mapper chat kết nối hiện tại.
3. Lịch sử tin nhắn có id, roomId/classId, senderId, senderName, senderRole, content, createdAt; cursor pagination, server ordering, dedup theo id. Thời gian hiển thị `Asia/Ho_Chi_Minh`.
4. Mutation gửi tin nhận roomId/classId, content và clientMessageId để idempotent. BE xác thực cookie, kiểm tra quyền tutor/learner đang thuộc lớp; từ chối người ngoài lớp kể cả đã biết URL/roomId. Sender lấy từ session BE, không tin sender do FE cung cấp.
5. Lớp kết thúc/room đóng phải từ chối gửi mới tại BE, không chỉ ẩn input FE. API đọc lịch sử vẫn cho thành viên được phép xem.
6. Realtime: cấp subscription token đúng room và thành viên, event có message id và classId; kiểm tra quyền lại khi thành viên bị gỡ hoặc lớp đóng. Không subscribe kênh connection thay thế.
7. API actual đi qua `apiClient` credentialed, Zod validate response, query key theo class/room/cursor. Mutation invalidate lịch sử; event cập nhật cache và dedup. Bổ sung error codes cho mất quyền, room đóng, giới hạn gửi, lỗi mạng; giữ draft khi lỗi gửi.

BE nên bổ sung các trường vào read model lớp để FE không phải suy luận: thời gian bắt đầu/kết thúc, tổng số buổi đã mua/lên lịch, lịch kế tiếp, số buổi chưa điểm danh, tình trạng tài liệu, quyền sửa/xem và phòng chat. Các trường chưa có trong mock không được dựng thành số liệu thật trên UI.

## QA bắt buộc

- Kiểm tra URL trực tiếp, back danh sách, nav giữa screen cùng classId, classId không hợp lệ, lớp 1:1 và nhóm.
- Role LEARNER/STAFF giữ sidebar cũ; preview AI và bài tập LEARNER vẫn ẩn chrome.
- Lớp kết thúc: không composer, service từ chối gửi; không thao tác sửa tài liệu/điểm danh.
- Chat lớp A/B không lẫn cache/tin nhắn; nội dung rỗng hoặc vượt 2.000 ký tự bị chặn; lỗi gửi giữ draft.
- Điểm danh ongoing/completed vẫn hoạt động và restore focus khi đóng modal.
- Responsive 360px/tablet/desktop, menu mobile đóng sau nav, phím Tab/Enter/Escape, skeleton theo screen, reduced motion.

## Kết quả kiểm tra FE (09/10/2026)

- 84 regression tests LMS đạt, gồm route/sidebar, vị trí back/logo LMS, badge benchmark, tiêu đề không lặp, toolbar gọn, class boundary, room isolation, lớp kết thúc, AI background job và fullscreen preview.
- TypeScript, lint toàn LMS và shared layout/navigation, production build đạt.
- Responsive và accessibility đã rà ở code/SSR; chưa QA trực quan, keyboard trong trình duyệt hoặc Lighthouse vì quyền localhost bị chặn trong phiên làm việc. Không coi SSR tests là kiểm tra browser.
