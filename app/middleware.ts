import { NextRequest, NextResponse } from "next/server";

const roleRoutes = {
  ADMIN: ["/admin"],
  CONSULTANT: ["/consultant"],
  TUTOR: ["/lms/tutor"],
  LEARNER: ["/lms/learner"],
} as const;

export function middleware(request: NextRequest) {
  //   const token = request.cookies.get("accessToken")?.value;
  //   const role = request.cookies.get("role")?.value;
  const token = true;
  const role = "TUTOR";

  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] ?? [];

  const canAccess = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!canAccess) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/consultant/:path*",
    "/lms/tutor/:path*",
    "/lms/learner/:path*",
  ],
};
