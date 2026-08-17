/**
 * Google Places API (New) client. Official API only, key stays server-side.
 * Photo URLs are resolved with skipHttpRedirect so the report carries plain
 * public googleusercontent URLs — the API key never reaches the browser.
 */

import type { BusinessProfile, CompetitorEntry } from "./types";
import { fetchCapped, withBudget } from "./guards";

const BASE = "https://places.googleapis.com/v1";

function key(): string {
  const k =
    (typeof process !== "undefined" ? process.env?.["GOOGLE_MAPS_API_KEY"] : undefined) ??
    (globalThis as Record<string, any>)["GOOGLE_MAPS_API_KEY"];
  if (!k) throw new Error("Scanner is not configured yet (missing Places key)");
  return k as string;
}

interface RawPlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  primaryType?: string;
  types?: string[];
  location?: { latitude?: number; longitude?: number };
  photos?: { name?: string }[];
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  reviews?: {
    rating?: number;
    text?: { text?: string };
    authorAttribution?: { displayName?: string };
  }[];
}

const SEARCH_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.primaryType",
  "places.types",
  "places.location",
  "places.photos",
  "places.regularOpeningHours",
].join(",");

async function placesPost(path: string, body: unknown, fieldMask: string): Promise<any> {
  const { res, text } = await fetchCapped(`${BASE}/${path}`, {
    method: "POST",
    timeoutMs: 8_000,
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": key(),
      "x-goog-fieldmask": fieldMask,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Places ${path} failed: ${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

export interface ResolvedPlace {
  profile: BusinessProfile;
  location: { lat: number; lng: number } | null;
  primaryType: string | null;
}

/** Resolve up to 4 public, key-free photo URLs for a place. */
async function resolvePhotos(photoNames: string[]): Promise<string[]> {
  const picks = photoNames.slice(0, 4);
  const urls = await Promise.all(
    picks.map(async (name) => {
      try {
        const { res, text } = await fetchCapped(
          `${BASE}/${name}/media?maxWidthPx=640&skipHttpRedirect=true&key=${encodeURIComponent(key())}`,
          { timeoutMs: 6_000 },
        );
        if (!res.ok) return null;
        const parsed = JSON.parse(text) as { photoUri?: string };
        return parsed.photoUri ?? null;
      } catch {
        return null;
      }
    }),
  );
  return urls.filter((u): u is string => typeof u === "string" && u.startsWith("https://"));
}

function toProfile(p: RawPlace, photoUrls: string[]): BusinessProfile {
  return {
    placeId: p.id ?? null,
    name: p.displayName?.text ?? null,
    address: p.formattedAddress ?? null,
    phone: p.nationalPhoneNumber ?? null,
    rating: typeof p.rating === "number" ? p.rating : null,
    reviewCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
    websiteUri: p.websiteUri ?? null,
    primaryType: p.primaryType ?? p.types?.[0] ?? null,
    photoUrls,
    photoCount: p.photos?.length ?? null,
    hoursKnown: Boolean(p.regularOpeningHours?.weekdayDescriptions?.length),
    openNow: p.regularOpeningHours?.openNow ?? null,
    reviews: (p.reviews ?? [])
      .slice(0, 3)
      .map((r) => ({
        text: (r.text?.text ?? "").slice(0, 220),
        rating: r.rating ?? 0,
        author: r.authorAttribution?.displayName ?? "Google user",
      }))
      .filter((r) => r.text.length > 0),
  };
}

/** Find a business by free-text query ("Name, City"). */
export async function findBusiness(query: string): Promise<ResolvedPlace | null> {
  const data = await placesPost(
    "places:searchText",
    { textQuery: query, maxResultCount: 1 },
    SEARCH_FIELDS,
  );
  const p: RawPlace | undefined = data.places?.[0];
  if (!p?.id) return null;

  // Reviews come from Place Details.
  let reviews: RawPlace["reviews"] = [];
  try {
    const { res, text } = await fetchCapped(
      `${BASE}/places/${p.id}`,
      {
        timeoutMs: 8_000,
        headers: {
          "x-goog-api-key": key(),
          "x-goog-fieldmask": "reviews",
        },
      },
    );
    if (res.ok) reviews = (JSON.parse(text) as RawPlace).reviews ?? [];
  } catch {
    /* reviews are enrichment, not required */
  }

  const photoUrls = await withBudget(resolvePhotos((p.photos ?? []).map((x) => x.name!).filter(Boolean)), 8_000, []);
  const profile = toProfile({ ...p, reviews }, photoUrls);
  return {
    profile,
    location:
      p.location?.latitude != null && p.location?.longitude != null
        ? { lat: p.location.latitude, lng: p.location.longitude }
        : null,
    primaryType: p.primaryType ?? null,
  };
}

/** Nearby same-category competitors, top N by review count (excluding self). */
export async function findCompetitors(
  center: { lat: number; lng: number },
  primaryType: string | null,
  selfId: string | null,
  selfRow: CompetitorEntry,
  n = 3,
): Promise<CompetitorEntry[]> {
  const body: Record<string, unknown> = {
    maxResultCount: 10,
    rankPreference: "POPULARITY",
    locationRestriction: {
      circle: { center: { latitude: center.lat, longitude: center.lng }, radius: 4000 },
    },
  };
  if (primaryType) body["includedPrimaryTypes"] = [primaryType];

  const data = await placesPost(
    "places:searchNearby",
    body,
    "places.id,places.displayName,places.rating,places.userRatingCount,places.websiteUri",
  );
  const rows: CompetitorEntry[] = ((data.places ?? []) as RawPlace[])
    .filter((p) => p.id && p.id !== selfId)
    .map((p) => ({
      name: p.displayName?.text ?? "Nearby business",
      rating: typeof p.rating === "number" ? p.rating : null,
      reviewCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
      hasWebsite: Boolean(p.websiteUri),
    }))
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, n);
  return [selfRow, ...rows];
}
