import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  let role: string | undefined;

  if (accessToken) {
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    try {
      const { payload } = await jwtVerify(accessToken, jwtSecret);

      if (typeof payload.role === "string") {
        role = payload.role;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (role === "admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (["/login", "/verify-otp", "/register", "/reset-password", "/forgot-password"].includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/verify-otp",
    "/reset-password",
    "/forgot-password"
  ]
};