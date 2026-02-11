import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/supabase/server';

export async function GET(req: Request) {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();

  const url = new URL('/', req.url);
  return NextResponse.redirect(url);
}
