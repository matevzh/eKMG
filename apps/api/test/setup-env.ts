import { config as loadEnv } from "dotenv";
import { resolve } from "path";

// Must run before AppModule / data-source imports so NODE_ENV=test picks .env.test.
process.env.NODE_ENV = "test";
loadEnv({ path: resolve(__dirname, "../.env.test") });
