import { env } from '@/lib/env';
import { createLogger } from '@/lib/logger';

const logger = createLogger('JobMatcher');

export interface JobMatchResult {
    jobId: string;
    compatibilityScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    matchReason: string;
}

/**
 * Calculate compatibility score between user skills and job
 * Uses AI to intelligently match skills (e.g., "React" matches "ReactJS")
 */
export async function calculateCompatibility(
    userSkills: string[],
    jobSkills: string[],
    jobDescription?: string
): Promise<{ score: number; matchingSkills: string[]; missingSkills: string[] }> {
    if (userSkills.length === 0) {
        return { score: 0, matchingSkills: [], missingSkills: jobSkills };
    }

    if (jobSkills.length === 0 && !jobDescription) {
        return { score: 50, matchingSkills: [], missingSkills: [] };
    }

    try {
        const prompt = `Compare these skills and rate compatibility 0-100.

User Skills: ${userSkills.join(', ')}
Job Requirements: ${jobSkills.length > 0 ? jobSkills.join(', ') : 'See description'}
${jobDescription ? `Job Description: ${jobDescription.slice(0, 500)}` : ''}

Return ONLY valid JSON:
{
  "score": number (0-100),
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"]
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
                temperature: 0.3,
            }),
        });

        const data = await res.json();
        let content = data.choices[0].message.content;

        // Strip markdown code blocks if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const result = JSON.parse(content);

        return {
            score: Math.min(100, Math.max(0, result.score)),
            matchingSkills: result.matchingSkills || [],
            missingSkills: result.missingSkills || [],
        };
    } catch (error) {
        logger.error('AI compatibility calculation failed', error);

        // Fallback to simple matching
        const matchingSkills = userSkills.filter(us =>
            jobSkills.some(js =>
                js.toLowerCase().includes(us.toLowerCase()) ||
                us.toLowerCase().includes(js.toLowerCase())
            )
        );

        const score = jobSkills.length > 0
            ? (matchingSkills.length / jobSkills.length) * 100
            : 50;

        return {
            score: Math.round(score),
            matchingSkills,
            missingSkills: jobSkills.filter(js => !matchingSkills.includes(js)),
        };
    }
}

/**
 * Generate match reason using AI
 */
async function generateMatchReason(
    matchingSkills: string[],
    score: number
): Promise<string> {
    if (score === 0) return 'No matching skills found';
    if (score < 30) return `Limited match (${matchingSkills.slice(0, 2).join(', ')})`;
    if (score < 60) return `Partial match with ${matchingSkills.slice(0, 3).join(', ')}`;
    if (score < 80) return `Good match! You have ${matchingSkills.slice(0, 4).join(', ')}`;
    return `Excellent match! Strong skills in ${matchingSkills.slice(0, 5).join(', ')}`;
}

/**
 * Match and rank jobs by user skills
 */
export async function matchJobs(
    userSkills: string[],
    jobs: Array<{
        id: string;
        title: string;
        description: string | null;
        skills?: string[];
    }>
): Promise<JobMatchResult[]> {
    logger.info(`Matching ${jobs.length} jobs against ${userSkills.length} user skills`);

    const results = await Promise.all(
        jobs.map(async (job) => {
            const jobSkills = job.skills || [];
            const compatibility = await calculateCompatibility(
                userSkills,
                jobSkills,
                job.description || undefined
            );

            const matchReason = await generateMatchReason(
                compatibility.matchingSkills,
                compatibility.score
            );

            return {
                jobId: job.id,
                compatibilityScore: compatibility.score,
                matchingSkills: compatibility.matchingSkills,
                missingSkills: compatibility.missingSkills,
                matchReason,
            };
        })
    );

    // Sort by compatibility score (highest first)
    return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
