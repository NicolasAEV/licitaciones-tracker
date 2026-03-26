import { NextRequest, NextResponse } from "next/server";
import {
  getTrackedTenders,
  trackTender,
  untrackTender,
  isTracked,
} from "@/server/tracking/tracking.repository";

// GET: Obtener todas las licitaciones en seguimiento
export async function GET() {
  try {
    const tracked = await getTrackedTenders();
    return NextResponse.json(tracked);
  } catch (error) {
    console.error("Error fetching tracked tenders:", error);
    return NextResponse.json(
      { error: "Error al obtener licitaciones en seguimiento" },
      { status: 500 }
    );
  }
}

// POST: Marcar una licitación para seguimiento
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Código de licitación es requerido" },
        { status: 400 }
      );
    }

    await trackTender(code);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE: Quitar una licitación del seguimiento
export async function DELETE(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Código de licitación es requerido" },
        { status: 400 }
      );
    }

    await untrackTender(code);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
