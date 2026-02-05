import { NextResponse } from 'next/server';
import { jobSources } from '@/lib/jobs/jobSources';

export async function POST(req: Request) {
  const { query, location } = await req.json();

  const results = jobSources.map((s) => ({
    source: s.name,
    url: s.buildUrl(query, location),
  }));

  // 🔌 Here you can store search using your schema
  // await db.insert(jobSearches).values({ query, location });

  return NextResponse.json(results);
}
