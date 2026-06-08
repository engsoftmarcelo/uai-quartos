import { SearchSkeletons } from "@/components/search/search-skeletons";

export default function SearchLoading() {
  return (
    <div className="uai-section bg-background">
      <div className="uai-container">
        <SearchSkeletons />
      </div>
    </div>
  );
}
