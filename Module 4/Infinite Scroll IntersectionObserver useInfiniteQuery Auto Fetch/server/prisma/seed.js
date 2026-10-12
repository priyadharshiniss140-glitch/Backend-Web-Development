import prisma from "./client.js";

// 35 threads so infinite scroll has several pages (page size 10 → 4 pages).
// createdAt is spread so ordering is stable and visible.
// A few rows are author-less (authorId: null) to keep the UI's fallbacks honest.
async function main() {
  await prisma.comment.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.author.deleteMany();

  const ada = await prisma.author.create({
    data: { name: "Ada", avatarUrl: "/avatars/ada.svg" },
  });
  const linus = await prisma.author.create({
    data: { name: "Linus", avatarUrl: "/avatars/linus.svg" },
  });
  const grace = await prisma.author.create({
    data: { name: "Grace", avatarUrl: "/avatars/grace.svg" },
  });
  const authors = [ada.id, linus.id, grace.id];

  const TOTAL = 35;
  const day = (n) => new Date(Date.now() - n * 3_600_000); // n hours ago

  for (let i = 1; i <= TOTAL; i++) {
    // every 7th thread has no author, to exercise the fallback UI
    const authorId = i % 7 === 0 ? null : authors[i % authors.length];

    const thread = await prisma.thread.create({
      data: {
        title: `Thread #${String(i).padStart(2, "0")}`,
        body: `Seeded thread number ${i} for pagination testing.`,
        authorId,
        createdAt: day(TOTAL - i), // #01 oldest … #35 newest
      },
    });

    const commentCount = i % 4; // 0–3 comments, varied per thread
    if (commentCount > 0) {
      await prisma.comment.createMany({
        data: Array.from({ length: commentCount }, (_, c) => ({
          body: `Comment ${c + 1} on thread ${i}`,
          threadId: thread.id,
        })),
      });
    }
  }

  console.log(`✅ Seeded ${TOTAL} threads (page size 10 → 4 pages)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
