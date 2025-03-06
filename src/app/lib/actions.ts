"use server";
import postgres from "postgres";
import { NextResponse } from "next/server"; // To send a response
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  name: z.string(),
  release_year: z.coerce.number(),
  actors: z.string(),
  description: z.string(),
  genres: z.array(z.coerce.number()),
});

export async function addMovie(formData: FormData) {
  try {
    const { name, release_year, actors, description, genres } = FormSchema.parse({
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
