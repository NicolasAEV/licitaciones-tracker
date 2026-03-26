import { Tender, TenderDetail } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function getTenders(query?: string): Promise<Tender[]> {
  const url = new URL("/api/tenders", API_URL);
  if (query) url.searchParams.set("q", query);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Error al obtener licitaciones");

  return res.json();
}

export async function getTenderByCode(code: string): Promise<TenderDetail> {
  const res = await fetch(
    `${API_URL}/api/tenders/${encodeURIComponent(code)}`
  );
  if (!res.ok) throw new Error("Error al obtener detalle de licitación");

  return res.json();
}
