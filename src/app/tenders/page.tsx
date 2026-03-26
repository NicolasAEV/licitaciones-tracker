import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import { OrgAutocomplete } from "@/components/OrgAutocomplete";
import { StatusFilter } from "@/components/StatusFilter";
import { TenderCard } from "@/components/TenderCard";
import { Pagination } from "@/components/Pagination";
import { searchTenders, SearchResult, getDefaultOrganization } from "@/server/tenders/tenders.repository";

export const metadata = {
  title: "Buscar Licitaciones | Licitaciones Tracker",
};

function TenderResults({
  result,
  query,
}: Readonly<{ result: SearchResult; query?: string }>) {
  if (result.tenders.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white py-16 text-center">
        <p className="text-sm text-zinc-500">
          No se encontraron licitaciones
          {query ? ` para "${query}"` : ""}
          {result.orgName ? ` en ${result.orgName}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-400">
        {result.total} licitación{result.total === 1 ? "" : "es"} activa
        {result.total === 1 ? "" : "s"}
        {result.orgName ? ` de ${result.orgName}` : ""}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {result.tenders.map((tender) => (
          <TenderCard key={tender.code} tender={tender} />
        ))}
      </div>

      <Suspense>
        <Pagination
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
        />
      </Suspense>
    </div>
  );
}

export default async function TendersPage(
  props: Readonly<{
    searchParams: Promise<{ q?: string; page?: string; org?: string; estado?: string }>;
  }>
) {
  const { q, page: pageParam, org, estado } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  // Si no hay org especificada, intentar usar la default
  let effectiveOrg = org;
  let defaultOrg = null;
  
  if (!effectiveOrg) {
    defaultOrg = await getDefaultOrganization();
    effectiveOrg = defaultOrg?.codigoEmpresa;
  }

  let result: SearchResult | null = null;
  let error: string | null = null;

  try {
    result = await searchTenders(q, page, effectiveOrg, estado);
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Error al conectar con la API";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Licitaciones
        </h1>
        <p className="text-sm text-zinc-500">
          Busca por nombre, código u organismo.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr,280px]">
          <Suspense>
            <SearchInput placeholder="Buscar por nombre o código de licitación..." />
          </Suspense>
          <Suspense>
            <OrgAutocomplete
              selectedCodigoEmpresa={effectiveOrg}
              selectedName={result?.orgName || defaultOrg?.name}
            />
          </Suspense>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr,200px]">
          <div />
          <Suspense>
            <StatusFilter selectedEstado={estado} />
          </Suspense>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-16 text-center">
          <p className="text-sm font-medium text-red-700">
            Error al cargar licitaciones
          </p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      )}

      {!error && result && (
        <TenderResults result={result} query={q} />
      )}
    </div>
  );
}
