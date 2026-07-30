import { NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
import { auth } from "@/lib/auth";
// import { saleItemSchema, transactionArraySchema } from "@/schemas/analytics";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //   const data = await req.json();

  const baseUrl = `${process.env.API_BASE_URL}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  try {
    // -------------------------
    // Run 3 API calls in parallel
    // -------------------------
    const [updateRes, salesRes, trendsRes] = await Promise.all([
      fetch(`${baseUrl}/bingwa/sales-summary`, {
        method: "GET",
        headers,
      }),
      fetch(`${baseUrl}/bingwa/top-selling-offers`, {
        method: "GET",
        headers,
      }),
      fetch(`${baseUrl}/bingwa/daily-sales-summary`, {
        method: "GET",
        headers,
      }),
      // fetch(`${baseUrl}/transactions/mpesa/transactions?limit=50`, {
      //   method: "GET",
      //   headers,
      // }),
    ]);

    // -------------------------
    // Parse JSON responses
    // -------------------------
    const [updateJson, salesJson, trendsJson] = await Promise.all([
      updateRes.json(),
      salesRes.json(),
      trendsRes.json(),
    ]);

    // const parsedTransactions = transactionArraySchema.parse(transactionsJson.data);
    // console.log("Parsed Transactions:", parsedTransactions);

    return NextResponse.json({
      success: true,
      update: updateJson,
      sales: salesJson,
      trends: trendsJson,
    });
  } catch (err) {
    console.error("Analytics API error:", err);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
