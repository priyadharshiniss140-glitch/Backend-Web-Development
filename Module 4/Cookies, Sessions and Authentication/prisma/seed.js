require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("SessionDemo!48", 10);
  await prisma.user.upsert({
    where: { email: "sam@example.com" },
    update: { name: "Sam", passwordHash },
    create: { name: "Sam", email: "sam@example.com", passwordHash },
  });
  // Avoid printing demo credentials or hashes to logs.
  console.log("Demo account seeded.");
}

main()
  .catch(() => {
    console.error("Seed failed.");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
