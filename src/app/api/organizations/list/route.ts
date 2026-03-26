import { NextRequest, NextResponse } from "next/server";
import { searchOrganizations } from "@/server/tenders/tenders.repository";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const pageParam = request.nextUrl.searchParams.get("page");
  const region = request.nextUrl.searchParams.get("region")?.trim();
  const page = Math.max(1, Number(pageParam) || 1);

  try {
    const result = await searchOrganizations(q, page, 20);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener organismos";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
