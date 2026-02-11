import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/supabase/server";
import { db } from "@/lib/db";
import { skills as skillsTable, usersSkills } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const logger = createLogger("SkillsExtractAPI");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_TEXT_CHARS = 12000;
const MAX_SKILLS = 30;

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function normalizeSkill(raw: string) {
  return raw.trim();
}

async function extractTextFromFile(file: File, ext: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (ext === ".pdf" || file.type === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default as (
      data: Buffer
    ) => Promise<{ text: string }>;
    try {
      const parsed = await pdfParse(buffer);
      return parsed.text || "";
    } catch (error) {
      logger.warn("PDF parse failed, returning empty text", error);
      return "";
    }
  }

  if (
    ext === ".docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result?.value || "";
  }

  throw new Error("Unsupported file type");
}

async function extractSkillsFromText(text: string) {
  if (!GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const prompt = [
    "You are an expert resume parser.",
    "Extract professional and technical skills from the resume text.",
    "Return ONLY a JSON array of strings. No extra text.",
    "Rules:",
    "- Skills must be short (1-4 words).",
    "- Deduplicate similar items.",
    "- Max 30 skills.",
    "",
    "Resume text:",
    text,
  ].join("\n");

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to extract skills");
  }

  const payload = (await response.json()) as GroqResponse;
  const raw =
    typeof payload?.choices?.[0]?.message?.content === "string"
      ? payload.choices[0].message.content.trim()
      : "[]";

  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.filter((s) => typeof s === "string");
    }
  } catch {
    return [];
  }

  return [];
}

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

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 2MB)" },
        { status: 413 }
      );
    }

    const ext =
      typeof file.name === "string" && file.name.includes(".")
        ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
        : "";

    const rawText = await extractTextFromFile(file, ext);
    const normalizedText = rawText.replace(/\s+/g, " ").trim();
    const trimmedText = normalizedText.slice(0, MAX_TEXT_CHARS);

    if (!trimmedText) {
      return NextResponse.json({ skills: [] });
    }

    const extracted = await extractSkillsFromText(trimmedText);
    const deduped: string[] = [];
    const seen = new Set<string>();

    for (const skill of extracted) {
      const normalized = normalizeSkill(skill);
      const key = normalized.toLowerCase();
      if (!normalized || seen.has(key)) continue;
      seen.add(key);
      deduped.push(normalized);
      if (deduped.length >= MAX_SKILLS) break;
    }

    if (deduped.length === 0) {
      return NextResponse.json({ skills: [] });
    }

    const skillNamesLower = deduped.map((s) => s.toLowerCase());
    const existing = await db
      .select()
      .from(skillsTable)
      .where(inArray(skillsTable.name, skillNamesLower));

    const existingMap = new Map(existing.map((row) => [row.name, row.id]));
    const missing = skillNamesLower.filter((name) => !existingMap.has(name));

    if (missing.length > 0) {
      const inserted = await db
        .insert(skillsTable)
        .values(missing.map((name) => ({ name })))
        .returning();
      for (const row of inserted) {
        existingMap.set(row.name, row.id);
      }
    }

    const userSkillRows = skillNamesLower
      .map((name) => existingMap.get(name))
      .filter(Boolean)
      .map((skillId) => ({
        userId: user.id,
        skillId: skillId as string,
        proficiency: 3,
      }));

    if (userSkillRows.length > 0) {
      await db
        .insert(usersSkills)
        .values(userSkillRows)
        .onConflictDoUpdate({
          target: [usersSkills.userId, usersSkills.skillId],
          set: { proficiency: 3 },
        });
    }

    logger.info(
      `Extracted ${deduped.length} skills from resume for user ${user.id}`
    );

    return NextResponse.json({ skills: deduped });
  } catch (error) {
    logger.error("Failed to extract skills", error);
    return NextResponse.json(
      { error: "Failed to extract skills" },
      { status: 500 }
    );
  }
}
