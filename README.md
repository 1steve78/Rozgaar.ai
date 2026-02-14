# Rozgaar.ai

Skill-based job discovery for early-career talent. Rozgaar.ai combines resume/skill extraction, AI-assisted search, and multi-source job ingestion to surface roles that actually fit.

## Features
- Skill-driven job search with smart filters
- Multi-source job ingestion (Adzuna, RemoteOK, Remotive)
- AI resume skill extraction (PDF/DOCX)
- Personalized job recommendations
- Supabase authentication and profiles
- RAG-style career guidance chat

## Tech Stack
- Next.js (App Router)
- Supabase (Auth + Postgres)
- Drizzle ORM
- Tailwind CSS
- Groq/OpenRouter for skill extraction

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Create your local env file
   ```bash
   copy .env.example .env.local
   ```
3. Fill in environment variables (see below)
4. Run the dev server
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

## Environment Variables
Set these in `.env.local` (see `.env.example`):
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADZUNA_APP_ID`
- `ADZUNA_API_KEY`
- `RAPID_API_KEY`
- `OPENROUTER_API_KEY`
- `GROQ_API_KEY`

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — lint

## Notes
- Some DB columns (profile fields, salary) may require migrations before enabling select queries.
- Ingestion is rate-limited and capped to 10 jobs per request.

## Limits (Free Tier)
- 3 job fetches per day
- 10 chat messages per day

## Deploy
Use your preferred hosting (Vercel recommended for Next.js). Ensure all env vars are set in the hosting environment.
