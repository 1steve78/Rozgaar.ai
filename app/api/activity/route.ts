import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/supabase/server";
import { trackActivity } from "@/lib/analytics";
import { createLogger } from "@/lib/logger";

const logger = createLogger("ActivityAPI");

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const action = typeof body?.action === "string" ? body.action.trim() : "";
    const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : undefined;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    await trackActivity(user.id, action, metadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to track activity", error);
    return NextResponse.json({ error: "Failed to track activity" }, { status: 500 });
  }
}
