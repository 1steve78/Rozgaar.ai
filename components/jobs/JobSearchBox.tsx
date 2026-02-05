'use client';

import { useState } from 'react';

export default function JobSearchBox({
  onSearch,
}: {
  onSearch: (q: string, loc: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Job title, skills (e.g. Frontend, React)"
        className="border rounded-xl px-4 py-3"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (optional)"
        className="border rounded-xl px-4 py-3"
      />

      <button
        onClick={() => onSearch(query, location)}
        className="bg-sky-500 hover:bg-sky-600 transition text-white py-3 rounded-xl font-semibold"
      >
        Find Jobs Across Platforms
      </button>
    </div>
  );
}
