"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "../../lib/auth";

export default function Page(props: any) {
  return (
    <div className="border-r h-full w-[300px]">
      <button className={"btn-primary"} type="submit" onClick={props.logout}>
        Logout
      </button>
    </div>
  );
}
