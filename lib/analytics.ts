import { db } from "@/lib/db";
import { userActivity } from "@/db/schema";

export async function trackActivity(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
) {
  await db.insert(userActivity).values({
    userId,
    action,
    metadata: metadata || null,
  });
}
