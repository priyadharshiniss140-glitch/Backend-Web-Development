const prisma = require('../db/prismaClient');
const { translatePrismaError } = require('./prismaErrors');
const fields = { id: true, postId: true, tagId: true, createdAt: true };
const numericId = (id) => {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
};

async function findAll() {
  return prisma.postTag.findMany({ select: fields, orderBy: { id: 'asc' } });
}
async function findById(id) {
  const key = numericId(id);
  return key === null ? null : prisma.postTag.findUnique({ where: { id: key }, select: fields });
}
async function create(data) {
  try {
    return await prisma.postTag.create({
      data: { postId: data.postId, tagId: data.tagId },
      select: fields,
    });
  } catch (error) { throw translatePrismaError(error); }
}
async function update(id, patch = {}) {
  const key = numericId(id);
  if (key === null) return null;
  const data = {};
  if (patch.postId !== undefined) data.postId = patch.postId;
  if (patch.tagId !== undefined) data.tagId = patch.tagId;
  try {
    return await prisma.postTag.update({ where: { id: key }, data, select: fields });
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    throw translatePrismaError(error);
  }
}
async function remove(id) {
  const key = numericId(id);
  if (key === null) return false;
  try {
    await prisma.postTag.delete({ where: { id: key } });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    throw translatePrismaError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
