import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicOnlyRoute = publicOnlyRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  if (isProtectedRoute && !session?.sessionId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicOnlyRoute && session?.sessionId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};