import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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
        release_year INT NOT NULL,
        actors TEXT NOT NULL,
        description TEXT
      );
    `;
  const insertedMovies = await Promise.all(
    movies.map(async (movie: any) => {
      return sql`
            INSERT INTO movies (name, release_year, actors, description)
            VALUES (${movie.name}, ${movie.year}, ${movie.actors},  ${movie.description})
            ON CONFLICT (id) DO NOTHING;
          `;
    })
  );
  return insertedMovies;
}

export async function GET() {
  try {
    await sql.begin(() => [seedMovies()]);
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
