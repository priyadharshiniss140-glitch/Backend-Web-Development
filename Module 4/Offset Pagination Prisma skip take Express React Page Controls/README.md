# Offset Pagination — Prisma skip/take → Express → React (Starter)

The feed currently returns **every** thread in one response, and the React list
renders all of them with no page controls. Your task is to add **offset
pagination** end to end.

## What you build
1. **Server** — read `page` from `req.query`, turn it into `skip`/`take`, and
   return `{ threads, total, hasMore }` (the `total` comes from
   `prisma.thread.count()` in the same request).
2. **React** — add `page` state, put it in the TanStack Query `queryKey`, and
   render **Previous / Next** buttons with correct disabled states.

## Files you'll edit
- `server/routes/threads.js`
- `client/src/services/threads.service.js`
- `client/src/components/ThreadList.jsx`

`ThreadItem.jsx` already renders each thread correctly — leave it alone.

## Prerequisites
- Node.js 18+ (no database server needed — this project uses SQLite)

## Setup
```bash
npm run setup
cp server/.env.example server/.env
cp client/.env.development.example client/.env.development
npm --prefix server run db:setup   # prisma migrate dev
npm --prefix server run db:seed    # seed 42 threads (→ 5 pages of 10)
```

## Run
```bash
npm run dev
```
- client: `http://localhost:5173`
- server: `http://localhost:3001`

## Success looks like
1. Clicking **Next** sends a request with a `?page=` parameter (Network tab).
2. The response body includes `total` and `hasMore`.
3. **Previous** is disabled on page 1; **Next** is disabled on the last page.
4. Changing the page fetches new data while the current page stays visible.
