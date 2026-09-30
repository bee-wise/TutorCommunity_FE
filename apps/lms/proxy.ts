import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/robots.txt", "/sitemap.xml"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;
  const refreshToken = request.cookies.get("beewise_refresh_token")?.value;

  const isPublicPath = publicPaths.includes(pathname);
  const tokenToParse = token || refreshToken;

  if (!isPublicPath && !token && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu truy cập trang login hoặc trang chủ /lms mà đã có token -> phân luồng theo role
  if ((pathname === "/" || pathname === "/lms") && (token || refreshToken)) {
    let role = "LEARNER";

    // Ưu tiên lấy role từ token, nếu không có thì thử lấy từ refreshToken

    if (tokenToParse) {
      try {
        const payload = JSON.parse(atob(tokenToParse.split(".")[1]));
        if (payload?.role) role = payload.role;
      } catch {
        // ignore parsing error
      }
    }

    const targetUrl =
      role.toUpperCase() === "TUTOR"
        ? "/lms/tutor/dashboard"
        : "/lms/learner/schedule";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  const response = NextResponse.next();

  if (tokenToParse) {
    response.cookies.set("beewise_has_session", "1", {
      path: "/",
      sameSite: "lax",
    });
  } else if (request.cookies.has("beewise_has_session")) {
    response.cookies.delete("beewise_has_session");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)"],
};
