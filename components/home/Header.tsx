'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between py-6">
      <div className="text-2xl font-bold text-sky-600">
        🌼 Rozgaar.ai
      </div>

      <nav className="hidden md:flex gap-8 text-gray-600">
        <Link href="/">Home</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="px-5 py-2 text-gray-400">Loading...</div>
        ) : user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-medium">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="max-w-[150px] truncate">{user.email}</span>
            </div>
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-white/70 backdrop-blur text-sky-600 border border-white hover:bg-sky-50 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="px-5 py-2 rounded-full bg-white/70 backdrop-blur text-sky-600 border border-white hover:bg-sky-50 transition-colors"
          >
            Sign In / Sign Up
          </Link>
        )}
      </div>
    </header>
  );
}