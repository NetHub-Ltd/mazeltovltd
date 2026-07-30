import { NextResponse } from "next/server";
// import { auth } from "@/auth"; // from your NextAuth setup
import { auth } from "@/lib/auth";
export async function GET() {
  try {
    // 1. Get session
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Proxy request to FastAPI
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    // 3. Handle FastAPI errors
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from FastAPI", details: await res.text() },
        { status: res.status }
      );
    }

    // 4. Return FastAPI JSON
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
