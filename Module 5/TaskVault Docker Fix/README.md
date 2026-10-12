# TaskVault Dockerfile Fix

This folder contains the Dockerfile and Docker ignore rules requested in the TaskVault assignment.

## Dockerfile decisions

- Uses the versioned lightweight base image `node:20-alpine`.
- Copies `package*.json` and runs `npm ci` before copying application source.
- Copies the Prisma schema and runs `npx prisma generate` during image build.
- Copies the remaining source with `COPY . .`.
- Exposes port 3000 and starts with exec-form `CMD ["npm", "start"]`.
- `.dockerignore` excludes `node_modules`, `.env`, and `.git`.

## Local validation steps

Run these from the actual TaskVault project root, where `package.json`, `prisma/schema.prisma`, and the app code live. This folder is a reference implementation because the assignment starter repository was not accessible through the connected GitHub account.

1. Copy `.env.example` to `.env` and set a valid development `DATABASE_URL`.
2. Run `npm install`.
3. Run `npx prisma db push` to create/update the development schema.
4. Build from the actual project root: `docker build -t taskvault-api .`.
5. Run with the database URL supplied at runtime: `docker run --rm -p 3000:3000 --env-file .env taskvault-api`.
6. Check `GET http://localhost:3000/api/tasks`.

If PostgreSQL is on the host machine, the database URL used by the container may need `host.docker.internal` instead of `localhost`. Match the exposed port and `npm start` script to the actual starter app if they differ.

## Security

Never commit `.env` or real credentials. The Docker build uses `.dockerignore` to keep the local environment file out of the build context.
