require('dotenv').config();

const express = require('express');
const postController = require('./controllers/postController');
const prisma = require('./db/prismaClient');

const app = express();
app.use(express.json());

app.get('/posts', postController.list);
app.get('/posts/:id', postController.get);
app.post('/posts', postController.create);
app.patch('/posts/:id', postController.update);
app.delete('/posts/:id', postController.remove);

// Do not expose raw Prisma, PostgreSQL, SQL, or stack details to API clients.
app.use((error, req, res, next) => {
  const statusCode = Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 && error.statusCode < 500
    ? error.statusCode
    : 500;

  if (statusCode >= 500) {
    console.error('[api:error]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(statusCode).json({ error: error.message || 'Request failed' });
});

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to PostgreSQL');

    const port = Number(process.env.PORT) || 3000;
    const server = app.listen(port, () => {
      console.log(`✅ API listening on port ${port}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received; closing API and Prisma connection`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start API. Check DATABASE_URL and database migrations.');
    console.error(error);
    await prisma.$disconnect().catch(() => {});
    process.exitCode = 1;
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
