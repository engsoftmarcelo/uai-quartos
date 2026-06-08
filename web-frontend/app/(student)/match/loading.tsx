import { Skeleton } from "@/components/ui/skeleton";

export default function MatchLoading() {
  return (
    <div className="grid gap-5">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-[30rem] w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
}
