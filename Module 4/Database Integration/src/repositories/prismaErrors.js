// Translate expected database constraints into stable, safe application errors.
// Unknown failures are left for the central HTTP error boundary to sanitize.
function translatePrismaError(error) {
  if (!error || typeof error !== 'object') return error;

  if (error.code === 'P2002') {
    const safeError = new Error('A resource with these values already exists');
    safeError.statusCode = 409;
    return safeError;
  }

  if (error.code === 'P2003' || error.code === 'P2014') {
    const safeError = new Error('The requested operation violates a relationship constraint');
    safeError.statusCode = 409;
    return safeError;
  }

  return error;
}

module.exports = { translatePrismaError };
