"use server";
import postgres from "postgres";
import { NextResponse } from "next/server"; // To send a response
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
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
});

function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchMovies(searchParams: URLSearchParams): Promise<Movie[] | { error: string }> {
  try {
    await delay(1000);
    // Validate the query from URL
    const { name } = SearchSchema.parse({
      name: searchParams.get("name") || "",
    });

    let results: Movie[];
    if (name === "") {
      // No query? Return all movies
      results = await sql`
        SELECT m.id, m.name, m.release_year, m.actors, m.description,
               ARRAY_AGG(g.name) AS genres
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        GROUP BY m.id
        ORDER BY m.name ASC;
      `;
      return results;
    }
    results = await sql`
      SELECT m.id, m.name, m.release_year, m.actors, m.description,
             ARRAY_AGG(g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.name ILIKE ${"%" + name + "%"}
      GROUP BY m.id
      ORDER BY m.name ASC;
    `;

    return results;
  } catch (error) {
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
