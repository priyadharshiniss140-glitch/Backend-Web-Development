# Threadbase — Auth Starter (server)

The Express + Prisma API you have been building. Everything works **except** that
the write routes are wide open: anyone can `POST`, `PUT`, or `DELETE` a thread
with no token. Your job is to lock them with a `verifyToken` middleware.

## What is here

```
server/
├── server.js              # app entry — mounts /auth and /api/threads
├── routes/
│   ├── threads.js         # GET (public) + POST/PUT/DELETE (UNPROTECTED — fix these)
│   └── auth.js            # provided login scaffold — DO NOT EDIT
├── middleware/            # empty — your verifyToken.js goes here
├── prisma/
│   ├── schema.prisma      # Author / Thread / Comment (SQLite)
│   ├── client.js          # PrismaClient singleton
│   └── seed.js            # 3 authors + 12 threads
├── .env.example           # copy to .env — DATABASE_URL + JWT_SECRET
└── package.json
```

## Setup

```bash
cd server
cp .env.example .env # your local secrets — never commit this file
npm install
npm run db:setup     # creates the SQLite DB and runs the first migration
npm run db:seed      # seeds authors + threads
npm start            # http://localhost:3001
```

## Get a token to test with

The scaffold at `routes/auth.js` issues real tokens. Log in with a demo user:

```
POST http://localhost:3001/auth/login
Content-Type: application/json

{ "email": "ada@threadbase.dev", "password": "password" }
```

The response contains `{ accessToken, user }`. Send that `accessToken` as
`Authorization: Bearer <accessToken>` on your protected requests.

## Your task

1. Create `middleware/verifyToken.js`.
2. Apply it to `POST`, `PUT`, and `DELETE /api/threads` (keep `GET` public).
3. Add a protected `GET /api/me` that returns `req.user`.

See the assignment brief for the full rubric and submission steps.
