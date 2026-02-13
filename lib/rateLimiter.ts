import { db } from "@/lib/db";
import { chatMessageLogs, jobFetchLogs } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function checkJobFetchLimit(userId: string, limit: number = 3) {
  const today = new Date().toISOString().split("T")[0];

  const [result] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(jobFetchLogs)
    .where(
      and(
        eq(jobFetchLogs.userId, userId),
        sql`DATE(${jobFetchLogs.fetchedAt}) = ${today}`
      )
    );

  if ((result?.count ?? 0) >= limit) {
    throw new Error(`Daily job fetch limit reached (${limit}/day). Try again tomorrow.`);
  }

  await db.insert(jobFetchLogs).values({ userId, fetchedAt: new Date() });
}

export async function checkChatLimit(userId: string, limit: number = 10) {
  const [result] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(chatMessageLogs)
    .where(
      and(
        eq(chatMessageLogs.userId, userId),
        sql`${chatMessageLogs.createdAt} > NOW() - INTERVAL '1 day'`
      )
    );

  if ((result?.count ?? 0) >= limit) {
    throw new Error(`Daily chat limit reached (${limit} messages/day). Upgrade for unlimited access.`);
  }

  await db.insert(chatMessageLogs).values({ userId, createdAt: new Date() });
}
