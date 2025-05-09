import postgres from "postgres";
import bcrypt from "bcryptjs";

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

const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@gmail.com",
    password: "123456",
  },
];

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user: any) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);

      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hash})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedMovies() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  const movies: any[] = [
    {
      name: "The Dark Knight",
      year: 2008,
      actors: "Christian Bale, Heath Ledger",
      description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    },
    {
      name: "Pulp Fiction",
      year: 1994,
      actors: "John Travolta, Uma Thurman",
      description: "The lives of two mob hitmen, a boxer, and others intertwine in tales of violence and redemption.",
    },
    {
      name: "Forrest Gump",
      year: 1994,
      actors: "Tom Hanks, Robin Wright",
      description:
        "The presidencies of Kennedy and Johnson, the Vietnam War, and more through the eyes of an Alabama man.",
    },
    {
      name: "Inception",
      year: 2010,
      actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
      description: "A thief who steals corporate secrets through dream-sharing is given a task to plant an idea.",
    },
    {
      name: "Fight Club",
      year: 1999,
      actors: "Brad Pitt, Edward Norton",
      description: "An insomniac office worker and a soap maker form an underground fight club.",
    },
    {
      name: "The Matrix",
      year: 1999,
      actors: "Keanu Reeves, Laurence Fishburne",
      description: "A computer hacker learns about the true nature of his reality and his role in the war.",
    },
    {
      name: "Goodfellas",
      year: 1990,
      actors: "Robert De Niro, Ray Liotta",
      description:
        "The story of Henry Hill and his life in the mob, covering his relationship with his wife and partners.",
    },
    {
      name: "The Lord of the Rings: The Return of the King",
      year: 2003,
      actors: "Elijah Wood, Viggo Mortensen",
      description:
        "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam.",
    },
    {
      name: "Star Wars: Episode V - The Empire Strikes Back",
      year: 1980,
      actors: "Mark Hamill, Harrison Ford",
      description: "After the Rebels are overpowered by the Empire, Luke begins Jedi training with Yoda.",
    },
    {
      name: "The Silence of the Lambs",
      year: 1991,
      actors: "Jodie Foster, Anthony Hopkins",
      description: "A young FBI cadet must confide in an incarcerated cannibal killer to catch another serial killer.",
    },
    {
      name: "Se7en",
      year: 1995,
      actors: "Morgan Freeman, Brad Pitt",
      description: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives.",
    },
    {
      name: "The Usual Suspects",
      year: 1995,
      actors: "Kevin Spacey, Gabriel Byrne",
      description: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat.",
    },
    {
      name: "Saving Private Ryan",
      year: 1998,
      actors: "Tom Hanks, Matt Damon",
      description:
        "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper.",
    },
    {
      name: "Schindler's List",
      year: 1993,
      actors: "Liam Neeson, Ralph Fiennes",
      description: "In German-occupied Poland, Oskar Schindler becomes concerned for his Jewish workforce.",
    },
    {
      name: "The Green Mile",
      year: 1999,
      actors: "Tom Hanks, Michael Clarke Duncan",
      description:
        "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder.",
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
    // await seedGenres();
    // await seedMovies();
    // await seedUsers();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
