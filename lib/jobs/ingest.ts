import { db } from '@/lib/db';
import { jobs } from '@/db/schema';
import { fetchAdzunaJobs } from './sources/adzuna';
import { fetchRemoteOKJobs } from './sources/remoteok';
import { fetchRemotiveJobs } from './sources/remotive';
import { extractSkills } from '@/lib/ai/extractSkills';

export async function ingestJobs(query: string) {
  const allJobs = [
    ...(await fetchAdzunaJobs(query)),
    ...(await fetchRemoteOKJobs()),
    ...(await fetchRemotiveJobs(query)),
  ];

  for (const job of allJobs) {
    // ⛔ skip invalid jobs
    if (!job.title || !job.sourceUrl) continue;

    const skills =
      job.description && job.description.length > 20
        ? await extractSkills(job.description)
        : [];

    await db
      .insert(jobs)
      .values({
        title: job.title,
        company: job.company ?? null,
        location: job.location ?? null,
        description: job.description ?? null,
        jobType: job.jobType ?? null,
        source: job.source,
        sourceUrl: job.sourceUrl,
        postedAt: job.postedAt ?? null,
        createdAt: new Date(),
      })
      .onConflictDoNothing(); // 🔥 prevents duplicates
  }

  return { inserted: allJobs.length };
}
