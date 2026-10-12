const { validationResult } = require('express-validator');
const AppError = require('./AppError');

module.exports = function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new AppError('Validation failed', 422);
    // Preserve the starter API's validation details in the error response.
    error.details = errors.array();
    return next(error);
  }

  return next();
};
