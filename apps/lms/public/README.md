# Thư mục Public dùng chung (Shared Public)

Thư mục này chứa tất cả các tài nguyên tĩnh (`images`, `brand`, `fonts`, `favicon.ico`, v.v.) dùng chung cho toàn bộ các ứng dụng (apps) trong hệ thống BeeWise.

## Cơ Chế Hoạt Động

Trong Next.js, mỗi app yêu cầu một thư mục `public` nằm ngay tại root của app đó (ví dụ `apps/lms/public`).
Thay vì phải copy-paste ảnh bằng tay mỗi khi thêm mới, hệ thống đã được cấu hình cơ chế tự động đồng bộ:

1. Bạn chỉ cần thả các file tĩnh mới vào trong thư mục `packages/public` này.
2. Tại các file `package.json` của mỗi app (ví dụ `apps/lms/package.json`), đã có gắn hook script:
   ```json
   "predev": "node ../../scripts/copy-public.js",
   "prebuild": "node ../../scripts/copy-public.js"
   ```
3. Khi bạn chạy lệnh `npm run dev` hoặc `npm run build`, đoạn script sẽ tự động quét thư mục `packages/public` và **copy (đồng bộ)** toàn bộ vào thư mục `public` của từng app tương ứng.

## Hướng Dẫn Sử Dụng
*   **Thêm Ảnh / Icon mới:** Bỏ vào `packages/public/images` hoặc `packages/public/brand`.
*   **Sử dụng trong Code (Client / Server Component):** Sử dụng đường dẫn bình thường như không có gì thay đổi, bắt đầu bằng `/`.
    ```tsx
    <Image src="/brand/beewise-logo.png" alt="Logo" width={100} height={100} />
    ```
*   **Không chỉnh sửa file ở `apps/*/public`:** Vì mọi thứ bên trong thư mục `public` của từng app sẽ bị ghi đè bởi thư mục này khi chạy lại lệnh dev/build.
*   **Lưu ý:** Lần đầu tiên sau khi thả file mới vào `packages/public`, bạn cần tắt Terminal đang chạy `npm run dev` và bật lại (hoặc chạy lệnh thủ công nếu muốn) để script copy file hoạt động.
