"use client";

import { useState } from "react";
import { TenderDocument } from "@/types";
import { formatFileSize, formatDate } from "@/lib/format";

interface DocumentListProps {
  tenderCode: string;
}

export function DocumentList({ tenderCode }: DocumentListProps) {
  const [documents, setDocuments] = useState<TenderDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  async function handleDiscover(withDownload = false) {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/tenders/${encodeURIComponent(tenderCode)}/documents/discover${
        withDownload ? "?download=true" : ""
      }`;
      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Error al descubrir documentos";
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setDocuments(data.documents ?? []);
      setDiscovered(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "No se pudieron obtener los documentos adjuntos";
      setError(errorMessage);
      console.error("Error discovering documents:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadExisting() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/tenders/${encodeURIComponent(tenderCode)}/documents`
      );
      if (!res.ok) throw new Error("Error");

      const data = await res.json();
      if (data.documents?.length > 0) {
        setDocuments(data.documents);
        setDiscovered(true);
      } else {
        // No cached documents — run discovery
        await handleDiscover();
      }
    } catch {
      await handleDiscover();
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadSingle(docId: string) {
    setDownloading((prev) => new Set(prev).add(docId));

    try {
      const res = await fetch(`/api/documents/${docId}/download`);
      if (!res.ok) {
        // If not downloaded yet, it might return 404
        setError("Archivo no disponible. Intenta 'Buscar y descargar'.");
        return;
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition");
      let fileName = "documento";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) fileName = decodeURIComponent(match[1]);
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error al descargar el archivo");
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
    }
  }

  // File type icon
  function fileIcon(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOC";
    if (["xls", "xlsx"].includes(ext)) return "XLS";
    if (["ppt", "pptx"].includes(ext)) return "PPT";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "IMG";
    if (["zip", "rar", "7z"].includes(ext)) return "ZIP";
    return "FILE";
  }

  function typeColor(type: string): string {
    if (type.includes("Administrativ")) return "bg-blue-100 text-blue-700";
    if (type.includes("Técnic")) return "bg-green-100 text-green-700";
    if (type.includes("Económic")) return "bg-amber-100 text-amber-700";
    if (type.includes("Comisión")) return "bg-purple-100 text-purple-700";
    return "bg-zinc-100 text-zinc-600";
  }

  if (!discovered) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadExisting}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner />
                Buscando adjuntos...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Ver adjuntos
              </>
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Documentos adjuntos ({documents.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleDiscover(false)}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-50"
          >
            {loading ? <Spinner /> : null}
            Actualizar
          </button>
          <button
            onClick={() => handleDiscover(true)}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? <Spinner /> : null}
            Buscar y descargar
          </button>
        </div>
      </div>

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      {documents.length === 0 ? (
        <p className="text-sm text-zinc-400">No se encontraron documentos adjuntos.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400">
                <th className="px-3 py-2 font-medium">Archivo</th>
                <th className="px-3 py-2 font-medium">Tipo</th>
                <th className="px-3 py-2 font-medium text-right">Tamaño</th>
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-zinc-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-10 items-center justify-center rounded bg-zinc-100 text-[10px] font-bold text-zinc-500">
                        {fileIcon(doc.fileName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900" title={doc.fileName}>
                          {doc.fileName}
                        </p>
                        {doc.description && (
                          <p className="truncate text-xs text-zinc-400">{doc.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {doc.fileType && (
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeColor(doc.fileType)}`}>
                        {doc.fileType}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right text-zinc-600">
                    {doc.fileSize > 0 ? formatFileSize(doc.fileSize) : "-"}
                  </td>
                  <td className="px-3 py-2 text-zinc-600">
                    {doc.uploadDate ? formatDate(doc.uploadDate) : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {doc.hasContent ? (
                      <button
                        onClick={() => handleDownloadSingle(doc.id)}
                        disabled={downloading.has(doc.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                      >
                        {downloading.has(doc.id) ? (
                          <Spinner />
                        ) : (
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        Descargar
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400">Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
