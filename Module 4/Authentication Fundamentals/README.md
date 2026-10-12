# Authentication Fundamentals — Registration and Login

An Express + Prisma API with asynchronous bcrypt password hashing, normalized email lookups, and generic authentication failures.

## Requirements

- Node.js 18+
- npm

## Setup

Run from this directory:

```bash
npm install
cp .env.example .env
npm run db:push
npm start
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The project uses SQLite, so no database server is needed. `.env` and the local SQLite database are ignored by Git. Never commit real secrets.

## Register

`POST http://localhost:3000/auth/register`

```json
{
  "name": "Sam",
  "email": "sam@example.com",
  "password": "correct horse battery staple"
}
```

Success returns **201** with only `id`, `name`, and normalized `email`. Passwords are asynchronously hashed with bcryptjs and only `passwordHash` is persisted. A duplicate normalized email returns **409**.

## Login

`POST http://localhost:3000/auth/login`

```json
{
  "email": "sam@example.com",
  "password": "correct horse battery staple"
}
```

Success returns **200** with only `id`, `name`, and `email`. Unknown emails and incorrect passwords both return **401** with the same body:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

Malformed JSON and missing/invalid fields return **400**. Unexpected errors return a controlled **500** response without raw Prisma or bcrypt details.

## Architecture

- `src/routes/authRoutes.js`: HTTP wiring only.
- `src/services/authService.js`: validation, email normalization, hash/compare, and auth workflow.
- `src/repositories/userRepository.js`: Prisma access isolated behind repository functions.
- `src/serializers/userSerializer.js`: explicit `id` / `name` / `email` allowlist.
- `src/errors/AppError.js`: expected HTTP errors for the centralized handler.
