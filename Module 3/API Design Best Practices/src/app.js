const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const http = require('./utils/http');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/', postRoutes);

  // Consistent JSON for every unknown route. Old verb-based endpoints are gone.
  app.use((req, res) => {
    return http.sendError(res, 404, 'ROUTE_NOT_FOUND', 'Route not found');
  });

  // Central error boundary: log internal details, but never send them to clients.
  app.use((err, req, res, next) => {
    const status = Number.isInteger(err.statusCode) &&
      err.statusCode >= 400 && err.statusCode < 500
      ? err.statusCode
      : 500;

    if (status >= 500) {
      console.error('[api-error]', err);
      return http.sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        'Internal server error'
      );
    }

    const code = status === 404 ? 'NOT_FOUND' : 'BAD_REQUEST';
    const message = status === 404 ? 'Resource not found' : 'Invalid request';
    return http.sendError(res, status, code, message);
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};
