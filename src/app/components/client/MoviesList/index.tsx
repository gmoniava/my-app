import React from "react";
import type { Movie } from "@/app/lib/movies";
import { searchMovies } from "@/app/lib/movies";
type MovieListProps = {
  params: any;
};

const MovieList = async ({ params }: MovieListProps) => {
  const searchResults = await searchMovies(params);
  if (!Array.isArray(searchResults)) return null;

  return (
    <div className=" flex-1 overflow-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Movies</h2>
      {searchResults.length === 0 ? (
        <p className="text-center text-gray-500">No movies found.</p>
      ) : (
        <ul className="space-y-4">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {movie.name} ({movie.release_year})
              </h3>
              <p className="text-gray-600">
                <strong>Actors:</strong> {movie.actors}
              </p>
              <p className="text-gray-600">
                <strong>Genres:</strong> {movie.genres.join(", ")}
              </p>
              <p className="text-gray-800 mt-2">{movie.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieList;
