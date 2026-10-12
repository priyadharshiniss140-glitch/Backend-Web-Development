# Threadbase — Protected Routes & Role-Based UI (Starter)

A small React + React Router v6 app with **AuthContext already built** and login working.
Every route is currently **public**, and `ThreadItem` shows Edit/Delete to **everyone**.
Your job is to add the client-side access gates.

## Run it (two terminals)

```bash
# Terminal 1 — auth scaffold (do NOT edit)
cd server
cp .env.example .env
npm install
npm start                    # http://localhost:3001

# Terminal 2 — the React app
cd client
cp .env.development.example .env.development
npm install
npm run dev                  # http://localhost:5173
```

Demo accounts (password is `password` for both):

| Email | Role | userId |
|---|---|---|
| `ada@threadbase.dev` | `member` | 1 |
| `linus@threadbase.dev` | `admin` | 2 |

## Your tasks

1. **`PrivateRoute`** (`client/src/components/PrivateRoute.jsx`) — read `useAuth().user`; if there's no user, return `<Navigate to="/login" replace state={{ from: location }} />`; otherwise render `children`.
2. **Protect routes** (`client/src/App.jsx`) — wrap `/dashboard`, `/profile`, and `/threads/new` in `<PrivateRoute>`. Leave `/`, `/login`, `/threads` public.
3. **`RoleGate`** (`client/src/components/RoleGate.jsx`) — render `children` only when `user?.role === requiredRole`, else `null`. It's already used to wrap the "Admin tools" block in `DashboardPage`.
4. **Owner-only controls** (`client/src/components/ThreadItem.jsx`) — show Edit/Delete only when `user?.userId === thread.authorId` **or** the user is an admin.

## How to check yourself

- Logged out, click **Dashboard** → you land on **/login**.
- Log in as **Ada** → open **Threads**: Edit/Delete appear only on Ada's threads.
- Log in as **Linus** (admin) → **Dashboard** shows the "Admin tools" block; Ada doesn't see it. Linus sees Edit/Delete on every thread.
- Log out → Dashboard/Profile/New thread all bounce to /login.

> Remember: these gates are **UX only**. The real security boundary is the server's `verifyToken` middleware — the client can be tampered with, the server can't be bypassed.
