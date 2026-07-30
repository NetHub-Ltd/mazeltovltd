import { NextResponse } from "next/server";
import axiosClient from "@/lib/axios";
import { bingwaOffersArraySchema } from "@/schemas";

const backendUrl = process.env.API_BASE_URL;

export async function GET(request: Request) {
  try {
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not found" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let endpoint: string;

    if (category) {
      // call category-specific endpoint
      endpoint = `${backendUrl}/bingwa/offers-by-category/${category}`;
    } else {
      // call get-all endpoint
      endpoint = `${backendUrl}/bingwa/get-all`;
    }

    const res = await axiosClient.get(endpoint);

    if (!res.data.success) {
      return NextResponse.json({ error: res.data.message }, { status: 400 });
    }

    const parsed = bingwaOffersArraySchema.safeParse(res.data.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    return NextResponse.json(parsed.data);
  } catch (err) {
    console.error("Bingwa Fetch Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
