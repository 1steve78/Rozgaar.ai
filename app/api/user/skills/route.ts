import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/supabase/server';
import { db } from '@/lib/db';
import { users, usersSkills, skills as skillsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SkillsAPI');

/**
 * GET /api/user/skills - Get user's skills
 */
export async function GET(req: Request) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userSkillsData = await db
            .select({
                skillId: skillsTable.id,
                skillName: skillsTable.name,
                proficiency: usersSkills.proficiency,
            })
            .from(usersSkills)
            .innerJoin(skillsTable, eq(usersSkills.skillId, skillsTable.id))
            .where(eq(usersSkills.userId, user.id));

        return NextResponse.json({ skills: userSkillsData });
    } catch (error) {
        logger.error('Failed to fetch user skills', error);
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}

/**
 * POST /api/user/skills - Add new skill or update proficiency
 */
export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { skillName, proficiency } = await req.json();

        if (!skillName) {
            return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
        }

        // Ensure user profile exists to satisfy FK constraints
        await db
            .insert(users)
            .values({
                id: user.id,
                email: user.email ?? '',
                fullName:
                    (user.user_metadata?.full_name as string | undefined) ||
                    (user.user_metadata?.name as string | undefined) ||
                    null,
            })
            .onConflictDoNothing();

        // Find or create skill
        let skill = await db
            .select()
            .from(skillsTable)
            .where(eq(skillsTable.name, skillName.toLowerCase()))
            .limit(1);

        let skillId: string;
        if (skill.length === 0) {
            // Create new skill
            const newSkill = await db
                .insert(skillsTable)
                .values({ name: skillName.toLowerCase() })
                .returning();
            skillId = newSkill[0].id;
        } else {
            skillId = skill[0].id;
        }

        // Add to user's skills (or update if exists)
        await db
            .insert(usersSkills)
            .values({
                userId: user.id,
                skillId: skillId,
                proficiency: proficiency || 3,
            })
            .onConflictDoUpdate({
                target: [usersSkills.userId, usersSkills.skillId],
                set: { proficiency: proficiency || 3 },
            });

        logger.info(`Added/updated skill "${skillName}" for user ${user.id}`);

        return NextResponse.json({ success: true, skillName });
    } catch (error) {
        logger.error('Failed to add skill', error);
        return NextResponse.json({ error: 'Failed to add skill' }, { status: 500 });
    }
}

/**
 * DELETE /api/user/skills - Remove skill from user
 */
export async function DELETE(req: Request) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const skillId = searchParams.get('skillId');

        if (!skillId) {
            return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
        }

        await db
            .delete(usersSkills)
            .where(and(
                eq(usersSkills.userId, user.id),
                eq(usersSkills.skillId, skillId)
            ));

        logger.info(`Removed skill ${skillId} for user ${user.id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Failed to remove skill', error);
        return NextResponse.json({ error: 'Failed to remove skill' }, { status: 500 });
    }
}
