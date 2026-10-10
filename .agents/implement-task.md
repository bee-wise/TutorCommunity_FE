## Onboarding: gate Phỏng vấn AI by APPROVED profile 2026-10-10

- [x] Đối chiếu workflow, các trạng thái hồ sơ, resolver Onboarding và luồng preview.
- [x] Đổi thứ tự thành gửi hồ sơ → chờ duyệt → Phỏng vấn AI sau khi `tutorProfileStatus` là `APPROVED`.
- [x] Đồng bộ header và redirect sau đăng nhập theo `isInterviewed`; 33 regression tests, TypeScript Sale, ESLint các file Sale và diff check trong phạm vi tác vụ đạt.

## Consultant message composer 2026-10-09

- [x] Đối chiếu ảnh feedback, workflow, design skill và benchmark BeeWise.
- [x] Gom ô nhập, Mẫu, Widget và Gửi vào một thanh đồng bộ; giữ nhãn công cụ trên mobile và tự tăng chiều cao khi nhập nhiều dòng.
- [x] TypeScript, ESLint, production build staff và `git diff --check` đạt.
- [ ] QA trực quan trên trình duyệt chưa thực hiện vì công cụ browser bị lỗi khởi tạo.

## Consultant trial widget GUID validation 2026-10-09

- [x] Đối chiếu ID `tutorOfferingId` từ `GET /chat-rooms` với schema request học thử; xác định `z.uuid()` loại GUID hợp lệ của backend có nhóm phiên bản `9`.
- [x] Dùng `z.guid()` cho payload học thử và các mã GUID trong cùng widget; báo lỗi dễ hiểu nếu offering ID sai định dạng.
- [x] Kiểm tra payload mẫu bằng schema thật, TypeScript, ESLint, production build staff và `git diff --check`.

## LMS sidebar logo 2026-10-09

- [x] Đối chiếu workflow, chuẩn UI và hai sidebar LMS hiện hành.
- [x] Thay logo theo trạng thái mở/đóng ở sidebar chung và sidebar lớp; bỏ nhãn LMS trùng, giữ nhận diện BeeWise cũ ngoài LMS.
- [x] 11 regression tests, TypeScript, lint LMS/shared sidebar và production build đạt. Đã rà vị trí logo LMS còn lại theo phạm vi sidebar.

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

## LMS LEARNER Kho tài liệu đồng bộ TUTOR

- [x] Đọc workflow, design skill và benchmark; audit 3 màn và đối chiếu Quản lý tài liệu TUTOR. Redesign-preserve, dials 5/3/5; dùng Button/Radix hiện có, Heroicons và semantic tokens.
- [x] Card lớp 1:1/nhóm, bộ lọc môn/trạng thái/sắp xếp; giữ luồng Lớp -> Buổi học -> Tài liệu và back về đúng tab. Metadata lớp bổ sung trong mock, không đổi API.
- [x] Đồng bộ child screens, badge nguồn AI/upload, viewer chỉ đọc, empty/missing states và skeleton theo màn. Không dùng kho nháp TUTOR; file/nội dung thực tế vẫn chờ API như trước.
- [x] 72 regression tests, TypeScript, lint toàn LMS không warning, production build và diff check đạt. UI TUTOR không thay đổi; browser QA chưa thực hiện.
- [ ] QA trực quan/Lighthouse (quyền localhost đã bị chặn ở phiên trước).

## LMS TUTOR workspace: badge, nhận diện và toolbar gọn

- [x] Đọc lại workflow, design-taste-frontend và benchmark; đối chiếu ảnh feedback. Redesign-preserve, dials 5/3/6.
- [x] Badge pill nền nhẹ theo benchmark, metadata riêng; giữ global tokens và tương phản chữ trên secondary hiện tại.
- [x] Tên/loại/trạng thái lớp chỉ ở sidebar; nút back trước logo BeeWise LMS, vẫn dùng được khi collapse. Bỏ tiêu đề buổi học lặp; giữ chỉnh sửa đồng thời hiện có.
- [x] Toolbar lớp/buổi/học viên/tài liệu compact, 44px targets, custom select và skeleton cùng grid; không đổi flow AI, preview hoặc nghiệp vụ điểm danh/chat.
- [x] 84 tests, TypeScript, lint toàn LMS không warning và production build đạt; cập nhật doc và dọn script tạm.
- [ ] QA trực quan/Lighthouse trên browser chưa thực hiện (quyền localhost bị chặn).

## LMS TUTOR không gian quản lý theo lớp

- [x] Audit workflow, skill mới, benchmark, navigation và contract chat; chốt với người dùng phòng chat chung theo lớp và lớp kết thúc chỉ xem.
- [x] Refactor sidebar chung: Tổng quan có Lịch dạy; Công việc gồm Quản lý lớp và Chat kết nối/tư vấn. Sidebar lớp riêng, giữ URL tài liệu/preview cũ.
- [x] Tách thông tin lớp, buổi học/điểm danh và thành viên; thêm chat lớp mock tách biệt chat kết nối thật. Lớp kết thúc chỉ xem, service chặn gửi tin nhắn/ghi điểm danh/tài liệu.
- [x] Viết WORKSPACE.md và đồng bộ README BE; 82 regression tests, TypeScript, lint toàn LMS/shared layout và production build đạt. git diff --check sạch; bỏ skeleton detail cũ và import dư.
- [ ] QA trực quan/Lighthouse (quyền localhost đã bị chặn ở phiên trước).

## LMS LEARNER workspace theo lớp

- [x] Đọc workflow, skill thiết kế và benchmark; audit route, navigation và dữ liệu mock giữa tài liệu, bài tập, học phí, chat.
- [x] Đồng bộ danh mục lớp và tạo dashboard, báo cáo, danh sách lớp cùng không gian lớp có sidebar riêng.
- [x] Nối deep link tài liệu, bài tập, học phí vào sidebar lớp mà vẫn giữ URL cũ; chat vẫn nằm ngoài. Lịch học thuộc Tổng quan; ẩn tài liệu/bài tập ở sidebar chính theo yêu cầu bổ sung.
- [x] 90 regression tests, TypeScript, lint LMS/shared navigation, production build và `git diff --check` đạt; có README hợp đồng dữ liệu mock/BE, rà nhãn UI và code dư.
- [ ] QA trực quan trên browser chưa thực hiện trong phiên này.

## LMS LEARNER danh sách lớp theo UI standards

- [x] Đọc workflow, design-taste-frontend và benchmark; audit trang danh sách lớp, card, filter, skeleton và luồng vào lớp.
- [x] Tạo toolbar lọc riêng cho lớp và chỉnh phân cấp card gọn, rõ trạng thái, gia sư, tiến độ và bài tập cần làm; không đổi route hoặc dữ liệu mock.
- [x] Đồng bộ skeleton; 92 regression tests, TypeScript, lint LMS, production build và `git diff --check` đạt. Rà nhãn UI, tương phản badge/CTA, icon và component length.
- [ ] QA trực quan/Lighthouse trên browser chưa thực hiện trong phiên này.

## LMS LEARNER hợp nhất trang tổng quan

- [x] Dùng `Báo cáo học tập` làm trang chính `/lms/learner`; bỏ mục và màn `Tổng quan` riêng.
- [x] Giữ URL báo cáo cũ bằng redirect; xóa dashboard/mock service không còn dùng và đồng bộ test, README.
- [x] 92 regression tests, TypeScript, lint LMS, production build và diff check đạt; còn thiếu QA trực quan trên browser.

## LMS đồng bộ vai trò khi cookie đăng nhập thay đổi giữa các cổng localhost

- [x] Đối chiếu workflow, UI standards, proxy, bootstrap `/auth/me` và cấu hình cache Query.
- [x] Chặn route sai vai trò ở proxy; xác minh lại `/auth/me` lúc mở LMS và khi quay lại tab, chỉ render workspace đúng vai trò.
- [x] 4 test phân luồng đạt; ESLint và `git diff --check` đạt. TypeScript toàn LMS còn 5 lỗi sẵn có trong `BusinessChatWidget.tsx` và `useChatRoom.ts` (không thuộc thay đổi này).

## Widget message content 2026-10-10

- [x] Đối chiếu workflow và các renderer chat Staff, Sale, LMS.
- [x] Ẩn content của tin nhắn widget trong timeline và chi tiết; bỏ thao tác sao chép content ẩn, giữ nguyên payload và tin nhắn thường.
- [x] TypeScript cả ba app và ESLint các file thay đổi đạt; `git diff --check` trên các file của tác vụ đạt.

## Trial widget room link and action 2026-10-10

- [x] Đối chiếu ảnh phản hồi, workflow, design skill và widget dùng chung.
- [x] Gom link phòng học trực tuyến và nút tham gia vào cùng một cụm; giữ địa điểm học trực tiếp ở hàng thông tin.
- [x] TypeScript Staff, Sale, LMS; ESLint file widget; và `git diff --check` trên các file của tác vụ đều đạt.

## Consultant chat unread badges 2026-10-10

- [x] Điều tra dữ liệu `GET /chat-rooms`, luồng Centrifugo và cách tính badge; xác định `updatedAt`, mốc cộng 1 giây, tin tự gửi và chỉ subscribe phòng đang mở gây sai/chậm.
- [x] Dùng `lastMessageAt`, đếm tin mới từ người khác bằng TanStack Query, lưu mốc đã đọc theo user/phòng, đồng bộ giữa tab và theo dõi realtime cho danh sách phòng.
- [x] Chỉ đánh dấu đã đọc khi phòng hiển thị; gom badge trùng và dùng token màu `destructive`.
- [x] 3 regression tests, TypeScript, ESLint, production build Staff và diff check đạt.

## LMS tutor chat unread badges 2026-10-10

- [x] Điều tra mapper đặt `unreadCount: 0`, danh sách chỉ polling 30 giây và chưa subscribe realtime cho các phòng chưa mở.
- [x] Dùng hook chung tính tin đến theo mốc đã đọc, subscribe realtime toàn danh sách, thêm polling 5 giây khi mở trang và refresh lúc quay lại tab; hiện badge đỏ ở phòng/tab có tin mới.
- [x] Đánh dấu đã đọc khi phòng đang hiển thị; sửa đường dẫn từ thẻ chat tóm tắt về đúng `/lms/tutor/messages`.
- [x] 3 regression tests, TypeScript LMS/Staff, ESLint, production build tuần tự cho cả hai app và diff check đạt.

## LMS tutor chat polling performance 2026-10-10

- [x] Rà nhịp gọi `GET /chat-rooms` 5 giây và trạng thái kết nối Centrifugo.
- [x] Dùng realtime làm nguồn cập nhật chính; chuyển polling dự phòng sang 30 giây khi socket và các kênh phòng sẵn sàng, 15 giây khi chưa sẵn sàng.
- [x] TypeScript, ESLint và production build LMS/Staff đạt; diff check đạt.
