import { NextRequest, NextResponse } from "next/server";
import { getDocumentsByTender } from "@/server/documents/documents.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenderCode = decodeURIComponent(id);

  try {
    const documents = await getDocumentsByTender(tenderCode);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Error al obtener documentos" },
      { status: 500 }
    );
  }
}
