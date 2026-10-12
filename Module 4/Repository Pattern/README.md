# Repository Pattern Assignment

Refactored the post service so it depends on a stable repository interface instead of importing or manipulating the old raw in-memory store.

## Run

```bash
npm start
```

## Repository contract

`src/repositories/postRepository.js` is the only layer that owns post storage and ID generation. It exposes exactly these operations:

- `findAll()` — returns a new array of record copies.
- `findById(id)` — returns a record copy or `null`.
- `create(fields)` — allocates the ID and returns the complete new record.
- `update(id, patch)` — applies only defined fields, returns the updated record or `null`.
- `remove(id)` — returns `true` when a record was removed, otherwise `false`.

The repository currently uses a `Map` as its storage implementation. The former raw array store has been removed; services cannot import or mutate it directly.

## Service boundary

`src/services/postService.js` uses only the repository methods. Business behavior remains in the service: it enforces the required title on create, applies the existing empty-body default, and restricts updates to the existing editable fields. The controller continues to use the same service methods and response shapes.

## Storage-swap proof

When replacing the `Map` with Prisma, the repository's internal operations will change to Prisma queries and database setup will be added. The repository's exported five-method contract remains the same, so services, controllers, API routes, and HTTP responses do not need to learn about Prisma or be rewritten for the storage change.
