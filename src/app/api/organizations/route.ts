import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/server/db/data-source";
import { Organization, OrganizationEntity } from "@/server/db/entities";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  try {
    const ds = await getDataSource();
    const repo = ds.getRepository<Organization>(OrganizationEntity);

    let orgs: Organization[];
    if (q) {
      orgs = await repo
        .createQueryBuilder("org")
        .where("LOWER(org.name) LIKE LOWER(:q)", { q: `%${q}%` })
        .orWhere("LOWER(org.codigoEmpresa) LIKE LOWER(:q)", { q: `%${q}%` })
        .orderBy("org.name", "ASC")
        .take(30)
        .getMany();
    } else {
      orgs = await repo.find({
        select: { codigoEmpresa: true, name: true },
        order: { name: "ASC" },
        take: 30,
      });
    }

    return NextResponse.json(
      orgs.map((o) => ({ codigoEmpresa: o.codigoEmpresa, name: o.name }))
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener organismos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
