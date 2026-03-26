import { getTrackedTenders, TrackedTenderInfo } from "@/server/tracking/tracking.repository";
import { TrackButton } from "@/components/TrackButton";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatTenderType, daysUntil } from "@/lib/format";
import Link from "next/link";

export const metadata = {
  title: "Licitaciones Seguidas | Licitaciones Tracker",
};

export default async function SeguimientoPage() {
  let tracked: TrackedTenderInfo[] = [];
  let error: string | null = null;

  try {
    tracked = await getTrackedTenders();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar licitaciones";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Licitaciones Seguidas</h1>
        <p className="text-sm text-zinc-500">Tus licitaciones marcadas para seguimiento.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-16 text-center">
          <p className="text-sm font-medium text-red-700">Error al cargar licitaciones</p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      )}

      {!error && tracked.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white py-16 text-center">
          <p className="mb-4 text-sm text-zinc-500">No tienes licitaciones en seguimiento.</p>
          <Link href="/tenders" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Buscar licitaciones</Link>
        </div>
      )}

      {!error && tracked.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">{tracked.length} licitación{tracked.length === 1 ? "" : "es"} en seguimiento</p>

          <div className="grid gap-4 md:grid-cols-2">
            {tracked.map((tender) => (
              <div key={tender.code} className="rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
                  <Link href={`/tenders/${encodeURIComponent(tender.code)}`} className="flex flex-1 items-center gap-2 text-xs">
                    <span className="font-semibold text-zinc-700">{tender.code}</span>
                    {tender.type && (<span className="text-zinc-400">{formatTenderType(tender.type)}</span>)}
                  </Link>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={tender.status} />
                    <TrackButton tenderCode={tender.code} initialTracked={true} variant="icon" />
                  </div>
                </div>

                {/* Body */}
                <Link href={`/tenders/${encodeURIComponent(tender.code)}`} className="block px-5 py-4">
                  <h3 className="mb-3 text-sm font-semibold leading-snug text-zinc-900">{tender.name}</h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    {tender.organizationName && (
                      <div className="col-span-2">
                        <p className="text-zinc-400">Organismo</p>
                        <p className="font-medium text-zinc-700">{tender.organizationName}</p>
                      </div>
                    )}
                    {tender.publishDate && (
                      <div>
                        <p className="text-zinc-400">Publicación</p>
                        <p className="text-zinc-700">{formatDate(String(tender.publishDate))}</p>
                      </div>
                    )}
                    {tender.closeDate && (
                      <div>
                        <p className="text-zinc-400">Cierre</p>
                        <p className="text-zinc-700">{formatDate(String(tender.closeDate))} <span className="text-zinc-400">({daysUntil(String(tender.closeDate))})</span></p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-zinc-400">En seguimiento desde</p>
                      <p className="text-zinc-700">{formatDate(String(tender.trackedAt))}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
