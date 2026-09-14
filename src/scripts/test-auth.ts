import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/session";

async function main() {
  // 1. Password hashing
  const plainPassword = "TestPassword123";
  const hash = await bcrypt.hash(plainPassword, 10);
  const matches = await bcrypt.compare(plainPassword, hash);
  const wrongMatches = await bcrypt.compare("WrongPassword", hash);
  console.log("Hash (truncated):", hash.slice(0, 20) + "...");
  console.log("Correct password matches (should be true):", matches);
  console.log("Wrong password matches (should be false):", wrongMatches);

  // 2. Create a test user + session row directly via Prisma
  const user = await prisma.user.create({
    data: {
      name: "Session Test User",
      email: `session-test-${Date.now()}@example.com`,
      passwordHash: hash,
    },
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const dbSession = await prisma.session.create({
    data: { userId: user.id, expiresAt },
  });
  console.log("Created DB session:", dbSession);

  // 3. Token round-trip (this is what the cookie will hold)
  const token = await encrypt({
    sessionId: dbSession.id,
    expiresAt: expiresAt.getTime(),
  });
  console.log("Encrypted token (truncated):", token.slice(0, 30) + "...");

  const payload = await decrypt(token);
  console.log("Decrypted payload:", payload);
  console.log(
    "Session ID round-trips correctly (should be true):",
    payload?.sessionId === dbSession.id
  );

  // 4. Clean up
  await prisma.session.delete({ where: { id: dbSession.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Cleaned up test user and session.");
}

main()
  .catch((error) => {
    console.error("Something went wrong:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });