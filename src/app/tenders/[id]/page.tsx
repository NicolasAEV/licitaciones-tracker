import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenderByCode } from "@/server/tenders/tenders.repository";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentList } from "@/components/DocumentList";
import { formatCurrency, formatDate } from "@/lib/format";

const tenderTypeLabels: Record<string, string> = {
  L1: "Licitación Pública < 100 UTM",
  LE: "Licitación Pública 100-1.000 UTM",
  LP: "Licitación Pública 1.000-2.000 UTM",
  LQ: "Licitación Pública 2.000-5.000 UTM",
  LR: "Licitación Pública > 5.000 UTM",
  E2: "Licitación Privada < 100 UTM",
  CO: "Licitación Privada 100-1.000 UTM",
  B2: "Licitación Privada 1.000-2.000 UTM",
  H2: "Licitación Privada 2.000-5.000 UTM",
  I2: "Licitación Privada > 5.000 UTM",
  LS: "Licitación Pública Servicios personales",
};

export default async function TenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const code = decodeURIComponent(id);

  let tender;
  try {
    tender = await getTenderByCode(code);
  } catch {
    notFound();
  }

  if (!tender) notFound();

  const hasPaymentContact =
    tender.paymentContactName || tender.paymentContactEmail;
  const hasLogistics = tender.visitAddress || tender.deliveryAddress;
  const hasItemAdjudication = tender.items.some((i) => i.adjudication);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Back link */}
      <Link
        href="/tenders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a licitaciones
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-400">{tender.code}</span>
          <StatusBadge status={tender.status} />
        </div>
        <h1 className="mb-2 text-xl font-bold text-zinc-900">{tender.name}</h1>
        {tender.description && (
          <p className="text-sm leading-relaxed text-zinc-600">{tender.description}</p>
        )}
      </div>

      {/* === Two-column top layout === */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Organismo + Comprador */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Organismo
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <InfoField label="Nombre" value={tender.organization} />
            <InfoField label="Código" value={tender.organizationCode ?? ""} />
            <InfoField label="Unidad de compra" value={tender.buyerUnit} />
            <InfoField label="Código unidad" value={tender.buyerCodigoUnidad ?? ""} />
            <InfoField label="Rut" value={tender.buyerRut ?? ""} />
            <InfoField label="Región" value={tender.region} />
            <InfoField label="Comuna" value={tender.buyerCommune} />
            <InfoField label="Dirección" value={tender.buyerAddress} />
          </div>
        </div>

        {/* Right: Licitación details */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Licitación
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <InfoField label="Tipo" value={tenderTypeLabels[tender.type] ?? tender.type} />
            <InfoField label="Convocatoria" value={tender.convocationType ?? ""} />
            <InfoField label="Etapas" value={tender.stages ? String(tender.stages) : ""} />
            <InfoField
              label="Monto estimado"
              value={
                tender.estimatedAmount
                  ? `${formatCurrency(tender.estimatedAmount)} ${tender.currency}`
                  : "No informado"
              }
            />
            {tender.estimatedAmountJustification && (
              <InfoField label="Justificación monto" value={tender.estimatedAmountJustification} />
            )}
            <InfoField label="Obra" value={tender.isWorksProject ? "Sí" : "No"} />
            <InfoField label="Extensión plazo" value={tender.deadlineExtension ? "Sí" : "No"} />
            {tender.complaints != null && tender.complaints > 0 && (
              <InfoField label="Reclamos" value={String(tender.complaints)} />
            )}
          </div>
        </div>
      </div>

      {/* === Contacts + Contract row === */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: All contacts combined */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Contactos
          </h2>
          <div className="space-y-3">
            {/* Buyer user */}
            {(tender.buyerUserName || tender.buyerUserPosition) && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">Usuario responsable</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {tender.buyerUserName && <InfoField label="Nombre" value={tender.buyerUserName} />}
                  {tender.buyerUserPosition && <InfoField label="Cargo" value={tender.buyerUserPosition} />}
                </div>
              </div>
            )}
            {/* Contract contact */}
            {(tender.contactName || tender.contactEmail) && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">Responsable contrato</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {tender.contactName && <InfoField label="Nombre" value={tender.contactName} />}
                  {tender.contactEmail && <InfoField label="Email" value={tender.contactEmail} />}
                  {tender.contactPhone && <InfoField label="Teléfono" value={tender.contactPhone} />}
                </div>
              </div>
            )}
            {/* Payment contact */}
            {hasPaymentContact && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">Responsable pago</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {tender.paymentContactName && <InfoField label="Nombre" value={tender.paymentContactName} />}
                  {tender.paymentContactEmail && <InfoField label="Email" value={tender.paymentContactEmail} />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contract + Logistics */}
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Contrato
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {tender.contractDuration != null && tender.contractDuration > 0 && (
                <InfoField
                  label="Duración"
                  value={`${tender.contractDuration} ${tender.contractDurationType}`}
                />
              )}
              <InfoField label="Renovable" value={tender.isRenewable ? "Sí" : "No"} />
              {tender.isRenewable && tender.renewalPeriod && (
                <InfoField
                  label="Período renovación"
                  value={
                    tender.renewalValue
                      ? `${tender.renewalValue} ${tender.renewalPeriod}`
                      : tender.renewalPeriod
                  }
                />
              )}
              <InfoField
                label="Subcontratación"
                value={tender.subcontracting ? "Permitida" : "No permitida"}
              />
              {tender.hiringProhibition && (
                <InfoField label="Prohibición" value={tender.hiringProhibition} />
              )}
            </div>
          </div>

          {hasLogistics && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Direcciones
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {tender.visitAddress && (
                  <InfoField label="Visita a terreno" value={tender.visitAddress} />
                )}
                {tender.deliveryAddress && (
                  <InfoField label="Entrega" value={tender.deliveryAddress} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Dates grid (compact) === */}
      {tender.dates.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Fechas
          </h2>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-3 lg:grid-cols-4">
            {tender.dates.map((d) => (
              <div key={d.label} className="bg-white px-3 py-2">
                <p className="text-xs text-zinc-400">{d.label}</p>
                <p className="text-sm font-medium text-zinc-800">
                  {d.date ? formatDate(d.date) : <span className="text-zinc-300">-</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Items table === */}
      {tender.items.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Productos / Servicios ({tender.items.length})
          </h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Producto</th>
                  <th className="px-3 py-2 font-medium">Categoría</th>
                  <th className="px-3 py-2 font-medium text-right">Cant.</th>
                  <th className="px-3 py-2 font-medium">Unidad</th>
                  {hasItemAdjudication && (
                    <>
                      <th className="px-3 py-2 font-medium">Proveedor</th>
                      <th className="px-3 py-2 font-medium text-right">Adj.</th>
                      <th className="px-3 py-2 font-medium text-right">P. unit.</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {tender.items.map((item) => (
                  <tr key={item.correlative}>
                    <td className="px-3 py-2 text-zinc-400">{item.correlative}</td>
                    <td className="px-3 py-2 text-zinc-900">
                      {item.productName}
                      {item.description && (
                        <span className="ml-1 text-xs text-zinc-400">— {item.description}</span>
                      )}
                      <p className="text-xs text-zinc-300">
                        {item.productCode} | {item.categoryCode}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-zinc-600">{item.category}</td>
                    <td className="px-3 py-2 text-right text-zinc-700">{item.quantity}</td>
                    <td className="px-3 py-2 text-zinc-600">{item.unit}</td>
                    {hasItemAdjudication && (
                      <>
                        <td className="px-3 py-2 text-zinc-700">
                          {item.adjudication ? (
                            <>
                              {item.adjudication.supplierName}
                              <p className="text-xs text-zinc-400">{item.adjudication.supplierRut}</p>
                            </>
                          ) : (
                            <span className="text-zinc-300">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-zinc-700">
                          {item.adjudication?.awardedQuantity ?? "-"}
                        </td>
                        <td className="px-3 py-2 text-right text-zinc-700">
                          {item.adjudication ? formatCurrency(item.adjudication.unitPrice) : "-"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === Adjudication === */}
      {tender.adjudication && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Adjudicación
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {tender.adjudication.date && (
              <div>
                <span className="text-xs text-blue-400">Fecha </span>
                <span className="text-sm font-medium text-blue-900">
                  {formatDate(tender.adjudication.date)}
                </span>
              </div>
            )}
            <div>
              <span className="text-xs text-blue-400">Oferentes </span>
              <span className="text-sm font-medium text-blue-900">
                {tender.adjudication.supplierCount}
              </span>
            </div>
            {tender.adjudication.number && (
              <div>
                <span className="text-xs text-blue-400">Doc. </span>
                <span className="text-sm font-medium text-blue-900">
                  {tender.adjudication.number}
                </span>
              </div>
            )}
            {tender.adjudication.actUrl && (
              <a
                href={tender.adjudication.actUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                Ver acta
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {/* === Documents === */}
      <div className="mb-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Documentos Adjuntos
        </h2>
        <DocumentList tenderCode={tender.code} />
      </div>
    </div>
  );
}

function InfoField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-sm font-medium text-zinc-900">{value}</p>
    </div>
  );
}
