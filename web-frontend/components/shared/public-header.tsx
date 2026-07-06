import Link from "next/link";
import { Home, LogIn, Menu, Search } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-border bg-background/92 backdrop-blur">
      <nav
        aria-label="Navegação pública"
        className="uai-container flex h-16 items-center justify-between gap-4"
      >
        <Link className="inline-flex items-center gap-2 font-bold" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
            <Home className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{siteConfig.shortName}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {siteConfig.publicNav.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            className="rounded-md px-3 py-2 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
            href="/landlord"
          >
            Anuncie seu quarto
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
            href="/entrar"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Entrar
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-3 text-sm font-bold text-white transition hover:bg-brand-strong"
            href="/buscar"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary
            aria-label="Abrir menu"
            className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-md border border-border bg-surface text-muted-strong [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 mt-2 grid w-56 gap-1 rounded-md border border-border bg-surface p-2 shadow-md">
            {siteConfig.publicNav.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-bold text-muted-strong hover:bg-surface-muted"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="rounded-md px-3 py-2 text-sm font-bold text-muted-strong hover:bg-surface-muted"
              href="/landlord"
            >
              Anuncie seu quarto
            </Link>
            <Link
              className="rounded-md border border-border px-3 py-2 text-sm font-bold text-muted-strong hover:bg-surface-muted"
              href="/entrar"
            >
              Entrar
            </Link>
            <Link
              className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white"
              href="/buscar"
            >
              Buscar
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
