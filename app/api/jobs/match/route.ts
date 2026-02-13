import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/supabase/server';
import { db } from '@/lib/db';
import { jobs, usersSkills, skills as skillsTable, jobsSkills } from '@/db/schema';
import { matchJobs } from '@/lib/ai/jobMatcher';
import { eq, inArray } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const logger = createLogger('MatchAPI');

export async function GET(req: Request) {
    try {
        // Get authenticated user
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info(`Matching jobs for user ${user.id}`);

        // Get user's skills
        const userSkillsData = await db
            .select({
                skillName: skillsTable.name,
            })
            .from(usersSkills)
            .innerJoin(skillsTable, eq(usersSkills.skillId, skillsTable.id))
            .where(eq(usersSkills.userId, user.id));

        const userSkills = userSkillsData.map(s => s.skillName);

        if (userSkills.length === 0) {
            return NextResponse.json({
                message: 'Please add skills to your profile to get personalized job matches',
                matches: [],
            });
        }

        // Get recent jobs from database
        const recentJobs = await db
            .select({
                id: jobs.id,
                title: jobs.title,
                description: jobs.description,
                company: jobs.company,
                location: jobs.location,
                jobType: jobs.jobType,
                sourceUrl: jobs.sourceUrl,
            })
            .from(jobs)
            .orderBy(jobs.createdAt)
            .limit(100);

        const jobIds = recentJobs.map(job => job.id);
        const jobSkillsMap = new Map<string, string[]>();

        if (jobIds.length > 0) {
            const jobsSkillsData = await db
                .select({
                    jobId: jobsSkills.jobId,
                    skillName: skillsTable.name,
                })
                .from(jobsSkills)
                .innerJoin(skillsTable, eq(jobsSkills.skillId, skillsTable.id))
                .where(inArray(jobsSkills.jobId, jobIds));

            for (const row of jobsSkillsData) {
                const skills = jobSkillsMap.get(row.jobId);
                if (skills) {
                    skills.push(row.skillName);
                } else {
                    jobSkillsMap.set(row.jobId, [row.skillName]);
                }
            }
        }

        // Use AI to match and rank jobs
        const matches = await matchJobs(
            userSkills,
            recentJobs.map(job => ({
                id: job.id,
                title: job.title,
                description: job.description,
                skills: jobSkillsMap.get(job.id) ?? [],
            }))
        );

        // Combine job data with match results
        const rankedJobs = matches
            .filter(match => match.compatibilityScore > 20) // Only show decent matches
            .map(match => {
                const job = recentJobs.find(j => j.id === match.jobId);
                return {
                    ...job,
                    compatibility: {
                        score: match.compatibilityScore,
                        matchingSkills: match.matchingSkills,
                        missingSkills: match.missingSkills,
                        reason: match.matchReason,
                    },
                };
            });

        logger.info(`Found ${rankedJobs.length} matching jobs`);

        return NextResponse.json({
            userSkills,
            matches: rankedJobs,
            totalAnalyzed: recentJobs.length,
        });
    } catch (error) {
        logger.error('Job matching failed', error);
        return NextResponse.json(
            { error: 'Failed to match jobs' },
            { status: 500 }
        );
    }
}
