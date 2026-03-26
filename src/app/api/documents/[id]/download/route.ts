import { NextRequest, NextResponse } from "next/server";
import { getDocumentContent } from "@/server/documents/documents.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const doc = await getDocumentContent(id);

    if (!doc) {
      return NextResponse.json(
        { error: "Documento no encontrado o no descargado aún" },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(doc.content), {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.fileName)}"`,
        "Content-Length": String(doc.content.length),
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return NextResponse.json(
      { error: "Error al descargar documento" },
      { status: 500 }
    );
  }
}
