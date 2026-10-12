FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma generate needs the schema available, but app source is copied afterward.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
