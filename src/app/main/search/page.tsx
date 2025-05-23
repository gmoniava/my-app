import SearchForm from "@/app/components/client/SearchForm";
import MovieList from "@/app/components/server/MoviesList";
import { Suspense } from "react";
import Pagination from "@/app/components/client/Pagination";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className=" h-full overflow-auto  ">
      <SearchForm />

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="justify-center items-center h-16 flex">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <MovieList searchParams={searchParams} />
      </Suspense>

      <Pagination />
    </div>
  );
}
