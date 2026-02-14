'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

type UserProfile = {
  name?: string;
  email?: string;
};

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch {
        // silently fail
      } finally {
        setUserLoaded(true);
      }
    };

    loadUser();
  }, []);

  // Get user initials for avatar
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    const parts = user.name.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? 'U';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  }, [user]);

  const navLinks = user
    ? [
        { href: '/dashboard', label: 'Home' },
        { href: '/jobs', label: 'Jobs' },
        { href: '/dashboard/findjobs', label: 'Find Jobs' },
        { href: '/dashboard/skillmap-ai', label: 'Skill Map AI' },
      ]
    : [{ href: '/', label: 'Home' }];
  const visibleLinks = userLoaded ? navLinks : [];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: LOGO */}
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Rozgaar.ai
          </Link>

          {/* CENTER: DESKTOP NAV */}
          <nav className={`hidden md:flex items-center gap-1 ${userLoaded ? '' : 'invisible'}`}>
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT: USER & ACTIONS */}
          <div className="flex items-center gap-3">
            {userLoaded ? (
              user ? (
              <>
                <Link
                  href="/dashboard/profile"
                  className="group flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow">
                    {userInitials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <Link
                  href="/auth/logout"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Logout
                </Link>
              </>
              ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                >
                  Sign up
                </Link>
              </>
              )
            ) : (
              <div className="hidden sm:flex gap-2">
                <div className="h-9 w-20 rounded-lg bg-gray-100" />
                <div className="h-9 w-24 rounded-lg bg-gray-100" />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && userLoaded && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-in slide-in-from-top">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/auth/logout"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                Logout
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
