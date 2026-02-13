"use client";

import ErrorBoundary from "@/components/ErrorBoundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-4">
        <ErrorBoundary error={error} />
        <button
          onClick={() => reset()}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
