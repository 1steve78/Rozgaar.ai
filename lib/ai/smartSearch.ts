import { env } from '@/lib/env';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SmartSearch');

export interface SearchFilters {
    keywords: string[];
    jobType?: 'internship' | 'full-time' | 'part-time' | 'contract' | 'remote';
    location?: string;
    skills?: string[];
    remote?: boolean;
}

/**
 * Parse natural language query into structured search filters
 * Examples:
 * - "remote React jobs" → { keywords: ["react"], remote: true }
 * - "full-time frontend developer in Bangalore" → { keywords: ["frontend", "developer"], jobType: "full-time", location: "bangalore" }
 */
export async function parseSmartSearch(query: string): Promise<SearchFilters> {
    if (!query || query.trim().length === 0) {
        return { keywords: [] };
    }

    try {
        const prompt = `Parse this job search query into structured filters.

Query: "${query}"

Extract:
- keywords: important search terms
- jobType: one of [internship, full-time, part-time, contract, remote] or null
- location: city/country name or null
- skills: technical skills mentioned or null
- remote: true if mentions remote/work-from-home

Return ONLY valid JSON:
{
  "keywords": ["word1", "word2"],
  "jobType": "full-time" or null,
  "location": "city" or null,
  "skills": ["skill1"] or null,
  "remote": true or false
}`;

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.2, // Lower temperature for more consistent parsing
            }),
        });

        const data = await res.json();
        let content = data.choices[0].message.content;

        // Strip markdown code blocks if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsed = JSON.parse(content);

        logger.debug('Smart search parsed', { data: { query, parsed } });

        return {
            keywords: parsed.keywords || [],
            jobType: parsed.jobType || undefined,
            location: parsed.location || undefined,
            skills: parsed.skills || undefined,
            remote: parsed.remote || false,
        };
    } catch (error) {
        logger.error('Smart search parsing failed, using fallback', error);

        // Fallback to simple keyword extraction
        const keywords = query
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2);

        return {
            keywords,
            remote: /remote|wfh|work from home/i.test(query),
        };
    }
}

/**
 * Generate human-readable description of search filters
 */
export function describeFilters(filters: SearchFilters): string {
    const parts: string[] = [];

    if (filters.keywords.length > 0) {
        parts.push(filters.keywords.join(', '));
    }

    if (filters.jobType) {
        parts.push(filters.jobType.replace('-', ' '));
    }

    if (filters.location) {
        parts.push(`in ${filters.location}`);
    }

    if (filters.remote) {
        parts.push('remote');
    }

    if (filters.skills && filters.skills.length > 0) {
        parts.push(`requiring ${filters.skills.join(', ')}`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'all jobs';
}
