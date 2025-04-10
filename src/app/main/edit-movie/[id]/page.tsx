import { addMovie, getMovieById, searchMovies } from "@/app/lib/movies";
import AddMovie from "../../add-movie/page";

export default async function Page(props: any) {
  const params = await props.params;
  const id = params.id;
  const movie = await getMovieById(id);
  return (
    <div>
      <AddMovie movie={movie} />
    </div>
  );
}
