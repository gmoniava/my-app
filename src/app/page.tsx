import Link from "next/link";
import Image from "next/image";
import moviesPng from "./images/movies.png";
export default async function Page() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className=" w-1/3 border border-slate-300 p-[10px] h-1/3 rounded-md flex flex-col text-center">
        <div className="flex-2">
          <div className="text-2xl">Welcome to the Movie App</div>
          <div className="mt-1">Welcome to the movie application. </div>
          <Image src={moviesPng} alt="Picture of the author" width={100} height={100} className="mt-1 mb-1 mx-auto" />
        </div>
        <div className="flex-1 flex justify-center items-start ">
          <Link className="btn-primary inline-block" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
