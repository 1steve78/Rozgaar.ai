import { NextResponse } from "next/server";

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = "jsearch.p.rapidapi.com";
const API_URL = "https://jsearch.p.rapidapi.com/search";

const ROLES = [
  "AI Engineer",
  "Frontend Developer",
  "Data Analyst",
  "DevOps Engineer",
  "Product Designer",
];

function getTrend(count: number): "up" | "down" | "neutral" {
  if (count === 0) return "down";
  if (count >= 20) return "up";
  return "neutral";
}

export async function GET() {
  if (!RAPID_API_KEY) {
    return NextResponse.json(
      { error: "Missing RAPID_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const results = await Promise.all(
      ROLES.map(async (role) => {
        const url = new URL(API_URL);
        url.searchParams.set("query", role);
        url.searchParams.set("page", "1");
        url.searchParams.set("num_pages", "1");
        url.searchParams.set("location", "India");

        const response = await fetch(url.toString(), {
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": RAPID_API_HOST,
          },
          next: { revalidate: 1800 },
        });

        if (!response.ok) {
          return {
            title: role,
            count: 0,
          };
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];

        return {
          title: role,
          count: data.length,
        };
      })
    );

    const bulletins = results.map((result, index) => ({
      id: index + 1,
      type: "TRENDING_ROLE",
      title: result.title,
      description: `${result.count} new jobs posted`,
      trend: getTrend(result.count),
      updatedAt: "Just now",
    }));

    return NextResponse.json(bulletins, {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bulletin" },
      { status: 500 }
    );
  }
}
