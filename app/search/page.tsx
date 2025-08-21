import SearchPage from "@/components/search";
import { Suspense } from "react";

function Search() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            Loading...
            {/* <Loader2 className="w-8 h-8 animate-spin" /> */}
          </div>
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}

export default Search;
