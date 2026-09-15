import "dotenv/config";
import { prisma } from "@/lib/db";

async function main() {
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

  const applicationA = await prisma.application.create({
    data: {
      company: "Acme Corp",
      jobTitle: "Backend Engineer",
      jobType: "FULL_TIME",
      status: "INTERVIEW",
      userId: userA.id,
    },
  });

  const interview = await prisma.interview.create({
    data: {
      applicationId: applicationA.id,
      round: "Technical Round",
      interviewDate: new Date(),
      interviewType: "Video Call",
    },
  });
  console.log("Created interview under User A's application:", interview.id);

  // The exact ownership-check query our Server Actions use
  const ownedByB = await prisma.interview.findFirst({
    where: { id: interview.id, application: { userId: userB.id } },
  });
  console.log(
    "User B's ownership check correctly finds nothing (should be true):",
    ownedByB === null
  );

  const ownedByA = await prisma.interview.findFirst({
    where: { id: interview.id, application: { userId: userA.id } },
  });
  console.log(
    "User A's ownership check correctly finds it (should be true):",
    ownedByA !== null
  );

  // Cleanup — deleting the application cascades the interview
  await prisma.application.delete({ where: { id: applicationA.id } });
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