# Threadbase - File Upload with Multer

## Setup

Run these commands from this folder:

```bash
cp .env.example .env
npm install
npm start
```

The server listens on `http://localhost:3001`.

## Get a demo token

Send `POST http://localhost:3001/auth/login` with JSON:

```json
{
  "username": "ada",
  "password": "password"
}
```

Copy the returned token.

## Upload an image

In Thunder Client or Postman, send `POST http://localhost:3001/api/upload` with:

- Header: `Authorization: Bearer <token>`
- Body type: `form-data`
- Field name: `avatar`, type: **File**, with a JPEG, PNG, WEBP, or GIF image

A successful upload returns HTTP 201 and a JSON `url`, for example:

```json
{
  "url": "/uploads/avatar-1718050000000-874320.jpg"
}
```

Open `http://localhost:3001` followed by the returned URL to view the image.

Non-image MIME types and files larger than 5 MB return HTTP 400. A missing or invalid Bearer token returns HTTP 401. Uploaded test files are ignored by Git.
