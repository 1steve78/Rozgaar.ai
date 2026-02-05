'use client';

import { supabase } from '@/supabase/client';

export default function SocialLogin() {
  const signInWithProvider = async (provider: 'google' | 'linkedin') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => signInWithProvider('google')}
        className="w-full flex justify-center gap-3 bg-sky-50 hover:bg-sky-100 border rounded-lg py-3"
      >
        🔍 Continue with Google
      </button>

      <button
        onClick={() => signInWithProvider('linkedin')}
        className="w-full flex justify-center gap-3 bg-sky-50 hover:bg-sky-100 border rounded-lg py-3"
      >
        💼 Continue with LinkedIn
      </button>
    </div>
  );
}
