"use client";

import { addMovie } from "@/app/lib/actions";

export default function Page() {
  return (
    <div className="h-full">
      <div
        onClick={() => {
          const formData = new FormData();
          formData.append("name", "Inception");
          formData.append("release_year", "2010");
          formData.append("actors", "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page");
          formData.append("description", "A mind-bending thriller about dreams within dreams.");
          formData.append("genres", "1");
          formData.append("genres", "2");
          addMovie(formData);
        }}
      >
        Add movie
      </div>
    </div>
  );
}
