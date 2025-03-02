import { redirect } from "next/navigation";
import { login, getSession, logout } from "@/app/lib/auth";

export default async function Page() {
  const session = await getSession();
  return (
    <section>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
          redirect("/main");
        }}
        style={{ padding: 10 }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border rounded "
        />
        <br />
        <button className={"btn-primary"} type="submit">
          Login
        </button>
      </form>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}
