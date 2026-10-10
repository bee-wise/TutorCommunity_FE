# Không gian lớp học LEARNER (UI mock)

## Điều hướng

- Nhóm Tổng Quan của sidebar chính chỉ có `Báo cáo học tập` (`/lms/learner`) và `Lịch học của tôi`. URL cũ `/lms/learner/report` chuyển về trang báo cáo tại `/lms/learner`.
- `/lms/learner/classes` là danh sách lớp. `/lms/learner/classes/[classId]` và `/sessions` dùng sidebar theo lớp.
- Sidebar lớp gồm thông tin lớp, buổi học, tài liệu lớp học, bài tập và học phí. Không có tin nhắn trong sidebar này: chat tiếp tục là màn độc lập tại `/lms/learner/chat`.
- Các URL tài liệu, bài tập và học phí hiện hữu vẫn chạy. Khi URL chỉ rõ lớp, `getLearnerWorkspaceRoute` gắn sidebar lớp; màn làm bài `/lms/learner/exercises/[exerciseId]` tiếp tục fullscreen.
- Trang danh sách tài liệu/bài tập cũ vẫn tồn tại để không phá deep link, nhưng không hiển thị trong sidebar chính. Từ không gian lớp, người học đi thẳng vào nội dung của lớp đã chọn.

## Quan hệ dữ liệu mock và hợp đồng tích hợp

`LEARNER_CLASSES` hiện là danh mục lớp mẫu dùng chung. Bài tập tham chiếu `classId` và `sessionId`; tài liệu tham chiếu `sessionId`; học phí lưu `learnerClassId` để nối với lớp trong LMS. Thống kê ở trang Báo cáo học tập được tổng hợp từ các tập mẫu này và ghi rõ là dữ liệu minh họa, không phải báo cáo chính thức.

Khi tích hợp BE, các endpoint lớp, buổi học, tài liệu, bài tập và học phí cần giữ khóa lớp/buổi thống nhất và kiểm tra quyền truy cập của học viên theo từng lớp. Danh sách/tổng hợp và trạng thái nên lấy qua feature hook + service với TanStack Query, query keys tập trung, validate dữ liệu ngoại vi bằng Zod theo workflow của repository. Không dùng dữ liệu lớp từ URL làm bằng chứng phân quyền. Tin nhắn lớp học cần tiếp tục lấy theo quyền của từng phòng chat, không ghép vào route/sidebar lớp.

Lớp đã kết thúc vẫn cho xem lại nội dung. Các hành động ghi hoặc nộp bài cần dựa trên quyền/trạng thái trả từ BE khi tích hợp, không suy diễn từ trạng thái mock phía client.
