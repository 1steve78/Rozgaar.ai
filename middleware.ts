import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { createLogger } from "@/lib/logger";

const logger = createLogger('Middleware');

export async function middleware(req: NextRequest) {
  logger.debug(`Middleware called for: ${req.nextUrl.pathname}`);

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookies = req.cookies.getAll();
          logger.debug(`Reading cookies: ${cookies.length}`);
          return cookies;
        },
        setAll(cookiesToSet) {
          logger.debug(`Setting cookies: ${cookiesToSet.length}`);
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // This will refresh the session if needed
  const { data, error } = await supabase.auth.getUser();

  logger.debug('User check', {
    data: {
      hasUser: !!data.user,
      userId: data.user?.id,
      hasError: !!error,
    }
  });

  const publicPaths = new Set<string>(['/', '/auth', '/auth/callback']);

  const pathname = req.nextUrl.pathname;
  const isPublicPath = publicPaths.has(pathname);

  if (!data.user) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isPublicPath) {
      logger.info('Redirecting to /auth - restricted page');
      const redirectUrl = new URL('/auth', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const userEmail = data.user?.email?.toLowerCase() || "";
    if (!data.user || adminEmails.length === 0 || !adminEmails.includes(userEmail)) {
      logger.info("Redirecting to / - admin access denied");
      const redirectUrl = new URL("/", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from auth page
  if (data.user && req.nextUrl.pathname === "/auth") {
    logger.info("Redirecting to /dashboard - user logged in");
    const redirectUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  logger.debug("Middleware allowing request");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
