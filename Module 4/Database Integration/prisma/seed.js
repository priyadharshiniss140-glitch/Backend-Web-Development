require('dotenv').config();
const prisma = require('../src/db/prismaClient');

// Safe, repeatable development seed. It never deletes or resets user data.
async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'seed-owner@community.local' },
    update: { name: 'Seed Owner' },
    create: { name: 'Seed Owner', email: 'seed-owner@community.local' },
  });

  const seedPosts = [
    { title: 'First post', body: 'The contract survives storage changes.' },
    { title: 'Second post', body: 'Migrations record database design.' },
  ];

  for (const fields of seedPosts) {
    const existing = await prisma.post.findFirst({
      where: { title: fields.title, authorId: owner.id },
      select: { id: true },
    });
    if (!existing) {
      await prisma.post.create({
        data: { ...fields, authorId: owner.id },
      });
    }
  }
}

main()
  .then(async () => {
    console.log('Development seed complete (existing data preserved).');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Development seed failed. Check DATABASE_URL and schema migration.');
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
