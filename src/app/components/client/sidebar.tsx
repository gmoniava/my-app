"use client";
import { redirect } from "next/navigation";
import { logout } from "../../lib/auth";
import { useTransition } from "react";
import Link from "next/link";

export default function Page(props: any) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-r h-full w-[300px] flex flex-col gap-1 items-center">
      <div>
        {" "}
        <Link href="/main/add-movie">
          <button className="cursor-pointer" type="submit">
            Add movie
          </button>
        </Link>
      </div>

      <div>
        <Link href="/main/movies">
          <button className="cursor-pointer" type="submit">
            Search movies
          </button>
        </Link>
      </div>

      <div>
        <button
          type="submit"
          className="cursor-pointer"
          onClick={() => {
            startTransition(async () => {
              await logout();
              redirect("/");
            });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
