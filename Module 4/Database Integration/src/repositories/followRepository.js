const prisma = require('../db/prismaClient');
const { translatePrismaError } = require('./prismaErrors');
const fields = { id: true, followerId: true, followingId: true, createdAt: true };
const numericId = (id) => {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
};

async function findAll() {
  return prisma.follow.findMany({ select: fields, orderBy: { id: 'asc' } });
}
async function findById(id) {
  const key = numericId(id);
  return key === null ? null : prisma.follow.findUnique({ where: { id: key }, select: fields });
}
async function create(data) {
  try {
    return await prisma.follow.create({
      data: { followerId: data.followerId, followingId: data.followingId },
      select: fields,
    });
  } catch (error) { throw translatePrismaError(error); }
}
async function update(id, patch = {}) {
  const key = numericId(id);
  if (key === null) return null;
  const data = {};
  if (patch.followerId !== undefined) data.followerId = patch.followerId;
  if (patch.followingId !== undefined) data.followingId = patch.followingId;
  try {
    return await prisma.follow.update({ where: { id: key }, data, select: fields });
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    throw translatePrismaError(error);
  }
}
async function remove(id) {
  const key = numericId(id);
  if (key === null) return false;
  try {
    await prisma.follow.delete({ where: { id: key } });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    throw translatePrismaError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
