import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Farm } from '../farms/entities/farm.entity';
import { Animal } from '../animals/entities/animal.entity';
import { CalendarEvent } from '../events/entities/event.entity';
import { PushToken } from '../notifications/entities/push-token.entity';

// Load .env eagerly so this config is self-sufficient whether it is imported by
// the Nest app (before ConfigModule initialises) or run standalone by the
// TypeORM CLI. In hosted environments (Railway/Render) there is no .env file and
// this call is a harmless no-op — the platform injects the vars directly.
loadEnv({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const isDevelopment = process.env.NODE_ENV === 'development';

// Managed Postgres providers require TLS. Set DB_SSL=true in prod. Most managed
// providers use certs that don't chain to a public root, hence rejectUnauthorized:false.
const useSsl = process.env.DB_SSL === 'true';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [User, Farm, Animal, CalendarEvent, PushToken],
  // Compiled to dist/migrations/*.js in prod; loaded as *.ts under ts-node CLI.
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  // Auto-schema-sync ONLY in dev. Prod schema changes go through migrations.
  synchronize: isDevelopment,
  dropSchema: false,
  // Run pending migrations on boot when DB_MIGRATIONS_RUN=true (set in prod).
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  ssl: useSsl ? { rejectUnauthorized: false } : false,
};

// Default export is used by the TypeORM CLI (migration:generate / :run / :revert).
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
