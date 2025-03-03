"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SECRET_KEY || (process.env.NODE_ENV === "development" ? "test-secret-key" : undefined);

const key = new TextEncoder().encode(secretKey);

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get("email"), name: "John" };

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  (await cookies()).delete("session");
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
