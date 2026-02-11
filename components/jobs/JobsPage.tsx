'use client';

import { useEffect, useState } from 'react';
import JobsListing from '@/components/jobs/JobsListing';

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

const quickFilters = ['Remote', 'Full-time', 'Part-time', 'Internship', 'Contract'];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Apply filters whenever jobs or activeFilters change
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => {
      const jobTypeMatch = activeFilters.some(filter => {
        const filterLower = filter.toLowerCase();
        const jobTypeLower = (job.jobType || '').toLowerCase();
        const descriptionLower = (job.description || '').toLowerCase();
        const titleLower = (job.title || '').toLowerCase();

        // Check job type field
        if (jobTypeLower.includes(filterLower)) return true;

        // Check description and title for remote
        if (filterLower === 'remote') {
          return descriptionLower.includes('remote') || titleLower.includes('remote');
        }

        return false;
      });

      return jobTypeMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, activeFilters]);

  const loadRecent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/jobs');
      
      if (!res.ok) {
        throw new Error(`Failed to load jobs (${res.status})`);
      }

      const data = await res.json();
      setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load jobs';
      setError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const runSearch = async (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    setQuery(nextQuery);
    setError(null);

    if (!trimmed) {
      await loadRecent();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(trimmed)}`);
      
      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }

      const data = await res.json();
      setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleRetry = () => {
    if (query.trim()) {
      runSearch(query);
    } else {
      loadRecent();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Search Section */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Find your next role
          </h1>
          <p className="text-sm text-gray-600">
            Search the latest jobs in our database.
          </p>
        </div>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch(query);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by job title, company, or location..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search jobs'}
          </button>
        </form>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilters.includes(filter)
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'
            }`}
          >
            {filter}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {query.trim() ? (
            <span>
              Showing{' '}
              {activeFilters.length > 0 ? (
                <span className="font-medium text-gray-900">
                  {filteredJobs.length} of {jobs.length}
                </span>
              ) : (
                <span className="font-medium text-gray-900">{jobs.length}</span>
              )}{' '}
              results for{' '}
              <span className="font-medium text-gray-900">"{query}"</span>
            </span>
          ) : (
            <span>
              Showing{' '}
              {activeFilters.length > 0 ? (
                <span className="font-medium text-gray-900">
                  {filteredJobs.length} of {jobs.length}
                </span>
              ) : (
                <span className="font-medium text-gray-900">{jobs.length}</span>
              )}{' '}
              latest jobs from the database.
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      )}

      {/* Jobs Listing */}
      <JobsListing
        jobs={filteredJobs}
        loading={loading}
        query={query}
        error={error}
      />
    </div>
  );
}