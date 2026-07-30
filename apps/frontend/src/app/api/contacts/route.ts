import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/get-multi`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const data = await res.json();
  // console.log("Contacts API Response:", data);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from FastAPI" },
      { status: res.status }
    );
  }

  //   const data = await res.json();
  return NextResponse.json(data);
}
