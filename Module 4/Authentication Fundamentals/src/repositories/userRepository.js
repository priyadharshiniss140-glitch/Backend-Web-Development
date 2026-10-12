const prisma = require("../db/prisma");

async function findByEmail(email) {
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

async function createUser({ name, email, passwordHash }) {
  try {
    return await prisma.user.create({
      data: { name, email, passwordHash },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch (error) {
    // Translate Prisma's unique-email violation into a repository-level error.
    // The Prisma exception itself is not exposed to a client or logged.
    if (error && error.code === "P2002") {
      const duplicateEmailError = new Error("Email already exists");
      duplicateEmailError.code = "EMAIL_ALREADY_EXISTS";
      throw duplicateEmailError;
    }
    throw error;
  }
}

module.exports = {
  findByEmail,
  createUser,
};
