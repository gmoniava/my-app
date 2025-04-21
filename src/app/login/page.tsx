"use client";

import { useActionState } from "react";
import { login } from "@/app/lib/auth";

export default function Search() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="h-full">
      <div className="flex justify-center items-center h-full">
        <div className=" w-1/3 border border-slate-300 p-[10px] h-1/3 rounded-md flex flex-col">
          <div className="text-2xl text-center">Please login</div>
          <div className="text-gray-400 text-center">Enter username and password</div>
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

                <button className={"btn-primary mt-2"} type="submit">
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
