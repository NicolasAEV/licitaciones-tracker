import { MercadoPublicoResponse, MercadoPublicoTender, MercadoPublicoOrganismosResponse } from "@/types";

const API_URL = process.env.MERCADO_PUBLICO_URL!;
const TICKET = process.env.TICKET_API!;

export const STATUS_MAP: Record<number, string> = {
  5: "Publicada",
  6: "Cerrada",
  7: "Desierta",
  8: "Adjudicada",
  18: "Revocada",
  19: "Suspendida",
};

function buildUrl(params: Record<string, string>): string {
  const url = new URL("licitaciones.json", API_URL);
  url.searchParams.set("ticket", TICKET);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export async function fetchFromApi(
  params: Record<string, string>,
  cacheTtl = 300
): Promise<MercadoPublicoTender[]> {
  const url = buildUrl(params);
  const res = await fetch(url, { next: { revalidate: cacheTtl } });

  if (!res.ok) {
    throw new Error(`API Mercado Público error: ${res.status}`);
  }

  const data: MercadoPublicoResponse = await res.json();
  return data.Listado ?? [];
}

export async function fetchAllOrganismos(): Promise<MercadoPublicoOrganismosResponse> {
  const url = new URL("Empresas/BuscarComprador", API_URL);
  url.searchParams.set("ticket", TICKET);
  
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Cache 1 hora
  
  if (!res.ok) {
    throw new Error(`API BuscarComprador error: ${res.status}`);
  }
  
  return res.json();
}

export function resolveStatus(raw: Partial<MercadoPublicoTender>): string {
  if (raw.Estado) return raw.Estado;
  return STATUS_MAP[raw.CodigoEstado ?? 0] ?? "Desconocido";
}
