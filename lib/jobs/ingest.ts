import { db } from '@/lib/db';
import { jobs } from '@/db/schema';
import { fetchAdzunaJobs } from './sources/adzuna';
import { fetchRemoteOKJobs } from './sources/remoteok';
import { fetchRemotiveJobs } from './sources/remotive';
import { extractSkills } from '@/lib/ai/extractSkills';

export async function ingestJobs(query: string) {
  const safeFetch = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      console.error('Job source fetch failed:', error);
      return fallback;
    }
  };

  const [adzunaJobs, remoteOkJobs, remotiveJobs] = await Promise.all([
    safeFetch(() => fetchAdzunaJobs(query), []),
    safeFetch(() => fetchRemoteOKJobs(), []),
    safeFetch(() => fetchRemotiveJobs(query), []),
  ]);

  const allJobs = [...adzunaJobs, ...remoteOkJobs, ...remotiveJobs];
  const validJobs = allJobs.filter(job => job.title && job.sourceUrl);
  const MAX_INGEST = 10;
  const limitedJobs = validJobs.slice(0, MAX_INGEST);

  const allowedJobTypes = new Set([
    'full-time',
    'part-time',
    'contract',
    'internship',
  ]);

  const SKILL_CONCURRENCY = 5;
  const BATCH_SIZE = 100;

  const mapWithConcurrency = async <T, R>(
    items: T[],
    limit: number,
    worker: (item: T, index: number) => Promise<R>
  ): Promise<R[]> => {
    if (items.length === 0) return [];
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    const workers = Array.from(
      { length: Math.min(limit, items.length) },
      async () => {
        while (true) {
          const current = nextIndex++;
          if (current >= items.length) break;
          results[current] = await worker(items[current], current);
        }
      }
    );

    await Promise.all(workers);
    return results;
  };

  const enrichedJobs = await mapWithConcurrency(
    limitedJobs,
    SKILL_CONCURRENCY,
    async (job) => {
      let skills: string[] = [];
      if (job.description && job.description.length > 20) {
        try {
          skills = await extractSkills(job.description);
        } catch (error) {
          console.error('Skill extraction failed:', error);
        }
      }

      return { job, skills };
    }
  );

  const now = new Date();
  const values = enrichedJobs.map(({ job }) => ({
    title: job.title,
    company: job.company ?? null,
    location: job.location ?? null,
    description: job.description ?? null,
    jobType:
      job.jobType && allowedJobTypes.has(job.jobType)
        ? job.jobType
        : null,
    source: job.source,
    sourceUrl: job.sourceUrl,
    postedAt: job.postedAt ?? null,
    createdAt: now,
  }));

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const batch = values.slice(i, i + BATCH_SIZE);
    await db.insert(jobs).values(batch).onConflictDoNothing();
  }

  return { inserted: values.length };
}
