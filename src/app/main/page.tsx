import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/components/client/sidebar";
import { logout } from "@/app/lib/auth";

export default async function Page() {
  return (
    <div className="flex h-full">
      <Sidebar
        logout={async () => {
          "use server";
          await logout();
          redirect("/");
        }}
      />
      <div>Content</div>
    </div>
  );
}
