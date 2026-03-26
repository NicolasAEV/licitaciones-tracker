import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/server/db/data-source";
import { Organization, OrganizationEntity } from "@/server/db/entities";

// GET: Obtener la organización marcada como default
export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository<Organization>(OrganizationEntity);

    const defaultOrg = await repo.findOne({
      where: { isDefault: true },
    });

    if (!defaultOrg) {
      return NextResponse.json({ codigoEmpresa: null, name: null });
    }

    return NextResponse.json({
      codigoEmpresa: defaultOrg.codigoEmpresa,
      name: defaultOrg.name,
    });
  } catch (error) {
    console.error("Error fetching default organization:", error);
    return NextResponse.json(
      { error: "Error al obtener organización por defecto" },
      { status: 500 }
    );
  }
}

// POST: Marcar una organización como default (solo puede haber una)
export async function POST(request: NextRequest) {
  try {
    const { codigoEmpresa } = await request.json();

    if (!codigoEmpresa) {
      return NextResponse.json(
        { error: "codigoEmpresa es requerido" },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository<Organization>(OrganizationEntity);

    // Primero, quitar el default de cualquier org que lo tenga
    await repo.update({ isDefault: true }, { isDefault: false });

    // Ahora marcar la nueva org como default
    const result = await repo.update(
      { codigoEmpresa },
      { isDefault: true }
    );

    if (result.affected === 0) {
      return NextResponse.json(
        { error: "Organización no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting default organization:", error);
    return NextResponse.json(
      { error: "Error al marcar organización como default" },
      { status: 500 }
    );
  }
}

// DELETE: Quitar el default de todas las organizaciones
export async function DELETE() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository<Organization>(OrganizationEntity);

    await repo.update({ isDefault: true }, { isDefault: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing default organization:", error);
    return NextResponse.json(
      { error: "Error al quitar organización default" },
      { status: 500 }
    );
  }
}
