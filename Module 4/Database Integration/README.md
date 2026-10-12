# Database Integration — PostgreSQL + Prisma

This assignment replaces the in-memory repository implementation with Prisma-backed PostgreSQL queries while preserving the service/repository contract and existing API response shapes.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A database (for example `community_dev`) created before running migrations

## Environment

From this directory, copy the example environment file and configure the connection string:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your local PostgreSQL username, password, host, port, and database. Never commit `.env`.

## Install, generate and migrate

```bash
npm install
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate -- --name init_relational_schema
```

The schema and migration history are committed under `prisma/`. The client is generated from `schema.prisma` via the `prisma:generate` command and the package postinstall hook.

## Seed safely (optional)

```bash
npm run prisma:seed
```

The seed script uses a stable unique email and checks whether example posts already exist. It does not delete tables or reset user data, so it can be run repeatedly.

## Start the API

```bash
npm start
```

The application connects Prisma before opening the HTTP listener and logs a successful database connection. A connection failure stops startup.

## Repository contract and API compatibility

The services continue to call `findAll`, `findById`, `create`, `update`, and `remove`; only repository adapters call Prisma. Post records are projected to the pre-existing fields (`id`, `title`, `body`, and `authorId`) so database timestamps and relations do not unexpectedly alter the API payload. Empty lists remain `[]`; missing reads and updates return `null`; missing removals return `false`.

Expected uniqueness and relational-constraint failures become stable 409 errors; invalid required field failures become safe 422 errors. Unexpected server/database failures are logged on the server and return only a generic 500 message to the client.

## Data model and deletion rules

The schema includes Users, Posts, Comments, Votes, Follows, Tags and PostTag relations, with primary keys, foreign keys, creation/update timestamps, lookup indexes, unique emails/tag names, unique votes per user/post, unique follows per pair, and unique post/tag pairs.

Post deletion cascades to its comments, votes, and tag links. User deletion cascades to votes and follows, sets nullable post authors to null, and is restricted when the user authored comments. These deletion rules are explicit in the Prisma schema and the migration.

## Verify behavior after configuring PostgreSQL

Use your API client or curl to test:
- List posts (empty database should return `{ "data": [] }`).
- Read an existing post and a missing post.
- Create a post, update it, and remove it.
- Update/remove a missing ID and confirm the controller's existing 404 behavior.
- Try a duplicate email, vote pair, or follow pair using the corresponding repository and confirm a safe 409 without raw Prisma details.

The database-specific integration could not be run in this GitHub-only session; apply the migration against your local PostgreSQL instance and perform these end-to-end checks before final submission.
