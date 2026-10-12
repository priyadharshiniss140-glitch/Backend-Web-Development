'use strict';

const express = require('express');
const app = express();

// Register health before authentication or other middleware so probes always work.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// In the actual starter, keep existing middleware and API routes below this endpoint.
