'use client';

import { useEffect, useState } from 'react';

type RecommendedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  skills?: string[];
  jobType?: string;
  sourceUrl?: string;
};

type JobRecommendationsProps = {
  userSkills: string[];
  limit?: number;
};

export default function JobRecommendations({ userSkills, limit = 3 }: JobRecommendationsProps) {
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userSkills || userSkills.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build query from user skills
        const skillsQuery = userSkills.slice(0, 3).join(' OR ');
        
        const res = await fetch(
          `/api/jobs/recommendations?skills=${encodeURIComponent(skillsQuery)}&limit=${limit}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error('Failed to fetch job recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userSkills, limit]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-red-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-600">No recommendations yet</p>
          <p className="text-xs text-gray-500 mt-1">Add more skills to get personalized job matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          Recommended Jobs
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {jobs.length}
          </span>
        </h3>
        <a
          href="/jobs"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          See all
        </a>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition line-clamp-1">
                    {job.title}
                  </h4>
                  {job.matchScore && job.matchScore > 70 && (
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {job.matchScore}% match
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 mb-2 line-clamp-1">{job.company}</p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  )}
                  
                  {job.salary && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="font-medium text-green-600">{job.salary}</span>
                    </>
                  )}

                  {job.jobType && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="capitalize">{job.jobType}</span>
                    </>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-gray-500">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <a
                href={job.sourceUrl || `/jobs/${job.id}`}
                target={job.sourceUrl ? '_blank' : '_self'}
                rel={job.sourceUrl ? 'noopener noreferrer' : undefined}
                className="flex-shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.href = '/find-jobs'}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all"
      >
        Find More Jobs
      </button>
    </div>
  );
}