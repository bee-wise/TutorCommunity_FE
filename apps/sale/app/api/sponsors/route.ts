import { NextResponse } from "next/server";
import { DEFAULT_SPONSORS } from "@/features/landing/data/landing.data";
import type { SponsorItem } from "@/features/landing/types";

// Server-only environment variable (never exposed to client browser)
const SPONSORS_GIST_URL =
  process.env.SPONSORS_JSON_URL ||
  process.env.NEXT_PUBLIC_SPONSORS_JSON_URL ||
  "";

export async function GET() {
  try {
    if (!SPONSORS_GIST_URL) {
      return NextResponse.json(DEFAULT_SPONSORS);
    }

    const fetchUrl = SPONSORS_GIST_URL.includes("?")
      ? `${SPONSORS_GIST_URL}&_t=${Date.now()}`
      : `${SPONSORS_GIST_URL}?_t=${Date.now()}`;

    const res = await fetch(fetchUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(DEFAULT_SPONSORS);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(DEFAULT_SPONSORS);
    }

    const validSponsors = data
      .filter((item): item is SponsorItem => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof item.name === "string" &&
          typeof item.logoUrl === "string" &&
          item.isActive !== false
        );
      })
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

    return NextResponse.json(
      validSponsors.length > 0 ? validSponsors : DEFAULT_SPONSORS,
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching sponsors in API route:", error);
    return NextResponse.json(DEFAULT_SPONSORS);
  }
}
