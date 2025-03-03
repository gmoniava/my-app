import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedGenres() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
     CREATE TABLE IF NOT EXISTS genres (
     id INTEGER PRIMARY KEY,
     name VARCHAR(255) NOT NULL
    );
    `;

  await sql`INSERT INTO genres (id, name) VALUES (1, 'Action');`;
  await sql`INSERT INTO genres (id, name) VALUES (2, 'Comedy');`;
  await sql`INSERT INTO genres (id, name) VALUES (3, 'Drama');`;
  await sql`INSERT INTO genres (id, name) VALUES (4, 'Thriller');`;
  await sql`INSERT INTO genres (id, name) VALUES (5, 'Sci-Fi');`;

  await sql`CREATE TABLE IF NOT EXISTS movie_genres (
      movie_id UUID,
      genre_id INTEGER,
      PRIMARY KEY (movie_id, genre_id),
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    );`;
}

async function seedMovies() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  const movies: any[] = [
    {
      name: "The Shawshank Redemption",
      year: 1994,
      actors: "Tim Robbins",
      description: `A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.`,
    },
  ];

  await sql`
      CREATE TABLE IF NOT EXISTS movies (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        release_year INTEGER NOT NULL,
        actors TEXT NOT NULL,
        description TEXT
      );
    `;
  const insertedMovies = await Promise.all(
    movies.map(async (movie: any) => {
      return sql`
            INSERT INTO movies (name, release_year, actors, description)
            VALUES (${movie.name}, ${movie.year}, ${movie.actors},  ${movie.description})            
          `;
    })
  );
  return insertedMovies;
}

export async function GET() {
  try {
    await seedGenres();
    await seedMovies();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
