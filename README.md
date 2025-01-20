# Project Setup

## 1. Create your `.env` file and add it to the project directory

Example:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baze_projekt?schema=public"
```
Where `postgres:postgres` is the username and password, and `baze_projekt` is an empty database created using pgAdmin.

## 2. Install dependencies
```
npm install
```

## 3. Generate Prisma client
```
npx prisma generate
```

## 4. Run database migrations
```
npx prisma migrate dev --name init
```

## 5. Seed the database
```
npx ts-node prisma/seed.ts
```

*If `npx ts-node prisma/seed.ts` or `npx prisma migrate dev --name init` fails, try installing dotenv:
```
npm install dotenv
```
Then add `require('dotenv').config()` to `seeds.ts`.

## 6. If seeding is successful, start the server
```
npm run dev
```
