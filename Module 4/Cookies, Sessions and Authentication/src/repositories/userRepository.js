const prisma = require("../db/prisma");

// Return the hash only for credential verification; never serialize this record.
async function findByEmailForLogin(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
    },
  });
}

// Session identity recovery does not need the credential hash.
async function findPublicUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

module.exports = {
  findByEmailForLogin,
  findPublicUserById,
};
