require('dotenv').config();
const prisma = require('../src/db/prismaClient');
const seedPosts = require('../src/data/postSeed');

// Idempotent development seed: creates known examples when absent and never wipes data.
async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'seed-owner@community.local' },
    update: { name: 'Seed Owner' },
    create: { name: 'Seed Owner', email: 'seed-owner@community.local' },
  });

  for (const post of seedPosts) {
    const existing = await prisma.post.findFirst({
      where: {
        title: post.title,
        body: post.body,
        authorId: owner.id,
      },
      select: { id: true },
    });

    if (!existing) {
      await prisma.post.create({
        data: {
          title: post.title,
          body: post.body || '',
          authorId: owner.id,
        },
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
    console.error('Development seed failed. Check DATABASE_URL and migrations.');
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
