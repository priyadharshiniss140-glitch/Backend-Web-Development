// Translate expected Prisma constraint/validation failures into safe application errors.
// Unknown failures are passed to the central HTTP boundary, which masks 5xx details.
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

  if (['P2000', 'P2006', 'P2007', 'P2009', 'P2011', 'P2012'].includes(error.code)) {
    const safeError = new Error('One or more fields are invalid');
    safeError.statusCode = 422;
    return safeError;
  }

  return error;
}

module.exports = { translatePrismaError };
