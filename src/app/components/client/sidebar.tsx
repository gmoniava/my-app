"use client";
import { redirect } from "next/navigation";
import { logout } from "../../lib/auth";
import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Page(props: any) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  return (
    <div
      className={`border-r border-r-gray-300 h-full flex flex-col gap-1 items-center transition-all ${
        props.isOpen ? "w-64 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div>
        {" "}
        <Link
          href="/main"
          className={clsx("cursor-pointer", {
            "bg-sky-100 text-blue-600": pathname === "/main",
          })}
        >
          Main
        </Link>
      </div>

      <div>
        {" "}
        <Link
          href="/main/add-movie"
          className={clsx("cursor-pointer", {
            "bg-sky-100 text-blue-600": pathname === "/main/add-movie",
          })}
        >
          Add movie
        </Link>
      </div>

      <div>
        <Link
          href="/main/search"
          className={clsx("cursor-pointer", {
            "bg-sky-100 text-blue-600": pathname === "/main/search",
          })}
        >
          Search movies
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
