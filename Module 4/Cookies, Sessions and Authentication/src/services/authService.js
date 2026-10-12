const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const sessionStore = require("../session/sessionStore");
const HttpError = require("../errors/HttpError");

const INVALID_CREDENTIALS = {
  status: 401,
  code: "INVALID_CREDENTIALS",
  message: "Invalid email or password",
};

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateLoginInput(input) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    !isNonEmptyString(input.email) ||
    !isNonEmptyString(input.password)
  ) {
    throw new HttpError(
      400,
      "INVALID_INPUT",
      "Email and password must be non-empty strings"
    );
  }

  const email = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "INVALID_INPUT", "Email must be valid");
  }

  return { email, password: input.password };
}

async function login(input) {
  const { email, password } = validateLoginInput(input);
  const user = await userRepository.findByEmailForLogin(email);

  if (!user) {
    throw new HttpError(
      INVALID_CREDENTIALS.status,
      INVALID_CREDENTIALS.code,
      INVALID_CREDENTIALS.message
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(
      INVALID_CREDENTIALS.status,
      INVALID_CREDENTIALS.code,
      INVALID_CREDENTIALS.message
    );
  }

  // The cookie only carries this random, opaque ID; user data stays server-side.
  const { sessionId } = sessionStore.create(user.id);

  return {
    sessionId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

async function resolveSession(sessionId) {
  const session = sessionStore.get(sessionId);
  if (!session) return null;

  const user = await userRepository.findPublicUserById(session.userId);
  if (!user) {
    // A session whose user was deleted must not remain valid.
    sessionStore.destroy(sessionId);
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function logout(sessionId) {
  if (typeof sessionId === "string" && sessionId.length > 0) {
    sessionStore.destroy(sessionId);
  }
}

module.exports = {
  login,
  resolveSession,
  logout,
};
