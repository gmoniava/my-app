"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useOptimistic, useActionState } from "react";
import { login, getSession } from "@/app/lib/auth";

export default function Search({ name }: any) {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="h-full">
      <div className="flex justify-center items-center h-full">
        <div className=" w-1/3 border border-slate-300 p-[10px] h-1/3 rounded-md flex flex-col">
          <div className="text-2xl flex-1 text-center">Please login</div>
          <div className="flex-1">
            {" "}
            <form action={formAction} style={{ padding: 10 }}>
              <div className="flex flex-col items-center gap-1">
                <input type="email" name="email" placeholder="Email" className="border rounded border-slate-300" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border rounded border-slate-300"
                />

                <button className={"btn-primary"} type="submit">
                  {isPending ? "Logging in" : "Login"}
                </button>
              </div>
            </form>
            {state?.error && <div className="text-red-800 text-lg text-center">{state.error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
