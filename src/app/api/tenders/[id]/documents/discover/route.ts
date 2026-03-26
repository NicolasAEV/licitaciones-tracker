import { NextRequest, NextResponse } from "next/server";
import { discoverDocuments, downloadDocument } from "@/server/documents/scraper";
import {
  saveDocuments,
  saveDocumentContent,
  getDocumentsByTender,
} from "@/server/documents/documents.repository";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenderCode = decodeURIComponent(id);
  const shouldDownload = request.nextUrl.searchParams.get("download") === "true";

  try {
    // Step 1: Discover documents via scraping
    const scraped = await discoverDocuments(tenderCode);

    if (scraped.length === 0) {
      // Return existing documents if any, or empty
      const existing = await getDocumentsByTender(tenderCode);
      return NextResponse.json({
        documents: existing,
        discovered: 0,
        message: "No se encontraron documentos adjuntos",
      });
    }

    // Step 2: Save metadata to DB
    const documents = await saveDocuments(scraped, tenderCode);

    // Step 3: Optionally download file content
    if (shouldDownload && scraped.length > 0) {
      const sourceUrl = scraped[0].sourceUrl;

      for (const doc of documents) {
        if (doc.hasContent) continue; // Already downloaded

        const matchingScraped = scraped.find(
          (s) => s.fileName === doc.fileName
        );
        if (!matchingScraped) continue;

        const result = await downloadDocument(
          sourceUrl,
          matchingScraped.rowIndex
        );

        if (result) {
          await saveDocumentContent(doc.id, result.content, result.hash);
        }
      }

      // Re-fetch to get updated hasContent status
      const updated = await getDocumentsByTender(tenderCode);
      return NextResponse.json({
        documents: updated,
        discovered: scraped.length,
        message: `Se descubrieron ${scraped.length} documentos`,
      });
    }

    return NextResponse.json({
      documents,
      discovered: scraped.length,
      message: `Se descubrieron ${scraped.length} documentos`,
    });
  } catch (error) {
    console.error("Error discovering documents:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    const isConnectionError = errorMessage.includes("fetch failed") || 
                              errorMessage.includes("ECONNREFUSED") ||
                              errorMessage.includes("ETIMEDOUT");
    
    if (isConnectionError) {
      return NextResponse.json(
        { 
          error: "No se pudo conectar con Mercado Público. Por favor, verifica tu conexión a internet o intenta más tarde.",
          details: errorMessage
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Error al descubrir documentos",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
