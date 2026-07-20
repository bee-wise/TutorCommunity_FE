NGHIỆP VỤ KẾT NỐI QUA CHAT ROOM
Phiên bản tinh chỉnh: 11/07/2026

================================================================

1. # MỤC TIÊU NGHIỆP VỤ

Learner có thể tìm kiếm và xem nhiều hồ sơ Tutor, nhưng chỉ được tự tạo tối đa một kết nối đang hoạt động tại một thời điểm.

Khi Learner nhấn Connect và xác nhận, BeeWise tạo ngay:

- Một Connect Request;
- Một Chat Room gồm Learner, Tutor và Consultant được phân công.

Tutor không cần Accept hoặc Decline Connect Request. Tutor chỉ cần vào Chat Room, chào hỏi Learner, trao đổi và tham gia buổi học thử. Consultant hỗ trợ điều phối, xác nhận kết quả và đóng hoặc chuyển kết nối thành lớp học.

================================================================ 2. LUỒNG NGHIỆP VỤ CHÍNH
================================================================

1. Learner chọn Tutor từ kết quả tìm kiếm hoặc trang hồ sơ Tutor.
2. Nếu Learner chưa đăng nhập, hệ thống yêu cầu đăng nhập/đăng ký và sau đó quay lại đúng hồ sơ Tutor đã chọn.
3. Learner nhấn Connect.
4. UI hiển thị popup xác nhận kết nối.
5. Sau khi Learner xác nhận, backend kiểm tra Learner có kết nối tự tạo đang hoạt động hay không.
6. Nếu đã có kết nối đang hoạt động:
   - Không tạo Connect Request mới;
   - Không tạo Chat Room mới;
   - Trả HTTP 409 ACTIVE_CONNECTION_EXISTS;
   - FE hiển thị CTA Go to Current Chat Room và Contact Consultant.
7. Nếu đủ điều kiện:
   - Tạo Connect Request với status = ACTIVE;
   - Tạo Chat Room với status = ACTIVE;
   - Thêm Learner, Tutor và Consultant được phân công vào room;
   - Đặt connectionStage = WAITING_FOR_TUTOR;
   - Khóa nút Connect trên các hồ sơ Tutor khác.
8. Tutor nhận thông báo, mở Chat Room và gửi lời chào/trao đổi đầu tiên.
9. Khi Tutor gửi tin nhắn đầu tiên, hệ thống cập nhật:
   - connectionStage = DISCUSSING;
   - tutorFirstResponseAt = thời điểm gửi tin nhắn đầu tiên.
10. Consultant hỗ trợ hai bên xác nhận:
    - Nhu cầu và mục tiêu học;
    - Môn/chủ đề cần học;
    - Hình thức Online/Offline;
    - Khung giờ phù hợp;
    - Mức học phí;
    - Lịch và điều kiện học thử.
11. Khi thống nhất được lịch học thử:
    - connectionStage = TRIAL_SCHEDULED.
12. Sau khi học thử hoàn tất:
    - connectionStage = AWAITING_DECISION.
13. Nếu hai bên không tiếp tục:
    - Consultant chọn lý do đóng;
    - Connect Request = CLOSED;
    - Chat Room = CLOSED và chuyển sang read-only;
    - Learner được tự tạo kết nối mới.
14. Nếu Learner hủy trước khi Tutor phản hồi hoặc trước khi lịch học thử được xác nhận:
    - Connect Request = CANCELLED;
    - Chat Room = CLOSED và chuyển sang read-only;
    - Learner được tự tạo kết nối mới.
15. Nếu Tutor không phản hồi trong thời hạn SLA do hệ thống cấu hình:
    - Connect Request = TIMEOUT;
    - Chat Room = CLOSED và chuyển sang read-only;
    - Learner được tự tạo kết nối mới;
    - Consultant nhận thông báo để hỗ trợ Learner nếu cần.
16. Nếu hai bên đồng ý học chính thức:
    - Consultant xác nhận kết nối thành công;
    - Hệ thống tạo Class/Learning Contract;
    - Connect Request = CONVERTED_TO_CLASS;
    - Chat Room = CONVERTED_TO_CLASS và chuyển sang read-only hoặc liên kết sang Class Chat Room;
    - Class status = PENDING_PAYMENT;
    - Nút Connect được mở lại cho Learner.
17. Sau khi Learner thanh toán thành công:
    - Payment = PAID;
    - Class status = ACTIVE;
    - Learner và Tutor được sử dụng LMS theo quyền của lớp.
18. Nếu Learner muốn kết nối thêm Tutor khi đang có một Connect Request ACTIVE:
    - Learner phải chọn Contact Consultant;
    - Consultant đánh giá nhu cầu;
    - Consultant có thể tạo/cho phép kết nối bổ sung theo luồng ngoại lệ;
    - Hệ thống phải lưu lý do, người phê duyệt và audit log.

================================================================ 3. QUY TẮC TRẠNG THÁI CONNECT REQUEST
================================================================

3.1. Trạng thái vòng đời

- ACTIVE
  Kết nối đã được tạo thành công và Chat Room ba bên đang hoạt động. Trạng thái này bắt đầu ngay sau khi Learner xác nhận Connect; không chờ Tutor Accept.

- CLOSED
  Hai bên đã trao đổi hoặc học thử nhưng không tiếp tục học chính thức. Consultant là người đóng và phải chọn closeReason.

- CANCELLED
  Learner chủ động hủy trước khi Tutor phản hồi hoặc trước khi buổi học thử được xác nhận. Khi quy trình đã đi sâu hơn, nên dùng CLOSED với closeReason = LEARNER_WITHDREW.

- TIMEOUT
  Tutor không có phản hồi đầu tiên trong thời hạn SLA được cấu hình.

- CONVERTED_TO_CLASS
  Consultant đã xác nhận hai bên đồng ý học và hệ thống đã tạo Class/Learning Contract.

  3.3. Giai đoạn xử lý kết nối

Để thể hiện tiến trình mà không làm phình trạng thái vòng đời, bổ sung trường connectionStage:

- WAITING_FOR_TUTOR
  Room đã tạo, đang chờ Tutor gửi phản hồi đầu tiên.

- DISCUSSING
  Tutor đã tham gia; các bên đang trao đổi nhu cầu, lịch, hình thức và học phí.

- TRIAL_SCHEDULED
  Đã thống nhất lịch học thử.

- AWAITING_DECISION
  Đã học thử và đang chờ quyết định học chính thức.

Khi Connect Request chuyển sang CLOSED, CANCELLED, TIMEOUT hoặc CONVERTED_TO_CLASS, connectionStage được giữ lại để phục vụ lịch sử/audit nhưng không còn điều khiển quyền tạo kết nối.

================================================================ 4. TRẠNG THÁI CHAT ROOM
================================================================

- ACTIVE
  Room đang mở và các thành viên có thể trao đổi.

- CLOSED
  Kết nối kết thúc mà không tạo lớp. Room chuyển sang read-only.

- CONVERTED_TO_CLASS
  Kết nối đã tạo thành

consultantReviewStatus:

- NONE
- NEEDS_REVIEW
- IN_REVIEW
- RESOLVED
  Các trường hợp có thể đặt NEEDS_REVIEW:
- Hai bên không thống nhất học phí hoặc lịch;
- Có dấu hiệu giao dịch ngoài nền tảng;
- Có tranh chấp hoặc nội dung cần Consultant xử lý ưu tiên;
- Room bị đình trệ quá thời hạn cấu hình.

================================================================ 5. LÝ DO ĐÓNG KẾT NỐI ĐỀ XUẤT
================================================================
closeReason:

- LEARNER_NOT_INTERESTED
- TUTOR_UNAVAILABLE
- SCHEDULE_MISMATCH
- LEARNING_MODE_MISMATCH
- FEE_NOT_AGREED
- TRIAL_UNSUCCESSFUL
- LEARNER_WITHDREW
- TUTOR_NO_RESPONSE
- DUPLICATE_CONNECTION
- POLICY_VIOLATION
- OTHER
  Nếu closeReason = OTHER, closeNote là bắt buộc.

================================================================ 6. QUY TẮC KHÓA VÀ MỞ LẠI NÚT CONNECT
================================================================
BR-CONNECT-01
Learner có thể tìm kiếm và xem nhiều Tutor nhưng chỉ được tự tạo tối đa một Connect Request có status = ACTIVE tại một thời điểm.

BR-CONNECT-02
Khi Learner có Connect Request status = ACTIVE, nút Connect trên tất cả hồ sơ Tutor khác phải bị vô hiệu hóa.

Thông báo:
“Bạn đang trong quá trình kết nối với một gia sư. Vui lòng tiếp tục trao đổi trong phòng chat hiện tại hoặc liên hệ Consultant nếu cần hỗ trợ kết nối thêm gia sư khác.”
→ CTA:

- Go to Current Chat Room
- Contact Consultant

BR-CONNECT-03
Nút Connect được kích hoạt lại khi kết nối hiện tại chuyển sang 1 trong các status:

- CLOSED
- CANCELLED
- TIMEOUT
- CONVERTED_TO_CLASS

BR-CONNECT-04
Nếu Learner cần kết nối thêm Tutor khi đang có kết nối ACTIVE, Learner phải liên hệ Consultant. Chỉ tài khoản có quyền Consultant/Admin mới được tạo hoặc phê duyệt kết nối ngoại lệ.

BR-CONNECT-05
Quy tắc một kết nối tự tạo đang hoạt động phải được kiểm soát ở cả FE và BE. Disable UI không thay thế kiểm tra backend.

BR-CONNECT-06
Backend phải kiểm tra và tạo Connect Request + Chat Room trong cùng một transaction. Nếu không tạo đủ Connect Request, Chat Room, member records và Consultant assignment thì rollback toàn bộ.

BR-CONNECT-07
Backend phải chống double-click và request đồng thời bằng ít nhất một trong các cơ chế:

- Idempotency-Key cho API POST;
- Database transaction + row/advisory lock theo learnerId;
- Partial unique index/constraint bảo đảm mỗi Learner chỉ có một self-service Connect Request ACTIVE.

BR-CONNECT-08
Kết nối do Consultant tạo theo luồng ngoại lệ không bị chặn bởi giới hạn self-service, nhưng phải lưu:

- createdBy;
- overrideApprovedBy;
- overrideReason;
- createdAt;
- audit log.

BR-CONNECT-09
Quyền tự tạo kết nối mới được mở lại ngay khi Class/Learning Contract được tạo và Connect Request chuyển sang CONVERTED_TO_CLASS; không cần chờ Class thanh toán thành công.

================================================================ 7. API TẠO CONNECT REQUEST VÀ CHAT ROOM
================================================================
Endpoint đề xuất:
POST /connect-requests

Request đề xuất:
{
"tutorId": "049b45bc-604b-4989-ba73-95ce779a896c"
}

Header đề xuất:
Idempotency-Key: <uuid-generated-by-client>

7.1. Tạo kết nối thành công — HTTP 201 Created

{
"success": true,
"code": "CONNECTION_CREATED",
"message": "Tạo kết nối thành công.",
"data": {
"connectRequestId": "8d2183cb-6119-47ac-9bb0-c0fe9f68732e",
"chatRoomId": "670a9c5e-e61f-4c05-8ca6-ef8d9fa4e157",
"connectionStatus": "ACTIVE",
"connectionStage": "WAITING_FOR_TUTOR",
"chatRoomStatus": "ACTIVE",
"consultantReviewStatus": "NONE",
"canCreateAnotherConnection": false,
"blockingReason": "ACTIVE_CONNECTION_EXISTS",
"createdAt": "2026-07-10T10:30:00+07:00",
"learner": {
"id": "8e953c6a-d252-4694-bace-db43ebbfc3c8",
"name": "Test Learner"
},
"tutor": {
"id": "049b45bc-604b-4989-ba73-95ce779a896c",
"name": "Phúc Bùi Quang"
},
"consultant": {
"id": "509cbe67-625e-44e2-9295-86f05dca9690",
"name": "Linh Trịnh Thị"
},
"classId": null
}
}

7.2. Learner đang có kết nối ACTIVE — HTTP 409 Conflict

{
"success": false,
"code": "ACTIVE_CONNECTION_EXISTS",
"message": "Bạn đang trong quá trình kết nối với một gia sư. Vui lòng tiếp tục trong phòng chat hiện tại hoặc liên hệ Consultant để được hỗ trợ kết nối thêm.",
"data": {
"canCreateAnotherConnection": false,
"blockingReason": "ACTIVE_CONNECTION_EXISTS",
"requiresConsultantSupport": true,
"activeChatRoomId": "670a9c5e-e61f-4c05-8ca6-ef8d9fa4e157",
"activeConnection": {
"connectRequestId": "8d2183cb-6119-47ac-9bb0-c0fe9f68732e",
"connectionStatus": "ACTIVE",
"connectionStage": "DISCUSSING",
"chatRoomStatus": "ACTIVE",
"tutor": {
"id": "049b45bc-604b-4989-ba73-95ce779a896c",
"name": "Phúc Bùi Quang"
},
"consultant": {
"id": "509cbe67-625e-44e2-9295-86f05dca9690",
"name": "Linh Trịnh Thị"
}
}
}
}

FE sử dụng response 409 để:

- Không tạo Connect Request hoặc Chat Room mới;
- Hiển thị cảnh báo đang có kết nối hoạt động;
- Điều hướng Go to Current Chat Room bằng activeChatRoomId;
- Hiển thị Contact Consultant.

================================================================ 8. API KIỂM TRA ELIGIBILITY
================================================================
Endpoint đề xuất:
GET /connect-requests/eligibility

8.1. Khi đang có kết nối ACTIVE

{
"success": true,
"data": {
"canCreateConnection": false,
"blockingReason": "ACTIVE_CONNECTION_EXISTS",
"requiresConsultantSupport": true,
"activeConnectRequestId": "8d2183cb-6119-47ac-9bb0-c0fe9f68732e",
"activeChatRoomId": "670a9c5e-e61f-4c05-8ca6-ef8d9fa4e157",
"activeTutorId": "049b45bc-604b-4989-ba73-95ce779a896c",
"connectionStatus": "ACTIVE",
"connectionStage": "DISCUSSING"
}
}

8.2. Khi được phép Connect

{
"success": true,
"data": {
"canCreateConnection": true,
"blockingReason": null,
"requiresConsultantSupport": false,
"activeConnectRequestId": null,
"activeChatRoomId": null,
"activeTutorId": null,
"connectionStatus": null,
"connectionStage": null
}
}

FE gọi eligibility khi:

- Learner mở Tutor Profile;
- Learner quay lại Sale Page sau khi đăng nhập;
- App được reload hoặc token được refresh;
- Chat Room vừa được đóng/hủy/timeout;
- Kết nối vừa chuyển thành lớp;
- Learner quay lại app từ một tab hoặc thiết bị khác.

Ngoài các lần gọi trên, FE nên cập nhật local state ngay sau các API mutation thành công; không chỉ phụ thuộc vào lần gọi eligibility tiếp theo.

================================================================ 9. USER FLOW — LEARNER
================================================================
Guest Accesses beewise.vn
↓
Choose Search Method
├── Manual Search
└── AI Search
↓
View Tutor Results
↓
View Tutor Profile Detail
↓
Click Connect
↓
Is the Learner Signed In?
├── NO
│ ↓
│ Login / Register
│ ↓
│ Return to Selected Tutor
│ ↓
│ Click Connect Again
│
└── YES
↓
Show Connection Confirmation Popup
↓
Learner Confirms?
├── NO
│ → Close Popup
│ → Remain on Tutor Profile
│
└── YES
↓
Backend Checks Active Self-Service Connection
↓
Active Connection Exists?
├── YES
│ ↓
│ Do Not Create New Request or Room
│ ↓
│ Show Active Connection Warning
│ ↓
│ Choose Action
│ ├── Go to Current Chat Room
│ └── Contact Consultant
│
└── NO
↓
Create Connect Request = ACTIVE
↓
Create Three-Party Chat Room = ACTIVE
Learner + Tutor + Assigned Consultant
↓
Set Connection Stage = WAITING_FOR_TUTOR
↓
Disable Connect Buttons for Other Tutors
↓
Open Current Chat Room
↓
Tutor Sends First Message
↓
Connection Stage = DISCUSSING
↓
Discuss Needs, Schedule, Mode, Fee and Trial Lesson
↓
Schedule Trial Lesson
↓
Connection Stage = TRIAL_SCHEDULED
↓
Complete Trial Lesson
↓
Connection Stage = AWAITING_DECISION
↓
Do Learner and Tutor Agree to Study Officially?
├── NO
│ ↓
│ Consultant Closes Connection
│ ↓
│ Connect Request = CLOSED
│ Chat Room = CLOSED / Read-only
│ ↓
│ Enable Connect Buttons
│ ↓
│ Return to Tutor Search
│
└── YES
↓
Consultant Confirms Successful Connection
↓
Create Class / Learning Contract
↓
Connect Request = CONVERTED_TO_CLASS
Chat Room = CONVERTED_TO_CLASS / Read-only
↓
Class Status = PENDING_PAYMENT
↓
Enable Connect Buttons Again
↓
Learner Pays BeeWise
↓
Payment Confirmed?
├── NO
│ → Keep Class = PENDING_PAYMENT or apply payment expiry rule
│
└── YES
↓
Class Status = ACTIVE
↓
Enable Learner LMS Access
↓
Manage Schedule, Materials, Payments and Reports
↓
Complete the Class

Alternative outcomes while connection is ACTIVE:

- Learner cancels before Tutor responds/trial is confirmed
  → Connect Request = CANCELLED
  → Chat Room = CLOSED / Read-only
  → Enable Connect buttons.

- Tutor does not respond within configured SLA
  → Connect Request = TIMEOUT
  → Chat Room = CLOSED / Read-only
  → Enable Connect buttons.

- Learner wants another Tutor while current connection is ACTIVE
  → Contact Consultant
  → Consultant handles exception flow.

================================================================ 10. USER FLOW — TUTOR
================================================================

Guest Accesses beewise.vn
↓
Register a BeeWise Account
↓
Complete Tutor Profile
↓
Submit Tutor Profile
↓
Check Free Listing Eligibility
├── Eligible
│ → Subscription Waived
│
└── Not Eligible
↓
Pay 50,000 VNĐ / 6 Months
↓
Payment Confirmed
↓
Interview with the BeeWise Team
↓
Consultant Reviews Profile & Interview Result
↓
Is the Application Approved?
├── NO
│ ↓
│ View Rejection Reason
│ ↓
│ Edit Tutor Profile
│ ↓
│ Resubmit Application
│ ↓
│ Consultant Reviews Again
│
└── YES
↓
Public Profile Enabled
↓
Complete Post-Approval Information - Bank Information - Available Time Slots
↓
LMS Access Enabled
↓
Learner Creates Connection
↓
System Automatically Creates Three-Party Chat Room
Learner + Tutor + Assigned Consultant
↓
Tutor Receives Notification
↓
Tutor Opens Chat Room
↓
Tutor Sends Greeting / First Response
↓
Connection Stage = DISCUSSING
↓
Discuss Needs, Schedule, Mode, Fee and Trial Lesson
↓
Agree on Trial Schedule?
├── NO
│ → Continue Discussion or Ask Consultant for Support
│
└── YES
↓
Trial Lesson Scheduled
↓
Conduct Trial Lesson
↓
Provide Post-Trial Decision
↓
Do Both Parties Agree to Study Officially?
├── NO
│ ↓
│ Consultant Closes Connection
│ Chat Room Becomes Read-only
│ ↓
│ Wait for Future Connection
│
└── YES
↓
Consultant Confirms Successful Connection
↓
Class / Learning Contract Created
↓
Wait for Learner Payment
↓
Payment Confirmed
↓
Class Status = ACTIVE
↓
Receive Class and Start Teaching in LMS

================================================================ 11. USER FLOW — CONSULTANT
================================================================

Consultant Logs In to staff.beewise.vn
↓
Role & Permission Check
↓
Open Consultant Workspace
↓
Choose Task
├── Tutor Verification
│ ↓
│ View Pending Tutor Applications
│ ↓
│ Review Profile & Evidence
│ ↓
│ Join / Review Tutor Interview
│ ↓
│ Is the Tutor Qualified?
│ ├── NO
│ │ → Enter Rejection Reason
│ │ → Reject Profile
│ │ → Notify Tutor
│ │
│ └── YES
│ → Approve Tutor Profile
│ → Enable Public Listing
│
└── Connection Support
↓
Learner Creates Connection
↓
System Assigns Consultant and Creates Three-Party Chat Room
↓
Consultant Receives Assigned Room
↓
Monitor Whether Tutor Sends First Response Within SLA
↓
Tutor Responds Within SLA?
├── NO
│ ↓
│ Contact / Remind Tutor
│ ↓
│ Still No Response at SLA Expiry?
│ ├── YES
│ │ → Connect Request = TIMEOUT
│ │ → Close Chat Room / Read-only
│ │ → Enable Learner to Connect Again
│ │ → Support Learner in Finding Another Tutor
│ └── NO
│ → Continue Connection Flow
│
└── YES
↓
Support Three-Party Discussion
↓
Confirm Needs, Schedule, Mode and Fee
↓
Coordinate Trial Lesson
↓
Trial Lesson Completed
↓
Do Both Parties Agree to Study Officially?
├── NO
│ ↓
│ Select Close Reason
│ ↓
│ Connect Request = CLOSED
│ Chat Room = CLOSED / Read-only
│ ↓
│ Enable Learner to Connect Again
│
└── YES
↓
Confirm Successful Connection
↓
Create Class / Learning Contract
↓
Connect Request = CONVERTED_TO_CLASS
Chat Room = CONVERTED_TO_CLASS / Read-only
↓
Class Status = PENDING_PAYMENT
↓
Enable Learner to Connect Again
↓
Monitor Payment
↓
Payment Confirmed?
├── NO
│ → Follow Payment Expiry / Reminder Rule
│
└── YES
↓
Class Status = ACTIVE
↓
Enable Learner and Tutor LMS Access
↓
Monitor Initial Class Stage

Exception Flow — Additional Tutor Connection:
Learner Contacts Consultant While an ACTIVE Connection Exists
↓
Consultant Reviews Reason and Current Connection
↓
Is Additional Connection Justified?
├── NO
│ → Explain Current One-Connection Rule
│ → Direct Learner to Existing Chat Room
│
└── YES
↓
Create or Approve Additional Connection with Override
↓
Record overrideReason, approvedBy and Audit Log
↓
Create Additional Three-Party Chat Room
↓
Continue Standard Connection Support Flow

================================================================ 12. STATE TRANSITION SUMMARY
================================================================

Connect Request:

ACTIVE
├── Learner cancels early
│ → CANCELLED
├── Tutor does not respond within SLA
│ → TIMEOUT
├── Parties do not continue after discussion/trial
│ → CLOSED
└── Class/Learning Contract created
→ CONVERTED_TO_CLASS

Chat Room:

ACTIVE
├── Connection cancelled, timed out or unsuccessful
│ → CLOSED
└── Class/Learning Contract created
→ CONVERTED_TO_CLASS

Connect button eligibility:

- ACTIVE → canCreateAnotherConnection = false
- CLOSED → true
- CANCELLED → true
- TIMEOUT → true
- CONVERTED_TO_CLASS → true

================================================================ 13. ACCEPTANCE CRITERIA CỐT LÕI
================================================================

AC-01
Khi Learner không có Connect Request ACTIVE và xác nhận Connect, hệ thống tạo đúng một Connect Request ACTIVE và đúng một Chat Room ACTIVE có đủ Learner, Tutor và Consultant.

AC-02
Ngay sau khi tạo room thành công, FE vô hiệu hóa Connect trên các Tutor khác và điều hướng Learner đến Chat Room hiện tại.

AC-03
Tutor có thể mở room và gửi tin nhắn ngay.

AC-04
Khi Tutor gửi tin nhắn đầu tiên, connectionStage chuyển từ WAITING_FOR_TUTOR sang DISCUSSING.

AC-05
Nếu Learner gửi hai request đồng thời, backend chỉ cho phép một kết nối self-service ACTIVE; request còn lại nhận HTTP 409.

AC-06
Khi Connect Request chuyển thành CLOSED, CANCELLED, TIMEOUT hoặc CONVERTED_TO_CLASS, eligibility trả canCreateConnection = true.

AC-07
Khi Consultant xác nhận hai bên đồng ý học, Class/Learning Contract được tạo, Connect Request và Chat Room chuyển sang CONVERTED_TO_CLASS, và Class ở PENDING_PAYMENT.

AC-08
Kết nối bổ sung trong lúc đang ACTIVE chỉ được tạo bởi Consultant/Admin có quyền override và phải có audit log.
