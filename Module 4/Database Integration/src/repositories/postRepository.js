const prisma = require('../db/prismaClient');
const { translatePrismaError } = require('./prismaErrors');

// Keep the existing post repository contract and response shape stable.
// Database timestamps and relation objects are deliberately not added to API records.
const postFields = {
  id: true,
  title: true,
  body: true,
  authorId: true,
};

function toPost(record) {
  if (!record) return null;
  return {
    id: record.id,
    title: record.title,
    body: record.body,
    // Match the old in-memory behavior: undefined authorId is omitted by JSON serialization.
    authorId: record.authorId == null ? undefined : record.authorId,
  };
}

function numericId(id) {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

async function findAll() {
  const records = await prisma.post.findMany({
    select: postFields,
    orderBy: { id: 'asc' },
  });
  return records.map(toPost);
}

async function findById(id) {
  const key = numericId(id);
  if (key === null) return null;
  const record = await prisma.post.findUnique({
    where: { id: key },
    select: postFields,
  });
  return toPost(record);
}

async function create(fields) {
  try {
    const record = await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId ?? null,
      },
      select: postFields,
    });
    return toPost(record);
  } catch (error) {
    throw translatePrismaError(error);
  }
}

async function update(id, patch = {}) {
  const key = numericId(id);
  if (key === null) return null;

  // Keep the existing editable fields: title and body only.
  const data = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  try {
    const record = await prisma.post.update({
      where: { id: key },
      data,
      select: postFields,
    });
    return toPost(record);
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    throw translatePrismaError(error);
  }
}

async function remove(id) {
  const key = numericId(id);
  if (key === null) return false;
  try {
    await prisma.post.delete({ where: { id: key } });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    throw translatePrismaError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
