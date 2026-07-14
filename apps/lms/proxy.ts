import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;

  const isPublicPath = publicPaths.includes(pathname);

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu truy cập trang login hoặc trang chủ /lms mà đã có token -> phân luồng theo role
  if ((pathname === "/" || pathname === "/lms") && token) {
    let role = "LEARNER";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role) role = payload.role;
    } catch (e) {
      // ignore parsing error
    }

    const targetUrl =
      role.toUpperCase() === "TUTOR" ? "/lms/tutor" : "/lms/learner";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)"],
};
