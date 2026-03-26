"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface OrgOption {
  codigoEmpresa: string;
  name: string;
}

interface OrgAutocompleteProps {
  selectedCodigoEmpresa?: string;
  selectedName?: string;
}

export function OrgAutocomplete({
  selectedCodigoEmpresa,
  selectedName,
}: Readonly<OrgAutocompleteProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<OrgOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch matching orgs from DB (fast)
  useEffect(() => {
    if (query.length < 2) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/organizations?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data: OrgOption[] = await res.json();
          setOptions(data);
          setIsOpen(true);
        }
      } catch {
        // Ignore abort errors
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOrg(org: OrgOption) {
    setQuery("");
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("org", org.codigoEmpresa);
    params.delete("page");
    router.push(`/tenders?${params}`);
  }

  function clearOrg() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("org");
    params.delete("page");
    router.push(`/tenders?${params}`);
  }

  if (selectedCodigoEmpresa && selectedName) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
        <svg
          className="h-4 w-4 shrink-0 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="truncate text-sm text-blue-700">
          {selectedCodigoEmpresa} - {selectedName}
        </span>
        <button
          onClick={clearOrg}
          className="ml-auto shrink-0 rounded p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por organismo..."
          className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
          </div>
        )}
      </div>

      {isOpen && options.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
          {options.map((org) => (
            <button
              key={org.codigoEmpresa}
              onClick={() => selectOrg(org)}
              className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="font-medium text-zinc-900">{org.codigoEmpresa}</span>
              <span className="text-zinc-500"> - </span>
              <span>{org.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && !loading && options.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
          <p className="text-xs text-zinc-400">
            No se encontraron organismos
          </p>
        </div>
      )}
    </div>
  );
}
