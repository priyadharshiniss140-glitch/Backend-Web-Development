# Threadbase — Session Authentication

Express and Prisma API using a signed, opaque `sid` cookie backed by a server-side session store.

## Setup

Run from this directory:

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Before starting, replace the `COOKIE_SECRET` placeholder in `.env` with at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP testing. In production, the app always sets `Secure`; deploy behind HTTPS. Do not commit `.env` or paste secrets into logs.

Seeded local demo account: `sam@example.com` / `SessionDemo!48`.

## Endpoints

### Login — `POST /auth/login`

Request:

```json
{ "email": "sam@example.com", "password": "SessionDemo!48" }
```

A successful login returns `200` with only `id`, `name`, and `email`, and sets the signed `sid` cookie. Unknown email and wrong password return the same generic `401` response.

### Current session — `GET /auth/me`

Send the cookie from login. Returns `200` with safe identity fields only for a valid, unexpired server-side session. Missing, altered, expired, or orphaned sessions receive a generic `401`.

### Logout — `POST /auth/logout`

Destroys the matching server-side session, clears `sid` with the same cookie attributes, and returns `204`. Logout is idempotent.

## Cookie and session behavior

- Cookie name: `sid`; value is a cryptographically random session ID, signed by `cookie-parser` using `COOKIE_SECRET`.
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, one-hour default `Max-Age`, and `Secure` in production. `SESSION_TTL_MS` controls both cookie and server-side expiration.
- The server-side in-memory Map stores only `{ userId, expiresAt }` keyed by the opaque ID. Expired sessions are removed when accessed.
- **The in-memory store is for learning and single-process local execution only.** Production deployments should use a shared expiring store such as Redis so sessions survive restarts and work across multiple API instances.

## Local verification with curl

Login and save the cookie:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"SessionDemo!48"}' \
  http://localhost:3000/auth/login
```

Inspect the response headers for `Set-Cookie: sid=...`, `HttpOnly`, and `SameSite=Lax`.

Call the protected identity endpoint using the saved cookie:

```bash
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Log out and verify that the old cookie no longer authenticates:

```bash
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Use HTTPS when testing production cookie behavior; a browser or HTTP client should not send a `Secure` cookie over plain HTTP.
