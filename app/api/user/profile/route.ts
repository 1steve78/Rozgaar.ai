import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ProfileAPI');

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileRows = await db
      .select({
        name: users.fullName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const profile = profileRows[0] ?? {
      name: user.user_metadata?.full_name ?? user.email ?? 'User',
      email: user.email ?? '',
      phone: null,
      location: null,
      linkedin: null,
      about: null,
      role: null,
    };

    return NextResponse.json(profile);
  } catch (error) {
    logger.error('Failed to fetch profile', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
