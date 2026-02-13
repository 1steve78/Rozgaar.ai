import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSupabaseServer } from "@/supabase/server";
import { trackActivity } from "@/lib/analytics";
import { createLogger } from "@/lib/logger";

const logger = createLogger("JobDetailAPI");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const jobRows = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    const job = jobRows[0];
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      trackActivity(user.id, "job_view", { jobId }).catch((error) => {
        logger.warn("Failed to track job view", { data: { error } });
      });
    }

    return NextResponse.json({ job });
  } catch (error) {
    logger.error("Failed to fetch job", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
