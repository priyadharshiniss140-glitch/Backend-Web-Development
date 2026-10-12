const prisma = require('../db/prismaClient');
const { translatePrismaError } = require('./prismaErrors');
const fields = { id: true, body: true, authorId: true, postId: true, createdAt: true, updatedAt: true };
const numericId = (id) => {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
};

async function findAll() {
  return prisma.comment.findMany({ select: fields, orderBy: { id: 'asc' } });
}
async function findById(id) {
  const key = numericId(id);
  return key === null ? null : prisma.comment.findUnique({ where: { id: key }, select: fields });
}
async function create(data) {
  try {
    return await prisma.comment.create({
      data: { body: data.body, authorId: data.authorId, postId: data.postId },
      select: fields,
    });
  } catch (error) { throw translatePrismaError(error); }
}
async function update(id, patch = {}) {
  const key = numericId(id);
  if (key === null) return null;
  const data = {};
  for (const field of ['body', 'authorId', 'postId']) {
    if (patch[field] !== undefined) data[field] = patch[field];
  }
  try {
    return await prisma.comment.update({ where: { id: key }, data, select: fields });
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    throw translatePrismaError(error);
  }
}
async function remove(id) {
  const key = numericId(id);
  if (key === null) return false;
  try {
    await prisma.comment.delete({ where: { id: key } });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    throw translatePrismaError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
