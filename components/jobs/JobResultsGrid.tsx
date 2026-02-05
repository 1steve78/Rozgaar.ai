import { jobSources } from '@/lib/jobs/jobSources';
import JobSourceCard from './JobSourceCard';

export default function JobResultsGrid({
  query,
  location,
}: {
  query: string;
  location: string;
}) {
  if (!query) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {jobSources.map((source) => (
        <JobSourceCard
          key={source.id}
          source={source}
          url={source.buildUrl(query, location)}
        />
      ))}
    </div>
  );
}
