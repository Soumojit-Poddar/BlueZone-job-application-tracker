import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/db";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? await decrypt(token) : null;

  if (!payload?.sessionId) {
    redirect("/login");
  }

  // Check the database — this is what makes logout instant.
  // A stateless JWT alone couldn't do this; it would stay "valid" until it expired.
  const dbSession = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    select: { userId: true, expiresAt: true },
  });

  if (!dbSession || dbSession.expiresAt < new Date()) {
    redirect("/login");
  }

  return { isAuth: true, userId: dbSession.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });

  return user;
});