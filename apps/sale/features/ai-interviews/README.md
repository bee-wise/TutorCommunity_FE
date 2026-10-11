# AI Interviews

Luồng thật nằm trong màn Phỏng vấn AI của `/tutor/onboarding`, chỉ mở sau khi hồ sơ được Core phê duyệt. Preview onboarding tiếp tục dùng kịch bản mock.

- Q7 hiển thị nguyên văn trước pre-check. Camera/micro phải được cấp quyền; ghi thử audio 5 giây và `POST /mic-check` phải đạt.
- Consent gửi đủ `checks.camera`, `checks.mic`, `checks.network`, `checks.time_confirmed` và không tính lượt. Chỉ nút xác nhận “Có, bắt đầu phỏng vấn” gọi `POST /interviews` và tính lượt. Buổi đang mở hoặc SYSTEM_ERROR còn hạn được tiếp tục sau pre-check.
- Mỗi prompt dùng thời gian server trả về, tự bắt đầu/dừng ghi; audio-only gửi API, video PUT trực tiếp lên R2 không có cookie. Upload video lỗi được giữ trong bộ nhớ để thử lại, bài chỉ được nộp khi toàn bộ video tải xong. Giữ trang mở trong khi upload.
- Heartbeat 30 giây, cảnh báo rời trang, xử lý retry/followup, đồng bộ sau `processing` và câu hỏi lệch. Audio lỗi được giữ để gửi lại trong cùng trang.
- Không đánh dấu tài khoản đã được duyệt từ kết quả AI. Quyết định Consultant và đồng bộ Core quyết định bước tiếp theo.

Contract/schema/service/query keys chung: `packages/core/ai-interviews`. Cookie được chuyển qua proxy `/api/ai/*`. Backend cần cấu hình trusted Origin, R2 CORS cho PUT/Content-Type, JWT, quy định/rubric và worker chấm điểm. Trình duyệt cần HTTPS hoặc localhost và MediaRecorder hỗ trợ audio/video webm hoặc mp4.

Frontend không gọi webhook Core; webhook HMAC là tích hợp server với server.
