import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    const data = await req.json();
    const res = await fetch(`${process.env.API_BASE_URL}/payments/bingwa-stk-push`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payment request successful, check your phone" });
}