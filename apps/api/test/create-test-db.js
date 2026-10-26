/* One-shot: create the ekmg_test database using credentials from .env.development. */
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const raw = fs.readFileSync(file, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([^=]+)=\s*"?([^"]*)"?\s*$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

async function main() {
  const env = loadEnv(path.join(__dirname, "../.env.development"));
  const admin = new Client({
    host: env.DB_HOST,
    port: Number(env.DB_PORT || 5432),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: "postgres",
  });
  await admin.connect();
  const existing = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", ["ekmg_test"]);
  if (existing.rowCount === 0) {
    await admin.query('CREATE DATABASE "ekmg_test"');
    console.log("Created database ekmg_test");
  } else {
    console.log("Database ekmg_test already exists");
  }
  await admin.end();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
