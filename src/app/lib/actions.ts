"use server";
import postgres from "postgres";
import { NextResponse } from "next/server"; // To send a response

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function addMovie(formData: FormData) {
  const name = formData.get("name") as string;
  const release_year = parseInt(formData.get("release_year") as string);
  const actors = formData.get("actors") as string;
  const description = formData.get("description") as string;
  const genres = formData.getAll("genres") as string[]; // Array of selected genre IDs

  if (!name || !release_year || !actors || !description || genres.length === 0) {
    throw new Error("Missing required form data");
  }

  try {
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
