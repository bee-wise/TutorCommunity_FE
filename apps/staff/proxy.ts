import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;

  const isPublicPath = publicPaths.includes(pathname);

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let role = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role) role = payload.role;
    } catch (e) {
      // ignore parsing error
    }
  }

  // Nếu truy cập trang login hoặc trang chủ hoặc /staff mà đã có token -> phân luồng theo role
  if (
    (pathname === "/" || pathname === "/login" || pathname === "/staff") &&
    token
  ) {
    if (role.toUpperCase() === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (role.toUpperCase() === "CONSULTANT") {
      return NextResponse.redirect(
        new URL("/consultant/dashboard", request.url),
      );
    }
  }

  // Nếu pathname là /staff hoặc / mà không có token
  if ((pathname === "/staff" || pathname === "/") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)"],
};
