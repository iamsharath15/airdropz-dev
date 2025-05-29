// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes (example)
  if (pathname.startsWith("/dashboard")) {
    // Read HttpOnly cookie named 'token'
    const token = req.cookies.get("token")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/"; // redirect to home or login
      return NextResponse.redirect(url);
    }

    // Optional: You can add token validation here (e.g., JWT verification)
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
