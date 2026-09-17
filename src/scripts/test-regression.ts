import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/session";
import { ApplicationFormSchema } from "@/lib/definitions";

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`✅ ${label}`);
    passed++;
  } else {
    console.log(`❌ ${label}`);
    failed++;
  }
}

async function main() {
  console.log("--- Auth & Session ---");

  const plainPassword = "TestPassword123";
  const hash = await bcrypt.hash(plainPassword, 10);
  check("Correct password verifies", await bcrypt.compare(plainPassword, hash));
  check("Wrong password is rejected", !(await bcrypt.compare("WrongPassword", hash)));

  const token = await encrypt({ sessionId: "fake-id-123", expiresAt: Date.now() + 10000 });
  const decoded = await decrypt(token);
  check("Session token round-trips correctly", decoded?.sessionId === "fake-id-123");
  check("Tampered token is rejected", (await decrypt(token + "tampered")) === null);

  console.log("\n--- Form validation ---");

  const invalidApplication = ApplicationFormSchema.safeParse({
    company: "",
    jobTitle: "",
    jobType: "NOT_A_REAL_TYPE",
    status: "APPLIED",
  });
  check("Empty/invalid application fields are rejected", !invalidApplication.success);

  const validApplication = ApplicationFormSchema.safeParse({
    company: "Acme",
    jobTitle: "Engineer",
    jobType: "FULL_TIME",
    status: "APPLIED",
  });
  check("Valid minimal application data passes validation", validApplication.success);

  console.log("\n--- Database constraints ---");

  const email = `regression-${Date.now()}@example.com`;
  const userA = await prisma.user.create({
    data: { name: "Regression User A", email, passwordHash: hash },
  });

  let duplicateBlocked = false;
  try {
    await prisma.user.create({
      data: { name: "Duplicate", email, passwordHash: hash },
    });
  } catch {
    duplicateBlocked = true;
  }
  check("Duplicate email is rejected at the database level", duplicateBlocked);

  const userB = await prisma.user.create({
    data: {
      name: "Regression User B",
      email: `regression-b-${Date.now()}@example.com`,
      passwordHash: hash,
    },
  });

  console.log("\n--- Application & Interview ownership ---");

  const application = await prisma.application.create({
    data: {
      company: "Regression Corp",
      jobTitle: "Test Engineer",
      jobType: "FULL_TIME",
      status: "APPLIED",
      userId: userA.id,
    },
  });

  const interview = await prisma.interview.create({
    data: {
      applicationId: application.id,
      round: "Technical Round",
      interviewDate: new Date(),
      interviewType: "Video Call",
    },
  });

  let userBUpdateBlocked = false;
  try {
    await prisma.application.update({
      where: { id: application.id, userId: userB.id },
      data: { company: "Hacked" },
    });
  } catch {
    userBUpdateBlocked = true;
  }
  check("User B cannot update User A's application", userBUpdateBlocked);

  const interviewOwnedByB = await prisma.interview.findFirst({
    where: { id: interview.id, application: { userId: userB.id } },
  });
  check("User B's interview ownership check finds nothing", interviewOwnedByB === null);

  const interviewOwnedByA = await prisma.interview.findFirst({
    where: { id: interview.id, application: { userId: userA.id } },
  });
  check("User A's interview ownership check finds it", interviewOwnedByA !== null);

  console.log("\n--- Enum constraints ---");

  let invalidStatusBlocked = false;
  try {
    await prisma.$executeRaw`UPDATE "Application" SET status = 'NOT_A_REAL_STATUS' WHERE id = ${application.id}`;
  } catch {
    invalidStatusBlocked = true;
  }
  check("Database itself rejects an invalid enum value", invalidStatusBlocked);

  console.log("\n--- Cascade deletes ---");

  await prisma.user.delete({ where: { id: userA.id } });

  const applicationGone = await prisma.application.findUnique({
    where: { id: application.id },
  });
  const interviewGone = await prisma.interview.findUnique({
    where: { id: interview.id },
  });
  check("Deleting a user cascades to their applications", applicationGone === null);
  check(
    "Deleting a user cascades all the way to interviews on those applications",
    interviewGone === null
  );

  await prisma.user.delete({ where: { id: userB.id } });

  console.log(`\n${passed} passed, ${failed} failed`);
}

main()
  .catch((error) => {
    console.error("Regression script crashed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });