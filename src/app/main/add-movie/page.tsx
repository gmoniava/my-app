"use client";

import { addMovie, editMovie } from "@/app/lib/movies";
import React, { useState, useTransition } from "react";

export default function Page(props: any) {
  const [formData, setFormData] = useState(
    props.movie
      ? { ...props.movie, genres: props.movie.genres?.map((t: any) => t.toString()) }
      : {
          name: "",
          release_year: "",
          actors: "",
          description: "",
          genres: [],
        }
  );

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Reset message before submitting

    const data = new FormData();
    data.append("name", formData.name);
    data.append("release_year", formData.release_year);
    data.append("actors", formData.actors);
    data.append("description", formData.description);
    formData.genres.forEach((genre: any) => data.append("genres", genre));

    startTransition(async () => {
      try {
        if (props.movie) {
          data.append("id", formData.id);
          await editMovie(data);
          setMessage("Movie edited successfully!");
        } else {
          await addMovie(data);
          setMessage("Movie added successfully!");
          setFormData({ name: "", release_year: "", actors: "", description: "", genres: [] }); // Reset form
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed. Please try again.");
      }
    });
  };

  const handleChange = (e: any) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option: any) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="w-1/2 mx-auto space-y-4 p-4 border rounded-lg">
        <div className="text-xl font-semibold">{props.movie ? "Edit movie" : "Add new movie"}</div>

        <div>
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block">Release Year:</label>
          <input
            type="number"
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            className="border p-2 w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block">Actors (comma-separated):</label>
          <input
            type="text"
            name="actors"
            value={formData.actors}
            onChange={handleChange}
            className="border p-2 w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block">Genres:</label>
          <select
            name="genres"
            multiple
            value={formData.genres}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={isPending}
          >
            <option value="1">Action</option>
            <option value="2">Comedy</option>
            <option value="3">Drama</option>
            <option value="4">Thriller</option>
            <option value="5">Sci-Fi</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isPending}>
          {isPending ? (props.movie ? "Editing..." : "Adding") : props.movie ? "Edit Movie" : "Add Movie"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
}
