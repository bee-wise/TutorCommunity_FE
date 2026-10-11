# Google Authentication trên Sale và LMS

Google login hoạt động trên Sale và LMS. BE chưa hỗ trợ Google login cho Staff, nên Staff tiếp tục dùng mật khẩu BeeWise.

## Chạy local

1. Điền `NEXT_PUBLIC_API_BASE_URL=https://localhost:7235` và Google Web Client ID trong `.env.local` của cả `apps/sale` và `apps/lms` (xem `.env.example`). LMS cần thêm `NEXT_PUBLIC_SALE_BASE_URL=https://localhost:3000`.
2. Chạy `npm run dev:https -w sale` và `npm run dev:https -w lms`. Tin cậy chứng chỉ HTTPS local của FE và BE.
3. Thêm `https://localhost:3000` và `https://localhost:3001` vào Google Authorized JavaScript origins và `Cors:AllowedOrigins` của BE.

FE gọi `/api/auth/google/*` cùng origin. Next rewrite chuyển tiếp tới API đã cấu hình. Các POST dùng cookie, `Content-Type: application/json` và `X-BeeWise-CSRF: 1`. Không cấu hình FE local gọi trực tiếp API test khác site vì cookie giao dịch `SameSite=Lax` sẽ không đi theo. Với môi trường test, triển khai FE trên HTTPS dưới `beewise.vn` và cấu hình API/proxy cùng site; đặt `NEXT_PUBLIC_SALE_BASE_URL` thành origin Sale tương ứng.

Nút Google dùng GIS popup. FE lấy challenge mới cho mỗi lần bắt đầu lại, exchange mỗi ID token một lần, và chỉ lưu tài khoản trả từ `/auth/me` sau khi BE đặt cookie đăng nhập. Nếu BE trả `REGISTRATION_REQUIRED`, Sale mở form hoàn tất đăng ký; LMS dẫn sang Sale. Nếu trả `LINK_REQUIRED`, FE yêu cầu mật khẩu BeeWise và đồng ý liên kết. Staff không gửi Google challenge.

Nút GIS và nút Đăng nhập/Đăng ký cùng chiều cao 40px, chiếm toàn bộ chiều rộng form tới tối đa 400px. Đường dẫn quên mật khẩu trên LMS mở luồng khôi phục tại `/forgot-password` của LMS.
