import { NextRequest, NextResponse } from "next/server";
import { getTenderByCode } from "@/server/tenders/tenders.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const tender = await getTenderByCode(id);

    if (!tender) {
      return NextResponse.json(
        { error: "Licitación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(tender);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener licitación";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
