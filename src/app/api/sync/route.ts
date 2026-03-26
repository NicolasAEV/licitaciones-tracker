import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/server/sync/sync.service";
import { getDataSource } from "@/server/db/data-source";
import { Organization, OrganizationEntity } from "@/server/db/entities";

export const maxDuration = 600; // 10 min timeout for long sync

export async function GET() {
  try {
    const ds = await getDataSource();
    const orgRepo = ds.getRepository<Organization>(OrganizationEntity);

    const orgCount = await orgRepo.count();

    return NextResponse.json({ orgCount });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener estado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.SYNC_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await runSync();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error en sincronización";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
