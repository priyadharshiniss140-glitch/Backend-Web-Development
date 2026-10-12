const prisma = require('../db/prismaClient');
const { translatePrismaError } = require('./prismaErrors');

const userFields = { id: true, name: true, email: true, createdAt: true, updatedAt: true };
const numericId = (id) => {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
};

async function findAll() {
  return prisma.user.findMany({ select: userFields, orderBy: { id: 'asc' } });
}
async function findById(id) {
  const key = numericId(id);
  return key === null ? null : prisma.user.findUnique({ where: { id: key }, select: userFields });
}
async function create(fields) {
  try {
    return await prisma.user.create({
      data: { name: fields.name, email: fields.email },
      select: userFields,
    });
  } catch (error) { throw translatePrismaError(error); }
}
async function update(id, patch = {}) {
  const key = numericId(id);
  if (key === null) return null;
  const data = {};
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.email !== undefined) data.email = patch.email;
  try {
    return await prisma.user.update({ where: { id: key }, data, select: userFields });
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    throw translatePrismaError(error);
  }
}
async function remove(id) {
  const key = numericId(id);
  if (key === null) return false;
  try {
    await prisma.user.delete({ where: { id: key } });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    throw translatePrismaError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
