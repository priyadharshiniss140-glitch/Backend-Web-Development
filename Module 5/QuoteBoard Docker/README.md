# QuoteBoard — Vite React Docker Deployment

Reference implementation of the required production container files.

## Files

- `Dockerfile`: two-stage Node build and Nginx runtime.
- `nginx.conf`: SPA history fallback so direct navigation and refresh on `/quote/:id` return `index.html`.
- `.dockerignore`: excludes `node_modules`, `dist`, `.git`, and `.env*`.

## Run against the actual QuoteBoard starter

Run these commands from the root of the actual QuoteBoard project (where its `package.json` is located). This reference folder does not contain the application source because the supplied starter repository was not accessible through the connected GitHub account.

```bash
npm ci
npm run dev
```

Verify `/` and `/quote/1` in the Vite server, then build and start the production container:

```bash
docker build -t quoteboard:latest .
docker images quoteboard
docker run --rm -d --name quoteboard -p 8080:80 quoteboard:latest
```

Open `http://localhost:8080/quote/1`, refresh, and ensure it remains on the application rather than returning 404. Verify the reported image size with `docker images quoteboard`.

## Why Node is absent at runtime

Node is only in the builder stage, where dependencies are installed and Vite creates static assets in `/app/dist`. The final stage starts from `nginx:alpine` and copies only the built assets plus the Nginx configuration, so the runtime image does not include the Node runtime or source build dependencies.

## Evidence still to capture

The image size and browser screenshot must be captured from a successful local Docker build and browser refresh. They are intentionally not fabricated in this reference implementation.
