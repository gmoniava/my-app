import { Suspense } from "react";
import GenresPanel from "./GenresPanel";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const genres = Array.isArray(searchParams.genre)
    ? searchParams.genre
    : searchParams.genre !== null && searchParams.genre !== undefined
    ? [searchParams.genre]
    : [];

  return (
    <div>
      <GenresPanel genres={genres} />

      <div>
        <Suspense fallback={<p>Loading...</p>} key={JSON.stringify(searchParams)}>
          <MovieList genres={genres} />
        </Suspense>
      </div>
    </div>
  );
}

async function MovieList({ genres }: { genres: string[] }) {
  // Fetch the content...
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <>
      <p>Params (Server):</p>

      <div>
        {genres.map((genre) => (
          <p key={genre}>{genre}</p>
        ))}
      </div>
    </>
  );
}
