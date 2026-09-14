import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // 1. Create the session row in the database
  const dbSession = await prisma.session.create({
    data: { userId, expiresAt },
  });

  // 2. Sign a token containing just the session ID
  const sessionToken = await encrypt({
    sessionId: dbSession.id,
    expiresAt: expiresAt.getTime(),
  });

  // 3. Store the signed token in an httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    const payload = await decrypt(token);
    if (payload?.sessionId) {
      await prisma.session
        .delete({ where: { id: payload.sessionId } })
        .catch(() => {
          // Already gone — safe to ignore
        });
    }
  }

  cookieStore.delete("session");
}