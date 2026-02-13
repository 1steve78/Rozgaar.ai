import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/supabase/server";
import { db } from "@/lib/db";
import { chatMessageLogs, jobFetchLogs } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { createLogger } from "@/lib/logger";

const logger = createLogger("UsageAPI");

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    const [chatCount] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(chatMessageLogs)
      .where(
        and(
          eq(chatMessageLogs.userId, user.id),
          sql`${chatMessageLogs.createdAt} > NOW() - INTERVAL '1 day'`
        )
      );

    const [fetchCount] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(jobFetchLogs)
      .where(
        and(
          eq(jobFetchLogs.userId, user.id),
          sql`DATE(${jobFetchLogs.fetchedAt}) = ${today}`
        )
      );

    return NextResponse.json({
      chatCount: chatCount?.count ?? 0,
      fetchCount: fetchCount?.count ?? 0,
      limits: {
        chat: 10,
        fetch: 3,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch usage stats", error);
    return NextResponse.json({ error: "Failed to fetch usage stats" }, { status: 500 });
  }
}
