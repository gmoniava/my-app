"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const secretKey = process.env.SECRET_KEY || (process.env.NODE_ENV === "development" ? "test-secret-key" : undefined);

const key = new TextEncoder().encode(secretKey);

export async function verify(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function sign(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

async function getUser(email: string): Promise<any> {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const UserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function login(previousState: any, formData: FormData) {
  // Parse the user from the request
  const user = UserSchema.parse({ email: formData.get("email") || "", password: formData.get("password") || "" });

  // Find user in the database
  const userFromDb = await getUser(user.email);
  if (!userFromDb) {
    return { error: "User not found" };
  }

  // Do the passwords match?
  const passWordsMatch = bcrypt.compareSync(user.password, userFromDb.password);
  if (!passWordsMatch) return { error: "Wrong credentials" };

  // We authenticated the user, now let's create a session.
  // The session will exist for 1 hour.
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const session = await sign({ user, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true });

  redirect("/main");
}

export async function logout() {
  // Destroy the session
  (await cookies()).delete("session");
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return verify(session);
}
