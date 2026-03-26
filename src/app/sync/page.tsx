"use client";

import { useState, useEffect, useCallback } from "react";

interface SyncStatus {
  orgCount: number;
}

export default function SyncPage() {
  const [data, setData] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/sync");
      if (res.ok) {
        setData(await res.json());
        setError(null);
      } else {
        const body = await res.json();
        setError(body.error ?? "Error al cargar estado");
      }
    } catch {
      setError("No se pudo conectar al servidor");
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function triggerSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SYNC_SECRET ?? "change-me-in-production"}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setSyncResult(
          `Sincronización completada: ${result.orgsSynced} organizaciones (${(result.durationMs / 1000).toFixed(1)}s)`
        );
      } else {
        setSyncResult(`Error: ${result.error ?? "Sync falló"}`);
      }
      await loadStatus();
    } catch {
      setSyncResult("Error de conexión al ejecutar sincronización");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Sincroniza Organizaciones
        </h1>
        <p className="text-sm text-zinc-500">
          Sincroniza el catálogo de organizaciones desde Mercado Público.
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Estado actual</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-zinc-900">
            {data?.orgCount ?? 0}
          </span>
          <span className="text-sm text-zinc-500">organizaciones en base de datos</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={triggerSync}
            disabled={syncing}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Sincronizando...</span>
              </span>
            ) : (
              "Sincronizar organizaciones"
            )}
          </button>

          <button
            onClick={loadStatus}
            className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Actualizar
          </button>
        </div>
      </div>

      {syncResult && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            syncResult.startsWith("Error")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {syncResult}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> La sincronización obtiene el catálogo completo de organizaciones 
          desde el endpoint BuscarComprador de Mercado Público (~899 organizaciones). 
          Solo guarda CodigoEmpresa y NombreEmpresa.
        </p>
      </div>
    </div>
  );
}
