import { ingestJobs } from '@/lib/jobs/ingest';
import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/supabase/server';
import { checkJobFetchLimit } from '@/lib/rateLimiter';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = rateLimitStore.get(key)?.filter((ts) => ts > windowStart) ?? [];
  hits.push(now);
  rateLimitStore.set(key, hits);
  return hits.length > RATE_LIMIT_MAX;
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    await checkJobFetchLimit(user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Rate limit reached';
    return NextResponse.json({ error: message }, { status: 429 });
  }

  const { query } = await req.json();

  const count = await ingestJobs(query);

  return NextResponse.json({
    success: true,
    ingested: count,
  });
}
