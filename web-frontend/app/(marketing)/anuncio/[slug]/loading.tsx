import { Skeleton } from "@/components/ui/skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="bg-background pb-28 pt-5 lg:pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <main className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
              <Skeleton className="aspect-[4/3] w-full lg:aspect-[16/10]" />
              <Skeleton className="h-80 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-72 w-full" />
          </main>
          <Skeleton className="hidden h-80 w-full lg:block" />
        </div>
      </div>
    </div>
  );
}
