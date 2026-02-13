import { db } from '@/lib/db';
import { jobs, jobsSkills, skills as skillsTable } from '@/db/schema';
import { fetchAdzunaJobs } from './sources/adzuna';
import { fetchRemoteOKJobs } from './sources/remoteok';
import { fetchRemotiveJobs } from './sources/remotive';
import { extractSkills } from '@/lib/ai/extractSkills';
import { eq } from 'drizzle-orm';

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
  let insertedCount = 0;

  for (const { job, skills } of enrichedJobs) {
    const normalizedSkills = Array.from(
      new Set(
        (skills || [])
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    const existingJob = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.sourceUrl, job.sourceUrl))
      .limit(1);

    let jobId: string;
    if (existingJob.length > 0) {
      jobId = existingJob[0].id;
    } else {
      const insertedJob = await db
        .insert(jobs)
        .values({
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
        })
        .returning({ id: jobs.id });

      jobId = insertedJob[0].id;
      insertedCount += 1;
    }

    if (normalizedSkills.length === 0) continue;

    for (const skillName of normalizedSkills) {
      let skill = await db
        .select({ id: skillsTable.id })
        .from(skillsTable)
        .where(eq(skillsTable.name, skillName))
        .limit(1);

      let skillId: string;
      if (skill.length === 0) {
        const created = await db
          .insert(skillsTable)
          .values({ name: skillName })
          .returning({ id: skillsTable.id });
        skillId = created[0].id;
      } else {
        skillId = skill[0].id;
      }

      await db
        .insert(jobsSkills)
        .values({ jobId, skillId })
        .onConflictDoNothing();
    }
  }

  return insertedCount;
}
