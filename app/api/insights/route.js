import { NextResponse } from "next/server";
import { getInsights } from "@/lib/wordpress";
import { INSIGHTS_ENABLED } from "@/lib/features";

export async function GET(request) {
  if (!INSIGHTS_ENABLED) {
    return new NextResponse(null, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const perPage = parseInt(searchParams.get("perPage") || "6", 10);

  const insights = await getInsights({ perPage, offset });
  return NextResponse.json(insights);
}
