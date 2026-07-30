import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  try {
    // Send POST request server-side using fetch
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/bingwa/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data), // only stringify once
      }
    );

    // console.log("Response status:", res);

    const result = await res.json();

    if (res.status !== 201) {
      return NextResponse.json(
        { error: result.statusText || "Something went wrong" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Bingwa offer created successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
