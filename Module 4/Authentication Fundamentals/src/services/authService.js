const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const serializeUser = require("../serializers/userSerializer");
const AppError = require("../errors/AppError");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function requireFields(input, fields) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    fields.some((field) => !isNonEmptyString(input[field]))
  ) {
    throw new AppError(
      400,
      "INVALID_INPUT",
      `Required fields must be non-empty strings: ${fields.join(", ")}`
    );
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getSaltRounds() {
  const configuredRounds = Number(process.env.BCRYPT_COST);
  return Number.isInteger(configuredRounds) &&
    configuredRounds >= 4 &&
    configuredRounds <= 31
    ? configuredRounds
    : 12;
}

function invalidCredentialsError() {
  return new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
}

function emailAlreadyExistsError() {
  return new AppError(409, "EMAIL_ALREADY_EXISTS", "Email already exists");
}

async function register(input) {
  requireFields(input, ["name", "email", "password"]);

  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw emailAlreadyExistsError();
  }

  // Preserve the password as supplied; only validate it with trim().
  const passwordHash = await bcrypt.hash(input.password, getSaltRounds());

  try {
    const user = await userRepository.createUser({
      name,
      email,
      passwordHash,
    });
    return serializeUser(user);
  } catch (error) {
    // Handle concurrent registrations that race past the pre-check.
    if (error && error.code === "EMAIL_ALREADY_EXISTS") {
      throw emailAlreadyExistsError();
    }
    throw error;
  }
}

async function login(input) {
  requireFields(input, ["email", "password"]);

  const email = normalizeEmail(input.email);
  const user = await userRepository.findByEmail(email);

  // Both credential failures intentionally use exactly the same response.
  if (!user) {
    throw invalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw invalidCredentialsError();
  }

  return serializeUser(user);
}

module.exports = {
  register,
  login,
};
