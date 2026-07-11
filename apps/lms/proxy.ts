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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|brand).*)",
  ],
};
