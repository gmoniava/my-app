import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/app/components/client/sidebar";
import { logout } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en" className="h-full flex">
      <Sidebar
        logout={async () => {
          "use server";
          await logout();
          redirect("/");
        }}
      />
      <div>{children}</div>
    </div>
  );
}
