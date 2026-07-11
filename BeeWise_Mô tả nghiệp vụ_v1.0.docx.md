

**BEEWISE**

**Mô tả nghiệp vụ tổng quan hệ thống**

Sale Page | LMS | Operations Portal

| Dự án | BeeWise |
| :---- | :---- |
| **Loại tài liệu** | Business Overview / Mô tả nghiệp vụ chính |
| **Phiên bản** | 1.0 |
| **Ngày cập nhật** | 08/07/2026 |
| **Đối tượng sử dụng** | Product Owner, BA, Dev, QA, UI/UX, Consultant, Admin, thành viên nhóm dự án |

# 

# **1\. Mục đích và phạm vi tài liệu**

Tài liệu này mô tả nghiệp vụ chính của hệ thống BeeWise ở mức tổng quan, tập trung vào ba phân hệ trọng tâm: **Sale Page**, **LMS** và **Operations Portal dành cho Admin & Consultant**.

# **2\. Kiến trúc nghiệp vụ tổng quan**

BeeWise nên được tổ chức thành ba phân hệ chính, trong đó Operations Portal là hệ thống nội bộ dùng chung cho Admin và Consultant nhưng phân quyền theo vai trò.

| Phân hệ | Người dùng | Mục tiêu nghiệp vụ | Kết quả đầu ra | Đánh giá |
| :---- | :---- | :---- | :---- | :---- |
| Sale Page | Guest, Learner, Tutor mới | Giới thiệu BeeWise, tìm kiếm gia sư, AI Search, đăng ký, đăng nhập, bắt đầu kết nối | Lead, tài khoản Learner/Tutor, yêu cầu kết nối | Trang chủ chính thức và nằm trong MVPB. |
| LMS | Learner, Tutor | Quản lý lớp học sau khi kết nối thành công | Lịch học, tài liệu, học phí, thanh toán, lịch sử lớp học |  Trang quản lý quá trình học sau khi kết nối thành công. Trong MVPB chỉ cần ở mức mockUI.  |
| Operations Portal | Admin, Consultant | Vận hành, xác thực, điều phối kết nối, theo dõi chất lượng | Hồ sơ được duyệt, chat được hỗ trợ, lớp học được kích hoạt, dữ liệu vận hành |  Bao gồm 2 role là admin và consultant. Trong MVPB, consultant cần hoàn thiện chức năng phê duyệt profile gia sư và hỗ trợ kết nối học viên trong chat room.  |

| Nguyên tắc thiết kế Sale Page không nên ôm nghiệp vụ quản lý học tập; LMS không nên ôm nghiệp vụ tìm kiếm công khai; Operations Portal không nên để Learner/Tutor truy cập trực tiếp. Mỗi phân hệ có mục đích riêng và được nối với nhau bằng trạng thái nghiệp vụ rõ ràng. |
| :---- |

# **3\. Phân hệ Sale Page**

Sale Page là trang công khai dành cho người dùng bên ngoài. Đây là nơi Guest, Learner và Tutor mới tiếp cận BeeWise, tìm hiểu dịch vụ và bắt đầu luồng đăng ký hoặc kết nối.

## **3.1 Guest**

Guest là người dùng chưa đăng nhập. Guest vẫn cần được trải nghiệm đầy đủ phần khám phá dịch vụ để tăng khả năng chuyển đổi.

* Xem mô tả BeeWise và giá trị nền tảng mang lại.  
* Tìm kiếm gia sư bằng bộ lọc thủ công.  
* Tìm kiếm gia sư bằng AI Search theo nhu cầu tự nhiên.  
* Xem danh sách và hồ sơ công khai của các Tutor đã được xác thực.  
* Thấy CTA đăng ký trở thành gia sư.  
* Truy cập Sign in/Login hoặc Register.

## **3.2 Learner**

Learner là người học hoặc phụ huynh có nhu cầu tìm gia sư. Khi Learner đăng nhập, hệ thống cần ưu tiên continuity của hành trình người dùng.

| Quy tắc redirect sau đăng nhập Nếu Learner đang xem một vị trí trên Sale Page, đang xem hồ sơ Tutor hoặc đang chuẩn bị kết nối trước khi đăng nhập, hệ thống phải đưa Learner quay lại đúng vị trí hoặc hành động trước đó sau khi đăng nhập thành công. |
| :---- |

\! **Importance:** Learner login xong vẫn ở Sale Page, nhưng Sale Page trở thành trang tìm kiếm và kết nối gia sư cho Learner. Learner có thể xem/ sử dụng được các tính năng/nội dung sau:

1. Giới thiệu BeeWise   
2. Tìm kiếm gia sư bằng AI   
3. Tìm kiếm gia sư thủ công   
4. Danh sách gia sư   
5. Profile detail gia sư   
6. Trang profile Learner   
7. Kết nối gia sư qua Chat Room   
8. Tin nhắn / Chat Room   
9. Lịch sử kết nối   
10. Lưu hồ sơ gia sư yêu thích   
11. Thông báo   
12. CTA vào LMS nếu đã có lớp học 

## **3.3 Tutor**

Tutor mới sau khi đăng ký hoặc đăng nhập không đi thẳng vào LMS. Tutor cần hoàn thành quy trình onboarding và xác thực hồ sơ trước khi được cấp quyền LMS dành cho gia sư.

| Giai đoạn | Mô tả | Trạng thái đầu ra |
| :---- | :---- | :---- |
| 1\. Tạo tài khoản | Tutor đăng ký tài khoản trên Sale Page | Account created |
| 2\. Điền hồ sơ gia sư \+ thanh toán 50k/6 tháng | Tutor điền form đăng ký hồ sơ gia sư chuyên nghiệp | Profile submitted |
| 3\. Tham gia phỏng vấn | Tutor tham gia phỏng vấn/xác nhận chất lượng theo quy trình BeeWise | Interview completed |
| 4\. Chờ xác thực | Consultant kiểm tra hồ sơ và kết quả phỏng vấn | Pending verification |
| 5\. Được duyệt | Hồ sơ đạt yêu cầu và được phép hiển thị công khai | Approved |
| 6\. Bổ sung thông tin sau duyệt  | Gia sư cập nhật **lịch rảnh có thể nhận lớp** và **thông tin tài khoản nhận thanh toán**.  | Post-approval info completed  |
| 7\. Cấp quyền LMS | Hệ thống kích hoạt quyền truy cập LMS cho tài khoản BeeWise hiện có.  | Tutor LMS access enabled |

# **\! Importance:** Tutor login xong không đi thẳng vào LMS nếu chưa được duyệt. Sau khi Tutor đăng nhập, hệ thống cần kiểm tra trạng thái onboarding và trạng thái hồ sơ để điều hướng đến màn hình phù hợp. Tutor có thể xem/sử dụng các tính năng hoặc nội dung sau tùy theo trạng thái tài khoản:

* # Trang bắt đầu onboarding gia sư theo dạng chuỗi 1 \- 2 \- 3 \- 4

* # Form đăng ký hồ sơ gia sư

* # Trang trạng thái hồ sơ

* # Thông báo hồ sơ đã gửi và đang chờ xử lý

* # Hướng dẫn hoặc lịch tham gia phỏng vấn

* # Trạng thái chờ Consultant xác thực

* # Lý do từ chối nếu hồ sơ bị Rejected

* # Chức năng chỉnh sửa và gửi lại hồ sơ

* # Thông báo hồ sơ đã được duyệt

* # CTA vào LMS nếu hồ sơ đã Approved

# **4\. Nghiệp vụ kết nối qua Chat Room**

Tại Sale Page, Learner kết nối với Tutor thông qua phòng chat. Phòng chat là điểm chuyển tiếp giữa nhu cầu tìm gia sư và việc hình thành lớp học thật.

1\. Learner chọn Tutor muốn kết nối từ kết quả tìm kiếm hoặc hồ sơ Tutor.

2\. Nếu Learner chưa đăng nhập, hệ thống yêu cầu đăng nhập/đăng ký và sau đó quay lại đúng luồng kết nối.

3\. Hệ thống tạo Chat Room gồm Learner, Tutor và Consultant được phân công.

4\. Consultant hỗ trợ hai bên trao đổi về nhu cầu học, lịch học, học phí, hình thức học và các điều kiện liên quan.

5\. Nếu Learner và Tutor đồng ý học, Consultant xác nhận kết nối thành công.

6\. Hệ thống tạo Class/Learning Contract. Nếu Class/Learning Contract được kích hoạt, hệ thống mở quyền LMS cho Learner. Tutor đã được mở quyền LMS từ giai đoạn hồ sơ Approved; hệ thống chỉ liên kết lớp mới vào LMS của Tutor.

## **4.1 Phân công Consultant**

| Tiêu chí phân công | Ý nghĩa |
| :---- | :---- |
| Lịch làm việc | Chỉ phân công Consultant đang trong ca trực hoặc có lịch làm việc phù hợp |
| Tải công việc | Ưu tiên Consultant đang xử lý ít phòng chat hơn để tránh quá tải |
| Lịch sử hỗ trợ | Nếu Learner đã từng được một Consultant hỗ trợ, nên ưu tiên giữ cùng Consultant để đảm bảo continuity |

## **4.2 Class/Learning Contract**

Class/Learning Contract là thực thể trung gian cần có sau khi Learner và Tutor đồng ý học. Đây là điểm nối dữ liệu giữa Chat Room và LMS.

| Thông tin cần có | Mục đích |
| :---- | :---- |
| Learner | Xác định người học hoặc phụ huynh tham gia lớp |
| Tutor | Xác định gia sư phụ trách lớp |
| Consultant owner | Xác định Consultant chịu trách nhiệm theo dõi kết nối/lớp học |
| Subject | Xác định môn học hoặc nhóm nội dung học |
| Schedule | Làm căn cứ tạo lịch học trên LMS |
| Fee | Làm căn cứ quản lý học phí, commission và thanh toán |
| Payment status | Kiểm soát trạng thái chờ thanh toán, đã thanh toán hoặc cần xử lý |
| Class status | Theo dõi Pending Payment, Active, Paused, Completed hoặc Cancelled |

# 

# **5\. Phân hệ LMS**

LMS là phân hệ quản lý quá trình học tập sau khi kết nối đã được xác nhận. LMS không phải là nơi tìm kiếm gia sư công khai, mà là môi trường vận hành lớp học giữa Learner và Tutor.

| Nhóm người dùng | Chức năng chính trong LMS |
| :---- | :---- |
| Learner | Xem lớp học đang tham gia, lịch học, tài liệu, học phí, trạng thái thanh toán, lịch sử kết nối và thông tin hỗ trợ từ Consultant |
| Tutor | Quản lý lớp được nhận, xem lịch dạy, cập nhật tài liệu học tập, theo dõi học phí, xem lịch sử kết nối và cập nhật nội dung liên quan đến buổi học |

\! **Importance: Rule cấp quyền truy cập từ tài khoản trên Sale Page vào LMS:**

| Role | Tạo tài khoản khi nào? | Được mở quyền LMS khi nào? |
| ----- | ----- | ----- |
| **Learner** | Khi đăng ký/login trên Sale Page | Khi có **Class/Learning Contract** được kích hoạt |
| **Tutor** | Khi đăng ký tài khoản trên Sale Page | Khi hồ sơ Tutor được **Approved** sau onboarding/phỏng vấn |
| **Admin** | Tài khoản nội bộ | Không dùng LMS, dùng Operations Portal |
| **Consultant** | Tài khoản nội bộ | Không dùng LMS, dùng Operations Portal |

* *Tutor Approved → mở LMS cho Tutor.*  
* *Learner Registered → chưa mở LMS.*  
* *Learner \+ Tutor kết nối thành công → tạo Class/Learning Contract.*  
* *Class Active → mở LMS cho Learner.*

\! **Importance: Chỉ sử dụng 1 account duy nhất**

## **5.1 Nhóm chức năng LMS cần có**

* **Quản lý lịch học:** xem lịch, cập nhật lịch, theo dõi trạng thái buổi học.  
* **Kho tài liệu:** Tutor đăng tài liệu, Learner truy cập tài liệu theo lớp.  
* **Học phí và thanh toán:** hiển thị phí, trạng thái thanh toán, lịch sử thanh toán.  
* **Lịch sử kết nối:** lưu lại thông tin Tutor, Learner, Consultant, thời điểm xác nhận học và lịch sử lớp.  
* **Trạng thái lớp học:** Pending Payment, Active, Paused, Completed, Cancelled.  
* **Theo dõi chất lượng học tập:** lesson report, attendance, feedback và hỗ trợ từ Consultant trong giai đoạn đầu.

| Trigger đề xuất Luồng tối ưu là: Đồng ý học → Consultant tạo Class/Learning Contract → Consultant/Mock payment xác nhận trạng thái thanh toán → Class status \= Active → Hệ thống mở LMS cho Learner  |
| :---- |

# **6\. Operations Portal dành cho Admin & Consultant**

Operations Portal là hệ thống nội bộ dành cho đội ngũ vận hành BeeWise. Learner và Tutor không sử dụng phân hệ này trực tiếp. Bên trong Operations Portal, hệ thống phân quyền theo vai trò Admin và Consultant.

## **6.1 Admin**

Admin là người quản trị cấp hệ thống, có quyền theo dõi và kiểm soát vận hành toàn nền tảng.

| Nhóm chức năng | Mô tả |
| :---- | :---- |
| Quản lý Consultant | Tạo/sửa tài khoản Consultant, quản lý trạng thái hoạt động, phân ca, lịch làm việc và hiệu suất |
| Quản lý tài khoản hệ thống | Theo dõi và xử lý tài khoản Learner, Tutor, Consultant, Admin khi có vấn đề |
| Quản lý vận hành | Theo dõi số lượng search, AI Search, connect, chat, hồ sơ chờ duyệt, lớp đang hoạt động |
| Quản lý cấu hình | Thiết lập timeout phản hồi, rule thông báo, trạng thái xử lý kết nối hoặc lớp học |
| Quản lý rủi ro | Khóa tài khoản, ẩn hồ sơ gia sư, xem audit log, xử lý trường hợp vi phạm hoặc khiếu nại |

## **6.2 Consultant**

Consultant là nhân sự vận hành trực tiếp trong ba giai đoạn: xác thực Tutor, hỗ trợ kết nối và theo dõi lớp học sau khi kết nối thành công.

| Giai đoạn | Nhiệm vụ của Consultant | Kết quả đầu ra |
| :---- | :---- | :---- |
| Xác thực Tutor | Kiểm tra hồ sơ, minh chứng, thông tin đăng ký và kết quả phỏng vấn; duyệt hoặc từ chối hồ sơ kèm lý do | Tutor Approved/Rejected |
| Hỗ trợ kết nối | Tham gia Chat Room được phân công; hỗ trợ Learner và Tutor làm rõ nhu cầu, lịch học, học phí, hình thức học | Kết nối rõ điều kiện học |
| Kích hoạt lớp học | Xác nhận khi hai bên đồng ý học; kích hoạt quy trình tạo Class/Learning Contract và cấp quyền LMS | Class created / LMS access enabled |
| Theo dõi sau kết nối | Tiếp tục theo dõi lớp mình đã hỗ trợ trong giai đoạn đầu; xử lý vấn đề, kiểm tra feedback và hỗ trợ duy trì chất lượng | Lớp học ổn định hơn |

# **7\. Luồng nghiệp vụ tổng quan**

Luồng nghiệp vụ tổng quan của BeeWise được mô tả như sau:

1\. Guest truy cập Sale Page để tìm hiểu BeeWise, tìm kiếm gia sư hoặc sử dụng AI Search.

2\. Nếu Guest muốn kết nối với Tutor, hệ thống yêu cầu đăng nhập hoặc đăng ký Learner.

3\. Sau khi đăng nhập, Learner được đưa lại đúng vị trí hoặc hành động trước đó trên Sale Page.

4\. Learner chọn Connect với Tutor, hệ thống tạo Chat Room gồm Learner, Tutor và Consultant được phân công.

5\. Consultant hỗ trợ hai bên trao đổi, thống nhất nhu cầu học, lịch học, học phí và điều kiện học.

6\. Nếu hai bên đồng ý học, Consultant xác nhận kết nối thành công.

7\. Hệ thống tạo Class/Learning Contract, kiểm tra trạng thái thanh toán và cấp quyền LMS cho Learner khi đủ điều kiện. (Tutor đã được cấp quyền truy cập LMS ở bước approved hồ sơ)

8\. Learner và Tutor sử dụng LMS để quản lý lịch học, tài liệu, học phí, thanh toán và lịch sử kết nối.

9\. Consultant tiếp tục theo dõi lớp học mình đã hỗ trợ trong giai đoạn đầu.

10\. Admin theo dõi vận hành, quản lý Consultant, tài khoản, cấu hình hệ thống, dashboard và rủi ro.

## **7.1 Luồng Tutor onboarding**

| Tutor onboarding Tạo tài khoản \-\> Điền hồ sơ gia sư \-\> Tham gia phỏng vấn \-\> Chờ xác thực \-\> Được duyệt \-\> Được cấp quyền LMS dành cho Tutor \-\> Hồ sơ có thể xuất hiện trên Sale Page. |
| :---- |

## **7.2 Luồng Learner kết nối**

| Learner connection flow Tìm kiếm gia sư/AI Search \-\> Xem hồ sơ Tutor \-\> Đăng nhập nếu cần \-\> Connect \-\> Chat Room 3 bên \-\> Consultant hỗ trợ \-\> Đồng ý học \-\> Tạo Class/Learning Contract \-\> Thanh toán/kích hoạt \-\> Vào LMS. |
| :---- |

# **8\. Nghiệp vụ thu phí BeeWise**

## BeeWise có 2 nguồn thu chính:

|  | Loại phí | Đối tượng trả | Cách hoạt động |
| ----- | ----- | ----- | ----- |
| Miễn phí 50 hồ sơ đầu tiên. | Phí hiển thị hồ sơ | Gia sư | Gia sư trả 50.000 VNĐ / 6 tháng để hồ sơ được hiển thị công khai. Hết hạn nếu không gia hạn thì hồ sơ bị ẩn. |
| Trong MVP, tạm thời cho qua. Consultant xác nhận phụ huynh đã thanh toán. | Phí dịch vụ kết nối | Phụ huynh/học viên | BeeWise thu 20% phí dịch vụ khi học phí được xác nhận và hai bên thống nhất học chính thức. |

### **Xác nhận học phí trong khung chat**

## Việc xác nhận học phí được thực hiện trong khung chat giữa Consultant, phụ huynh/học viên và gia sư.

## Luồng xử lý:

1. ## Gia sư trao đổi học phí với phụ huynh/học viên trong chat.

2. ## Consultant hỗ trợ xác nhận thông tin học phí, lịch học và điều kiện học.

3. ## Khi hai bên đồng ý học chính thức, học phí được chốt trong chat.

4. ## Từ thời điểm học phí được xác nhận, hệ thống bắt đầu tính 20% phí dịch vụ BeeWise.

5. ## Phụ huynh/học viên thanh toán cho BeeWise theo mức giá đã cộng phí dịch vụ.

6. ## BeeWise giữ lại phần phí dịch vụ và thanh toán phần học phí thực nhận cho gia sư theo kỳ đối soát.

### **Cách tính phí dịch vụ**

## Gia sư nhập hoặc xác nhận mức học phí mong muốn thực nhận.

## Ví dụ:

| Thành phần | Số tiền |
| ----- | ----- |
| Học phí gia sư xác nhận | 100.000 VNĐ/giờ |
| Phí dịch vụ BeeWise 20% | 20.000 VNĐ/giờ |
| Giá phụ huynh/học viên thanh toán | 120.000 VNĐ/giờ |
| Gia sư thực nhận | 100.000 VNĐ/giờ |
| BeeWise giữ lại | 20.000 VNĐ/giờ |

## 

| Nhóm / Phân hệ | Nội dung trong MVPB | Role sử dụng | Mức độ MVPB |
| ----- | ----- | ----- | :---: |
| **Sale Page** | Trang giới thiệu BeeWise, mô tả giá trị nền tảng, quy trình tìm gia sư | Guest, Learner, Tutor mới | MVPB |
| **Sale Page** | Tìm kiếm gia sư bằng bộ lọc thủ công | Guest, Learner | MVPB |
| **Sale Page** | Tìm kiếm gia sư bằng AI Search | Guest, Learner | MVPB |
| **Sale Page** | Hiển thị danh sách gia sư đã được xác thực | Guest, Learner | MVPB |
| **Sale Page** | Trang chi tiết profile gia sư | Guest, Learner | MVPB |
| **Sale Page** | Sign in / Login / Register | Guest, Learner, Tutor | MVPB |
| **Sale Page** | CTA đăng ký trở thành gia sư | Guest, Tutor mới | MVPB |
| **Learner trên Sale Page** | Sau login, Learner vẫn ở Sale Page và tiếp tục tìm kiếm/kết nối gia sư | Learner | MVPB |
| **Learner trên Sale Page** | Redirect về đúng vị trí/hành động trước khi login | Learner | MVPB |
| **Learner trên Sale Page** | Trang profile Learner | Learner | MVPB |
| **Learner trên Sale Page** | Lưu hồ sơ gia sư yêu thích | Learner | MockUI |
| **Learner trên Sale Page** | Tin nhắn / danh sách Chat Room | Learner | MVPB |
| **Learner trên Sale Page** | Lịch sử kết nối | Learner | MVPB |
| **Learner trên Sale Page** | Thông báo trạng thái kết nối | Learner | MVPB |
| **Learner trên Sale Page** | CTA vào LMS nếu đã có lớp học | Learner | MVPB |
| **Tutor Onboarding** | Tutor đăng ký tài khoản trên Sale Page | Tutor mới | MVPB |
| **Tutor Onboarding** | Tutor điền form đăng ký hồ sơ gia sư | Tutor mới | MVPB |
| **Tutor Onboarding** | Tutor tham gia phỏng vấn / xác nhận chất lượng | Tutor mới, Consultant | MVPB |
| **Tutor Onboarding** | Consultant kiểm tra hồ sơ và kết quả phỏng vấn | Consultant | MVPB |
| **Tutor Onboarding** | Consultant duyệt hoặc từ chối hồ sơ Tutor | Consultant | MVPB |
| **Tutor Onboarding** | Kích hoạt quyền LMS cho Tutor sau khi hồ sơ Approved | Tutor | MVPB |
| **Chat Room** | Learner chọn Tutor để kết nối | Learner | MVPB |
| **Chat Room** | Nếu chưa đăng nhập, hệ thống yêu cầu login/register rồi quay lại đúng luồng kết nối | Guest, Learner | MVPB |
| **Chat Room** | Tạo Chat Room gồm Learner, Tutor và Consultant | Learner, Tutor, Consultant | MVPB |
| **Chat Room** | Consultant được phân công theo lịch làm việc, tải công việc và lịch sử hỗ trợ | Consultant | MVPB |
| **Chat Room** | Consultant hỗ trợ trao đổi nhu cầu học, lịch học, học phí, hình thức học | Consultant, Learner, Tutor | MVPB |
| **Chat Room** | Consultant xác nhận khi Learner và Tutor đồng ý học | Consultant | MVPB |
| **Class / Learning Contract** | Tạo Class/Learning Contract sau khi hai bên đồng ý học | System, Consultant | MVPB |
| **Class / Learning Contract** | Lưu Learner, Tutor, Consultant owner, môn học, lịch học, học phí | System | MVPB |
| **Class / Learning Contract** | Quản lý Payment status | System, Consultant | MockUI |
| **Class / Learning Contract** | Quản lý Class status: Pending Payment, Active, Paused, Completed, Cancelled | System, Consultant | MVPB |
| **LMS** | LMS dành cho Learner và Tutor sau khi đủ điều kiện truy cập | Learner, Tutor | MockUI |
| **LMS** | Quản lý lịch học | Learner, Tutor | MockUI |
| **LMS** | Kho tài liệu | Learner, Tutor | MockUI |
| **LMS** | Học phí và thanh toán | Learner, Tutor | MockUI |
| **LMS** | Lịch sử kết nối/lịch sử lớp học | Learner, Tutor | MockUI |
| **LMS** | Theo dõi chất lượng học tập: lesson report, attendance, feedback | Learner, Tutor, Consultant | MockUI |
| **LMS Access Rule** | Một tài khoản BeeWise dùng chung toàn hệ thống | All roles | MVPB |
| **LMS Access Rule** | Tutor được mở LMS khi hồ sơ Approved | Tutor | MVPB |
| **LMS Access Rule** | Learner được mở LMS khi Class/Learning Contract Active | Learner | MVPB |
| **Operations Portal** | Hệ thống nội bộ cho Admin và Consultant | Admin, Consultant | MockUI |
| **Admin** | Quản lý Consultant: tài khoản, trạng thái, lịch làm việc, hiệu suất | Admin | MVPB |
| **Admin** | Quản lý tài khoản hệ thống | Admin | MockUI |
| **Admin** | Dashboard vận hành: search, AI Search, connect, chat, hồ sơ chờ duyệt, lớp đang hoạt động | Admin | MockUI |
| **Admin** | Quản lý cấu hình: timeout phản hồi, rule thông báo, trạng thái kết nối/lớp học | Admin | MockUI |
| **Admin** | Quản lý rủi ro: khóa tài khoản, ẩn hồ sơ, audit log, xử lý vi phạm/khiếu nại | Admin | MockUI |
| **Consultant** | Xác thực hồ sơ Tutor | Consultant | MVPB |
| **Consultant** | Tham gia Chat Room được phân công | Consultant | MVPB |
| **Consultant** | Xác nhận kết nối thành công | Consultant | MVPB |
| **Consultant** | Theo dõi lớp mình đã hỗ trợ trong giai đoạn đầu | Consultant | MockUI |

