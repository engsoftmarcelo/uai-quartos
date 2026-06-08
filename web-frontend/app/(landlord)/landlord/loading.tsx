import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordAreaLoading() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
