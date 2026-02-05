import { UnifiedJob } from '../normalize';

export async function fetchRemoteOKJobs(): Promise<UnifiedJob[]> {
  const res = await fetch('https://remoteok.com/api');
  const data = await res.json();

  return data
    .filter((j: any) => j.position)
    .map((job: any): UnifiedJob => ({
      title: job.position,
      company: job.company ?? null,
      location: job.location ?? 'Remote',
      description: job.description ?? null,
      jobType: 'remote' as any,
      skills: job.tags ?? [],
      source: 'remoteok',
      sourceUrl: job.url,
      postedAt: job.date ? new Date(job.date) : null,
    }));
}
