import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const API_URL = process.env.API_BASE_URL;
const AUTH_SECRET = process.env.AUTH_SECRET;

const protectedRoutes = ["/dashboard"];

export async function proxy(req: NextRequest) {
  console.log("[Middleware] Hit:", req.nextUrl.pathname);

  // --- 1. Load token safely ----------------------------------------------
  const token = await getToken({ req, secret: AUTH_SECRET });

  if (!token?.accessToken) {
    console.log("[Middleware] Missing access token → redirect");
    return redirectToLogin(req);
  }

  const accessToken = token.accessToken;

  // --- 2. Check if current route is protected ----------------------------
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));

  if (!isProtected) {
    return NextResponse.next();
  }

  // --- 3. Validate session with backend ----------------------------------
  try {
    if (!API_URL) {
      console.error(
        "[Middleware] API URL missing! Check NEXT_PUBLIC_API_BASE_URL"
      );
      return redirectToLogin(req);
    }

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (res.status === 200) {
      console.log("[Middleware] Token valid → continue");
      return NextResponse.next();
    }

    // Token expired or invalid
    if (res.status === 401) {
      console.log("[Middleware] Token invalid → redirect");
      return logoutAndRedirect(req);
    }

    // Any other non-OK response (500, 503, etc.)
    if (!res.ok) {
      console.warn("[Middleware] Unexpected API response:", res.status);
      // Don't lock the user out during transient failures
      return NextResponse.next();
    }
  } catch (err) {
    // Network issues, backend down, etc.
    console.error("[Middleware] Backend validation error:", err);
    // Fail-open: allow navigation but log for alerting
    return NextResponse.next();
  }

  // --- 4. Default: continue ----------------------------------------------
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const url = new URL("/login", req.url);
  return NextResponse.redirect(url);
}

function logoutAndRedirect(req: NextRequest) {
  const response = redirectToLogin(req);

  // Clean both cookie names used by NextAuth (development + production)
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
