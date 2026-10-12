# Axios Instance and Vite Environment Variables

Build the frontend HTTP layer for Threadbase. The Express API is in `server/`; the React/Vite app is in `client/`.

## Run locally
```bash
npm run setup
cp client/.env.development.example client/.env.development
npm run dev
```

Open http://localhost:5173. In the browser console, verify that `VITE_API_URL` is `http://localhost:3001`, that the thread list loads, and that Add thread creates a thread.

The `.env.development` file is local-only and ignored by Git. Never commit real environment files. The committed `.env.development.example` documents the required value.
