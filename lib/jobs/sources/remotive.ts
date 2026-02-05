import { UnifiedJob, mapJobType } from '../normalize';

export async function fetchRemotiveJobs(query: string): Promise<UnifiedJob[]> {
  const res = await fetch(
    `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  return data.jobs.map((job: any): UnifiedJob => ({
    title: job.title,
    company: job.company_name ?? null,
    location: job.candidate_required_location ?? 'Remote',
    description: job.description ?? null,
    jobType: mapJobType(job.job_type),
    skills: job.tags ?? [],
    source: 'remotive',
    sourceUrl: job.url,
    postedAt: job.publication_date
      ? new Date(job.publication_date)
      : null,
  }));
}
