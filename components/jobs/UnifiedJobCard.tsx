'use client';

import { useState, useMemo } from 'react';

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

export default function UnifiedJobCard({ job }: { job: Job }) {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const salaryColor = useMemo(() => {
    const colors = [
      'bg-emerald-500',
      'bg-sky-500',
      'bg-indigo-500',
      'bg-rose-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const generateSummary = async () => {
    if (summaryLoading || summary) return;

    setSummaryLoading(true);

    try {
      const response = await fetch('/api/jobs/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          title: job.title,
          description: job.description,
          company: job.company,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary || 'Summary generated successfully');
      } else {
        setSummary('Failed to generate summary. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const toggleInsights = () => {
    setShowInsights(!showInsights);
  };

  const sendActivity = async (action: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata }),
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  const sendFeedback = async (relevant: boolean) => {
    if (feedbackLoading) return;
    setFeedbackLoading(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relevant }),
      });

      if (response.ok) {
        setFeedback(relevant ? 'up' : 'down');
        sendActivity('job_feedback', { jobId: job.id, relevant });
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-blue-100/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%)]" />

      {job.salary && (
        <div className="absolute right-4 top-4">
          <span className={`${salaryColor} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
            {job.salary}
          </span>
        </div>
      )}

      <h3 className="relative pr-24 text-lg font-bold text-gray-900">
        {job.title}
      </h3>

      <p className="relative mt-1 text-sm font-medium text-blue-700/90">
        {job.company || 'Company Name'}
      </p>

      {job.location && (
        <div className="relative mt-3 flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>
      )}

      {job.jobType && (
        <div className="relative mt-3">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {job.jobType}
          </span>
        </div>
      )}

      {summary && (
        <div className="relative mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
        </div>
      )}

      {showInsights && (
        <div className="relative mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3">
          <h4 className="mb-2 text-sm font-semibold text-indigo-900">AI Insights</h4>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Match score based on your skills and experience</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Required skills: {job.skills?.join(', ') || 'Not specified'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Estimated application success rate</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={generateSummary}
          disabled={summaryLoading || !!summary}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300"
        >
          {summaryLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : summary ? (
            'Summary Ready'
          ) : (
            'Generate AI Summary'
          )}
        </button>

        <button
          onClick={toggleInsights}
          className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {showInsights ? 'Hide' : 'View'} Insights
        </button>
      </div>

      <div className="relative mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => sendFeedback(true)}
          disabled={feedbackLoading || feedback === 'up'}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            feedback === 'up'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          👍 Relevant
        </button>
        <button
          type="button"
          onClick={() => sendFeedback(false)}
          disabled={feedbackLoading || feedback === 'down'}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            feedback === 'down'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          👎 Not Relevant
        </button>
      </div>

      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          sendActivity('job_apply', { jobId: job.id, sourceUrl: job.sourceUrl })
        }
        className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        View Full Job Posting
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
