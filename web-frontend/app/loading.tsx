import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="uai-container grid min-h-screen content-center gap-5 py-10">
      <Skeleton className="h-9 w-44" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </main>
  );
}
