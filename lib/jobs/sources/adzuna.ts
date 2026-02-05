import { UnifiedJob, mapJobType } from '../normalize';
import { env } from '@/lib/env';

export async function fetchAdzunaJobs(query: string): Promise<UnifiedJob[]> {
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${env.ADZUNA_APP_ID}&app_key=${env.ADZUNA_API_KEY}&what=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results.map((job: any): UnifiedJob => ({
    title: job.title,
    company: job.company?.display_name ?? null,
    location: job.location?.display_name ?? null,
    description: job.description ?? null,
    jobType: mapJobType(job.contract_type),
    skills: [],
    source: 'adzuna',
    sourceUrl: job.redirect_url,
    postedAt: job.created ? new Date(job.created) : null,
  }));
}
