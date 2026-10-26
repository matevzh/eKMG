# API (`apps/api`)

NestJS REST API with TypeORM and PostgreSQL.

## Tests

### Unit (`npm test`)

Fast Jest specs under `src/**/*.spec.ts`. Repositories and collaborators are mocked — no database required.

```sh
npm test
```

### E2E (`npm run test:e2e`)

HTTP tests against a real Nest app and a dedicated Postgres database (`ekmg_test`), so they never wipe your development data.

1. Copy env and point it at the test DB:

   ```sh
   cp .env.development .env.test
   ```

   Set in `.env.test`:

   - `NODE_ENV=test`
   - `DB_NAME=ekmg_test`

   See [`.env.test.example`](.env.test.example).

2. Create the database (uses credentials from `.env.development`):

   ```sh
   npm run test:db
   ```

3. Run e2e (single worker; schema syncs automatically when `NODE_ENV=test`):

   ```sh
   npm run test:e2e
   ```

Helpers live in `test/utils/` (`createTestApp`, `truncateAll`, `registerUser`). Push and reminder side effects are stubbed in e2e so tests do not call Expo or run the reminder timer.
