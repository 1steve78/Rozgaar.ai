'use client';

import { useEffect, useState } from 'react';

interface SmartSearchBoxProps {
    onSearch: (query: string, smart?: boolean) => void;
    initialQuery?: string;
    query?: string;
}

export default function SmartSearchBox({
    onSearch,
    initialQuery = '',
    query: externalQuery,
}: SmartSearchBoxProps) {
    const [query, setQuery] = useState(initialQuery);
    const [smartMode, setSmartMode] = useState(true);

    useEffect(() => {
        if (typeof externalQuery === 'string') {
            setQuery(externalQuery);
        }
    }, [externalQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query, smartMode);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <div className="flex items-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                    {/* Search Icon */}
                    <div className="pl-4 pr-3">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                            smartMode
                                ? "Try 'remote React developer' or 'frontend jobs in Bangalore'..."
                                : 'Search for jobs...'
                        }
                        className="flex-1 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                    />

                    {/* Smart Mode Toggle */}
                    <button
                        type="button"
                        onClick={() => setSmartMode(!smartMode)}
                        className={`mx-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${smartMode
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        title={smartMode ? 'AI Smart Search Active' : 'AI Smart Search Disabled'}
                    >
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {smartMode ? 'AI' : 'Basic'}
                        </div>
                    </button>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="mr-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                    >
                        Search
                    </button>
                </div>

                {/* Smart Mode Indicator */}
                {smartMode && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>AI will understand your natural language query and apply smart filters</span>
                    </div>
                )}
            </div>
        </form>
    );
}
