import { NextResponse } from 'next/server';
import { jobSources } from '@/lib/jobs/jobSources';
import { db } from '@/lib/db';
import { jobs } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const results = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.company,
        location: jobs.location,
        description: jobs.description,
        jobType: jobs.jobType,
        source: jobs.source,
        sourceUrl: jobs.sourceUrl,
        postedAt: jobs.postedAt,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(50);

    return NextResponse.json({ jobs: results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

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
