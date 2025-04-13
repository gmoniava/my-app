import { redirect } from "next/navigation";
import { login, getSession } from "@/app/lib/auth";

export default async function Page() {
  const loginToApp = async (formData: any) => {
    "use server";
    await login(formData);
    redirect("/main");
  };

  return (
    <div className="h-full">
      <div className="flex justify-center items-center h-full">
        <div className=" w-1/3 border border-slate-300 p-[10px] h-1/3 rounded-md flex flex-col">
          <div className="text-2xl flex-1 text-center">Please login</div>
          <div className="flex-1">
            {" "}
            <form action={loginToApp} style={{ padding: 10 }}>
              <div className="flex flex-col items-center gap-1">
                <input type="email" name="email" placeholder="Email" className="border rounded border-slate-300" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border rounded border-slate-300"
                />

                <button className={"btn-primary"} type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
