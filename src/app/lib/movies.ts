"use server";
import postgres from "postgres";
import { NextResponse } from "next/server"; // To send a response
import { z } from "zod";
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
});

function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchMovies(
  searchParams: URLSearchParams
): Promise<{ data: Movie[]; total: number } | { error: string }> {
  try {
    await delay(1000);

    const { name, page, perPage } = SearchSchema.parse({
      name: searchParams.get("name") || "",
      page: searchParams.get("page"),
      perPage: searchParams.get("perPage"),
    });

    // Build WHERE clause conditionally
    const whereClause = name ? sql`WHERE m.name ILIKE ${"%" + name + "%"}` : sql``;

    // 1. Get total count
    const [{ count }] = await sql`
      SELECT COUNT(DISTINCT m.id)::int
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      ${whereClause}
    `;

    // 2. Get paginated data
    const offset = (page - 1) * perPage;
    const data: Movie[] = await sql`
      SELECT m.id, m.name, m.release_year, m.actors, m.description,
             ARRAY_AGG(g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      ${whereClause}
      GROUP BY m.id
      ORDER BY m.name ASC
      LIMIT ${perPage}
      OFFSET ${offset}
    `;

    return { data, total: count };
  } catch (error) {
    console.error(error);
    return { error: "Failed to search movies" };
  }
}

export async function addMovie(formData: FormData) {
  try {
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
  } catch (error) {
    return { error: "Failed to add movie: " };
  }
}
