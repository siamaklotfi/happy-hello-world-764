import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Researcher } from "@/lib/data";

export const listApprovedResearchers = createServerFn({ method: "GET" }).handler(async (): Promise<Researcher[]> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];

  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data } = await client
    .from("researcher_profiles")
    .select(
      "slug, display_name, degree, university, field_slug, major, specialties, experience_years, rating, reviews_count, projects_count, hourly_price, bio, publications, portfolio",
    )
    .eq("approved", true)
    .order("rating", { ascending: false })
    .limit(60);

  return (data ?? []).map((r) => ({
    slug: r.slug,
    name: r.display_name,
    degree: r.degree,
    university: r.university ?? "",
    fieldSlug: r.field_slug,
    major: r.major ?? "",
    specialties: r.specialties ?? [],
    experience: r.experience_years,
    rating: Number(r.rating),
    reviews: r.reviews_count,
    projects: r.projects_count,
    hourlyPrice: Number(r.hourly_price),
    bio: r.bio ?? "",
    publications: r.publications ?? [],
    portfolio: (r.portfolio ?? []).map((title: string) => ({ title, year: 1403 })),
    avatarSeed: r.slug,
  }));
});
