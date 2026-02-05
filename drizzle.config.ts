import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local first, then .env as fallback
config({ path: ".env.local" });
config({ path: ".env" });

// For Drizzle CLI, we only need DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env or .env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
