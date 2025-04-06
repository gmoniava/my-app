"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function GenresPanel({ genres }: { genres: string[] }) {
  const router = useRouter();
  console.log(genres);

  React.useEffect(() => {
    console.log("MOUNTED");
  }, []);

  return (
    <div>
      {["1", "2", "3", "4", "5"].map((genre) => (
        <label key={genre}>
          <input
            name={genre}
            type="checkbox"
            defaultChecked={genres.indexOf(genre) !== -1 ? true : false}
            onChange={(e) => {
              const { name, checked } = e.target;
              const newGenres = checked ? [...genres, name] : genres.filter((g) => g !== name);

              const newParams = new URLSearchParams(newGenres.map((genre) => ["genre", genre]));

              router.push(`?${newParams}`);
            }}
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
