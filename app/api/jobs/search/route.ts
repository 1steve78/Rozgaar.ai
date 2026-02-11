import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs } from '@/db';
import { ilike, or, and, eq } from 'drizzle-orm';
import { parseSmartSearch, describeFilters } from '@/lib/ai/smartSearch';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SearchAPI');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const smart = searchParams.get('smart') === 'true'; // Enable smart search with ?smart=true

  if (!query) {
    return NextResponse.json({ jobs: [] });
  }

  try {
    let whereConditions;

    // Use AI smart search if enabled
    if (smart) {
      logger.info(`Smart search: "${query}"`);
      const filters = await parseSmartSearch(query);
      const conditions = [];

      // Keywords search
      if (filters.keywords.length > 0) {
        const keywordConditions = filters.keywords.map(keyword =>
          or(
            ilike(jobs.title, `%${keyword}%`),
            ilike(jobs.description, `%${keyword}%`),
            ilike(jobs.company, `%${keyword}%`)
          )
        );
        conditions.push(or(...keywordConditions));
      }

      // Job type filter (exclude 'remote' as it's not in the enum)
      if (filters.jobType && filters.jobType !== 'remote') {
        conditions.push(eq(jobs.jobType, filters.jobType));
      }

      // Location filter
      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }

      whereConditions = conditions.length > 0 ? and(...conditions) : undefined;

      // Return filters description
      const filtersDescription = describeFilters(filters);
      logger.info(`Parsed as: ${filtersDescription}`);
    } else {
      // Basic text search (original behavior)
      whereConditions = or(
        ilike(jobs.title, `%${query}%`),
        ilike(jobs.company, `%${query}%`),
        ilike(jobs.location, `%${query}%`)
      );
    }

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
      .where(whereConditions)
      .orderBy(jobs.createdAt)
      .limit(50);

    return NextResponse.json({
      jobs: results,
      smart,
      query,
    });
  } catch (error) {
    logger.error('Search failed', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
