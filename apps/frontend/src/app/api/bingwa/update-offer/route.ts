import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bingwa/update/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
