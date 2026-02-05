'use client';

import { useState, useEffect } from 'react';

interface AIJobSummaryProps {
    jobId: string;
    title: string;
    description: string | null;
    company?: string | null;
}

interface Summary {
    summary: string;
    keyRequirements: string[];
    niceToHave: string[];
    highlights: string[];
}

export default function AIJobSummary({
    jobId,
    title,
    description,
    company,
}: AIJobSummaryProps) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const generateSummary = async () => {
        if (summary || loading) return;

        setLoading(true);
        try {
            const res = await fetch('/api/jobs/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, title, description, company }),
            });

            const data = await res.json();
            setSummary(data);
        } catch (error) {
            console.error('Failed to generate summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!description || description.length < 50) {
        return null;
    }

    return (
        <div className="mt-3">
            {!summary ? (
                <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {loading ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="animate-spin" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        )}
                    </svg>
                    {loading ? 'Generating AI Summary...' : 'Generate AI Summary'}
                </button>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">AI Summary</h4>
                        </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {summary.summary}
                    </p>

                    {summary.keyRequirements.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Key Requirements:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {summary.keyRequirements.map((req, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs"
                                    >
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {summary.niceToHave.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Nice to Have:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {summary.niceToHave.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {summary.highlights.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Highlights:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                {summary.highlights.map((highlight, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="mr-1.5">•</span>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
