/**
 * Environment Variable Validation
 * 
 * This module validates that all required environment variables are present
 * and provides type-safe access to them throughout the application.
 * 
 * It will throw a descriptive error at startup if any required variables are missing,
 * preventing runtime failures due to configuration issues.
 */

// Server-side environment variables
const requiredServerEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // Job APIs
  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID,
  ADZUNA_API_KEY: process.env.ADZUNA_API_KEY,

  // AI for skill extraction
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
} as const;

// Public environment variables (accessible on client)
const requiredPublicEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// Combine all env vars for validation
const allEnvVars = {
  ...requiredServerEnvVars,
  ...requiredPublicEnvVars,
} as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
function validateEnv() {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(allEnvVars)) {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n` +
      missing.map(key => `  - ${key}`).join('\n') +
      `\n\n` +
      `Please check your .env.local file and ensure all required variables are set.\n` +
      `Refer to .env.example for the full list of required variables.`
    );
  }
}

// Validate immediately when this module is imported
validateEnv();

/**
 * Type-safe, validated environment variables
 * These are guaranteed to be non-null strings at runtime
 */
export const env = {
  // Database
  DATABASE_URL: allEnvVars.DATABASE_URL!,

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: allEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: allEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: allEnvVars.SUPABASE_SERVICE_ROLE_KEY!,

  // Email
  RESEND_API_KEY: allEnvVars.RESEND_API_KEY!,
  EMAIL_FROM: allEnvVars.EMAIL_FROM!,

  // Job APIs
  ADZUNA_APP_ID: allEnvVars.ADZUNA_APP_ID!,
  ADZUNA_API_KEY: allEnvVars.ADZUNA_API_KEY!,

  // AI
  OPENROUTER_API_KEY: allEnvVars.OPENROUTER_API_KEY!,

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Prevent modification
Object.freeze(env);
