"use server";
import postgres from "postgres";
import { NextResponse } from "next/server"; // To send a response
import { z } from "zod";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const PAGE_SIZE = 5;

export type Movie = {
  id: number;
  name: string;
  release_year: number;
  actors: string;
  description: string;
  genres: string[];
};
const AddFormSchema = z.object({
  name: z.string(),
  release_year: z.coerce.number(),
  actors: z.string(),
  description: z.string(),
  genres: z.array(z.coerce.number()),
});
const EditFormSchema = z.object({
  name: z.string(),
  release_year: z.coerce.number(),
  actors: z.string(),
  description: z.string(),
  genres: z.array(z.coerce.number()),
  movieId: z.string(),
});

const DeleteSchema = z.object({
  id: z.string(),
});

const SearchSchema = z.object({
  name: z.string().trim().max(100, "Search query too long"),
  page: z.coerce
    .number()
    .nullable()
    .transform((val) => val ?? 1),
  perPage: z.coerce
    .number()
    .nullable()
    .transform((val) => val ?? PAGE_SIZE),
  genres: z.union([z.string(), z.array(z.string())]).transform((value) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.map((s) => parseInt(s, 10));
  }),
  release_year_from: z.coerce.number().nullable(),
  release_year_to: z.coerce.number().nullable(),
  actor: z.string().nullable(),
  description: z.string().nullable(),
});

function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deleteMovie(movieId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const { id } = DeleteSchema.parse({
      id: movieId || "",
    });

    await sql`DELETE FROM movies WHERE id = ${id}`;

    revalidatePath("/main/search");
  } catch (error) {
    throw new Error("Could not delete the movie");
  }
}

export async function searchMovies(
  searchParams: Record<string, any>
): Promise<{ data: Movie[]; total: number } | { error: string }> {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await delay(5000);

    const raw = {
      name: searchParams.name ?? "",
      page: searchParams.page ?? null,
      perPage: searchParams.perPage ?? null,
      genres: searchParams.genres ?? [],
      release_year_from: searchParams.release_year_from ?? null,
      release_year_to: searchParams.release_year_to ?? null,
      actor: searchParams.actor ?? null,
      description: searchParams.description ?? null,
    };

    const { name, page, perPage, genres, release_year_from, release_year_to, actor, description } =
      SearchSchema.parse(raw);

    const nameQuery = name ? sql`AND m.name ILIKE ${"%" + name + "%"}` : sql``;
    const releaseYearFromQuery = release_year_from ? sql`AND m.release_year >= ${release_year_from}` : sql``;
    const releaseYearToQuery = release_year_to ? sql`AND m.release_year <= ${release_year_to}` : sql``;
    const actorQuery = actor ? sql`AND m.actors ILIKE ${"%" + actor + "%"}` : sql``;
    const descriptionQuery = description ? sql`AND m.description ILIKE ${"%" + description + "%"}` : sql``;

    // We need a movie who has at least one matching genre
    const genreQuery =
      genres.length > 0
        ? sql`
        AND EXISTS (
          SELECT 1
            FROM movie_genres mg2
           WHERE mg2.movie_id = m.id
             AND mg2.genre_id = ANY (${genres})
        )
      `
        : sql``;

    // Get total count
    const [{ count }] = await sql`
    SELECT COUNT(DISTINCT m.id)::int
    FROM movies m
    WHERE true
    ${nameQuery}  
    ${releaseYearFromQuery}
    ${releaseYearToQuery}
    ${actorQuery}
    ${descriptionQuery}
    ${genreQuery}
  `;

    // Get paginated data
    const offset = (page - 1) * perPage;
    const data: Movie[] = await sql`
    SELECT m.id, m.name, m.release_year, m.actors, m.description,
           ARRAY_AGG(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE true
    ${nameQuery}
    ${releaseYearFromQuery}
    ${releaseYearToQuery}
    ${actorQuery}
    ${descriptionQuery}
    ${genreQuery}
    GROUP BY m.id
    ORDER BY m.name ASC
    LIMIT ${perPage}
    OFFSET ${offset}
  `;

    return { data, total: count };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getMovieById(id: string): Promise<Movie | { error: string }> {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Get movie details with aggregated genres
  const movies: Movie[] = await sql`
      SELECT m.id, m.name, m.release_year, m.actors, m.description,
            ARRAY_AGG(mg.genre_id) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      WHERE m.id = ${id}
      GROUP BY m.id
    `;

  if (!movies[0]) {
    return { error: "Movie not found" };
  }

  return movies[0];
}

export async function addMovie(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const { name, release_year, actors, description, genres } = AddFormSchema.parse({
    name: formData.get("name"),
    release_year: formData.get("release_year"),
    actors: formData.get("actors"),
    description: formData.get("description"),
    genres: formData.getAll("genres"),
  });

  // Start a safe transaction
  await sql.begin(async (tx) => {
    // Insert movie into movies table
    const result = await tx`
        INSERT INTO movies (name, release_year, actors, description) 
        VALUES (${name}, ${release_year}, ${actors}, ${description})
        RETURNING id;
      `;

    const movieId = result[0].id; // Get the inserted movie ID

    // Insert movie-genre relationships
    await Promise.all(
      genres.map(
        (genreId) =>
          tx`
            INSERT INTO movie_genres (movie_id, genre_id) 
            VALUES (${movieId}, ${genreId});
          `
      )
    );
  });

  return { message: "Movie added successfully" };
}

export async function editMovie(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const { name, release_year, actors, description, genres, movieId } = EditFormSchema.parse({
    name: formData.get("name"),
    release_year: formData.get("release_year"),
    actors: formData.get("actors"),
    description: formData.get("description"),
    genres: formData.getAll("genres"),
    movieId: formData.get("id"),
  });

  // Start a safe transaction
  await sql.begin(async (tx) => {
    // Update movie in the movies table
    await tx`
        UPDATE movies
        SET name = ${name}, release_year = ${release_year}, actors = ${actors}, description = ${description}
        WHERE id = ${movieId};
      `;

    // Remove existing movie-genre relationships
    await tx`
        DELETE FROM movie_genres
        WHERE movie_id = ${movieId};
      `;

    // Insert the new movie-genre relationships
    await Promise.all(
      genres.map(
        (genreId) =>
          tx`
            INSERT INTO movie_genres (movie_id, genre_id) 
            VALUES (${movieId}, ${genreId});
          `
      )
    );
  });

  return { message: "Movie updated successfully" };
}
