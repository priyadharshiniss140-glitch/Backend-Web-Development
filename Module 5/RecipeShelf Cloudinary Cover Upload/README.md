# RecipeShelf — Cloudinary Cover Upload

This is a standalone implementation scaffold for the cover-upload assignment.

## Setup
1. Copy `.env.example` to `.env` and fill in your Cloudinary credentials.
2. Run `npm install` then `npm start`.

## Endpoint
`POST /api/recipes/:recipeId/cover` with multipart form-data field `cover`. Accepts JPG/JPEG and PNG up to 4 MB. Uses Multer memory storage and uploads to `recipeshelf/covers`. Successful response: `{ "recipeId": "1", "coverUrl": "https://res.cloudinary.com/..." }`. Unknown recipe: 404; missing/invalid file: 400; oversized file: 413; Cloudinary failure: 502.

The sample in-memory store is only for this scaffold. When the actual course starter becomes accessible, wire the route to its existing database/model methods. `.env` is excluded from Git; only placeholder variable names belong in `.env.example`.
