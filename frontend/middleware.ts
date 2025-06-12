import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/onboarding"];
  const requiresAuth = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (requiresAuth) {
    const token = req.cookies.get("token");
console.log("hi",token);

    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/"; // Or redirect to /signin
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/onboarding"],
};
