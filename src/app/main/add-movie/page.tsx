"use client";

import { addMovie, editMovie } from "@/app/lib/movies";
import React, { useState, useTransition } from "react";

const emptyForm = { name: "", release_year: "", actors: "", description: "", genres: [] };

export default function Page(props: any) {
  const [form, setForm] = useState(
    // In edit mode, pre-fill the form with movie data that is passed as props.
    props.movie ? { ...props.movie, genres: props.movie.genres?.map((t: any) => t.toString()) } : emptyForm
  );

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message before submitting
    setMessage("");

    // Converting to form data for submission because the backend expects form-data.
    const data = new FormData();
    data.append("name", form.name);
    data.append("release_year", form.release_year);
    data.append("actors", form.actors);
    data.append("description", form.description);
    form.genres.forEach((genre: any) => data.append("genres", genre));

    startTransition(async () => {
      try {
        // Are we in edit mode or add mode?
        if (props.movie) {
          // We are in edit mode, so we need to include the movie ID.
          data.append("id", form.id);
          await editMovie(data);
          setMessage("Movie edited successfully!");
        } else {
          await addMovie(data);
          setMessage("Movie added successfully!");
          setForm(emptyForm);
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
      // Select-multiple returns a collection of selected options as HTMLCollection.
      const values = Array.from(selectedOptions, (option: any) => option.value);
      setForm({ ...form, [name]: values });
    } else {
      setForm({ ...form, [name]: value });
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
            value={form.name}
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
            value={form.release_year}
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
            value={form.actors}
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
            value={form.description}
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
            value={form.genres}
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
