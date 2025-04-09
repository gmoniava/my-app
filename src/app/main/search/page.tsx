import { addMovie, searchMovies } from "@/app/lib/movies";
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
  const urlSearchParams = new URLSearchParams(searchParams as Record<string, string>);
  const searchResults = await searchMovies(urlSearchParams);
  if ("error" in searchResults) return <div>Error</div>;

  return (
    <div className=" h-full flex flex-col group">
      <SearchForm />
      {/* We are handling loading state this way by combining has and group utilities from tailwind */}
      <div className="my-[5px] hidden group-has-[[data-pending]]:animate-pulse group-has-[[data-pending]]:block rounded mx-auto w-[200px] bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Loading movies
      </div>
      <Suspense fallback={<div data-pending="" />}>
        <MovieList searchResults={searchResults} />
      </Suspense>

      <Pagination searchResults={searchResults} />
    </div>
  );
}
