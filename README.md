# eKMG

eKMG is a farm-management app for keeping track of farms, animals, milk production, events, and finances. It includes a React web client, an Expo mobile app, and a NestJS API backed by PostgreSQL.

## Apps

- `apps/web` — React + TypeScript web app (Vite)
- `apps/mobile` — React Native app (Expo)
- `apps/api` — NestJS REST API with TypeORM

## Local development

Use Node.js and npm. Start the local PostgreSQL database from the repository root:

```sh
docker compose -f docker/docker-compose.yml up -d
```

Configure `apps/api/.env.development` with the database connection settings (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME`) and a `JWT_SECRET`. The local database defaults are documented in `docker/docker-compose.yml`.

Start the API:

```sh
cd apps/api
npm ci
npm run start:dev
```

### API tests

Unit tests mock repositories and need no database:

```sh
cd apps/api
npm test
```

E2E tests hit a real Nest app against a separate Postgres database (`ekmg_test`) so they never wipe your dev data:

```sh
# once: copy env and create the DB
cp .env.development .env.test
# edit .env.test → NODE_ENV=test and DB_NAME=ekmg_test
# (see .env.test.example)
npm run test:db

npm run test:e2e
```

Windows PowerShell equivalent for the env copy:

```powershell
Copy-Item .env.development .env.test
# then set NODE_ENV and DB_NAME in .env.test
```

In separate terminals, start either client:

```sh
cd apps/web
npm ci
npm run dev
```

```sh
cd apps/mobile
npm ci
npx expo start
```

The mobile app defaults to `http://10.0.2.2:3000` for Android emulators. Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to your API URL when using a physical device or another target.
