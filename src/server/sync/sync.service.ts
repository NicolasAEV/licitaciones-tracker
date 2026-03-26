import { getDataSource } from "@/server/db/data-source";
import { Organization, OrganizationEntity } from "@/server/db/entities";
import { fetchAllOrganismos } from "@/server/api/mercado-publico";

const DB_BATCH_SIZE = 1000;

export interface SyncResult {
  orgsSynced: number;
  durationMs: number;
}

/**
 * Sincroniza organizaciones desde BuscarComprador
 * Solo guarda CodigoEmpresa y NombreEmpresa
 */
export async function syncOrganizations(): Promise<number> {
  console.log("[Sync] Fetching organizations from BuscarComprador...");
  
  const data = await fetchAllOrganismos();
  const organismos = data.listaEmpresas || [];
  
  console.log(`[Sync] Found ${organismos.length} organizations`);
  
  if (organismos.length === 0) {
    return 0;
  }

  const ds = await getDataSource();
  const orgRepo = ds.getRepository<Organization>(OrganizationEntity);

  // Preparar organizaciones para insertar
  const orgsToSave: Omit<Organization, "updatedAt">[] = organismos.map((org) => ({
    codigoEmpresa: org.CodigoEmpresa,
    name: org.NombreEmpresa,
    isDefault: false,
  }));

  // Guardar en lotes
  console.log(`[Sync] Saving ${orgsToSave.length} organizations in batches of ${DB_BATCH_SIZE}...`);
  
  for (let i = 0; i < orgsToSave.length; i += DB_BATCH_SIZE) {
    const batch = orgsToSave.slice(i, i + DB_BATCH_SIZE);
    await orgRepo.save(batch);
    console.log(`[Sync] Saved batch ${Math.floor(i / DB_BATCH_SIZE) + 1} (${batch.length} orgs)`);
  }

  console.log(`[Sync] Organizations sync completed: ${orgsToSave.length} saved`);
  return orgsToSave.length;
}

/**
 * Ejecuta sincronización de organizaciones
 */
export async function runSync(): Promise<SyncResult> {
  const start = Date.now();
  
  console.log("[Sync] Starting organizations sync...");

  const orgsSynced = await syncOrganizations();

  const durationMs = Date.now() - start;
  console.log(`[Sync] Sync completed in ${(durationMs / 1000).toFixed(1)}s`);

  return {
    orgsSynced,
    durationMs,
  };
}
