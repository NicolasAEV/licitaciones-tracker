"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Organization {
  codigoEmpresa: string;
  name: string;
  isDefault: boolean;
}

export function OrganizationList({
  initialOrgs,
}: Readonly<{ initialOrgs: Organization[] }>) {
  const [organizations, setOrganizations] = useState(initialOrgs);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSetDefault = async (codigoEmpresa: string) => {
    setLoading(codigoEmpresa);
    try {
      const response = await fetch("/api/organizations/default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpresa }),
      });

      if (!response.ok) throw new Error("Error al marcar como default");

      // Actualizar estado local
      setOrganizations((prev) =>
        prev.map((org) => ({
          ...org,
          isDefault: org.codigoEmpresa === codigoEmpresa,
        }))
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al marcar organización como default");
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveDefault = async () => {
    setLoading("removing");
    try {
      const response = await fetch("/api/organizations/default", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al quitar default");

      // Actualizar estado local
      setOrganizations((prev) =>
        prev.map((org) => ({ ...org, isDefault: false }))
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al quitar organización default");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {organizations.map((org) => (
        <div
          key={org.codigoEmpresa}
          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-900">
                {org.codigoEmpresa}
              </h3>
              {org.isDefault && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Por defecto
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-600">{org.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/tenders?org=${org.codigoEmpresa}`}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Ver licitaciones
            </a>
            
            {org.isDefault ? (
              <button
                onClick={handleRemoveDefault}
                disabled={loading !== null}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                {loading === "removing" ? "..." : "Quitar default"}
              </button>
            ) : (
              <button
                onClick={() => handleSetDefault(org.codigoEmpresa)}
                disabled={loading !== null}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {loading === org.codigoEmpresa ? "..." : "Marcar default"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
