export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | null;

export interface UnifiedJob {
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  jobType: JobType;
  skills: string[];
  source: string;
  sourceUrl: string;
  postedAt: Date | null;
}

export function mapJobType(raw?: string): JobType {
  if (!raw) return null;

  const t = raw.toLowerCase();

  if (t.includes('full')) return 'full-time';
  if (t.includes('part')) return 'part-time';
  if (t.includes('contract')) return 'contract';
  if (t.includes('intern')) return 'internship';

  return null;
}
