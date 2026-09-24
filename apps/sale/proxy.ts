import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;
  const refreshToken = request.cookies.get("beewise_refresh_token")?.value;

  let role = "";
  const tokenToParse = token || refreshToken;

  if (tokenToParse) {
    try {
      const base64Payload = tokenToParse
        .split(".")[1]
        ?.replace(/-/g, "+")
        .replace(/_/g, "/");

      if (base64Payload) {
        const payload = JSON.parse(atob(base64Payload));
        if (payload?.role) {
          role = String(payload.role).toUpperCase();
        }
      }
    } catch {
      // Bỏ qua lỗi parse token nếu không hợp lệ
    }
  }

  // Chặn gia sư vào trang root (trang chủ chỉ dành cho học viên và khách) -> chuyển hướng về /tutor/home
  if (pathname === "/" && role === "TUTOR") {
    return NextResponse.redirect(new URL("/tutor/home", request.url));
  }

  // Nếu gia sư đã đăng nhập và truy cập các trang auth (/login, /register) -> chuyển hướng về /tutor/home
  if ((pathname === "/login" || pathname === "/register") && role === "TUTOR") {
    return NextResponse.redirect(new URL("/tutor/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match tất cả request paths ngoại trừ:
     * - api (các API route)
     * - _next/static, _next/image (tài nguyên tĩnh của Next.js)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.json
     * - Các thư mục static assets (brand, demos, favicon, icons, images, video)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|brand|demos|favicon|icons|images|video).*)",
  ],
};
