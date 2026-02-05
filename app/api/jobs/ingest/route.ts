import { ingestJobs } from '@/lib/jobs/ingest';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { query } = await req.json();

  const count = await ingestJobs(query);

  return NextResponse.json({
    success: true,
    ingested: count,
  });
}
