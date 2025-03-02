import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/auth";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/main"];
const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  let session: any;
  if (cookie) session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.user &&
    !req.nextUrl.pathname.startsWith("/main")
  ) {
    return NextResponse.redirect(new URL("/main", req.nextUrl), {
      status: 303,
    });
  }

  return NextResponse.next();
}
