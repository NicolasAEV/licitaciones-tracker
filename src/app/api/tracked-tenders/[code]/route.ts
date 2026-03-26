import { NextRequest, NextResponse } from "next/server";
import { isTracked } from "@/server/tracking/tracking.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const tracked = await isTracked(code);
    return NextResponse.json({ tracked });
  } catch (error) {
    console.error("Error checking tracked status:", error);
    return NextResponse.json(
      { error: "Error al verificar estado de seguimiento" },
      { status: 500 }
    );
  }
}
