# Database Integration — PostgreSQL + Prisma

This assignment replaces the in-memory repository implementation with Prisma-backed PostgreSQL queries while preserving the service/repository contract and existing API response shapes.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A database (for example, `community_dev`) created before applying migrations

## Environment

From this directory, copy the example environment file and configure the connection string:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your local PostgreSQL username, password, host, port, and database. Never commit `.env`.

## Install, generate, and migrate

```bash
npm install
npm run prisma:validate
npm run prisma:generate
npm run prisma:deploy
```

`prisma:deploy` applies the committed migration history. The initial relational migration is under `prisma/migrations/`; the package's `postinstall` hook and `prisma:generate` script generate Prisma Client from the committed schema.

For schema development after the initial migration, use `npm run prisma:migrate -- --name descriptive_change` and commit the resulting migration.

## Seed safely (recommended for matching the starter data)

```bash
npm run prisma:seed
```

The seed script uses a stable unique email and checks whether example posts already exist. It does not delete or reset user data, so it can be run repeatedly.

## Start the API

```bash
npm start
```

The application connects Prisma before opening the HTTP listener and logs a successful database connection. A connection failure stops startup.

## Repository contract and API compatibility

The services continue to call `findAll`, `findById`, `create`, `update`, and `remove`; only repository adapters call Prisma. Post records are projected to the pre-existing fields (`id`, `title`, `body`, and `authorId`) so database timestamps and relations do not unexpectedly alter the API payload. Empty lists remain `[]`; missing reads and updates return `null`; missing removals return `false`.

Expected uniqueness and relational-constraint failures become stable 409 errors; invalid values/required fields become safe 422 errors. Unexpected server/database failures are logged on the server and return only a generic 500 message to the client. No raw Prisma error codes or SQL details are exposed in HTTP responses.

## Data model and deletion rules

The schema includes Users, Posts, Comments, Votes, Follows, Tags and PostTag relations, with primary keys, foreign keys, creation/update timestamps, lookup indexes, unique emails/tag names, unique votes per user/post, unique follows per pair, and unique post/tag pairs.

Post deletion cascades to its comments, votes, and tag links. User deletion cascades to votes and follows, sets nullable post authors to null, and is restricted when the user authored comments. These deletion rules are explicit in the Prisma schema and migration.

## Verify behavior after configuring PostgreSQL

Use your API client or curl to test:
- List records (an empty database returns `{ "data": [] }`).
- Read an existing record and a missing record.
- Create a record, update it, and remove it.
- Update/remove a missing ID and confirm the controller's existing 404 behavior.
- Trigger a relational or uniqueness failure (for example, create a post with a nonexistent non-null author ID, or use the corresponding vote/follow repository twice with the same relationship) and confirm a safe 409 without raw Prisma details.

The database-specific integration could not be run in this GitHub-only session; apply the committed migration against your local PostgreSQL instance and perform these end-to-end checks before final submission.
