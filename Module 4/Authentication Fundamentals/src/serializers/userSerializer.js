// Explicit allowlist: never serialize password or passwordHash.
function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

module.exports = serializeUser;
