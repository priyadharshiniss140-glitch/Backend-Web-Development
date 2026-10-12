// Translate expected Prisma constraint failures into safe application errors.
// Other failures are passed through to the HTTP boundary, which masks 5xx details.
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

  if (error.code === 'P2000' || error.code === 'P2011' || error.code === 'P2012') {
    const safeError = new Error('One or more fields are invalid');
    safeError.statusCode = 422;
    return safeError;
  }

  return error;
}

module.exports = { translatePrismaError };
