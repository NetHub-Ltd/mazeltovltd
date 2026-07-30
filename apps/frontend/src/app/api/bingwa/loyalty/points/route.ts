import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const phone = request.nextUrl.searchParams.get("phone");
    if (!phone) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const res = await fetch(`${process.env.API_BASE_URL}/loyalty/points?phone=${phone}`);
    const data = await res.json();

    if (!data.success) {
        return NextResponse.json(data, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });

}