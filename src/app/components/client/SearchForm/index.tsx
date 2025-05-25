"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Search({ name }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const getInitialFormStateFromURL = () => {
    const getParam = (key: string) => searchParams.get(key) || "";

    const genres = searchParams.getAll("genres");

    return {
      name: getParam("name"),
      release_year_from: getParam("release_year_from"),
      release_year_to: getParam("release_year_to"),
      actor: getParam("actor"),
      description: getParam("description"),
      genres,
    };
  };

  const handleSearch = (prevState: any, formData: FormData): any => {
    // Basically we need to convert the FormData into a URLSearchParams object
    const params = new URLSearchParams(searchParams);

    const getValue = (key: string) => (formData.get(key) as string) || "";

    const name = getValue("name");
    const release_year_from = getValue("release_year_from");
    const release_year_to = getValue("release_year_to");
    const actor = getValue("actor");
    const description = getValue("description");
    const genres = formData.getAll("genres").map((g) => g.toString());

    const setOrDelete = (key: string, value: string) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("name", name);
    setOrDelete("release_year_from", release_year_from);
    setOrDelete("release_year_to", release_year_to);
    setOrDelete("actor", actor);
    setOrDelete("description", description);

    params.delete("genres");
    genres.forEach((genre) => {
      if (genre) params.append("genres", genre);
    });

    push(`${pathname}?${params.toString()}`);

    return {
      name,
      release_year_from,
      release_year_to,
      actor,
      description,
      genres,
    };
  };

  const [formState, formAction, isPending] = React.useActionState(handleSearch, getInitialFormStateFromURL());

  return (
    <div>
      <div className="h-full">
        <form action={formAction} className="w-1/2 mx-auto space-y-4 p-4 border rounded-lg">
          <div className="text-xl font-semibold">Search movies</div>

          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              name="name"
              className="border p-2 w-full"
              placeholder="e.g. Inception"
              defaultValue={formState.name}
            />
          </div>

          <div>
            <label className="block">Release Year Range:</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="release_year_from"
                className="border p-2 w-full"
                placeholder="From"
                defaultValue={formState.release_year_from}
              />
              <input
                type="number"
                name="release_year_to"
                className="border p-2 w-full"
                placeholder="To"
                defaultValue={formState.release_year_to}
              />
            </div>
          </div>

          <div>
            <label className="block">Actors:</label>
            <input
              type="text"
              name="actor"
              className="border p-2 w-full"
              placeholder="e.g. Leonardo DiCaprio"
              defaultValue={formState.actor}
            />
          </div>

          <div>
            <label className="block">Description:</label>
            <input
              type="text"
              name="description"
              className="border p-2 w-full"
              placeholder="e.g. This is a drama movie.."
              defaultValue={formState.description}
            />
          </div>

          <div>
            <label className="block">Genres:</label>
            <select
              // Had to add this because the select was not picking up the defaultValue unlike inputs during a re-render.
              key={[...new Set(formState.genres)].sort().join(",")}
              name="genres"
              multiple
              className="border p-2 w-full"
              defaultValue={formState.genres}
            >
              <option value="1">Action</option>
              <option value="2">Comedy</option>
              <option value="3">Drama</option>
              <option value="4">Thriller</option>
              <option value="5">Sci-Fi</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
    </div>
  );
}
