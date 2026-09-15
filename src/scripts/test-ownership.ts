import "dotenv/config";
import { prisma } from "@/lib/db";

async function main() {
  // 1. Two separate users
  const userA = await prisma.user.create({
    data: {
      name: "User A",
      email: `user-a-${Date.now()}@example.com`,
      passwordHash: "placeholder-hash",
    },
  });
  const userB = await prisma.user.create({
    data: {
      name: "User B",
      email: `user-b-${Date.now()}@example.com`,
      passwordHash: "placeholder-hash",
    },
  });

  // 2. An application owned by User A
  const application = await prisma.application.create({
    data: {
      company: "Acme Corp",
      jobTitle: "Backend Engineer",
      jobType: "FULL_TIME",
      status: "APPLIED",
      userId: userA.id,
    },
  });
  console.log("Created application owned by User A:", application.id);

  // 3. User B tries to update it — the exact pattern our Server Actions use
  try {
    await prisma.application.update({
      where: { id: application.id, userId: userB.id },
      data: { company: "Hacked Corp" },
    });
    console.log("PROBLEM: User B was able to update User A's application!");
  } catch {
    console.log("Correctly blocked: User B cannot update User A's application.");
  }

  // 4. User B tries to delete it
  try {
    await prisma.application.delete({
      where: { id: application.id, userId: userB.id },
    });
    console.log("PROBLEM: User B was able to delete User A's application!");
  } catch {
    console.log("Correctly blocked: User B cannot delete User A's application.");
  }

  // 5. Confirm it's genuinely untouched
  const stillThere = await prisma.application.findUnique({
    where: { id: application.id },
  });
  console.log(
    "Application unchanged after the attack attempts (should be true):",
    stillThere?.company === "Acme Corp"
  );

  // 6. The real owner updates it successfully
  const updated = await prisma.application.update({
    where: { id: application.id, userId: userA.id },
    data: { company: "Acme Corp (Updated)" },
  });
  console.log("User A successfully updated their own application:", updated.company);

  // 7. Clean up
  await prisma.application.delete({
    where: { id: application.id, userId: userA.id },
  });
  await prisma.user.delete({ where: { id: userA.id } });
  await prisma.user.delete({ where: { id: userB.id } });
  console.log("Cleaned up test data.");
}

main()
  .catch((error) => {
    console.error("Something went wrong:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });