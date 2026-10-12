# API Design Best Practices

An in-memory Express API demonstrating a predictable resource-oriented public contract.

## Run

```bash
npm install
npm start
```

The API listens on port 3000. The store resets on server restart; this lesson does not add a database.

## Public routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/posts?limit=2&offset=0` | List posts with pagination |
| GET | `/posts/:id` | Fetch one post |
| POST | `/posts` | Create a post |
| POST | `/posts/:id/likes` | Like a post |
| GET | `/__demo/failure` | Trigger a safe demo 500 response |

The old verb-based routes (`/getPosts`, `/getPost/:id`, `/createPost`, `/likePost/:id`) are no longer part of the public contract.

## Response contract

All successful responses use `{ data }`. List responses include pagination metadata:

```json
{
  "data": [],
  "meta": {
    "total": 5,
    "limit": 2,
    "offset": 0,
    "hasMore": true,
    "nextOffset": 2
  }
}
```

The default page size is 2 and the server caps `limit` at 5, regardless of the client-supplied value. Use `nextOffset` to fetch the next page while `hasMore` is true.

Errors use a consistent safe shape:

```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "Post not found"
  }
}
```

The demo failure route returns a generic `INTERNAL_SERVER_ERROR` message. Diagnostic details and stack traces are logged on the server only.

## Quick checks

```bash
curl -i "http://localhost:3000/posts"
curl -i "http://localhost:3000/posts?limit=100"
curl -i "http://localhost:3000/posts/1"
curl -i -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"title":"API Contracts","author":"maya"}'
curl -i -X POST http://localhost:3000/posts/1/likes
curl -i http://localhost:3000/posts/999
curl -i http://localhost:3000/__demo/failure
curl -i http://localhost:3000/getPosts
```
