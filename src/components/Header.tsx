import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Licitaciones Tracker
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link
            href="/tenders"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Buscar licitaciones
          </Link>
          <Link
            href="/organizations"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Organismos
          </Link>
          <Link
            href="/seguimiento"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Seguidas
          </Link>
          <Link
            href="/sync"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Sincronización
          </Link>
        </nav>
      </div>
    </header>
  );
}
