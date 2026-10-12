# Relational Data Shapes in React — Starter

The backend returns nested Prisma include data for each thread:
- `author: { name, avatarUrl }`
- `_count: { comments }`

The React component renders these nested fields and safely handles threads with a null author.

## Prerequisites
- Node.js 18+

## Setup
```bash
npm run setup
cp client/.env.development.example client/.env.development
cp server/.env.example server/.env
npm --prefix server run db:setup
npm run dev
```

- client: `http://localhost:5173`
- server: `http://localhost:3001`

## Assignment scope
Only `client/src/components/ThreadItem.jsx` was changed from the starter. The API route, seed, query hook and service are preserved.

## Result
- Author name comes from `thread.author?.name`.
- Avatar comes from `thread.author?.avatarUrl`, with a placeholder for missing/broken image URLs.
- Reply count comes from `thread._count?.comments`.
- Null authors render as “Anonymous” and do not crash the thread list.

Before submission, run the app and attach a screenshot showing normal authors, reply counts, and at least one author-less thread with fallback UI.
