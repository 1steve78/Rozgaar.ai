'use client';

import { useState, useEffect } from 'react';

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

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFresh, setFetchingFresh] = useState(false);
  const [query, setQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const quickFilters = ['Remote', 'Full-time', 'Part-time', 'Internship', 'Contract'];

  const searchJobs = async (q: string, skipFetch = false) => {
    if (!q) return;

    setLoading(true);
    setMessage('');
    setSearchPerformed(true);

    try {
      // Step 1: Search database first
      const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(q)}&smart=true`);
      const data = await res.json();

      if (data.jobs && data.jobs.length > 0) {
        // Found jobs in database
        setJobs(data.jobs);
        setMessage(`Found ${data.jobs.length} jobs in database`);
        setLoading(false);
      } else if (!skipFetch) {
        // Step 2: No jobs found - automatically fetch fresh ones
        setMessage('No jobs in database. Fetching fresh jobs from job boards...');
        await fetchFreshJobs(q);
      } else {
        setJobs([]);
        setMessage('No jobs found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setMessage('Search failed. Please try again.');
      setLoading(false);
    }
  };

  const fetchFreshJobs = async (q: string) => {
    setFetchingFresh(true);

    try {
      // Call ingest API to fetch from external sources
      const ingestRes = await fetch('/api/jobs/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const ingestData = await ingestRes.json();

      if (ingestData.success) {
        setMessage(`Fetched ${ingestData.ingested?.inserted || 0} fresh jobs! Searching...`);

        // Now search the database again
        const searchRes = await fetch(`/api/jobs/search?q=${encodeURIComponent(q)}&smart=true`);
        const searchData = await searchRes.json();

        setJobs(searchData.jobs || []);
        setMessage(`Found ${searchData.jobs?.length || 0} jobs`);
      } else {
        setMessage('Failed to fetch fresh jobs. Try again later.');
      }
    } catch (error) {
      console.error('Failed to fetch fresh jobs:', error);
      setMessage('Failed to fetch fresh jobs');
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

  const handleFetchFresh = () => {
    if (query) {
      fetchFreshJobs(query);
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">AI-powered job search with personalized recommendations</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-6">
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
                onChange={(e) => setQuery(e.target.value)}
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

        {/* Filter Pills & Fetch Fresh Button */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          {quickFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeFilters.includes(filter)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Fetch Fresh Jobs Button */}
        {query && searchPerformed && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleFetchFresh}
              disabled={fetchingFresh}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition shadow-sm"
            >
              <svg className={`w-4 h-4 ${fetchingFresh ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {fetchingFresh ? 'Fetching Fresh Jobs...' : 'Fetch Fresh Jobs'}
            </button>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-xl ${fetchingFresh
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
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !fetchingFresh && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Searching database...</span>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && jobs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searchPerformed && jobs.length === 0 && !message.includes('Fetching') && (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or click "Fetch Fresh Jobs"</p>
            <button
              onClick={handleFetchFresh}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Fetch Fresh Jobs
            </button>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !searchPerformed && (
          <div className="text-center py-16">
            <svg className="mx-auto h-20 w-20 text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Job Search</h3>
            <p className="text-gray-500">Enter a job title, skill, or company name to begin</p>
            <p className="text-sm text-gray-400 mt-2">We'll search our database first, then fetch fresh jobs if needed</p>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Generate random salary badge color
  const salaryColors = [
    'bg-green-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-pink-500',
  ];
  const randomColor = salaryColors[Math.floor(Math.random() * salaryColors.length)];

  const generateSummary = async () => {
    setSummaryLoading(true);
    // Simulate AI summary generation
    setTimeout(() => {
      setSummaryLoading(false);
      setShowSummary(true);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border border-gray-100 relative">
      {/* Salary Badge */}
      <div className="absolute top-4 right-4">
        <span className={`${randomColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          ₹12-20 LPA
        </span>
      </div>

      {/* Job Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-1 pr-24">{job.title}</h3>

      {/* Company */}
      <p className="text-sm text-gray-600 mb-4">{job.company || 'Company Name'}</p>

      {/* Location - if available */}
      {job.location && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>
      )}

      {/* Generate AI Summary Link */}
      <button
        onClick={generateSummary}
        disabled={summaryLoading || showSummary}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4 disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className={summaryLoading ? 'animate-pulse' : ''}>
          {summaryLoading ? 'Generating...' : showSummary ? 'Summary Generated' : 'Generate AI Summary'}
        </span>
      </button>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={generateSummary}
          disabled={summaryLoading}
          className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition shadow-sm"
        >
          {summaryLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate AI Summary'
          )}
        </button>

        <button className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          View AI Insights
        </button>
      </div>

      {/* View Job Link */}
      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
      >
        View Job
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
