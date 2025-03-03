"use client";
import { redirect } from "next/navigation";
import { logout } from "../../lib/auth";
import { useTransition } from "react";

export default function Page(props: any) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-r h-full w-[300px]">
      <button
        className={"btn-primary"}
        type="submit"
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
  );
}
