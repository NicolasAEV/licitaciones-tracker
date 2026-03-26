import { getDataSource } from "@/server/db/data-source";
import { TrackedTender, TrackedTenderEntity } from "@/server/db/entities";
import { fetchFromApi } from "@/server/api/mercado-publico";
import { MercadoPublicoTender } from "@/types";

export interface TrackedTenderInfo {
  code: string;
  name: string;
  statusCode: number;
  status: string;
  type: string;
  codigoEmpresa: string;
  organizationName?: string;
  closeDate: Date | null;
  publishDate: Date | null;
  trackedAt: Date;
  updatedAt: Date;
}

/** Get all tracked tenders with organization info */
export async function getTrackedTenders(): Promise<TrackedTenderInfo[]> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TrackedTender>(TrackedTenderEntity);

  const tracked = await repo.find({
    relations: ["organization"],
    order: { trackedAt: "DESC" },
  });

  return tracked.map((t) => ({
    code: t.code,
    name: t.name,
    statusCode: t.statusCode,
    status: t.status,
    type: t.type,
    codigoEmpresa: t.codigoEmpresa,
    organizationName: t.organization?.name,
    closeDate: t.closeDate,
    publishDate: t.publishDate,
    trackedAt: t.trackedAt,
    updatedAt: t.updatedAt,
  }));
}

/** Check if a tender is tracked */
export async function isTracked(code: string): Promise<boolean> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TrackedTender>(TrackedTenderEntity);

  const count = await repo.count({ where: { code } });
  return count > 0;
}

/** Track a tender (fetch from API and save) */
export async function trackTender(code: string): Promise<void> {
  // Fetch tender data from API
  const results = await fetchFromApi({ codigo: code });
  if (results.length === 0) {
    throw new Error("Licitación no encontrada");
  }

  const tender: MercadoPublicoTender = results[0];

  const ds = await getDataSource();
  const repo = ds.getRepository<TrackedTender>(TrackedTenderEntity);

  // Check if already tracked
  const existing = await repo.findOne({ where: { code } });
  if (existing) {
    throw new Error("Licitación ya está en seguimiento");
  }

  // Create tracked tender
  const tracked: Partial<TrackedTender> = {
    code: tender.CodigoExterno,
    name: tender.Nombre,
    statusCode: tender.CodigoEstado,
    status: tender.Estado,
    type: tender.Tipo,
    codigoEmpresa: tender.Comprador.CodigoOrganismo,
    closeDate: tender.FechaCierre ? new Date(tender.FechaCierre) : null,
    publishDate: tender.Fechas?.FechaPublicacion
      ? new Date(tender.Fechas.FechaPublicacion)
      : null,
  };

  await repo.save(tracked);
}

/** Untrack a tender */
export async function untrackTender(code: string): Promise<void> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TrackedTender>(TrackedTenderEntity);

  const result = await repo.delete({ code });

  if (result.affected === 0) {
    throw new Error("Licitación no encontrada en seguimiento");
  }
}

/** Update tracked tenders with fresh data from API */
export async function syncTrackedTenders(): Promise<{
  updated: number;
  errors: number;
}> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TrackedTender>(TrackedTenderEntity);

  const tracked = await repo.find();
  let updated = 0;
  let errors = 0;

  for (const t of tracked) {
    try {
      const results = await fetchFromApi({ codigo: t.code }, 60);
      if (results.length > 0) {
        const tender = results[0];
        await repo.update(
          { code: t.code },
          {
            name: tender.Nombre,
            statusCode: tender.CodigoEstado,
            status: tender.Estado,
            type: tender.Tipo,
            closeDate: tender.FechaCierre ? new Date(tender.FechaCierre) : null,
          }
        );
        updated++;
      }
    } catch (error) {
      console.error(`Error syncing tender ${t.code}:`, error);
      errors++;
    }
  }

  return { updated, errors };
}
