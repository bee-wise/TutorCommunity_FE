# AI Interviews Staff

- `/consultant/ai-interviews`: hàng chờ có filter trạng thái và pagination offset/limit; chi tiết package có summary, data conflicts, media/transcript, barem, evidence và hồ sơ hiện tại.
- Consultant override khi PENDING_REVIEW/NEEDS_REVISION, quyết định chỉ khi PENDING_REVIEW. Lý do bắt buộc cho override/cấp lượt và NEEDS_REVISION/REJECTED. AI không tự phê duyệt.
- `/admin/ai-interviews`: Admin xem cùng package, cấp lượt, yêu cầu AI chấm lại hoặc xóa dữ liệu. Admin không có nút override/quyết định, đúng contract.
- `/admin/ai-interviews/settings`: tạo/sao chép quy định; upload TOML tối đa 1 MB; xuất cấu hình và chỉnh câu hỏi, thời gian, tiêu chí, trọng số, thang điểm, ngưỡng từ rubric có sẵn thành phiên bản mới. Có JSON đầy đủ để giữ các trường mở rộng, lịch sử và activate có xác nhận. Các phiên bản cấu hình là bất biến.
- Editor giữ nguyên cấu trúc config do API trả về, thay đúng trường version của bản nguồn rồi gửi file TOML qua `POST /rubrics`. Nếu không xác định duy nhất trường version, dùng luồng tải file TOML. Backend xác thực cấu trúc Q1–Q6/trọng số/level/mã tiêu chí; lỗi giữ lại bản chỉnh sửa, tạo thành công vẫn cần Áp dụng riêng.
- Chấm lại cảnh báo thay điểm/override; xóa mọi dữ liệu Tutor yêu cầu nhập đúng mã Tutor. Không tự thực hiện các thao tác này khi mở trang.
- Link media được cập nhật định kỳ và có nút lấy link mới, thời hạn 15 phút. Quyết định hiển thị trạng thái đồng bộ Core, audit đọc qua API.

Mọi mutation dùng TanStack Query, invalidate cache sau thành công và toast phản hồi. DTO ngoại vi và request được kiểm tra Zod. API đi qua apiClient với cookie và rewrite `/api/ai/*` của Staff.
