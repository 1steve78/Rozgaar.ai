'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/home/Header';
import UnifiedJobCard from '@/components/jobs/UnifiedJobCard';

type Job = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  jobType: string | null;
  sourceUrl: string;
  skills?: string[];
  salary?: string;
};

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
};

type FilterPillsProps = {
  filters: string[];
  activeFilters: string[];
  onToggle: (filter: string) => void;
};

type StatusMessageProps = {
  message: string;
  fetchingFresh: boolean;
  isError?: boolean;
};

type JobsGridProps = {
  jobs: Job[];
};

type EmptyStateProps = {
  visible: boolean;
};

type InitialStateProps = {
  visible: boolean;
};

type ErrorStateProps = {
  visible: boolean;
  onRetry: () => void;
};

const quickFilters = ['Remote', 'Full-time', 'Part-time', 'Internship', 'Contract'];

const parseJsonSafe = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
  return await res.json();
};

export default function FindJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFresh, setFetchingFresh] = useState(false);
  const [query, setQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [accessBlocked, setAccessBlocked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        const res = await fetch('/api/user/skills');
        const data = await parseJsonSafe(res);
        const skills = (data?.skills || []).map((skill: any) => skill.skillName ?? skill.name ?? skill);

        if (!skills || skills.length === 0) {
          if (mounted) {
            setAccessBlocked(true);
          }
          return;
        }

        if (mounted) {
          setUserSkills(skills);
          setQuery(prev => prev || skills.join(', '));
        }
      } catch (error) {
        console.error('Failed to load user skills:', error);
      } finally {
        if (mounted) {
          setSkillsLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      mounted = false;
    };
  }, [router]);

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

  const searchJobs = async (q: string) => {
    if (!q) return;
    if (skillsLoading) return;
    if (userSkills.length === 0) {
      router.replace('/dashboard?addSkills=1');
      return;
    }

    setLoading(true);
    setMessage('');
    setHasError(false);
    setSearchPerformed(true);

    await fetchFreshJobs(q);
  };

  const fetchFreshJobs = async (q: string) => {
    const skillsQuery = userSkills.length > 0 ? userSkills.join(', ') : q;
    if (!skillsQuery) {
      setMessage('Please add skills to your profile to fetch jobs.');
      setLoading(false);
      return;
    }
    setFetchingFresh(true);

    try {
      const ingestPromise = fetch('/api/jobs/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: skillsQuery }),
      });

      setMessage('Searching with AI...');

      const searchRes = await fetch(`/api/jobs/search?q=${encodeURIComponent(q)}&smart=true`);
      
      if (!searchRes.ok) {
        throw new Error(`Search failed: ${searchRes.status}`);
      }

      const searchData = await parseJsonSafe(searchRes);

      setJobs(searchData?.jobs || []);
      setMessage(`Found ${searchData?.jobs?.length || 0} jobs`);
      setHasError(false);

      const ingestRes = await ingestPromise;
      if (!ingestRes.ok) {
        throw new Error(`Failed to ingest jobs: ${ingestRes.status}`);
      }

      const ingestData = await parseJsonSafe(ingestRes);

      if (ingestData?.success) {
        const refreshRes = await fetch(`/api/jobs/search?q=${encodeURIComponent(q)}&smart=true`);
        
        if (!refreshRes.ok) {
          throw new Error(`Search failed: ${refreshRes.status}`);
        }

        const refreshData = await parseJsonSafe(refreshRes);

        setJobs(refreshData?.jobs || []);
        setMessage(`Updated with ${refreshData?.jobs?.length || 0} jobs`);
        setHasError(false);
      }
    } catch (error) {
      console.error('Failed to fetch fresh jobs:', error);
      setMessage('Failed to fetch jobs. Please try again.');
      setHasError(true);
    } finally {
      setFetchingFresh(false);
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchJobs(query);
    }
  };

  const handleRetry = () => {
    if (query.trim()) {
      searchJobs(query);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const isLoading = loading || fetchingFresh;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      {accessBlocked ? (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Skills required</h1>
          <p className="text-gray-600 mb-6">
            Add at least one skill on your dashboard to unlock Find Jobs.
          </p>
          <button
            onClick={() => router.replace('/dashboard?addSkills=1')}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Go to dashboard
          </button>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SearchHeader />

        <SearchBar
          query={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          isLoading={isLoading}
        />

        <FilterPills
          filters={quickFilters}
          activeFilters={activeFilters}
          onToggle={toggleFilter}
        />

        {activeFilters.length > 0 && jobs.length > 0 && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>
        )}

        <StatusMessage 
          message={message} 
          fetchingFresh={fetchingFresh}
          isError={hasError}
        />

        <LoadingState visible={loading && !fetchingFresh} />

        <ErrorState visible={hasError && !isLoading} onRetry={handleRetry} />

        <JobsGrid jobs={filteredJobs} />

        <EmptyState
          visible={!isLoading && searchPerformed && filteredJobs.length === 0 && !hasError}
        />

        <InitialState visible={!isLoading && !searchPerformed} />
      </div>
      )}
    </div>
  );
}

function SearchHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Jobs</h1>
      <p className="text-gray-600">AI-powered job search tailored to your skills</p>
    </div>
  );
}

function SearchBar({ query, onChange, onSubmit, isLoading }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto mb-6">
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div className="pl-5 pr-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ml engineer"
            className="flex-1 py-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mr-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition shadow-sm"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  );
}

function FilterPills({ filters, activeFilters, onToggle }: FilterPillsProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onToggle(filter)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeFilters.includes(filter)
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function StatusMessage({ message, fetchingFresh, isError }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-xl ${
      isError
        ? 'bg-red-50 border border-red-200 text-red-800'
        : fetchingFresh
        ? 'bg-blue-50 border border-blue-200 text-blue-800'
        : 'bg-gray-50 border border-gray-200 text-gray-800'
      }`}>
      <div className="flex items-center gap-2">
        {fetchingFresh && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {isError && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

function LoadingState({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center gap-2 text-gray-600">
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Searching with AI...</span>
      </div>
    </div>
  );
}

function ErrorState({ visible, onRetry }: ErrorStateProps) {
  if (!visible) return null;

  return (
    <div className="text-center py-12">
      <svg className="mx-auto h-16 w-16 text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-4">We couldn't fetch jobs. Please try again.</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
}

function JobsGrid({ jobs }: JobsGridProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <UnifiedJobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function EmptyState({ visible }: EmptyStateProps) {
  if (!visible) return null;

  return (
    <div className="text-center py-16">
      <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
      <p className="text-gray-500">Try adjusting your search terms or filters.</p>
    </div>
  );
}

function InitialState({ visible }: InitialStateProps) {
  if (!visible) return null;

  return (
    <div className="text-center py-16">
      <svg className="mx-auto h-20 w-20 text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Job Search</h3>
      <p className="text-gray-500">Enter a job title, skill, or company name to begin</p>
      <p className="text-sm text-gray-400 mt-2">We'll fetch and rank fresh jobs using AI</p>
    </div>
  );
}
