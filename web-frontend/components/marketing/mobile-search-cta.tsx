import Link from "next/link";
import { Search } from "lucide-react";

export function MobileSearchCta() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-[var(--z-header)] lg:hidden">
      <Link
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-bold text-white shadow-md"
        href="#busca-principal"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Encontrar moradia
      </Link>
    </div>
  );
}
