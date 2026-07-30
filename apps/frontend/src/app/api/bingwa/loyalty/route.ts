import axiosClient from "@/lib/axios";
import { NextResponse } from "next/server";
import { bingwaOffersArraySchema } from "@/schemas";

export async function GET() {
  const res = await axiosClient.get("/bingwa/loyalty-offers");
  // console.log(res.data);

  if (!res.data.success) {
    return NextResponse.json(res.data, { status: 500 });
  }

  const parsed = bingwaOffersArraySchema.safeParse(res.data.data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 500 });
  }

  return NextResponse.json(parsed.data, { status: 200 });
}
