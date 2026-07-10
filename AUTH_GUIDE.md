# Hướng Dẫn Cấu Hình Authentication & Proxy (Monorepo BeeWise)

Tài liệu này hướng dẫn cách sử dụng hệ thống Authentication (Cookie-based), các custom hooks (`useLogin`, `useGetMe`, `useLogout`) và cách cấu hình Proxy cho một Next.js App mới trong hệ thống monorepo BeeWise.

---

## 1. Tổng Quan Kiến Trúc Authentication

Hệ thống BeeWise sử dụng **Cookie-based Authentication** kết hợp với **HttpOnly Cookies** để bảo mật (`beewise_access_token` và `beewise_refresh_token`).

- **Không lưu token ở LocalStorage/SessionStorage:** Client không tự lưu hay gắn token vào Header của request.
- **Tự động gửi Cookie:** Mọi API Request gửi đi từ client lên backend sẽ tự động đính kèm cookie nhờ thuộc tính `withCredentials: true` cấu hình sẵn trong `apiClient` của `@workspace/core`.
- **Giải pháp CORS:** Do Cookie bảo mật HttpOnly không thể tự động gửi chéo domain một cách dễ dàng ở môi trường local, tất cả các Next.js app phải sử dụng cơ chế **Proxy/Rewrite** để gom tất cả các API Request về cùng origin (ví dụ: `http://localhost:3001/api/*` trỏ về API Backend thực tế `http://localhost:8080/api/*`).

---

## 2. Cấu Hình Proxy & Điều Hướng (Next.js App Mới)

Khi tạo một Next.js App mới (ví dụ: `apps/sale`, `apps/staff`), bạn cần thực hiện 2 cấu hình bắt buộc sau:

### Bước A: Cấu hình `next.config.ts` (Rewrites)

Để chuyển tiếp các request `/api/*` từ client về đúng Port của Server Backend:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/core"],
  async rewrites() {
    return [
      {
        // Chuyển hướng các request client gọi đến /api/xyz về Backend API thực tế
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

### Bước B: Tạo file `proxy.ts` (Middleware phân luồng & Bảo vệ Route)

Next.js 16 sử dụng file `proxy.ts` nằm ở thư mục root của App (ngang hàng với `package.json` hoặc thư mục `app/`) làm Middleware để giải mã Token trên Server-side và phân luồng người dùng:

Hãy chạy lệnh `npx @next/codemod@canary middleware-to-proxy .` ở app cần config.

Tạo file `apps/[ten-app]/proxy.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các đường dẫn public mà không cần đăng nhập
const publicPaths = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("beewise_access_token")?.value;
  const isPublicPath = publicPaths.includes(pathname);

  // 1. Nếu chưa đăng nhập và cố tình vào các route private -> chuyển hướng về /login
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Nếu đã có token và đang ở trang chủ (/) hoặc trang đệm (/lms)
  // -> Giải mã token và tự động redirect về đúng trang Dashboard theo Role
  if ((pathname === "/" || pathname === "/lms") && token) {
    let role = "LEARNER";
    try {
      // Decode JWT trên server (đọc payload dạng Base64)
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role) role = payload.role;
    } catch (e) {
      // Bỏ qua lỗi parse nếu token lỗi
    }

    // Điều hướng theo Role
    const targetUrl = role.toUpperCase() === "ADMIN" ? "/admin" : "/consultant";

    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match tất cả request paths ngoại trừ:
     * - api (các API route)
     * - _next/static, _next/image (tài nguyên tĩnh của Next.js)
     * - favicon.ico (icon)
     * - Các thư mục chứa ảnh/brand tĩnh (public/images, public/brand)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)",
  ],
};
```

---

## 3. Cách Sử Dụng Các Custom Hooks Authentication

Các Hook này được đặt chung trong package `@workspace/core/hooks` để tái sử dụng trên toàn hệ thống.

### 3.1. Hook `useLogin` (Xử lý Đăng Nhập)

Sử dụng `useLogin` tại Form đăng nhập của từng App.

- **Đặc điểm:** Không cần tự fetch thông tin user sau khi login thành công. Sau khi API `/auth/login` trả về thành công, bạn chỉ cần điều hướng về route đệm `/lms` (hoặc `/`), Middleware ở file `proxy.ts` sẽ tự động bắt lấy cookie, decode role và đưa user vào đúng Dashboard.

```tsx
import { useLogin } from "@workspace/core/hooks/useLogin";
import { useForm } from "react-hook-form";

export function LoginForm() {
  // Truyền redirectUrl mong muốn sau khi đăng nhập thành công
  const { mutate: login, isPending } = useLogin({
    redirectUrl: "/lms", // Middleware sẽ nhận diện token và điều hướng theo Role
  });

  const onSubmit = (data) => {
    login(data); // data: { email, password }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input email & password */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Đang xử lý..." : "Đăng Nhập"}
      </button>
    </form>
  );
}
```

### 3.2. Hook `useGetMe` (Lấy thông tin User & Đồng bộ State)

Dùng tại các Layout cần bảo mật (ví dụ: `apps/lms/app/lms/layout.tsx` hoặc `apps/staff/app/layout.tsx`).

- **Vai trò:** Gọi API `/auth/me` để lấy thông tin chi tiết của người dùng đang đăng nhập (như Họ tên, Email, Ảnh đại diện, Trạng thái kích hoạt) và tự động đồng bộ vào Zustand Store (`useAuthStore`).
- **Lưu ý:** Chỉ gọi hook này ở các layout của trang private/dashboard để tránh gọi API thừa ở các trang public (như Landing Page/Portal).

```tsx
"use client";
import { useGetMe } from "@workspace/core/hooks/useGetMe";
import { DashboardLayout } from "@workspace/ui/components/layout/DashboardLayout";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hook tự động fetch thông tin người dùng và lưu vào useAuthStore
  useGetMe();

  return <DashboardLayout>{children}</DashboardLayout>;
}
```

### 3.3. Hook `useLogout` (Đăng Xuất)

Dùng tại nút Đăng xuất trên thanh Topbar hoặc Menu thiết lập.

- **Vai trò:** Gọi API `/auth/logout` để server xóa Cookie, đồng thời xóa thông tin User trong Zustand Store (`useAuthStore.logout()`) và điều hướng người dùng quay trở lại trang chủ (`/`).

```tsx
import { useLogout } from "@workspace/core/hooks/useLogout";

export function UserMenu() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button onClick={() => logout()} disabled={isPending}>
      {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
```

---

## 4. Cách Lấy Thông Tin User Trong Component (Client-side)

Khi đã chạy `useGetMe()` ở layout bọc ngoài, các component con có thể lấy thông tin user bất cứ lúc nào từ Zustand Store:

```tsx
import { useAuthStore } from "@workspace/core/store/useAuthStore";

export function UserAvatar() {
  // Lấy thông tin user trực tiếp từ Zustand
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div>
      <img src={user.avatarUrl} alt={user.fullName} />
      <p>
        {user.fullName} ({user.role})
      </p>
    </div>
  );
}
```
