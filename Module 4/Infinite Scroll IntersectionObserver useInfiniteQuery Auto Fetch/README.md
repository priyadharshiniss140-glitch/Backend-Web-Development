# Infinite Scroll — IntersectionObserver + useInfiniteQuery

Threadbase uses cursor-based pagination with TanStack Query's `useInfiniteQuery`.
The feed automatically loads the next page as the reader approaches the end of the list.

## Setup

Requires Node.js 18+; SQLite is used, so no separate database server is needed.

```bash
npm run setup
cp server/.env.example server/.env
cp client/.env.development.example client/.env.development
npm --prefix server run db:setup
npm --prefix server run db:seed
npm run dev
```

The app runs at `http://localhost:5173`; the API runs at `http://localhost:3001`.
The seed contains 35 threads at 10 per page.

## Implementation notes

- `client/src/hooks/useIntersection.js` observes the sentinel with `IntersectionObserver`, calls the callback only when intersecting, and disconnects during cleanup.
- `ThreadList.jsx` keeps the cursor-based `useInfiniteQuery`, uses a guarded callback to avoid overlapping next-page fetches, and replaces the button with an observed sentinel.
- The `Loading more…` cue appears only while `isFetchingNextPage` is true.
- The observer uses `rootMargin: "300px"` so the next page can begin fetching shortly before the sentinel reaches the visible viewport. This gives time for network and rendering work before the reader hits the end. It also avoids repeated manual scroll-position calculations, which need careful handling for viewport size, document height, and scroll events.

## Manual check

Scroll down through the feed. More threads should appear automatically without a “Load More” button. The seed should load across four cursor pages.
