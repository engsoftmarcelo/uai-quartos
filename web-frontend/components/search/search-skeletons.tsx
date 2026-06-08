import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeletons() {
  return (
    <section className="grid gap-4" aria-label="Carregando resultados">
      <Skeleton className="h-44 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="grid gap-3 rounded-md border border-border bg-surface p-3" key={index}>
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
