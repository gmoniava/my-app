"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export const PAGE_SIZE = 5;
export default function Pagination(props: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);

  const [optimisticPage, setOptimisticPage] = useOptimistic(page);
  const [pending, startTransition] = useTransition();

  // Handles page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    startTransition(() => {
      setOptimisticPage(newPage);
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const isNextDisabled = optimisticPage >= props.searchResults.total / PAGE_SIZE;
  const isPrevDisabled = optimisticPage === 1;
  const totalPages = Math.ceil(props.searchResults.total / PAGE_SIZE);

  return (
    <div className="flex justify-between items-center mt-4" data-pending={pending ? "" : undefined}>
      <button
        onClick={() => handlePageChange(optimisticPage - 1)}
        disabled={isPrevDisabled}
        className={`btn-secondary ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Previous
      </button>

      <span className="text-gray-600">
        Page {`${optimisticPage}/${totalPages}`} {/* Show the current optimistic page */}
      </span>

      <button
        onClick={() => handlePageChange(optimisticPage + 1)}
        disabled={isNextDisabled}
        className={`btn-secondary ${isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Next
      </button>
    </div>
  );
}
