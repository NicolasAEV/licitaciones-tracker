import { NextRequest, NextResponse } from "next/server";
import { searchTenders } from "@/server/tenders/tenders.repository";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const org = request.nextUrl.searchParams.get("org") ?? undefined;
  const estado = request.nextUrl.searchParams.get("estado") ?? undefined;

  try {
    const result = await searchTenders(query, page, org, estado);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al buscar licitaciones";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
