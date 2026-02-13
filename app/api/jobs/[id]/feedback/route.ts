import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/supabase/server";
import { db } from "@/lib/db";
import { jobFeedback } from "@/db/schema";
import { createLogger } from "@/lib/logger";

const logger = createLogger("JobFeedbackAPI");

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const relevant = typeof body?.relevant === "boolean" ? body.relevant : null;

    if (relevant === null) {
      return NextResponse.json({ error: "relevant is required" }, { status: 400 });
    }

    await db.insert(jobFeedback).values({
      userId: user.id,
      jobId,
      relevant,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to save job feedback", error);
    return NextResponse.json(
      { error: "Failed to save job feedback" },
      { status: 500 }
    );
  }
}
