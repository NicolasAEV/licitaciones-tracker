import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import { OrganizationCard } from "@/components/OrganizationCard";
import { Pagination } from "@/components/Pagination";
import { searchOrganizations, OrganizationSearchResult } from "@/server/tenders/tenders.repository";

export const metadata = {
  title: "Organismos Públicos | Licitaciones Tracker",
};

function OrganizationResults({
  result,
  query,
}: Readonly<{ result: OrganizationSearchResult; query?: string }>) {
  if (result.organizations.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white py-16 text-center">
        <p className="text-sm text-zinc-500">
          No se encontraron organismos
          {query ? ` para "${query}"` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-400">
        {result.total} organismo{result.total === 1 ? "" : "s"} encontrado
        {result.total === 1 ? "" : "s"}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {result.organizations.map((org) => (
          <OrganizationCard key={org.codigoEmpresa} org={org} />
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

export default async function OrganizationsPage(
  props: Readonly<{
    searchParams: Promise<{ q?: string; page?: string }>;
  }>
) {
  const { q, page: pageParam } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let result: OrganizationSearchResult | null = null;
  let error: string | null = null;

  try {
    result = await searchOrganizations(q, page, 20);
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Error al conectar con la base de datos";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Organismos Públicos
        </h1>
        <p className="text-sm text-zinc-500">
          Busca organismos por nombre o código.
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <SearchInput placeholder="Buscar organismos..." />
        </Suspense>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-16 text-center">
          <p className="text-sm font-medium text-red-700">
            Error al cargar organismos
          </p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      )}

      {result && !error && (
        <Suspense>
          <OrganizationResults result={result} query={q} />
        </Suspense>
      )}
    </div>
  );
}
