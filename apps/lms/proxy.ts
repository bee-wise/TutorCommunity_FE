import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getLmsRoleFromToken,
  getLmsRoleRedirectPath,
} from "./features/lms-workspace/utils/lms-role";

const publicPaths = ["/", "/login", "/robots.txt", "/sitemap.xml"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;
  const refreshToken = request.cookies.get("beewise_refresh_token")?.value;

  const isPublicPath = publicPaths.includes(pathname);
  const tokenToParse = token || refreshToken;
  const role = getLmsRoleFromToken(token) ?? getLmsRoleFromToken(refreshToken);

  if (!isPublicPath && !token && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Phân luồng sớm theo role trong cookie; /auth/me sẽ xác minh lại ở client.
  if ((pathname === "/" || pathname === "/lms") && (token || refreshToken)) {
    const targetUrl =
      role === "TUTOR"
        ? "/lms/tutor/dashboard"
        : "/lms/learner";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  if (role) {
    const targetPath = getLmsRoleRedirectPath(pathname, role);
    if (targetPath) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
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
