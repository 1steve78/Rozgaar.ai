import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";
const CACHE_SECONDS = 60 * 60 * 24 * 3; // 3 days

export async function GET(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") === "skill" ? "skill" : "job";
  const prompt =
    category === "job"
      ? "Give three concise career or job-search tips for today. Each must be actionable and under 60 words. Return them as a simple JSON array of strings, with no extra text."
      : "Give three concise professional skill-development tips for today. Each must be actionable and under 60 words. Return them as a simple JSON array of strings, with no extra text.";

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 240,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tip" },
        { status: 500 }
      );
    }

    const payload = await response.json();
    const raw =
      typeof payload?.choices?.[0]?.message?.content === "string"
        ? payload.choices[0].message.content.trim()
        : "[]";

    let tips: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        tips = parsed.filter((t) => typeof t === "string").slice(0, 3);
      }
    } catch {
      tips = [];
    }

    return NextResponse.json(
      { tips },
      {
        headers: {
          "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tip" }, { status: 500 });
  }
}
