"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useOptimistic, useTransition } from "react";
import { addMovie, searchMovies } from "@/app/lib/movies";

export const PAGE_SIZE = 5;
export default function Pagination(props: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  // Get the current page from the URL search params
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [optimisticPage, setOptimisticPage] = useOptimistic(page);
  const [pending, startTransition] = useTransition();
  const [total, setTotal] = React.useState<number>(0);

  // We basically want to get total here
  React.useEffect(() => {
    // Convert searchParams to an object
    // so we can pass it to searchMovies
    const paramsObject = Object.fromEntries(searchParams.entries());

    const fetchData = async () => {
      const result = await searchMovies(paramsObject);
      if ("error" in result) return;

      setTotal(result.total);
    };

    fetchData();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    startTransition(() => {
      // Make sure we see the new page immediately
      // even if the server response is delayed
      setOptimisticPage(newPage);

      // Now push the new page to the URL
      // This will trigger a re-render and fetch the new data
      push(`${pathname}?${params.toString()}`);
    });
  };

  const isNextDisabled = optimisticPage >= total / PAGE_SIZE;
  const isPrevDisabled = optimisticPage === 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex justify-between items-center mt-4" data-pending={pending ? "" : undefined}>
      <button
        onClick={() => handlePageChange(optimisticPage - 1)}
        disabled={isPrevDisabled}
        className={`btn-secondary ${isPrevDisabled ? "opacity-50" : ""}`}
      >
        Previous
      </button>

      <span className="text-gray-600">Page {`${optimisticPage}/${totalPages}`}</span>

      <button
        onClick={() => handlePageChange(optimisticPage + 1)}
        disabled={isNextDisabled}
        className={`btn-secondary ${isNextDisabled ? "opacity-50" : ""}`}
      >
        Next
      </button>
    </div>
  );
}
