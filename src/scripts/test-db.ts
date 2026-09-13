import "dotenv/config";
import { prisma } from "@/lib/db";

async function main() {
  const created = await prisma.connectionTest.create({
    data: { message: "Hello from Prisma + Neon!" },
  });
  console.log("Created row:", created);

  const all = await prisma.connectionTest.findMany();
  console.log("All rows in table:", all);
}

main()
  .catch((error) => {
    console.error("Something went wrong:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });