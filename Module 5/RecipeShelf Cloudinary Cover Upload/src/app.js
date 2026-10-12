'use strict';
require('dotenv').config();
const express = require('express');
const recipesRouter = require('./routes/recipes');

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/recipes', recipesRouter);
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Cover must not exceed 4 MB.' });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`RecipeShelf API listening on http://localhost:${port}`));
