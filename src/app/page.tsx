import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className=" w-1/3 border border-slate-300 p-[10px] h-[620px] rounded-md flex flex-col">
        <div className="text-2xl flex-1 text-center">Welcome to Movie App</div>
        <div className="flex justify-around">
          <Link className="btn-primary" href="/main">
            Main
          </Link>
          <Link className="btn-primary" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
