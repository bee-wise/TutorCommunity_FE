import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const isPublicPath = publicPaths.includes(pathname);

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
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
  matcher: [
    /*
     * Match tất cả request paths ngoại trừ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - các file tĩnh public như images, brand, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)",
  ],
};
