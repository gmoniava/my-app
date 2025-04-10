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
      <div className="hidden justify-center items-center h-16  group-has-[[data-pending]]:flex">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <Suspense fallback={<div data-pending="" />}>
        <MovieList searchResults={searchResults} />
      </Suspense>

      <Pagination searchResults={searchResults} />
    </div>
  );
}
