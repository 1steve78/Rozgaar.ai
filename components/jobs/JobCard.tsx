import CompatibilityScore from './CompatibilityScore';
import AIJobSummary from './AIJobSummary';

interface JobCardProps {
  job: any;
  compatibility?: {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
    reason: string;
  };
}

export default function JobCard({ job, compatibility }: JobCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
      {/* Header with Compatibility */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {job.title}
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {job.company} {job.location && `· ${job.location}`}
          </p>
        </div>

        {/* Compatibility Badge */}
        {compatibility && (
          <CompatibilityScore
            score={compatibility.score}
            matchingSkills={compatibility.matchingSkills}
            missingSkills={compatibility.missingSkills}
            reason={compatibility.reason}
          />
        )}
      </div>

      {/* Job Type Badge */}
      {job.jobType && (
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
          {job.jobType}
        </span>
      )}

      {/* Skills (if available) */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {job.skills.slice(0, 5).map((skill: string, idx: number) => (
            <span
              key={idx}
              className="text-xs bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary */}
      <AIJobSummary
        jobId={job.id}
        title={job.title}
        description={job.description}
        company={job.company}
      />

      {/* View Job Button */}
      <div className="mt-4">
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View Job
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
