import {
  MercadoPublicoTender,
  Tender,
  TenderDetail,
  TenderDate,
  TenderItem,
  TenderItemAdjudication,
  TenderAdjudication,
} from "@/types";
import { getDataSource } from "@/server/db/data-source";
import { Organization, OrganizationEntity } from "@/server/db/entities";
import { fetchFromApi, resolveStatus } from "@/server/api/mercado-publico";

// --- Mappers: API raw → frontend types ---

function mapTenderFromApi(raw: Partial<MercadoPublicoTender>): Tender {
  return {
    code: raw.CodigoExterno ?? "",
    name: raw.Nombre ?? "",
    status: resolveStatus(raw),
    statusCode: raw.CodigoEstado ?? 0,
    type: raw.Tipo ?? "",
    organization: raw.Comprador?.NombreOrganismo ?? "",
    organizationCode: raw.Comprador?.CodigoOrganismo ?? "",
    region: raw.Comprador?.RegionUnidad ?? "",
    closeDate: raw.FechaCierre ?? raw.Fechas?.FechaCierre ?? "",
    publishDate: raw.Fechas?.FechaPublicacion ?? "",
  };
}

function extractDates(raw: MercadoPublicoTender): TenderDate[] {
  const dateMap: Record<string, string> = {
    FechaPublicacion: "Publicación",
    FechaCierre: "Cierre",
    FechaCreacion: "Creación",
    FechaInicio: "Inicio foro",
    FechaFinal: "Cierre foro",
    FechaPubRespuestas: "Publicación respuestas",
    FechaActoAperturaTecnica: "Apertura técnica",
    FechaActoAperturaEconomica: "Apertura económica",
    FechaAdjudicacion: "Adjudicación",
    FechaEstimadaAdjudicacion: "Adjudicación estimada",
    FechaVisitaTerreno: "Visita a terreno",
    FechaEntregaAntecedentes: "Entrega de antecedentes",
    FechaSoporteFisico: "Soporte físico",
    FechaTiempoEvaluacion: "Evaluación",
    FechaEstimadaFirma: "Firma estimada",
  };

  const dates: TenderDate[] = [];
  const fechas = raw.Fechas as unknown as Record<string, string | null>;

  for (const [key, label] of Object.entries(dateMap)) {
    const value = fechas[key];
    // Push the entry if the key exists in the payload (even when null)
    if (Object.prototype.hasOwnProperty.call(fechas, key)) {
      dates.push({ label, date: value ?? "" });
    }
  }

  return dates;
}

function mapItems(raw: MercadoPublicoTender): TenderItem[] {
  if (!raw.Items?.Listado) return [];

  return raw.Items.Listado.map((item) => {
    let adjudication: TenderItemAdjudication | null = null;
    if (item.Adjudicacion) {
      adjudication = {
        supplierRut: item.Adjudicacion.RutProveedor,
        supplierName: item.Adjudicacion.NombreProveedor,
        awardedQuantity: item.Adjudicacion.CantidadAdjudicada,
        unitPrice: item.Adjudicacion.MontoUnitario,
      };
    }

    return {
      correlative: item.Correlativo,
      productCode: item.CodigoProducto,
      categoryCode: item.CodigoCategoria,
      category: item.Categoria,
      productName: item.NombreProducto,
      description: item.Descripcion,
      unit: item.UnidadMedida,
      quantity: item.Cantidad,
      adjudication,
    };
  });
}

function mapAdjudication(
  raw: MercadoPublicoTender
): TenderAdjudication | null {
  if (!raw.Adjudicacion) return null;

  return {
    type: raw.Adjudicacion.Tipo,
    date: raw.Adjudicacion.Fecha,
    number: raw.Adjudicacion.Numero,
    supplierCount: raw.Adjudicacion.NumeroOferentes,
    actUrl: raw.Adjudicacion.UrlActa,
  };
}

function mapTenderDetail(raw: MercadoPublicoTender): TenderDetail {
  return {
    ...mapTenderFromApi(raw),
    description: raw.Descripcion ?? "",
    buyerUnit: raw.Comprador?.NombreUnidad ?? "",
    buyerAddress: raw.Comprador?.DireccionUnidad ?? "",
    buyerRut: raw.Comprador?.RutUnidad ?? undefined,
    buyerCodigoUnidad: raw.Comprador?.CodigoUnidad ?? undefined,
    buyerUserName: raw.Comprador?.NombreUsuario ?? undefined,
    buyerUserPosition: raw.Comprador?.CargoUsuario ?? undefined,
    buyerCommune: raw.Comprador?.ComunaUnidad ?? "",
    contactName: raw.NombreResponsableContrato ?? "",
    contactEmail: raw.EmailResponsableContrato ?? "",
    contactPhone: raw.FonoResponsableContrato ?? "",
    paymentContactName: raw.NombreResponsablePago ?? undefined,
    paymentContactEmail: raw.EmailResponsablePago ?? undefined,
    estimatedAmount: raw.MontoEstimado ?? null,
    estimatedAmountJustification: raw.JustificacionMontoEstimado ?? null,
    currency: raw.Moneda ?? null,
    visitAddress: raw.DireccionVisita ?? null,
    deliveryAddress: raw.DireccionEntrega ?? null,
    convocationType: raw.TipoConvocatoria === 1 ? "Abierta" : "Cerrada",
    stages: raw.Etapas,
    isWorksProject: raw.Obras === 2,
    complaints: raw.CantidadReclamos,
    contractDuration: raw.TiempoDuracionContrato,
    contractDurationType: raw.TipoDuracionContrato ?? "",
    isRenewable: raw.EsRenovable === 1,
    renewalPeriod: raw.PeriodoTiempoRenovacion ?? null,
    renewalValue: raw.ValorTiempoRenovacion,
    subcontracting: raw.SubContratacion === 1,
    hiringProhibition: raw.ProhibicionContratacion ?? null,
    deadlineExtension: raw.ExtensionPlazo === 1,
    dates: extractDates(raw),
    items: mapItems(raw),
    adjudication: mapAdjudication(raw),
  };
}

// --- Public API ---

export interface SearchResult {
  tenders: Tender[];
  total: number;
  page: number;
  pageSize: number;
  orgName?: string;
}

export interface OrgInfo {
  codigoEmpresa: string;
  name: string;
}

const PAGE_SIZE = 20;
const ENRICH_CONCURRENCY = 5;

/** Organizations from the database (synced from Mercado Público) */
export async function getOrganizations(): Promise<OrgInfo[]> {
  const ds = await getDataSource();
  const repo = ds.getRepository<Organization>(OrganizationEntity);

  const orgs = await repo.find({
    select: { codigoEmpresa: true, name: true },
    order: { name: "ASC" },
  });

  return orgs.map((o) => ({ codigoEmpresa: o.codigoEmpresa, name: o.name }));
}

/** Get the default organization if one is set */
export async function getDefaultOrganization(): Promise<OrgInfo | null> {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository<Organization>(OrganizationEntity);

    const defaultOrg = await repo.findOne({
      where: { isDefault: true },
      select: { codigoEmpresa: true, name: true },
    });

    if (!defaultOrg) return null;

    return { codigoEmpresa: defaultOrg.codigoEmpresa, name: defaultOrg.name };
  } catch {
    return null;
  }
}

export interface OrganizationSearchResult {
  organizations: Organization[];
  total: number;
  page: number;
  pageSize: number;
}

/** Search organizations from database with pagination */
export async function searchOrganizations(
  query?: string,
  page = 1,
  pageSize = 20
): Promise<OrganizationSearchResult> {
  const ds = await getDataSource();
  const repo = ds.getRepository<Organization>(OrganizationEntity);

  const trimmed = query?.trim();
  
  let queryBuilder = repo.createQueryBuilder("org");

  const conditions: string[] = [];
  const parameters: Record<string, string> = {};

  if (trimmed) {
    conditions.push(
      "(LOWER(org.name) LIKE LOWER(:search) OR LOWER(org.codigoEmpresa) LIKE LOWER(:search))"
    );
    parameters.search = `%${trimmed}%`;
  }

  if (conditions.length > 0) {
    queryBuilder = queryBuilder.where(conditions.join(" AND "), parameters);
  }

  const total = await queryBuilder.getCount();

  const organizations = await queryBuilder
    .orderBy("org.name", "ASC")
    .skip((page - 1) * pageSize)
    .take(pageSize)
    .getMany();

  return {
    organizations,
    total,
    page,
    pageSize,
  };
}

/** Search tenders from the Mercado Público API */
export async function searchTenders(
  query?: string,
  page = 1,
  codigoOrganismo?: string,
  estado?: string
): Promise<SearchResult> {
  const effectiveEstado = estado || "activas";

  // 1. Build API params
  const apiParams: Record<string, string> = { estado: effectiveEstado };

  // Add CodigoOrganismo filter if provided (more efficient than local filtering)
  if (codigoOrganismo) {
    apiParams.CodigoOrganismo = codigoOrganismo;
  }

  // Fetch tenders from API with filters
  const allMinimal = await fetchFromApi(apiParams);

  // 2. Filter by text query (if provided)
  const trimmed = query?.trim().toLowerCase();

  const filtered = allMinimal.filter((t) => {
    if (trimmed) {
      const matchesName = t.Nombre?.toLowerCase().includes(trimmed);
      const matchesCode = t.CodigoExterno?.toLowerCase().includes(trimmed);
      if (!matchesName && !matchesCode) return false;
    }
    return true;
  });

  // 3. Sort by close date ascending
  filtered.sort((a, b) => {
    const da = a.FechaCierre ? new Date(a.FechaCierre).getTime() : Infinity;
    const db = b.FechaCierre ? new Date(b.FechaCierre).getTime() : Infinity;
    return da - db;
  });

  const total = filtered.length;

  // 4. Paginate
  const offset = (page - 1) * PAGE_SIZE;
  const pageSlice = filtered.slice(offset, offset + PAGE_SIZE);

  // 5. Enrich the page slice with full data (batches of 5 parallel)
  const enriched: Tender[] = [];

  for (let i = 0; i < pageSlice.length; i += ENRICH_CONCURRENCY) {
    const batch = pageSlice.slice(i, i + ENRICH_CONCURRENCY);
    const settled = await Promise.allSettled(
      batch.map((t) => fetchFromApi({ codigo: t.CodigoExterno }, 60))
    );

    for (let j = 0; j < batch.length; j++) {
      const result = settled[j];
      if (result.status === "fulfilled" && result.value.length > 0) {
        enriched.push(mapTenderFromApi(result.value[0]));
      } else {
        // Fallback: use minimal data
        enriched.push(mapTenderFromApi(batch[j]));
      }
    }
  }

  // 6. Resolve org name for filter display
  let orgName: string | undefined;
  if (codigoOrganismo) {
    try {
      const ds = await getDataSource();
      const orgRepo = ds.getRepository<Organization>(OrganizationEntity);
      const org = await orgRepo.findOne({ where: { codigoEmpresa: codigoOrganismo } });
      orgName = org?.name;
    } catch {
      // Ignore - org name is just for display
    }
  }

  return { tenders: enriched, total, page, pageSize: PAGE_SIZE, orgName };
}

/** Get full tender detail from the API */
export async function getTenderByCode(
  code: string
): Promise<TenderDetail | null> {
  try {
    const results = await fetchFromApi({ codigo: code });
    if (results.length > 0) return mapTenderDetail(results[0]);
  } catch {
    // API failed - no fallback available
  }

  return null;
}
