import GenresPanel from "./GenresPanel";

export default async function Page(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const searchParams = await props.searchParams;

  const genres = Array.isArray(searchParams.genre)
    ? searchParams.genre
    : searchParams.genre !== null && searchParams.genre !== undefined
    ? [searchParams.genre]
    : [];

  // Fetch the content...
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <GenresPanel genres={genres} />

      <div>
        <p>Params (Server):</p>

        <div>
          {genres.map((genre) => (
            <p key={genre}>{genre}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
