'use client';

import { useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.replace('/');
    });
  }, [router]);

  return <p className="p-10">Signing you in...</p>;
}
