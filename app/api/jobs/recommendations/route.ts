import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs } from '@/db/schema';
import { ilike, or, sql, desc } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const logger = createLogger('RecommendationsAPI');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skillsParam = searchParams.get('skills');
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  if (!skillsParam) {
    return NextResponse.json({ jobs: [] });
  }

  try {
    // Parse skills from query
    const skills = skillsParam
      .split(' OR ')
      .map(s => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      return NextResponse.json({ jobs: [] });
    }

    logger.info(`Fetching recommendations for skills: ${skills.join(', ')}`);

    // Build search conditions for each skill
    const skillConditions = skills.flatMap(skill => [
      ilike(jobs.title, `%${skill}%`),
      ilike(jobs.description, `%${skill}%`),
    ]);

    // Fetch jobs matching any of the skills
    const results = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.company,
        location: jobs.location,
        description: jobs.description,
        jobType: jobs.jobType,
        sourceUrl: jobs.sourceUrl,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(or(...skillConditions))
      .orderBy(desc(jobs.createdAt))
      .limit(limit * 2); // Fetch more to allow for scoring

    // Calculate match scores
    const scoredJobs = results.map(job => {
      let matchScore = 0;
      const titleLower = (job.title || '').toLowerCase();
      const descLower = (job.description || '').toLowerCase();
      
      skills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (titleLower.includes(skillLower)) matchScore += 30;
        if (descLower.includes(skillLower)) matchScore += 15;
      });

      // Boost recent jobs
      const daysSincePost = job.createdAt 
        ? Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      if (daysSincePost < 7) matchScore += 10;
      else if (daysSincePost < 30) matchScore += 5;

      return {
        ...job,
        matchScore: Math.min(matchScore, 99),
        skills: skills.filter(skill => 
          titleLower.includes(skill.toLowerCase()) || 
          descLower.includes(skill.toLowerCase())
        ),
      };
    });

    // Sort by match score and limit results
    const topJobs = scoredJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    logger.info(`Returning ${topJobs.length} recommendations`);

    return NextResponse.json({
      jobs: topJobs,
      skills: skills,
    });
  } catch (error) {
    logger.error('Failed to fetch recommendations', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
