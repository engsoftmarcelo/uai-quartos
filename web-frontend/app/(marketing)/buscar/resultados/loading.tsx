import { ResultsSkeleton } from "@/components/results/results-skeleton";

export default function ResultsLoading() {
  return (
    <div className="bg-background py-5 sm:py-6">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6">
        <ResultsSkeleton />
      </div>
    </div>
  );
}
