import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900">
          Licitaciones Tracker
        </h1>
        <p className="mb-8 text-zinc-500">
          Busca, analiza y haz seguimiento a licitaciones públicas de forma
          simple y eficiente.
        </p>
        <Link
          href="/tenders"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Buscar licitaciones
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
