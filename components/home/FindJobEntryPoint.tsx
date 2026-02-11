'use client';

import { useRouter } from 'next/navigation';

type FindJobsEntryPointProps = {
  onFindJobs?: () => Promise<void> | void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'compact' | 'secondary';
};

export default function FindJobsEntryPoint({
  onFindJobs,
  disabled = false,
  loading = false,
  variant = 'default',
}: FindJobsEntryPointProps) {
  const router = useRouter();
  const isDisabled = disabled || loading;
  const isCompact = variant === 'compact';

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white text-center shadow-sm ${
        isCompact ? 'p-6' : 'p-8'
      }`}
    >
      <div className={`rounded-full bg-blue-50 p-2.5 text-blue-600 ${isCompact ? 'mb-3' : 'mb-4'}`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" />
        </svg>
      </div>

      <h2 className={`font-semibold text-gray-900 ${isCompact ? 'mb-1 text-base' : 'mb-2 text-lg'}`}>
        Start Exploring Jobs
      </h2>

      <p className={`max-w-sm text-sm text-gray-600 ${isCompact ? 'mb-4' : 'mb-5'}`}>
        Discover opportunities tailored to your skills and interests.
      </p>

      <button
        onClick={() => (onFindJobs ? onFindJobs() : router.push('/dashboard/findjobs'))}
        disabled={isDisabled}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Finding Jobs...' : 'Find Jobs'}
      </button>
    </div>
  );
}
