"use client";

import { useRouter } from "next/navigation";

export default function GenresPanel({ genres }: { genres: string[] }) {
  const router = useRouter();

  return (
    <div>
      {["1", "2", "3", "4", "5"].map((genre) => (
        <label key={genre}>
          <input
            checked={genres.includes(genre)}
            onChange={(e) => {
              const { name, checked } = e.target;
              const newGenres = checked ? [...genres, name] : genres.filter((g) => g !== name);

              const newParams = new URLSearchParams(newGenres.map((genre) => ["genre", genre]));

              router.push(`?${newParams}`);
            }}
            name={genre}
            type="checkbox"
          />
          Genre {genre}
        </label>
      ))}

      <div>
        <button onClick={() => router.push(`?`)}>Clear</button>
      </div>

      <div>
        <p>Params (Client):</p>

        <div>
          {genres.map((genre) => (
            <p key={genre}>{genre}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
