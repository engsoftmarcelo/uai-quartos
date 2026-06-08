import { Skeleton } from "@/components/ui/skeleton";

export function ResultsSkeleton() {
  return (
    <section className="grid gap-5" aria-label="Carregando resultados">
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <Skeleton className="hidden h-[42rem] lg:block" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="grid gap-3 rounded-md border border-border bg-surface p-3" key={index}>
              <Skeleton className="h-56 w-full md:hidden" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-[34rem] lg:block" />
      </div>
    </section>
  );
}
