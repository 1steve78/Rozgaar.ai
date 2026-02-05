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

  // Protect dashboard routes
  if (!data.user && req.nextUrl.pathname.startsWith("/dashboard")) {
    logger.info("Redirecting to /auth - no user");
    const redirectUrl = new URL("/auth", req.url);
    return NextResponse.redirect(redirectUrl);
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
  matcher: ["/dashboard/:path*", "/auth"],
};