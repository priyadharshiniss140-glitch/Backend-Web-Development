'use strict';

const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinary');
const { findRecipeById, saveRecipe } = require('../recipeStore');

const router = express.Router();
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(req, file, cb) {
    if (!allowedTypes.has(file.mimetype)) {
      const err = new Error('Cover must be a JPG or PNG image.');
      err.code = 'INVALID_COVER_TYPE';
      return cb(err);
    }
    cb(null, true);
  },
});

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'recipeshelf/covers', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png'] },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url || !result?.public_id) return reject(new Error('Missing Cloudinary asset metadata.'));
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

router.post('/:recipeId/cover', (req, res, next) => {
  const recipe = findRecipeById(req.params.recipeId);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

  upload.single('cover')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Cover must not exceed 4 MB.' });
      if (err.code === 'INVALID_COVER_TYPE' || err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return next(err);
    }
    if (!req.file) return res.status(400).json({ error: 'A cover file is required in the cover field.' });

    const previousPublicId = recipe.coverPublicId;
    try {
      const uploaded = await uploadBuffer(req.file.buffer);
      recipe.coverUrl = uploaded.secure_url;
      recipe.coverPublicId = uploaded.public_id;
      saveRecipe(recipe);

      if (previousPublicId && previousPublicId !== uploaded.public_id) {
        try {
          await cloudinary.uploader.destroy(previousPublicId, { resource_type: 'image' });
        } catch (cleanupErr) {
          console.error('Old cover cleanup failed:', cleanupErr.message);
        }
      }
      return res.status(200).json({ recipeId: String(recipe.id), coverUrl: recipe.coverUrl });
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr.message);
      return res.status(502).json({ error: 'Cover image service is unavailable.' });
    }
  });
});

module.exports = router;
