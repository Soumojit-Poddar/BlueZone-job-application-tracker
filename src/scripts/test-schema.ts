import "dotenv/config";
import { prisma } from "@/lib/db";

async function main() {
  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      passwordHash: "temporary-placeholder-hash",
    },
  });
  console.log("Created user:", user);

  // 2. Create an application belonging to that user
  const application = await prisma.application.create({
    data: {
      company: "IBM",
      jobTitle: "Software Engineer",
      jobType: "FULL_TIME",
      location: "Bengaluru",
      status: "APPLIED",
      userId: user.id,
    },
  });
  console.log("Created application:", application);

  // 3. Create two interviews for that application
  await prisma.interview.createMany({
    data: [
      {
        applicationId: application.id,
        round: "Technical Round",
        interviewDate: new Date("2026-09-18"),
        interviewType: "Video Call",
      },
      {
        applicationId: application.id,
        round: "HR Round",
        interviewDate: new Date("2026-09-22"),
        interviewType: "Phone",
      },
    ],
  });

  // 4. Fetch the user with nested applications and interviews
  const userWithData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      applications: {
        include: { interviews: true },
      },
    },
  });
  console.log("User with nested data:", JSON.stringify(userWithData, null, 2));

  // 5. Delete the application — interviews should cascade-delete automatically
  await prisma.application.delete({ where: { id: application.id } });
  const remainingInterviews = await prisma.interview.findMany({
    where: { applicationId: application.id },
  });
  console.log(
    "Interviews remaining after deleting application (should be 0):",
    remainingInterviews.length
  );

  // 6. Clean up the test user
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Test user cleaned up.");
}

main()
  .catch((error) => {
    console.error("Something went wrong:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });