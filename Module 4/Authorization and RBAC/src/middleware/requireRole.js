const UNAUTHENTICATED = {
  error: {
    code: "UNAUTHENTICATED",
    message: "Authentication required",
  },
};

const FORBIDDEN = {
  error: {
    code: "FORBIDDEN",
    message: "Insufficient permissions",
  },
};

module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(UNAUTHENTICATED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(FORBIDDEN);
    }

    return next();
  };
};
