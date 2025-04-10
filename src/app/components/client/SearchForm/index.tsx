"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export default function Search({ name }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const [optimisticName, setOptimisticName] = useOptimistic(searchParams.get("name"));
  const [pending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("name", term);
    } else {
      params.delete("name");
    }

    startTransition(() => {
      setOptimisticName(term);
      replace(`${pathname}?${params.toString()}`);
    });
  }
  return (
    <div data-pending={pending ? "" : undefined}>
      <div className="w-1/2 mx-auto space-y-4 p-4 border rounded-lg">
        <div className="text-xl font-semibold">Search movies</div>

        <div className="relative group/search overflow-hidden">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <input
            type="search"
            id="default-search"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            value={optimisticName || ""}
            className={`border w-full pl-8 pr-2 py-1.5 rounded-lg focus:outline-none focus:border focus:border-gray-400`}
          />
          <div
            className={`absolute inset-y-0 -left-8 group-focus-within/search:-left-0 transition-all duration-200 ease-in-out flex items-center pl-2 pointer-events-none`}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 black"
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
