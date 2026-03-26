"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Organization } from "@/server/db/entities";

export function OrganizationCard({
  org,
}: Readonly<{ org: Organization }>) {
  const [isDefault, setIsDefault] = useState(org.isDefault);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleDefault = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isDefault) {
        // Quitar default
        const response = await fetch("/api/organizations/default", {
          method: "DELETE",
        });
        if (!response.ok) throw new Error();
        setIsDefault(false);
      } else {
        // Marcar como default
        const response = await fetch("/api/organizations/default", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigoEmpresa: org.codigoEmpresa }),
        });
        if (!response.ok) throw new Error();
        setIsDefault(true);
      }
      router.refresh();
    } catch {
      alert("Error al actualizar organización default");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
      {/* Default badge */}
      {isDefault && (
        <div className="absolute right-3 top-3">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            Por defecto
          </span>
        </div>
      )}

      <Link href={`/tenders?org=${encodeURIComponent(org.codigoEmpresa)}`}>
        {/* Header: código empresa */}
        <div className="border-b border-zinc-100 px-5 py-3">
          <span className="text-xs font-semibold text-zinc-700">
            {org.codigoEmpresa}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Name */}
          <h3 className="text-sm font-semibold leading-snug text-zinc-900">
            {org.name}
          </h3>
        </div>
      </Link>

      {/* Footer with actions */}
      <div className="border-t border-zinc-100 px-5 py-2.5 flex items-center justify-between">
        <Link
          href={`/tenders?org=${encodeURIComponent(org.codigoEmpresa)}`}
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          Ver licitaciones →
        </Link>
        
        <button
          onClick={handleToggleDefault}
          disabled={loading}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          title={isDefault ? "Quitar como organización por defecto" : "Marcar como organización por defecto"}
        >
          {loading ? "..." : isDefault ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
