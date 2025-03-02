import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  return (
    <div>
      Welcome
      <div>
        Go to{" "}
        <Link className="btn-primary" href="/main">
          Main
        </Link>
        <Link className="btn-primary" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
