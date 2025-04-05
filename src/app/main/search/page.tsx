import { addMovie, searchMovies } from "@/app/lib/movies";
import SearchForm from "@/app/components/client/SearchForm";
import MovieList from "@/app/components/client/MoviesList";
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams(searchParams as Record<string, string>);
  const searchResults = await searchMovies(params);
  if (!Array.isArray(searchResults)) return null;
  return (
    <div className="h-full flex flex-col">
      <SearchForm />
      <MovieList movies={searchResults} />
    </div>
  );
}
