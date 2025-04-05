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

        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={"Type movie name"}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          value={optimisticName || ""}
        />
      </div>
    </div>
  );
}
