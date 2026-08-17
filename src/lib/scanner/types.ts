/**
 * DK Studio live scanner — shared types.
 *
 * Truth rules baked into the shape: every number in a ScanReport traces to a
 * check that actually ran. Nothing here is invented; fields that could not be
 * measured are null, never guessed.
 */

export type ScanInput =
  | { mode: "url"; url: string }
  | { mode: "name"; name: string; city: string };

/** Finding classes per the ruled hierarchy. Lower number = leads the report. */
export type FindingClass = 1 | 2 | 3 | 4 | 5;

export const FINDING_CLASS_LABEL: Record<FindingClass, string> = {
  1: "Conversion blocker",
  2: "Competitive gap",
  3: "Profile gap",
  4: "Directionality",
  5: "Small fix",
};

export interface Finding {
  cls: FindingClass;
  /** Short claim, plain language. */
  title: string;
  /** One-line evidence: what we actually observed. */
  evidence: string;
  /** What this blocks for customers, in the owner's language. */
  customerCost: string;
}

export interface CompetitorEntry {
  name: string;
  rating: number | null;
  reviewCount: number | null;
  hasWebsite: boolean;
  /** True for the scanned business's own row. */
  self?: boolean;
}

export interface BusinessProfile {
  placeId: string | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  rating: number | null;
  reviewCount: number | null;
  websiteUri: string | null;
  primaryType: string | null;
  /** Key-free public photo URLs (lh3.googleusercontent.com), max 4. */
  photoUrls: string[];
  photoCount: number | null;
  hoursKnown: boolean;
  openNow: boolean | null;
  reviews: { text: string; rating: number; author: string }[];
}

export interface SiteChecks {
  finalUrl: string;
  reachable: boolean;
  https: boolean;
  status: number | null;
  /** Time to first byte in ms, measured from the scanner. */
  ttfbMs: number | null;
  htmlBytes: number | null;
  title: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  favicon: boolean;
  viewportMeta: boolean;
  h1: string | null;
  telLink: boolean;
  mailtoLink: boolean;
  /** External ordering/booking providers linked from the page. */
  orderingProviders: string[];
  bookingProviders: string[];
  socialLinks: string[];
  menuLink: "html" | "pdf" | "none";
  hoursOnPage: boolean;
  footerYear: number | null;
  /** Near-empty HTML shell rendered by JavaScript — limits what we can claim. */
  jsShell: boolean;
  contactFormLikely: boolean;
}

export interface PsiMetrics {
  /** 0-100 Lighthouse performance score, or null if PSI did not answer in time. */
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  timedOut: boolean;
}

export interface DimensionScore {
  label: "Clarity" | "Trust" | "Conversion" | "Performance";
  value: number; // 0-100
  /** The observed inputs this score was computed from. */
  basis: string;
}

export interface ScanReport {
  input: ScanInput;
  scannedAt: string;
  /** Business identity as resolved (may be null when URL-only and no match). */
  profile: BusinessProfile | null;
  site: SiteChecks | null;
  psi: PsiMetrics | null;
  competitors: CompetitorEntry[];
  findings: Finding[];
  /** True when classes 1-4 produced nothing: honest "strong basics" state. */
  strongBasics: boolean;
  scores: DimensionScore[];
  overallScore: number | null;
  /** Human-readable notes about what the instant scan could not measure. */
  limits: string[];
}

export interface ScanError {
  error: string;
}
