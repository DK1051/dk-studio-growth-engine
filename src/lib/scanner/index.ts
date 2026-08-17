/**
 * Scan orchestrator. Both input modes end in the same report:
 *   url        → site checks (+ Places lookup by domain for profile data)
 *   name+city  → Places lookup → discovers websiteUri → site checks
 * Everything degrades gracefully: a missing half produces an honest, smaller
 * report, never an invented one.
 */

import type { CompetitorEntry, ScanInput, ScanReport } from "./types";
import { cacheGet, cacheSet, normalizeUrl, sanitizeText, withBudget } from "./guards";
import { SAMPLE_HOST, sampleReport } from "./fixtures";
import { findBusiness, findCompetitors, type ResolvedPlace } from "./places";
import { checkPsi } from "./psi";
import { checkSite } from "./site";
import { buildFindings, buildScores, classifyBusiness } from "./findings";

export async function runScan(input: ScanInput): Promise<ScanReport> {
  // Built-in sample path for demos and UI testing — clearly labeled demo data.
  if (input.mode === "url" && input.url.toLowerCase().includes(SAMPLE_HOST)) {
    return sampleReport();
  }

  const cacheKey =
    input.mode === "url"
      ? `url:${input.url.toLowerCase().trim()}`
      : `name:${input.name.toLowerCase().trim()}|${input.city.toLowerCase().trim()}`;
  const cached = cacheGet<ScanReport>(cacheKey);
  if (cached) return cached;

  const limits: string[] = [];
  let resolved: ResolvedPlace | null = null;
  let siteUrl: string | null = null;

  if (input.mode === "name") {
    const name = sanitizeText(input.name, 90);
    const city = sanitizeText(input.city, 60);
    if (name.length < 2 || city.length < 2) throw new Error("Business name and city are both needed");
    try {
      resolved = await findBusiness(`${name}, ${city}`);
    } catch (e) {
      limits.push("Google profile lookup was unavailable during this scan.");
    }
    if (!resolved) {
      if (limits.length === 0) {
        throw new Error(
          "Could not find that business on Google. Check the spelling, or scan the website address directly.",
        );
      }
    }
    siteUrl = resolved?.profile.websiteUri ?? null;
    if (!siteUrl) limits.push("No website is linked on the Google profile, so site checks were skipped.");
  } else {
    siteUrl = normalizeUrl(input.url).toString();
    // Best-effort reverse lookup so URL mode still gets profile + competitors.
    try {
      const host = new URL(siteUrl).hostname.replace(/^www\./, "");
      resolved = await withBudget(findBusiness(host), 9_000, null);
      if (resolved?.profile.websiteUri) {
        const profileHost = new URL(resolved.profile.websiteUri).hostname.replace(/^www\./, "");
        if (profileHost !== host) {
          // Wrong business matched — do not attribute someone else's profile.
          resolved = null;
        }
      }
    } catch {
      resolved = null;
    }
    if (!resolved) limits.push("No matching Google profile was confirmed for this domain, so reputation data is limited.");
  }

  const [site, psi] = await Promise.all([
    siteUrl
      ? checkSite(siteUrl).catch(() => null)
      : Promise.resolve(null),
    siteUrl ? checkPsi(siteUrl, 12_000) : Promise.resolve(null),
  ]);

  let competitors: CompetitorEntry[] = [];
  if (resolved?.location && resolved.profile.name) {
    const selfRow: CompetitorEntry = {
      name: resolved.profile.name,
      rating: resolved.profile.rating,
      reviewCount: resolved.profile.reviewCount,
      hasWebsite: Boolean(resolved.profile.websiteUri ?? siteUrl),
      self: true,
    };
    try {
      competitors = await withBudget(
        findCompetitors(resolved.location, resolved.primaryType, resolved.profile.placeId, selfRow),
        9_000,
        [selfRow],
      );
    } catch {
      competitors = [selfRow];
      limits.push("Nearby competitor lookup was unavailable during this scan.");
    }
  }

  if (site?.jsShell) {
    limits.push(
      "This site renders through JavaScript, so the instant scan reads only its shell. The full audit runs a real browser over it.",
    );
  }
  if (psi?.timedOut) {
    limits.push("Google PageSpeed did not answer inside the scan window; speed shown from measured response time instead.");
  }
  limits.push("Listings consistency (Yelp, Apple, Bing), design review, and conversion-path walkthrough are covered by the full free audit.");

  const kind = classifyBusiness(resolved?.primaryType ?? null);
  const { findings, strongBasics } = buildFindings(kind, site, resolved?.profile ?? null, competitors);
  const { scores, overall } = buildScores(kind, site, resolved?.profile ?? null, psi, findings);

  const report: ScanReport = {
    input,
    scannedAt: new Date().toISOString(),
    profile: resolved?.profile ?? null,
    site,
    psi,
    competitors,
    findings,
    strongBasics,
    scores,
    overallScore: overall,
    limits,
  };
  cacheSet(cacheKey, report);
  return report;
}
