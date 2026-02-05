import { env } from '@/lib/env';
import { createLogger } from '@/lib/logger';

const logger = createLogger('JobSummarizer');

// Simple in-memory cache (in production, use Redis)
const summaryCache = new Map<string, { summary: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface JobSummary {
    summary: string;
    keyRequirements: string[];
    niceToHave: string[];
    highlights: string[];
}

/**
 * Generate AI summary of job description
 */
export async function summarizeJob(
    jobId: string,
    title: string,
    description: string | null,
    company?: string | null
): Promise<JobSummary> {
    if (!description || description.length < 50) {
        return {
            summary: `${title} position${company ? ` at ${company}` : ''}`,
            keyRequirements: [],
            niceToHave: [],
            highlights: [],
        };
    }

    // Check cache
    const cached = summaryCache.get(jobId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        logger.debug(`Using cached summary for job ${jobId}`);
        return JSON.parse(cached.summary);
    }

    try {
        const prompt = `Summarize this job posting concisely.

Title: ${title}
${company ? `Company: ${company}` : ''}
Description: ${description.slice(0, 1500)}

Create a summary with:
1. One-sentence overview (20-30 words)
2. Key requirements (must-haves)
3. Nice-to-have skills
4. Highlights/perks

Return ONLY valid JSON:
{
  "summary": "brief overview",
  "keyRequirements": ["req1", "req2", "req3"],
  "niceToHave": ["skill1", "skill2"],
  "highlights": ["perk1", "perk2"]
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
                temperature: 0.4,
            }),
        });

        const data = await res.json();
        let content = data.choices[0].message.content;

        // Strip markdown code blocks if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const result = JSON.parse(content);

        // Cache the result
        summaryCache.set(jobId, {
            summary: JSON.stringify(result),
            timestamp: Date.now(),
        });

        logger.info(`Generated summary for job ${jobId}`);

        return {
            summary: result.summary || `${title} position`,
            keyRequirements: result.keyRequirements || [],
            niceToHave: result.niceToHave || [],
            highlights: result.highlights || [],
        };
    } catch (error) {
        logger.error('Job summarization failed', error);

        // Fallback: basic summary
        return {
            summary: `${title}${company ? ` at ${company}` : ''}. ${description.slice(0, 150)}...`,
            keyRequirements: [],
            niceToHave: [],
            highlights: [],
        };
    }
}

/**
 * Clear cache (useful for cleanup)
 */
export function clearSummaryCache() {
    summaryCache.clear();
    logger.info('Summary cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return {
        size: summaryCache.size,
        entries: Array.from(summaryCache.keys()),
    };
}
