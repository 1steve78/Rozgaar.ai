import UnifiedJobCard from '@/components/jobs/UnifiedJobCard';

type Job = {
  id: string;
  title: string;
  description?: string | null;
  company?: string | null;
  location?: string | null;
  jobType?: string | null;
  sourceUrl?: string | null;
  skills?: string[] | null;
  salary?: string | null;
};

type JobsListingProps = {
  jobs: Job[];
  loading: boolean;
  query: string;
  error: string | null;
};

export default function JobsListing({
  jobs,
  loading,
  query,
  error,
}: JobsListingProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-rose-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  if (!query.trim() && jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start searching</h3>
        <p className="text-sm text-gray-600">Search for a role, skill, or location to see results.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-sm text-gray-600">
          No jobs found for <span className="font-medium">"{query}"</span>. Try another keyword or clear filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <UnifiedJobCard
          key={job.id}
          job={{
            ...job,
            sourceUrl: job.sourceUrl || '#',
            company: job.company || 'Confidential',
            title: job.title || 'Untitled Role',
            description: job.description ?? null,
            location: job.location ?? null,
            jobType: job.jobType ?? null,
            skills: job.skills ?? undefined,
            salary: job.salary ?? undefined,
          }}
        />
      ))}
    </div>
  );
}
