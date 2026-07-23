import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("beewise_access_token")?.value;
  const refreshToken = request.cookies.get("beewise_refresh_token")?.value;

  const isPublicPath = publicPaths.includes(pathname);

  if (!isPublicPath && !token && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let role = "";
  const tokenToParse = token;
  if (tokenToParse) {
    try {
      const payload = JSON.parse(atob(tokenToParse.split(".")[1]));
      if (payload?.role) role = payload.role;
    } catch (e) {
      // ignore parsing error
    }
  }

  if (role) {
    if (pathname.startsWith("/admin") && role.toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      pathname.startsWith("/consultant") &&
      role.toUpperCase() !== "CONSULTANT"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (
    (pathname === "/" || pathname === "/login" || pathname === "/staff") &&
    (token || refreshToken)
  ) {
    if (role.toUpperCase() === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (role.toUpperCase() === "CONSULTANT") {
      return NextResponse.redirect(new URL("/consultant", request.url));
    }
  }

  if ((pathname === "/staff" || pathname === "/") && !token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)"],
};
