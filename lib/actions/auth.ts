"use server"

import { createSupabaseServer } from "@/supabase/server"
import { users } from "@/db/schema"
import { sendWelcomeEmail } from "@/supabase/email"
import { adminDb } from "@/db/admin"
import { createLogger } from "@/lib/logger"
import { cookies } from "next/headers";

const logger = createLogger('Auth');

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthResponse =
  | { error: string }
  | { success: true; message: string }

export async function signup(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  logger.info("Signup attempt", { data: { email, fullName } });

  const supabase = await createSupabaseServer()

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  logger.debug("Signup response", {
    data: {
      hasUser: !!data.user,
      hasSession: !!data.session,
      hasError: !!error,
    }
  });

  if (error) {
    logger.error("Supabase auth error", error);
    return { error: error.message }
  }

  if (!fullName) {
    return { error: "Name is required" }
  }

  const user = data.user
  if (!user) {
    return { error: "Signup failed" }
  }

  logger.info("Auth user created", { data: { userId: user.id } });
  logger.debug("User email confirmed", { data: { confirmed: !!user.email_confirmed_at } });
  logger.debug("Session exists", { data: { hasSession: !!data.session } });

  // Insert into database
  try {
    await adminDb
      .insert(users)
      .values({
        id: user.id,
        email,
        fullName,
      })
      .onConflictDoNothing()

    logger.info("User record created in database");
  } catch (dbError) {
    logger.error("Database error", dbError);
  }

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email, fullName).catch((err) => {
    logger.warn("Email send failed", { data: { error: err } });
  })

  logger.info("Signup complete");
  return { success: true, message: "Account created successfully!" }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  logger.info("Login attempt", { data: { email } });

  const supabase = await createSupabaseServer()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  logger.debug("Login response", {
    data: {
      hasUser: !!data.user,
      hasSession: !!data.session,
      hasError: !!error,
    }
  });

  if (error) {
    logger.error("Login error", error);
    return { error: error.message }
  }

  logger.info("Login successful", { data: { hasSession: !!data.session } });
  return { success: true, message: "Logged in successfully!" }
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const user = (await res.json()) as AuthUser;
    return user;
  } catch {
    return null;
  }
}
