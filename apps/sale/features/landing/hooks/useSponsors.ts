import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SPONSORS } from "../data/landing.data";
import type { SponsorItem } from "../types";

async function fetchSponsors(): Promise<SponsorItem[]> {
  try {
    const res = await fetch("/api/sponsors", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sponsors: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_SPONSORS;
  } catch (error) {
    console.warn("Could not load sponsors from API, using fallback:", error);
    return DEFAULT_SPONSORS;
  }
}

export function useSponsors() {
  return useQuery({
    queryKey: ["landing-sponsors"],
    queryFn: fetchSponsors,
    placeholderData: DEFAULT_SPONSORS,
    staleTime: 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}


