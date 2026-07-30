// route to remove an offer
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  if (!data.id) {
    return NextResponse.json({ error: "Missing offer ID" }, { status: 400 });
  }

  const id = data.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bingwa/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to delete offer with ID:", id);
    return NextResponse.json({ success: false });
  }

  console.log("Successfully deleted offer with ID:", id);
  return NextResponse.json({ success: true, id });
}
