# Threadbase — SSE Client: useSSE Hook (Starter)

A React + Express app where the server is already pushing notifications over SSE.
Your job: write the `useSSE` hook and wire it into `AppShell` so the React app listens.

## Run it (two terminals)

```bash
# Terminal 1 — Express + SSE server (do NOT edit)
cd server
cp .env.example .env
npm install
npm start                   # http://localhost:3001

# Terminal 2 — React app
cd client
cp .env.development.example .env.development
npm install
npm run dev                 # http://localhost:5173
```

## Demo accounts (password: `password`)

| Email | Name | userId |
|---|---|---|
| `ada@threadbase.dev` | Ada | 1 |
| `linus@threadbase.dev` | Linus | 2 |

## Your tasks

1. **`hooks/useSSE.js`** — implement the hook (null guard, EventSource, onmessage, onerror, cleanup).
2. **`components/AppShell.jsx`** — wire `useSSE` with a stable `useCallback` handler that dispatches `ADD_NOTIFICATION`.

## Test it

After implementing:
1. Log in as Ada.
2. Open DevTools → Network → find `/api/notifications/stream` → EventStream tab.
3. In a new tab, `POST http://localhost:3001/api/notifications/test` with your Bearer token.
4. Watch the EventStream panel — a frame should appear and the bell badge should increment.

## Files to edit

- `client/src/hooks/useSSE.js` — contains a TODO stub
- `client/src/components/AppShell.jsx` — contains a TODO comment

Everything else is already working. Do not edit server files.
