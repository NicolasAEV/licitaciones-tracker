import Link from "next/link";
import { Tender } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { TrackButton } from "./TrackButton";
import {
  formatDate,
  formatTenderType,
  daysUntil,
} from "@/lib/format";

export function TenderCard({ tender }: Readonly<{ tender: Tender }>) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
      {/* Header: code + type + status + track button */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
        <Link
          href={`/tenders/${encodeURIComponent(tender.code)}`}
          className="flex flex-1 items-center gap-2 text-xs"
        >
          <span className="font-semibold text-zinc-700">{tender.code}</span>
          {tender.type && (
            <span className="text-zinc-400">
              {formatTenderType(tender.type)}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={tender.status} />
          <TrackButton tenderCode={tender.code} variant="icon" />
        </div>
      </div>

      {/* Body */}
      <Link
        href={`/tenders/${encodeURIComponent(tender.code)}`}
        className="block px-5 py-4"
      >
        {/* Name */}
        <h3 className="mb-3 text-sm font-semibold leading-snug text-zinc-900">
          {tender.name}
        </h3>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
          {tender.organization && (
            <div className="col-span-2">
              <p className="text-zinc-400">Organismo</p>
              <p className="font-medium text-zinc-700">
                {tender.organization}
              </p>
            </div>
          )}
          {tender.region && (
            <div>
              <p className="text-zinc-400">Región</p>
              <p className="text-zinc-700">{tender.region}</p>
            </div>
          )}
          {tender.publishDate && (
            <div>
              <p className="text-zinc-400">Publicación</p>
              <p className="text-zinc-700">{formatDate(tender.publishDate)}</p>
            </div>
          )}
          {tender.closeDate && (
            <div>
              <p className="text-zinc-400">Cierre</p>
              <p className="text-zinc-700">
                {formatDate(tender.closeDate)}{" "}
                <span className="text-zinc-400">
                  ({daysUntil(tender.closeDate)})
                </span>
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
