import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/supabase/server";
import { adminDb } from "@/db/admin";
import { users } from "@/db/schema";
import { createLogger } from "@/lib/logger";

const logger = createLogger("AuthEnsureUser");

export async function POST() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "User";

    await adminDb
      .insert(users)
      .values({
        id: user.id,
        email: user.email ?? "",
        fullName,
      })
      .onConflictDoNothing();

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to ensure user", err);
    return NextResponse.json(
      { error: "Failed to ensure user" },
      { status: 500 }
    );
  }
}
