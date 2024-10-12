import { jwtVerify } from "jose"; // Import the jwtVerify function from the jose library
import { NextRequest, NextResponse } from "next/server";

// Middleware function that handles both admin and auth routes
export async function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get("logged_in")?.value === "true"; // Check if the user is logged in
  const accessToken = request.cookies.get("access_token")?.value; // Retrieve the access_token from the cookie

  let role: string | undefined; // Variable to store the user role

  // Decode the access_token to get the role
  if (accessToken) {
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY); // Encode the secret for jose
    try {
      const { payload } = await jwtVerify(accessToken, jwtSecret); // Verify the token

      // Check the type of payload and assign the role
      if (typeof payload.role === "string") {
        role = payload.role; // Get the role from the payload
      }
    } catch (error) {
      console.error("Invalid token:", error); // Log error if token is invalid
    }
  }

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Check access for admin routes
  if (pathname.startsWith("/admin")) {
    if (loggedIn && role === "admin") {
      return NextResponse.next(); // Allow access to admin routes
    }
    return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
  }

  // Check access for auth routes
  if (["/login", "/verify", "/register", "/reset-password", "/forgot-password"].includes(pathname)) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home if already logged in
    }
  }

  return NextResponse.next(); // Allow access to other routes
};

// Export the config for middleware
export const config = {
  matcher: [
    "/admin/:path*", // Match all admin routes
    "/login",
    "/verify",
    "/register",
    "/reset-password",
    "/forgot-password"
  ] // Protect these routes
};